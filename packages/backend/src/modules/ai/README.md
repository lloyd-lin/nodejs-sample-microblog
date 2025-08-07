# AI模块

## 概述

AI模块是一个可扩展的LLM服务管理模块，支持多种AI服务提供者（如OpenAI、KimiAI等）。该模块采用工厂模式和依赖注入，提供了统一的接口来管理不同的AI服务。

## 架构设计

### 核心组件

```
ai/
├── ai.module.ts                    # 模块定义
├── ai-service.factory.ts           # AI服务工厂
├── interfaces/
│   └── ai-service.interface.ts     # AI服务接口定义
├── providers/
│   ├── openai.service.ts           # OpenAI服务提供者
│   └── kimi-ai.service.ts          # KimiAI服务提供者
└── README.md                       # 说明文档
```

### 设计模式

- **工厂模式**: 通过`AIServiceFactory`管理不同的AI服务实例
- **策略模式**: 每个AI服务提供者实现相同的接口
- **依赖注入**: 使用NestJS的DI容器管理服务实例

## 功能特性

### 🔄 多服务支持
- **DeepSeek**: 支持DeepSeek系列模型
- **KimiAI**: 支持Moonshot系列模型
- **可扩展**: 易于添加新的AI服务提供者

### 🤖 智能路由
- **自动选择**: 根据模型名称自动选择对应的AI服务
- **降级策略**: 当首选服务不可用时自动切换到备用服务
- **负载均衡**: 支持多服务负载均衡（未来扩展）

### 🔧 统一接口
- **标准化**: 所有AI服务提供统一的API接口
- **流式支持**: 支持流式和非流式响应
- **错误处理**: 统一的错误处理和重试机制

## 使用方法

### 1. 环境配置

```env
# DeepSeek配置
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1

# KimiAI配置
KIMI_API_KEY=your-kimi-api-key
KIMI_BASE_URL=https://kimi.moonshot.cn/api
```

### 2. 服务注入

```typescript
import { AIServiceFactory } from '../ai/ai-service.factory';
import { AIServiceType } from '../ai/interfaces/ai-service.interface';

@Injectable()
export class MyService {
  constructor(private aiServiceFactory: AIServiceFactory) {}

  async processWithDeepSeek() {
    const deepSeekService = this.aiServiceFactory.getService(AIServiceType.DEEPSEEK);
    return await deepSeekService.chatCompletion({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'deepseek-chat'
    });
  }

  async processWithKimiAI() {
    const kimiService = this.aiServiceFactory.getService(AIServiceType.KIMI);
    return await kimiService.chatCompletion({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'moonshot-v1-8k'
    });
  }

  async processWithAutoSelection() {
    // 根据模型自动选择服务
    const service = this.aiServiceFactory.getServiceByModel('deepseek-chat');
    return await service.chatCompletion({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'deepseek-chat'
    });
  }
}
```

### 3. 流式处理

```typescript
async streamResponse() {
  const service = this.aiServiceFactory.getDefaultService();
  
  const stream = service.chatCompletionStream({
    messages: [{ role: 'user', content: 'Tell me a story' }],
    model: 'deepseek-chat'
  });

  stream.subscribe({
    next: (chunk) => {
      console.log('Received chunk:', chunk);
    },
    error: (error) => {
      console.error('Stream error:', error);
    },
    complete: () => {
      console.log('Stream completed');
    }
  });
}
```

## API接口

### AIServiceInterface

所有AI服务提供者都必须实现以下接口：

```typescript
interface AIServiceInterface {
  // 非流式聊天完成
  chatCompletion(chatDto: ChatCompletionDto): Promise<ChatResponseDto>;
  
  // 流式聊天完成
  chatCompletionStream(chatDto: ChatCompletionDto): Observable<string>;
  
  // 获取支持的模型列表
  getModels(): Promise<any[]>;
  
  // 健康检查
  healthCheck(): Promise<any>;
  
  // 获取服务名称
  getServiceName(): string;
  
  // 检查服务是否可用
  isAvailable(): boolean;
}
```

### AIServiceFactory

工厂类提供以下方法：

```typescript
class AIServiceFactory {
  // 获取指定的AI服务
  getService(type: AIServiceType): AIServiceInterface;
  
  // 获取所有可用的AI服务
  getAvailableServices(): AIServiceInterface[];
  
  // 获取默认的AI服务
  getDefaultService(): AIServiceInterface;
  
  // 根据模型名称自动选择服务
  getServiceByModel(model: string): AIServiceInterface;
  
  // 获取所有服务的状态
  getAllServicesStatus(): Promise<any[]>;
  
  // 获取所有支持的模型
  getAllModels(): Promise<any[]>;
}
```

## 添加新的AI服务

### 1. 创建服务提供者

```typescript
// providers/new-ai.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIServiceInterface } from '../interfaces/ai-service.interface';
import { ChatCompletionDto, ChatResponseDto } from '../../chat/dto/chat.dto';

@Injectable()
export class NewAIService implements AIServiceInterface {
  private readonly logger = new Logger(NewAIService.name);
  
  constructor(private configService: ConfigService) {}
  
  getServiceName(): string {
    return 'NewAI';
  }
  
  isAvailable(): boolean {
    return !!this.configService.get('NEW_AI_API_KEY');
  }
  
  async chatCompletion(chatDto: ChatCompletionDto): Promise<ChatResponseDto> {
    // 实现聊天完成逻辑
  }
  
  chatCompletionStream(chatDto: ChatCompletionDto): Observable<string> {
    // 实现流式聊天逻辑
  }
  
  async getModels(): Promise<any[]> {
    // 实现获取模型列表逻辑
  }
  
  async healthCheck(): Promise<any> {
    // 实现健康检查逻辑
  }
}
```

### 2. 更新AI模块

```typescript
// ai.module.ts
import { NewAIService } from './providers/new-ai.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    DeepSeekService,
    KimiAIService,
    NewAIService, // 添加新服务
    AIServiceFactory,
  ],
  exports: [
    DeepSeekService,
    KimiAIService,
    NewAIService, // 导出新服务
    AIServiceFactory,
  ],
})
export class AIModule {}
```

### 3. 更新工厂类

```typescript
// ai-service.factory.ts
import { NewAIService } from './providers/new-ai.service';

export enum AIServiceType {
  DEEPSEEK = 'deepseek',
  KIMI = 'kimi',
  NEW_AI = 'new-ai', // 添加新类型
}

@Injectable()
export class AIServiceFactory {
  constructor(
    private readonly deepSeekService: DeepSeekService,
    private readonly kimiAIService: KimiAIService,
    private readonly newAIService: NewAIService, // 注入新服务
  ) {
    this.services = new Map();
    this.services.set(AIServiceType.DEEPSEEK, deepSeekService);
    this.services.set(AIServiceType.KIMI, kimiAIService);
    this.services.set(AIServiceType.NEW_AI, newAIService); // 注册新服务
  }
  
  getServiceByModel(model: string): AIServiceInterface {
    // 添加新服务的模型识别逻辑
    if (model.includes('new-ai')) {
      return this.getService(AIServiceType.NEW_AI);
    }
    // ... 其他逻辑
  }
}
```

## 配置说明

### 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `DEEPSEEK_API_KEY` | DeepSeek API密钥 | - |
| `DEEPSEEK_BASE_URL` | DeepSeek API基础URL | `https://api.deepseek.com/v1` |
| `KIMI_API_KEY` | KimiAI API密钥 | - |
| `KIMI_BASE_URL` | KimiAI API基础URL | `https://kimi.moonshot.cn/api` |

### 服务优先级

1. **DeepSeek**: 默认首选服务
2. **KimiAI**: 备用服务
3. **其他服务**: 按配置顺序

## 错误处理

### 常见错误

1. **服务不可用**
   ```typescript
       try {
      const service = this.aiServiceFactory.getService(AIServiceType.DEEPSEEK);
      const result = await service.chatCompletion(chatDto);
    } catch (error) {
      if (error.message.includes('not available')) {
        // 服务不可用，尝试备用服务
        const fallbackService = this.aiServiceFactory.getDefaultService();
        return await fallbackService.chatCompletion(chatDto);
      }
    }
   ```

2. **API限制**
   ```typescript
   // 在服务提供者中实现重试逻辑
   private async retryWithBackoff<T>(
     operation: () => Promise<T>,
     maxRetries: number = 3
   ): Promise<T> {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await operation();
       } catch (error) {
         if (error.message.includes('rate limit') && i < maxRetries - 1) {
           await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
           continue;
         }
         throw error;
       }
     }
   }
   ```

## 性能优化

### 1. 连接池管理
- 为每个AI服务维护独立的HTTP连接池
- 实现连接复用和超时管理

### 2. 缓存策略
- 缓存模型列表和配置信息
- 实现响应缓存（可选）

### 3. 并发控制
- 限制每个服务的并发请求数
- 实现请求队列和优先级管理

## 监控和日志

### 1. 健康检查
```typescript
// 定期检查所有服务状态
@Cron('*/5 * * * *') // 每5分钟检查一次
async checkServicesHealth() {
  const statuses = await this.aiServiceFactory.getAllServicesStatus();
  for (const status of statuses) {
    if (status.status === 'error') {
      this.logger.error(`Service ${status.service} is unhealthy:`, status.error);
    }
  }
}
```

### 2. 性能监控
```typescript
// 记录请求响应时间
async chatCompletion(chatDto: ChatCompletionDto): Promise<ChatResponseDto> {
  const startTime = Date.now();
  try {
    const result = await this.aiService.chatCompletion(chatDto);
    const duration = Date.now() - startTime;
    this.logger.log(`Chat completion completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    this.logger.error(`Chat completion failed after ${duration}ms:`, error);
    throw error;
  }
}
```

## 测试

### 单元测试
```typescript
describe('AIServiceFactory', () => {
  it('should return DeepSeek service for DeepSeek models', () => {
    const service = factory.getServiceByModel('deepseek-chat');
    expect(service.getServiceName()).toBe('DeepSeek');
  });

  it('should return KimiAI service for Moonshot models', () => {
    const service = factory.getServiceByModel('moonshot-v1-8k');
    expect(service.getServiceName()).toBe('KimiAI');
  });
});
```

### 集成测试
```typescript
describe('AI Services Integration', () => {
  it('should handle service fallback', async () => {
    // 模拟DeepSeek服务不可用
    jest.spyOn(deepSeekService, 'isAvailable').mockReturnValue(false);
    
    const result = await chatService.chatCompletion({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'deepseek-chat'
    });
    
    expect(result).toBeDefined();
  });
});
```

## 部署注意事项

1. **环境变量**: 确保所有必要的API密钥都已配置
2. **网络访问**: 确保服务器可以访问AI服务的API端点
3. **资源限制**: 监控API调用频率和资源使用情况
4. **备份策略**: 配置多个AI服务作为备份方案

## 未来扩展

- [ ] 支持更多AI服务（Claude、Gemini、OpenAI等）
- [ ] 实现智能负载均衡
- [ ] 添加模型性能对比功能
- [ ] 支持自定义模型训练
- [ ] 实现成本优化策略 