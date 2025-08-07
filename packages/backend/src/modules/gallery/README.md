# Gallery模块

## 概述

Gallery模块是一个基于NestJS的后端模块，主要功能是集成ChatService的流式处理方法，为前端提供AI流式响应能力。该模块支持图片分析、文本生成等多种AI功能。

## 功能特性

### 🔄 流式响应
- **实时流式输出**: 支持AI响应的实时流式传输
- **同步响应**: 提供同步API接口，返回完整结果
- **错误处理**: 完善的错误处理和异常捕获

### 🤖 AI集成
- **ChatService集成**: 无缝集成现有的ChatService
- **多种模型支持**: 支持GPT-3.5-turbo等多种AI模型
- **参数配置**: 支持温度、最大token数等参数配置

### 🔐 安全认证
- **JWT认证**: 集成JWT认证守卫
- **用户验证**: 支持用户身份验证
- **权限控制**: 基于角色的访问控制

## 模块结构

```
gallery/
├── gallery.controller.ts          # 控制器
├── gallery.service.ts             # 服务层
├── gallery.module.ts              # 模块定义
├── dto/
│   └── create-gallery-stream.dto.ts  # 数据传输对象
└── README.md                      # 说明文档
```

## API接口

### 1. 流式响应接口

**POST** `/api/gallery/stream`

流式返回AI响应内容。

**请求体:**
```json
{
  "prompt": "请分析这张图片的内容",
  "userId": "user123",
  "sessionId": "session456",
  "type": "image-analysis",
  "metadata": {
    "imageUrl": "https://example.com/image.jpg"
  }
}
```

**响应:**
- Content-Type: `text/plain; charset=utf-8`
- Transfer-Encoding: `chunked`
- 实时流式文本内容

### 2. 同步响应接口

**POST** `/api/gallery/stream-sync`

同步返回完整的AI响应结果。

**请求体:**
```json
{
  "prompt": "请分析这张图片的内容",
  "userId": "user123",
  "sessionId": "session456",
  "type": "image-analysis",
  "metadata": {
    "imageUrl": "https://example.com/image.jpg"
  }
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "content": "AI分析结果内容...",
    "metadata": {
      "model": "gpt-3.5-turbo",
      "usage": {
        "prompt_tokens": 50,
        "completion_tokens": 200,
        "total_tokens": 250
      }
    },
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "message": "Stream processed successfully"
}
```

## 使用方法

### 1. 模块导入

在`app.module.ts`中导入GalleryModule：

```typescript
import { GalleryModule } from './modules/gallery/gallery.module';

@Module({
  imports: [
    // 其他模块...
    GalleryModule,
  ],
})
export class AppModule {}
```

### 2. 前端调用示例

#### 流式调用
```javascript
const response = await fetch('/api/gallery/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    prompt: '请分析这张图片',
    userId: 'user123',
    type: 'image-analysis'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  console.log('Received chunk:', chunk);
}
```

#### 同步调用
```javascript
const response = await fetch('/api/gallery/stream-sync', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    prompt: '请分析这张图片',
    userId: 'user123',
    type: 'image-analysis'
  })
});

const result = await response.json();
console.log('AI Response:', result.data.content);
```

### 3. 图片分析示例

```javascript
// 图片分析请求
const imageAnalysisRequest = {
  prompt: `请分析这张图片，提供以下信息：
1. 图片中的主要对象和场景
2. 图片的详细描述
3. 相关的标签
4. 图片的技术信息

图片数据：${imageData}`,
  userId: 'user123',
  type: 'image-analysis',
  metadata: {
    imageSize: '2MB',
    imageFormat: 'JPEG'
  }
};

const response = await fetch('/api/gallery/stream-sync', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify(imageAnalysisRequest)
});

const result = await response.json();
console.log('图片分析结果:', result.data.content);
```

## 配置说明

### 环境变量

确保以下环境变量已正确配置：

```env
# OpenAI配置
OPENAI_API_KEY=your-openai-api-key
OPENAI_BASE_URL=https://api.openai.com/v1

# JWT配置
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
```

### 模块配置

Gallery模块使用以下默认配置：

- **模型**: `gpt-3.5-turbo`
- **温度**: `0.7`
- **最大token数**: `1000`
- **流式传输**: 启用

## 错误处理

### 常见错误

1. **认证错误** (401)
   ```json
   {
     "success": false,
     "message": "Authentication required"
   }
   ```

2. **参数验证错误** (400)
   ```json
   {
     "success": false,
     "message": "Validation failed",
     "errors": ["prompt is required"]
   }
   ```

3. **服务错误** (500)
   ```json
   {
     "success": false,
     "message": "Stream processing failed",
     "error": "OpenAI API error"
   }
   ```

### 错误处理策略

- **网络错误**: 自动重试机制
- **API限制**: 请求频率控制
- **超时处理**: 设置合理的超时时间
- **降级策略**: 在AI服务不可用时提供备用方案

## 性能优化

### 1. 缓存策略
- 实现响应缓存机制
- 缓存常用查询结果
- 设置合理的缓存过期时间

### 2. 并发控制
- 限制并发请求数量
- 实现请求队列机制
- 监控系统资源使用

### 3. 监控指标
- 请求响应时间
- 错误率统计
- 资源使用情况

## 扩展功能

### 1. 支持更多AI模型
```typescript
// 在service中添加模型选择
const chatDto: ChatCompletionDto = {
  messages: [...],
  model: 'gpt-4', // 支持更多模型
  temperature: 0.7,
  max_tokens: 1000,
};
```

### 2. 添加更多分析类型
```typescript
// 支持更多分析类型
enum AnalysisType {
  IMAGE_ANALYSIS = 'image-analysis',
  TEXT_GENERATION = 'text-generation',
  CODE_GENERATION = 'code-generation',
  SENTIMENT_ANALYSIS = 'sentiment-analysis',
}
```

### 3. 实现批量处理
```typescript
// 批量处理接口
@Post('batch')
async processBatch(@Body() requests: CreateGalleryStreamDto[]) {
  // 批量处理逻辑
}
```

## 测试

### 单元测试
```bash
npm run test gallery
```

### 集成测试
```bash
npm run test:e2e gallery
```

### API测试
使用Postman或curl测试API接口：

```bash
# 测试流式接口
curl -X POST http://localhost:3001/api/gallery/stream \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"prompt":"Hello","userId":"test"}'

# 测试同步接口
curl -X POST http://localhost:3001/api/gallery/stream-sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"prompt":"Hello","userId":"test"}'
```

## 部署

### 1. 构建
```bash
npm run build
```

### 2. 启动
```bash
npm run start:prod
```

### 3. Docker部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/main"]
```

## 维护

### 日志监控
- 监控API调用日志
- 跟踪错误和异常
- 分析性能指标

### 版本更新
- 定期更新依赖包
- 测试新功能兼容性
- 制定回滚策略

### 安全更新
- 及时更新安全补丁
- 监控安全漏洞
- 定期安全审计 