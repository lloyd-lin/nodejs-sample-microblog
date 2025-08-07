# Trust Proxy 配置说明

## 问题描述

当Express应用部署在反向代理（nginx、负载均衡器、CDN）后面时，会出现以下警告：

```
The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false (default). 
This could indicate a misconfiguration which would prevent express-rate-limit from accurately identifying users.
```

## 原因分析

- Express默认不信任代理头部
- 所有请求的IP地址都被识别为代理服务器IP
- 影响限流、日志记录、安全功能等

## 解决方案

### 1. 自动配置（推荐）

系统会根据`NODE_ENV`环境变量自动配置：

```typescript
// 开发环境
NODE_ENV=development  // 信任本地回环地址

// 预发布环境  
NODE_ENV=staging      // 信任第一层代理

// 生产环境
NODE_ENV=production   // 信任所有代理
```

### 2. 手动配置

通过环境变量手动配置：

```bash
# 信任所有代理
TRUST_PROXY=true

# 信任第一层代理
TRUST_PROXY=1

# 信任本地回环地址
TRUST_PROXY=loopback

# 信任特定IP列表
TRUST_PROXY_IPS=127.0.0.1,::1,10.0.0.0/8
```

### 3. 配置选项说明

| 配置值 | 说明 | 适用场景 |
|--------|------|----------|
| `true` | 信任所有代理 | 生产环境，多级代理 |
| `false` | 不信任任何代理 | 直接暴露的应用 |
| `1` | 信任第一层代理 | 单级代理 |
| `'loopback'` | 信任本地回环 | 开发环境 |
| `['127.0.0.1', '::1']` | 信任特定IP | 自定义配置 |

### 4. 验证配置

重启应用后，检查日志中是否还有警告信息。正确的配置应该：

- 消除X-Forwarded-For警告
- 正确识别客户端真实IP
- 限流功能正常工作

### 5. 安全考虑

- 生产环境建议使用`true`或`1`
- 开发环境使用`'loopback'`即可
- 避免在不安全的环境中信任所有代理

### 6. 相关头部

配置trust proxy后，Express会正确处理以下头部：

- `X-Forwarded-For`: 客户端真实IP
- `X-Forwarded-Host`: 原始主机名
- `X-Forwarded-Proto`: 原始协议（http/https）
- `X-Real-IP`: 真实IP（nginx设置）

### 7. 故障排除

如果配置后仍有问题：

1. 检查环境变量是否正确设置
2. 确认代理服务器正确传递头部
3. 查看应用日志中的IP地址是否正确
4. 测试限流功能是否正常工作 