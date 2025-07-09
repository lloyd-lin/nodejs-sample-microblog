# Microblog Backend

基于 NestJS 的微博应用后端 API 服务。

## 📋 功能特性

- 🔐 **用户认证**: JWT 认证，注册登录
- 👤 **用户管理**: 用户信息管理，头像上传
- 📝 **文章管理**: 文章发布、编辑、删除
- 💬 **评论系统**: 文章评论功能
- 🏷️ **标签系统**: 文章标签分类
- 📊 **统计功能**: 浏览量、点赞数统计
- 🔍 **搜索功能**: 文章搜索
- 📖 **API 文档**: Swagger 自动生成文档
- 🛡️ **安全防护**: 限流、CORS、Helmet 安全头

## 🛠 技术栈

- **框架**: NestJS 10.x
- **数据库**: PostgreSQL + TypeORM
- **认证**: JWT + Passport
- **文档**: Swagger/OpenAPI
- **验证**: class-validator
- **安全**: Helmet, CORS, Rate Limiting

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- PostgreSQL >= 12
- pnpm >= 8.0.0

### 安装依赖

```bash
# 在项目根目录
pnpm install

# 或仅安装后端依赖
pnpm --filter @microblog/backend install
```

### 环境配置

1. 复制环境变量文件：
```bash
cp .env.example .env
```

2. 修改 `.env` 文件中的配置：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=microblog

# JWT 密钥
JWT_SECRET=your-super-secret-jwt-key-here
```

### 数据库设置

1. 创建数据库：
```sql
CREATE DATABASE microblog;
```

2. 应用会自动创建表结构（开发环境）

### 启动应用

```bash
# 开发模式
pnpm --filter @microblog/backend dev

# 或
cd packages/backend
pnpm dev
```

应用将在 http://localhost:3001 启动

### API 文档

启动应用后访问：http://localhost:3001/api/docs

## 📁 项目结构

```
packages/backend/
├── src/
│   ├── modules/           # 业务模块
│   │   ├── auth/         # 认证模块
│   │   ├── users/        # 用户模块
│   │   ├── posts/        # 文章模块
│   │   └── comments/     # 评论模块
│   ├── common/           # 公共模块
│   │   ├── decorators/   # 装饰器
│   │   ├── filters/      # 异常过滤器
│   │   ├── guards/       # 路由守卫
│   │   ├── interceptors/ # 拦截器
│   │   └── pipes/        # 管道
│   ├── config/           # 配置文件
│   ├── app.module.ts     # 根模块
│   ├── app.controller.ts # 根控制器
│   ├── app.service.ts    # 根服务
│   └── main.ts          # 应用入口
├── test/                 # 测试文件
├── dist/                 # 编译输出
├── package.json
├── tsconfig.json
└── README.md
```

## 📚 API 接口

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/profile` - 获取用户信息

### 用户管理
- `GET /api/users` - 获取用户列表
- `GET /api/users/:id` - 获取用户详情
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户

### 文章管理
- `GET /api/posts` - 获取文章列表
- `GET /api/posts/:id` - 获取文章详情
- `POST /api/posts` - 创建文章
- `PUT /api/posts/:id` - 更新文章
- `DELETE /api/posts/:id` - 删除文章

### 评论管理
- `GET /api/comments` - 获取评论列表
- `POST /api/comments` - 创建评论
- `PUT /api/comments/:id` - 更新评论
- `DELETE /api/comments/:id` - 删除评论

## 🔧 开发脚本

```bash
# 开发模式
pnpm dev

# 构建
pnpm build

# 生产环境启动
pnpm start:prod

# 测试
pnpm test

# 代码检查
pnpm lint

# 格式化代码
pnpm format
```

## 🐳 Docker 部署

### 📦 最近更新 (2025-01)

#### 1. 完整Docker支持
- ✅ 创建`Dockerfile.simple`生产环境镜像
- ✅ 添加`build-docker-cloud.sh`云构建脚本
- ✅ 配置`.dockerignore`优化构建体积
- ✅ 环境变量完整配置
- ✅ 健康检查机制

#### 2. 云构建脚本
```bash
# 自动化构建和推送
./build-docker-cloud.sh

# 支持功能：
# - 自动构建应用
# - 构建Docker镜像
# - 推送到阿里云容器镜像服务
# - 环境变量检查
# - 构建日志记录
```

#### 3. 环境变量配置
创建`.env.production`文件：
```env
# 数据库配置
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=microblog

# API密钥
OPENAI_API_KEY=your-openai-api-key
JWT_SECRET=your-jwt-secret-key

# 服务配置
PORT=3001
NODE_ENV=production
```

### 🚀 快速部署

#### 方式一：使用构建脚本（推荐）
```bash
# 1. 配置环境变量
cp .env.production.example .env.production
vim .env.production

# 2. 执行构建
chmod +x build-docker-cloud.sh
./build-docker-cloud.sh
```

#### 方式二：手动构建
```bash
# 1. 构建应用
pnpm build

# 2. 构建Docker镜像
docker build -f Dockerfile.simple -t microblog-backend .

# 3. 运行容器
docker run -d \
  --name microblog-backend \
  -p 3001:3001 \
  --env-file .env.production \
  microblog-backend
```

### 🐳 Dockerfile配置

```dockerfile
# Dockerfile.simple
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制包管理文件
COPY package.json pnpm-lock.yaml ./

# 安装pnpm并安装依赖
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile --prod

# 复制构建产物
COPY dist/ ./dist/

# 复制环境变量文件
COPY .env.production ./.env

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["node", "dist/main"]
```

### 📁 新增文件说明

#### Docker相关文件
- `Dockerfile.simple` - 生产环境Docker镜像配置
- `build-docker-cloud.sh` - 云构建和部署脚本
- `.dockerignore` - Docker构建忽略文件
- `.env.production` - 生产环境变量模板
- `DOCKER-README.md` - 详细Docker部署指南

#### 重要配置
- 健康检查端点：`GET /health`
- 容器内端口：3001
- 镜像基于：node:18-alpine

### 🔒 安全注意事项

#### 环境变量安全
```bash
# 生产环境必须配置的敏感变量
OPENAI_API_KEY=sk-xxx...     # 保密！
JWT_SECRET=random-secret     # 使用强随机密钥
DB_PASSWORD=secure-password  # 数据库密码

# 🚨 安全提醒：
# 1. 不要将.env.production提交到版本控制
# 2. 使用强密码和复杂的JWT密钥  
# 3. 定期轮换API密钥
# 4. 在生产环境中限制数据库访问权限
```

#### 网络安全
- 容器间通信建议使用Docker网络
- 生产环境应配置HTTPS
- 建议使用反向代理（nginx）

### 📚 详细文档

- [完整Docker部署指南](./DOCKER-README.md) - 包含故障排除和最佳实践
- [API接口文档](http://localhost:3001/api/docs) - Swagger在线文档
- [项目整体架构](../../README.md) - 全栈项目说明

## 🤝 与前端对接

### CORS 配置
后端已配置 CORS，允许前端访问。

### 认证方式
使用 JWT Bearer Token 认证：
```
Authorization: Bearer <your_jwt_token>
```

### 数据格式
API 返回统一的 JSON 格式：
```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 安全配置

- **限流**: 每 IP 每 15 分钟最多 100 请求
- **CORS**: 配置允许的前端域名
- **Helmet**: 设置安全 HTTP 头
- **验证**: 所有输入数据验证
- **认证**: JWT 令牌认证

## 📝 开发规范

1. **模块化**: 按功能划分模块
2. **类型安全**: 使用 TypeScript 严格模式
3. **文档**: 使用 Swagger 注解
4. **测试**: 编写单元测试和集成测试
5. **代码规范**: ESLint + Prettier

## 🐛 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查数据库是否启动
   - 确认连接配置正确

2. **端口占用**
   - 修改 `.env` 中的 `PORT` 配置

3. **JWT 认证失败**
   - 检查 `JWT_SECRET` 配置

## �� 许可证

MIT License 