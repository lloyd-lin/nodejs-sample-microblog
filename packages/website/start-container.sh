#!/bin/bash

IMAGE_NAME="lingao-portfolio"
TAG="latest"
CONTAINER_NAME="portfolio"
PORT="8080"

echo "🐳 准备启动容器..."

# 停止并删除已存在的容器
if [ $(docker ps -aq -f name=${CONTAINER_NAME}) ]; then
    echo "🛑 停止现有容器..."
    docker stop ${CONTAINER_NAME}
    docker rm ${CONTAINER_NAME}
fi

# 启动新容器
echo "🚀 启动新容器..."
docker run -d \
  --name ${CONTAINER_NAME} \
  -p ${PORT}:80 \
  --restart unless-stopped \
  ${IMAGE_NAME}:${TAG}

if [ $? -eq 0 ]; then
    echo "✅ 容器启动成功!"
    echo "🌐 访问地址: http://localhost:${PORT}"
    echo "📊 容器状态:"
    docker ps -f name=${CONTAINER_NAME}
    echo ""
    echo "🔍 查看日志: docker logs ${CONTAINER_NAME}"
else
    echo "❌ 容器启动失败!"
    exit 1
fi 