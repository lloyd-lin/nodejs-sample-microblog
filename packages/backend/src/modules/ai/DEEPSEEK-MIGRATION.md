# DeepSeek迁移说明

## 概述

本次更新将默认AI服务从OpenAI迁移到DeepSeek，同时保持了多服务架构的灵活性。

## 主要变更

### 1. 服务提供者变更

- **OpenAIService** → **DeepSeekService**
- **文件重命名**: `openai.service.ts` → `deepseek.service.ts`
- **服务类型**: `AIServiceType.OPENAI` → `AIServiceType.DEEPSEEK`

### 2. 默认模型变更

- **旧默认模型**: `gpt-3.5-turbo`
- **新默认模型**: `deepseek-chat`

### 3. 环境变量变更

```env
# 旧配置
OPENAI_API_KEY=your-openai-api-key
OPENAI_BASE_URL=https://api.openai.com/v1

# 新配置
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

### 4. 模型识别规则更新

```typescript
// 旧规则
if (model.includes('gpt') || model.includes('text-davinci') || model.includes('claude')) {
  return this.getService(AIServiceType.OPENAI);
}

// 新规则
if (model.includes('deepseek') || model.includes('deepseek-chat') || model.includes('deepseek-coder')) {
  return this.getService(AIServiceType.DEEPSEEK);
}
```

## 影响范围

### 1. 直接影响的文件

- `packages/backend/src/modules/ai/interfaces/ai-service.interface.ts`
- `packages/backend/src/modules/ai/providers/deepseek.service.ts` (重命名)
- `packages/backend/src/modules/ai/ai-service.factory.ts`
- `packages/backend/src/modules/ai/ai.module.ts`
- `packages/backend/src/modules/chat/chat.service.ts`
- `packages/backend/src/modules/gallery/gallery.service.ts`

### 2. 服务优先级

1. **DeepSeek**: 默认首选服务
2. **KimiAI**: 备用服务
3. **其他服务**: 按配置顺序

## 迁移步骤

### 1. 环境配置更新

```bash
# 设置DeepSeek API密钥
export DEEPSEEK_API_KEY=your-deepseek-api-key

# 可选：设置自定义API端点
export DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

### 2. 代码更新

所有使用默认模型的地方都会自动使用`deepseek-chat`：

```typescript
// 自动使用DeepSeek服务
const result = await chatService.chatCompletion({
  messages: [{ role: 'user', content: 'Hello' }]
  // model默认为 'deepseek-chat'
});
```

### 3. 显式指定服务

如果需要使用特定的AI服务：

```typescript
// 使用DeepSeek
const deepSeekService = aiServiceFactory.getService(AIServiceType.DEEPSEEK);

// 使用KimiAI
const kimiService = aiServiceFactory.getService(AIServiceType.KIMI);
```

## 兼容性

### 1. 向后兼容

- 现有的API接口保持不变
- 客户端代码无需修改
- 自动服务选择逻辑已更新

### 2. 模型兼容性

DeepSeek支持的模型：
- `deepseek-chat` (默认)
- `deepseek-coder`
- `deepseek-chat-33b`
- `deepseek-coder-33b`

## 测试验证

### 1. 构建测试

```bash
cd packages/backend
npm run build
```

### 2. 服务健康检查

```bash
# 检查DeepSeek服务状态
curl -X GET http://localhost:3001/api/chat/health
```

### 3. 功能测试

```bash
# 测试聊天完成
curl -X POST http://localhost:3001/api/chat/completion \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "model": "deepseek-chat"
  }'
```

## 故障排除

### 1. 常见问题

**问题**: DeepSeek服务不可用
```
解决方案: 检查DEEPSEEK_API_KEY环境变量是否正确设置
```

**问题**: 模型不支持
```
解决方案: 确保使用DeepSeek支持的模型名称
```

**问题**: API端点错误
```
解决方案: 检查DEEPSEEK_BASE_URL配置
```

### 2. 降级策略

如果DeepSeek服务不可用，系统会自动降级到KimiAI：

```typescript
// 自动降级逻辑
if (deepSeekService.isAvailable()) {
  return deepSeekService;
} else if (kimiAIService.isAvailable()) {
  return kimiAIService;
} else {
  throw new Error('No AI service is available');
}
```

## 性能考虑

### 1. 响应时间

DeepSeek模型的响应时间可能与OpenAI不同，建议监控：

```typescript
// 性能监控
const startTime = Date.now();
const result = await service.chatCompletion(chatDto);
const duration = Date.now() - startTime;
console.log(`Response time: ${duration}ms`);
```

### 2. 成本优化

- 监控API调用频率
- 设置合理的`max_tokens`限制
- 使用流式响应减少延迟

## 未来扩展

### 1. 多服务支持

系统架构支持轻松添加更多AI服务：

- Claude
- Gemini
- 其他OpenAI兼容服务

### 2. 智能路由

未来可以实现基于以下因素的智能路由：
- 模型性能
- 成本效益
- 响应时间
- 可用性

## 总结

本次迁移成功将默认AI服务从OpenAI切换到DeepSeek，同时保持了系统的灵活性和可扩展性。所有现有功能都得到保留，新的默认模型`deepseek-chat`将提供更好的性能和成本效益。 