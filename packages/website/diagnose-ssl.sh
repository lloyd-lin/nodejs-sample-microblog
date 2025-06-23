#!/bin/bash

# SSL问题诊断脚本
# 帮助排查"SSL server reset connection"问题

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查参数
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}💡 用法: $0 <domain>${NC}"
    echo -e "${YELLOW}   示例: $0 intro.lgforest.fun${NC}"
    exit 1
fi

DOMAIN=$1

echo -e "${BLUE}🔍 开始诊断域名: ${DOMAIN}${NC}"
echo "=================================================="

# 1. DNS解析检查
echo -e "${YELLOW}📍 1. DNS解析检查${NC}"
if nslookup ${DOMAIN} > /dev/null 2>&1; then
    echo -e "${GREEN}✅ DNS解析正常${NC}"
    nslookup ${DOMAIN} | grep -A 2 "Name:"
else
    echo -e "${RED}❌ DNS解析失败${NC}"
fi
echo ""

# 2. 端口连通性检查
echo -e "${YELLOW}🔌 2. 端口连通性检查${NC}"
if nc -z -w5 ${DOMAIN} 443 2>/dev/null; then
    echo -e "${GREEN}✅ 443端口可达${NC}"
else
    echo -e "${RED}❌ 443端口不可达${NC}"
fi

if nc -z -w5 ${DOMAIN} 80 2>/dev/null; then
    echo -e "${GREEN}✅ 80端口可达${NC}"
else
    echo -e "${RED}❌ 80端口不可达${NC}"
fi
echo ""

# 3. SSL证书检查
echo -e "${YELLOW}🔒 3. SSL证书检查${NC}"
if command -v openssl &> /dev/null; then
    echo "证书详情:"
    echo | openssl s_client -servername ${DOMAIN} -connect ${DOMAIN}:443 2>/dev/null | openssl x509 -noout -text | grep -E "(Subject:|Issuer:|Not Before:|Not After:|DNS:)"
    
    echo ""
    echo "证书链验证:"
    if echo | openssl s_client -servername ${DOMAIN} -connect ${DOMAIN}:443 -verify_return_error 2>/dev/null > /dev/null; then
        echo -e "${GREEN}✅ 证书链验证通过${NC}"
    else
        echo -e "${RED}❌ 证书链验证失败${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  openssl未安装，跳过证书检查${NC}"
fi
echo ""

# 4. TLS握手测试
echo -e "${YELLOW}🤝 4. TLS握手测试${NC}"
if command -v openssl &> /dev/null; then
    echo "测试TLS 1.2:"
    if echo | openssl s_client -servername ${DOMAIN} -connect ${DOMAIN}:443 -tls1_2 2>/dev/null | grep -q "Verify return code: 0"; then
        echo -e "${GREEN}✅ TLS 1.2握手成功${NC}"
    else
        echo -e "${RED}❌ TLS 1.2握手失败${NC}"
    fi
    
    echo "测试TLS 1.3:"
    if echo | openssl s_client -servername ${DOMAIN} -connect ${DOMAIN}:443 -tls1_3 2>/dev/null | grep -q "Verify return code: 0"; then
        echo -e "${GREEN}✅ TLS 1.3握手成功${NC}"
    else
        echo -e "${YELLOW}⚠️  TLS 1.3握手失败或不支持${NC}"
    fi
fi
echo ""

# 5. HTTP/HTTPS重定向检查
echo -e "${YELLOW}↗️  5. HTTP/HTTPS重定向检查${NC}"
if command -v curl &> /dev/null; then
    echo "HTTP重定向测试:"
    HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" http://${DOMAIN}/ 2>/dev/null || echo "000")
    echo "HTTP响应: ${HTTP_RESPONSE}"
    
    echo "HTTPS访问测试:"
    HTTPS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN}/ 2>/dev/null || echo "000")
    echo "HTTPS响应: ${HTTPS_RESPONSE}"
    
    if [ "${HTTPS_RESPONSE}" = "200" ]; then
        echo -e "${GREEN}✅ HTTPS访问正常${NC}"
    else
        echo -e "${RED}❌ HTTPS访问异常${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  curl未安装，跳过重定向检查${NC}"
fi
echo ""

# 6. Kubernetes资源检查（如果kubectl可用）
echo -e "${YELLOW}☸️  6. Kubernetes资源检查${NC}"
if command -v kubectl &> /dev/null; then
    echo "检查Pod状态:"
    kubectl get pods -l app=hello-world 2>/dev/null || echo "无法获取Pod信息"
    
    echo ""
    echo "检查Service状态:"
    kubectl get svc hello-world 2>/dev/null || echo "无法获取Service信息"
    
    echo ""
    echo "检查Ingress状态:"
    kubectl get ingress 2>/dev/null || echo "无法获取Ingress信息"
    
    echo ""
    echo "检查证书状态:"
    kubectl get certificate 2>/dev/null || echo "无法获取Certificate信息"
else
    echo -e "${YELLOW}⚠️  kubectl未安装，跳过K8s资源检查${NC}"
fi
echo ""

# 7. 常见问题和解决方案
echo -e "${BLUE}💡 7. 常见问题和解决方案${NC}"
echo "如果遇到'SSL server reset connection'错误，可能的原因："
echo ""
echo "1. 证书问题："
echo "   - 证书未生效或过期"
echo "   - 证书链不完整"
echo "   - 域名不匹配"
echo ""
echo "2. SSL配置问题："
echo "   - 不支持的加密套件"
echo "   - TLS版本不兼容"
echo "   - SSL重定向配置错误"
echo ""
echo "3. 网络问题："
echo "   - DNS解析问题"
echo "   - 防火墙阻断"
echo "   - 负载均衡器配置问题"
echo ""
echo "4. 建议的修复步骤："
echo "   - 使用 sealos-deployment-fixed.yaml 配置"
echo "   - 等待证书自动申请完成（可能需要5-10分钟）"
echo "   - 检查域名DNS解析是否正确指向Sealos集群"
echo "   - 重新部署应用：kubectl apply -f sealos-deployment-fixed.yaml"
echo ""
echo "=================================================="
echo -e "${GREEN}🎉 诊断完成！${NC}" 