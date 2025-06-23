# 🚢 Sealos部署指南

本文档介绍如何将林高个人作品集部署到Sealos云平台。

## 📋 部署前准备

### 1. 环境要求
- Sealos账户 (https://cloud.sealos.io)
- Docker已安装并运行
- 项目已构建 (`npm run build`)

### 2. 镜像仓库准备
推荐使用以下镜像仓库之一：
- 阿里云容器镜像服务 (ACR)
- Docker Hub
- 腾讯云容器镜像服务 (TCR)
- 华为云容器镜像服务 (SWR)

### 3. 域名准备（可选）
- 准备一个域名用于访问（如：portfolio.yourdomain.com）
- 配置域名解析到Sealos集群

## 🚀 部署方式

### 方式一：自动化脚本部署（推荐）

1. **修改配置**
   ```bash
   # 编辑 deploy-to-sealos.sh
   REGISTRY="registry.cn-hangzhou.aliyuncs.com/your-namespace"  # 替换为您的镜像仓库
   DOMAIN="portfolio.example.com"  # 替换为您的域名
   ```

2. **执行部署**
   ```bash
   ./deploy-to-sealos.sh
   ```

### 方式二：手动部署

#### 步骤1: 构建并推送镜像
```bash
# 构建镜像
docker build -f Dockerfile.simple -t lingao-portfolio:latest .

# 标记镜像
docker tag lingao-portfolio:latest registry.cn-hangzhou.aliyuncs.com/your-namespace/lingao-portfolio:latest

# 登录镜像仓库
docker login registry.cn-hangzhou.aliyuncs.com

# 推送镜像
docker push registry.cn-hangzhou.aliyuncs.com/your-namespace/lingao-portfolio:latest
```

#### 步骤2: 修改部署配置
编辑 `sealos-deployment.yaml`，更新：
- 镜像地址：`image: registry.cn-hangzhou.aliyuncs.com/your-namespace/lingao-portfolio:latest`
- 域名：将 `portfolio.example.com` 替换为您的域名

#### 步骤3: 部署到Sealos
```bash
# 应用配置
kubectl apply -f sealos-deployment.yaml

# 检查部署状态
kubectl get pods -n lingao-portfolio
kubectl get svc -n lingao-portfolio  
kubectl get ingress -n lingao-portfolio
```

## 📁 部署文件说明

- `sealos-deployment.yaml` - Kubernetes部署配置
- `sealos-app.yaml` - Sealos应用配置
- `deploy-to-sealos.sh` - 自动化部署脚本
- `SEALOS-README.md` - 本说明文档

## 🔧 配置详解

### Deployment配置
- **资源限制**: 内存128Mi，CPU100m
- **健康检查**: 配置了存活性和就绪性探针
- **副本数**: 默认1个副本，可根据需要调整

### Service配置
- **类型**: ClusterIP（集群内部访问）
- **端口**: 80

### Ingress配置
- **SSL**: 自动配置Let's Encrypt证书
- **域名**: 支持自定义域名
- **重定向**: 强制HTTPS访问

## 🌐 访问应用

部署成功后，可通过以下方式访问：

1. **自定义域名**: https://your-domain.com
2. **Sealos临时域名**: 通过Sealos控制台获取
3. **端口转发**: `kubectl port-forward svc/lingao-portfolio-service 8080:80 -n lingao-portfolio`

## 📊 监控和管理

### 查看Pod状态
```bash
kubectl get pods -n lingao-portfolio -w
```

### 查看日志
```bash
kubectl logs -f deployment/lingao-portfolio -n lingao-portfolio
```

### 扩容/缩容
```bash
kubectl scale deployment lingao-portfolio --replicas=3 -n lingao-portfolio
```

### 更新应用
```bash
# 构建新镜像并推送后
kubectl rollout restart deployment/lingao-portfolio -n lingao-portfolio
```

## 🛠️ 故障排除

### Pod无法启动
```bash
# 查看Pod详情
kubectl describe pod <pod-name> -n lingao-portfolio

# 查看事件
kubectl get events -n lingao-portfolio --sort-by='.lastTimestamp'
```

### 无法访问应用
1. 检查Service和Pod是否正常
2. 检查Ingress配置和域名解析
3. 检查网络策略和防火墙

### 镜像拉取失败
1. 检查镜像仓库地址是否正确
2. 检查Sealos集群是否有权限访问镜像仓库
3. 配置ImagePullSecrets（如需要）

## 🔒 安全考虑

- 使用非root用户运行容器
- 配置安全上下文
- 启用网络策略
- 定期更新基础镜像
- 使用私有镜像仓库

## 💰 成本优化

- 根据实际负载调整资源请求和限制
- 使用HPA（水平Pod自动扩展）
- 配置合适的副本数
- 监控资源使用情况

---

**注意**: 首次部署可能需要几分钟时间，请耐心等待。如遇问题，请检查日志并参考故障排除章节。 