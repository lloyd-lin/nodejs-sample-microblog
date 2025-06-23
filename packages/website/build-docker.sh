#!/bin/bash

# 设置镜像名称和标签
IMAGE_NAME="lingao-portfolio"
TAG="latest"

echo "🚀 开始构建Docker镜像..."

# 构建Docker镜像
docker build -t ${IMAGE_NAME}:${TAG} .

if [ $? -eq 0 ]; then
    echo "✅ Docker镜像构建成功!"
    echo "📦 镜像名称: ${IMAGE_NAME}:${TAG}"
    echo ""
    echo "🔧 运行命令:"
    echo "   docker run -d -p 8080:80 --name portfolio ${IMAGE_NAME}:${TAG}"
    echo ""
    echo "🌐 访问地址: http://localhost:8080"
    echo ""
    echo "📋 其他有用命令:"
    echo "   查看容器: docker ps"
    echo "   停止容器: docker stop portfolio"
    echo "   删除容器: docker rm portfolio"
    echo "   查看日志: docker logs portfolio"
else
    echo "❌ Docker镜像构建失败!"
    exit 1
fi 