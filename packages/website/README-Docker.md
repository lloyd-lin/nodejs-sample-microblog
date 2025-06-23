# 林高个人作品集 - Docker部署指南

本文档说明如何使用Docker部署林高的个人作品集网站。

## 📋 先决条件

- Docker Engine 20.10+
- Docker Compose 2.0+

## 🚀 快速开始

### 方法一：使用构建脚本（推荐）

```bash
# 运行构建脚本
./build-docker.sh

# 运行容器
docker run -d -p 8080:80 --name portfolio lingao-portfolio:latest
```

### 方法二：使用Docker Compose

```bash
# 构建并启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 方法三：手动构建

```bash
# 构建镜像
docker build -t lingao-portfolio:latest .

# 运行容器
docker run -d -p 8080:80 --name portfolio lingao-portfolio:latest
```

## 🌐 访问网站

构建完成后，访问: http://localhost:8080

## 📁 项目结构

```
packages/website/
├── Dockerfile              # Docker镜像构建文件
├── docker-compose.yml      # Docker Compose配置
├── nginx.conf              # Nginx配置文件
├── build-docker.sh         # 构建脚本
├── .dockerignore           # Docker忽略文件
└── dist/                   # 构建产物目录
    ├── index.html
    ├── bundle.js
    └── bundle.js.LICENSE.txt
```

## 🔧 配置说明

### Nginx配置特性

- ✅ SPA路由支持（所有路由返回index.html）
- ✅ Gzip压缩
- ✅ 静态资源缓存优化
- ✅ 安全头部设置
- ✅ 健康检查端点(/health)

### Docker特性

- ✅ 多阶段构建（优化镜像大小）
- ✅ Alpine Linux基础镜像
- ✅ 健康检查
- ✅ 自动重启
- ✅ Traefik标签支持

## 🛠️ 常用命令

```bash
# 查看运行中的容器
docker ps

# 查看容器日志
docker logs portfolio

# 进入容器
docker exec -it portfolio sh

# 停止容器
docker stop portfolio

# 删除容器
docker rm portfolio

# 删除镜像
docker rmi lingao-portfolio:latest

# 重新构建（无缓存）
docker build --no-cache -t lingao-portfolio:latest .
```

## 🐛 故障排除

### 端口冲突
如果8080端口被占用，可以修改端口映射：
```bash
docker run -d -p 3000:80 --name portfolio lingao-portfolio:latest
```

### 健康检查失败
检查nginx配置和容器日志：
```bash
docker logs portfolio
docker exec -it portfolio nginx -t
```

### 构建失败
确保在正确的目录下运行构建命令，并且dist目录存在构建产物。

## 📊 性能优化

- 镜像大小：约 25MB（使用Alpine基础镜像）
- 启动时间：约 2-3秒
- 内存使用：约 10-20MB
- Gzip压缩：JS文件压缩率约70%

## 🔒 安全考虑

- 使用非root用户运行nginx
- 设置安全头部
- 禁用不必要的nginx模块
- 定期更新基础镜像

## 📈 监控和日志

容器包含健康检查端点，可以与监控系统集成：
- 健康检查：`GET /health`
- Nginx访问日志：stdout
- Nginx错误日志：stderr 