# 🐳 Docker部署说明

## 📦 构建Docker镜像

### 方式一：简化构建（推荐）
```bash
# 使用已构建的dist目录
./build-simple.sh
```

### 方式二：完整构建
```bash
# 从源码开始构建
./build-docker.sh
```

### 方式三：Docker Compose
```bash
# 一键构建和启动
docker-compose up -d
```

## 🚀 运行容器

### 自动启动脚本
```bash
./start-container.sh
```

### 手动启动
```bash
docker run -d -p 8080:80 --name portfolio lingao-portfolio:latest
```

## 🌐 访问

启动后访问: http://localhost:8080

## 📁 文件说明

- `Dockerfile` - 完整构建（包含npm build）
- `Dockerfile.simple` - 简化构建（使用现有dist）
- `nginx.conf` - Nginx配置（SPA支持、Gzip、缓存）
- `docker-compose.yml` - Docker Compose配置
- `build-docker.sh` - 完整构建脚本
- `build-simple.sh` - 简化构建脚本  
- `start-container.sh` - 启动容器脚本
- `.dockerignore` - Docker忽略文件

## ⚠️ 注意事项

1. 确保Docker Desktop已启动
2. 确保dist目录已构建（运行`npm run build`）
3. 端口8080被占用时可修改脚本中的PORT变量