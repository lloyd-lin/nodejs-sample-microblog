# 🐳 Microblog Backend - Docker部署指南

本文档说明如何使用Docker部署微博应用的后端API服务。

## 📋 先决条件

- Docker Engine 20.10+
- Node.js 18+ (用于本地构建)
- npm或pnpm包管理器
- OpenAI API密钥（必需）

## ⚠️ 重要：环境变量配置

在构建Docker镜像之前，您需要配置以下环境变量：

### 必需的环境变量
- `OPENAI_API_KEY`: OpenAI API密钥（必需）
- `NODE_ENV`: 环境模式（production）
- `PORT`: 服务端口（默认3001）

### 可选的环境变量
- `OPENAI_BASE_URL`: OpenAI API基础URL（默认: https://api.openai.com/v1）
- `FRONTEND_URL`: 前端URL（用于CORS，默认: http://localhost:3000，支持: https://introduce.lgforest.fun）
- `JWT_SECRET`: JWT密钥（推荐设置）

## 🚀 快速开始

### 方法一：使用构建脚本（推荐）

```bash
# 1. 运行构建脚本（会自动创建.env.production模板）
./build-docker-cloud.sh

# 2. 编辑.env.production文件，设置真实的API密钥
# 将 OPENAI_API_KEY=your-openai-api-key-here
# 替换为 OPENAI_API_KEY=sk-your-real-key

# 3. 重新运行构建脚本
./build-docker-cloud.sh

# 4. 运行容器
docker run -d -p 3001:3001 --name backend lingao-backend-cloud:v0.0.1
```

### 方法二：手动构建

```bash
# 1. 创建环境变量文件
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=sk-your-real-openai-key
OPENAI_BASE_URL=https://api.openai.com/v1
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
EOF

# 2. 构建项目
npm run build

# 3. 构建Docker镜像
docker build -f Dockerfile.simple -t lingao-backend:latest .

# 4. 运行容器
docker run -d -p 3001:3001 --name backend lingao-backend:latest
```

### 方法三：使用环境变量（推荐生产环境）

```bash
# 不将密钥写入文件，通过环境变量传递
docker run -d -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e OPENAI_API_KEY=sk-your-real-key \
  -e JWT_SECRET=your-jwt-secret \
  --name backend \
  lingao-backend:latest
```

## 🌐 访问服务

构建完成后：
- API服务: http://localhost:3001
- API文档: http://localhost:3001/api/docs
- 健康检查: http://localhost:3001/api/health

## 📁 项目结构

```
packages/backend/
├── Dockerfile.simple        # Docker镜像构建文件
├── build-docker-cloud.sh    # 云构建脚本
├── .dockerignore            # Docker忽略文件
├── .env.production          # 生产环境配置文件
├── DOCKER-README.md         # Docker部署说明
├── dist/                    # 构建产物目录
├── src/                     # 源代码目录
├── package.json
└── tsconfig.json
```

## 🔧 配置说明

### Docker特性

- ✅ 基于Node.js 18 Alpine镜像
- ✅ 生产环境优化
- ✅ 健康检查机制
- ✅ 环境变量支持
- ✅ 自动推送到阿里云容器镜像服务

### 健康检查

容器内置健康检查，每30秒检查一次：
- 检查端点：`GET /api/health`
- 超时时间：3秒
- 重试次数：3次
- 启动等待：5秒

## 🛠️ 常用命令

```bash
# 查看运行中的容器
docker ps

# 查看容器日志
docker logs backend

# 实时查看日志
docker logs -f backend

# 进入容器
docker exec -it backend sh

# 停止容器
docker stop backend

# 删除容器
docker rm backend

# 删除镜像
docker rmi lingao-backend-cloud:v0.0.1

# 重新构建（无缓存）
docker build --no-cache -f Dockerfile.simple -t lingao-backend:latest .
```

## 🔧 环境变量配置详解

### 1. OpenAI配置
```bash
# 必需：OpenAI API密钥
OPENAI_API_KEY=sk-proj-your-real-api-key

# 可选：自定义API端点
OPENAI_BASE_URL=https://api.openai.com/v1
```

### 2. 服务配置
```bash
# 环境模式
NODE_ENV=production

# 服务端口
PORT=3001

# 前端URL（CORS配置）
FRONTEND_URL=https://introduce.lgforest.fun
```

### 3. 安全配置
```bash
# JWT密钥（强烈推荐设置）
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# JWT过期时间
JWT_EXPIRES_IN=7d
```

### 4. 数据库配置（如果启用）
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=microblog
```

## 🔒 安全最佳实践

### 1. API密钥管理
```bash
# ✅ 推荐：使用环境变量
docker run -e OPENAI_API_KEY=sk-your-key ...

# ✅ 推荐：使用Docker Secrets
echo "sk-your-key" | docker secret create openai_key -

# ❌ 不推荐：硬编码在Dockerfile中
```

### 2. 生产环境部署
```bash
# 使用.env文件（开发环境）
docker run --env-file .env.production ...

# 使用Kubernetes ConfigMap/Secret
kubectl create secret generic backend-secrets \
  --from-literal=OPENAI_API_KEY=sk-your-key

# 使用Docker Compose环境变量
version: '3.8'
services:
  backend:
    image: lingao-backend:latest
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NODE_ENV=production
```

## 🐛 故障排除

### 环境变量相关问题

#### 1. OpenAI API Key错误
```bash
# 错误：OPENAI_API_KEY is required
# 解决：检查API密钥是否正确设置
docker logs backend
grep OPENAI_API_KEY .env.production
```

#### 2. API调用失败
```bash
# 错误：OpenAI API调用失败
# 解决：检查API密钥有效性和网络连接
curl -H "Authorization: Bearer sk-your-key" \
  https://api.openai.com/v1/models
```

#### 3. 端口冲突
```bash
# 错误：Port already in use
# 解决：修改端口映射
docker run -p 3002:3001 --name backend ...
```

### 构建相关问题

#### 1. 构建失败
```bash
# 确保在正确目录
pwd
# packages/backend

# 确保dist目录存在
ls -la dist/
# 如果不存在，先构建
pnpm run build
```

#### 2. 依赖安装失败
```bash
# 清理缓存重新安装
pnpm cache clean
pnpm install
```

## 📊 性能指标

- 镜像大小：约 150MB
- 启动时间：约 3-5秒
- 内存使用：约 50-100MB
- 响应时间：< 100ms (健康检查)

## 📈 监控和日志

- 健康检查端点：`GET /api/health`
- 应用日志：stdout/stderr
- Swagger文档：`/api/docs`
- 性能监控：可集成第三方监控服务

## 🤝 与前端集成

### CORS配置
通过`FRONTEND_URL`环境变量配置允许的前端域名。

### API文档
访问 `/api/docs` 查看完整的API文档。

### 认证方式
使用JWT Bearer Token：
```
Authorization: Bearer <your_jwt_token>
```

## 📝 更新版本

1. 修改 `build-docker-cloud.sh` 中的 `TAG` 版本号
2. 更新环境变量（如果有新的配置）
3. 运行构建脚本：`./build-docker-cloud.sh`
4. 更新部署环境的镜像版本

## 🆘 技术支持

如遇问题，请检查：
1. Docker版本是否满足要求
2. 环境变量配置是否正确
3. OpenAI API密钥是否有效
4. 端口是否被占用
5. 网络连接是否正常

### 常见错误码
- `OPENAI_API_KEY is required` - API密钥未设置
- `Port already in use` - 端口被占用
- `Connection refused` - 服务未启动或端口配置错误 