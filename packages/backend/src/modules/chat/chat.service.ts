import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import OpenAI from 'openai';
import { ChatCompletionDto, ChatResponseDto, ChatMessageDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.initializeOpenAI();
  }

  private initializeOpenAI() {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const baseURL = this.configService.get<string>('OPENAI_BASE_URL');

    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY not found, using mock service');
      this.openai = null;
      return;
    }

    try {
      this.openai = new OpenAI({
        apiKey,
        baseURL: baseURL || 'https://api.openai.com/v1',
      });
      this.logger.log('OpenAI client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize OpenAI client:', error);
      this.openai = null;
    }
  }

  /**
   * 聊天完成 - 非流式
   */
  async chatCompletion(chatDto: ChatCompletionDto): Promise<ChatResponseDto> {
    try {
      const { messages, model = 'gpt-3.5-turbo', temperature = 0.7, max_tokens = 1000 } = chatDto;

      // 如果没有配置OpenAI，使用模拟服务
      if (!this.openai) {
        return this.mockChatCompletion(chatDto);
      }

      // 调用OpenAI API
      const completion = await this.openai.chat.completions.create({
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature,
        max_tokens,
        stream: false,
      });

      return {
        id: completion.id,
        object: completion.object,
        created: completion.created,
        model: completion.model,
        choices: completion.choices.map(choice => ({
          index: choice.index,
          message: {
            role: choice.message.role as 'assistant',
            content: choice.message.content || '',
          },
          finish_reason: choice.finish_reason || 'stop',
        })),
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      this.logger.error('Chat completion error:', error);
      
      // 如果OpenAI调用失败，回退到模拟服务
      if (error.status === 401) {
        this.logger.warn('OpenAI API key invalid, falling back to mock service');
        return this.mockChatCompletion(chatDto);
      }
      
      throw new Error(`聊天服务错误: ${error.message}`);
    }
  }

  /**
   * 聊天完成 - 流式返回
   */
  chatCompletionStream(chatDto: ChatCompletionDto): Observable<string> {
    const { messages, model = 'gpt-3.5-turbo', temperature = 0.7, max_tokens = 1000 } = chatDto;

    return new Observable(observer => {
      if (!this.openai) {
        // 使用模拟流式服务
        this.mockStreamResponse(chatDto).then(async (stream) => {
          for await (const chunk of stream) {
            observer.next(chunk);
          }
          observer.next('data: [DONE]\n\n');
          observer.complete();
        }).catch(error => {
          observer.error(error);
        });
        return;
      }

      // 调用OpenAI流式API
      this.openai.chat.completions.create({
        model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature,
        max_tokens,
        stream: true,
      }).then(async (stream) => {
        try {
          for await (const chunk of stream) {
            const sseData = this.formatOpenAIChunk(chunk);
            if (sseData) {
              observer.next(sseData);
            }
          }
          observer.next('data: [DONE]\n\n');
          observer.complete();
        } catch (error) {
          this.logger.error('Stream processing error:', error);
          observer.error(error);
        }
      }).catch(error => {
        this.logger.error('Stream creation error:', error);
        // 回退到模拟流式服务
        this.mockStreamResponse(chatDto).then(async (stream) => {
          for await (const chunk of stream) {
            observer.next(chunk);
          }
          observer.next('data: [DONE]\n\n');
          observer.complete();
        }).catch(mockError => {
          observer.error(mockError);
        });
      });
    });
  }

  /**
   * 格式化OpenAI流式响应块
   */
  private formatOpenAIChunk(chunk: any): string {
    try {
      const sseChunk = {
        id: chunk.id,
        object: chunk.object,
        created: chunk.created,
        model: chunk.model,
        choices: chunk.choices.map(choice => ({
          index: choice.index,
          delta: choice.delta,
          finish_reason: choice.finish_reason,
        })),
      };

      return `data: ${JSON.stringify(sseChunk)}\n\n`;
    } catch (error) {
      this.logger.error('Error formatting chunk:', error);
      return '';
    }
  }

  /**
   * 模拟聊天完成
   */
  private async mockChatCompletion(chatDto: ChatCompletionDto): Promise<ChatResponseDto> {
    const { messages, model = 'gpt-3.5-turbo' } = chatDto;
    const userMessage = messages[messages.length - 1]?.content || '';
    
    let responseContent = '';
    
    if (userMessage.includes('微博') || userMessage.includes('应用') || userMessage.includes('功能')) {
      responseContent = `你好！我是微博应用的智能助手。这个微博应用包含以下主要功能：

🎯 **核心功能**
• 用户注册与登录管理
• 发布文字、图片动态
• 点赞、评论、转发互动
• 关注/粉丝社交网络

📱 **特色功能**  
• 话题标签与热门推荐
• 实时消息通知
• 个人主页与资料管理
• 内容搜索与发现

🤖 **AI助手**
• 智能聊天对话
• 内容创作建议
• 使用指导与帮助

有什么具体问题我可以帮你解答吗？`;
    } else if (userMessage.includes('你好') || userMessage.includes('hello')) {
      responseContent = '你好！我是微博应用的AI助手，很高兴为你服务！我可以帮你了解应用功能、回答使用问题、提供创作建议等。请告诉我你需要什么帮助吧！😊';
    } else {
      responseContent = `我理解你的问题："${userMessage}"。作为微博应用的智能助手，我会尽力为你提供帮助。

你可以向我询问：
• 微博应用的功能介绍
• 使用方法和操作指南  
• 内容创作建议
• 技术相关问题

请告诉我更具体的需求，我可以为你提供更准确的解答！`;
    }

    return {
      id: this.generateId(),
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: responseContent,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: this.countTokens(messages.map(m => m.content).join(' ')),
        completion_tokens: this.countTokens(responseContent),
        total_tokens: this.countTokens(messages.map(m => m.content).join(' ') + responseContent),
      },
    };
  }

  /**
   * 模拟流式响应
   */
  private async mockStreamResponse(chatDto: ChatCompletionDto): Promise<AsyncIterable<string>> {
    const fullResponse = await this.mockChatCompletion(chatDto);
    const content = fullResponse.choices[0].message.content;
    const chunks = content.split('');
    
    return {
      async *[Symbol.asyncIterator]() {
        for (let i = 0; i < chunks.length; i++) {
          const sseChunk = {
            id: fullResponse.id,
            object: 'chat.completion.chunk',
            created: fullResponse.created,
            model: fullResponse.model,
            choices: [
              {
                index: 0,
                delta: {
                  content: chunks[i],
                },
                finish_reason: i === chunks.length - 1 ? 'stop' : null,
              },
            ],
          };

          yield `data: ${JSON.stringify(sseChunk)}\n\n`;
          
          // 模拟流式延迟
          await new Promise(resolve => setTimeout(resolve, 30));
        }
      },
    };
  }

  /**
   * 获取支持的模型列表
   */
  async getModels() {
    if (this.openai) {
      try {
        const models = await this.openai.models.list();
        return models.data.filter(model => 
          model.id.includes('gpt') || 
          model.id.includes('text-davinci') ||
          model.id.includes('claude')
        );
      } catch (error) {
        this.logger.error('Failed to fetch models from OpenAI:', error);
      }
    }

    // 返回默认模型列表
    return [
      {
        id: 'gpt-3.5-turbo',
        object: 'model',
        created: 1686935002,
        owned_by: 'openai',
      },
      {
        id: 'gpt-4',
        object: 'model',
        created: 1687882411,
        owned_by: 'openai',
      },
      {
        id: 'gpt-4-turbo',
        object: 'model',
        created: 1712361441,
        owned_by: 'openai',
      },
      {
        id: 'microblog-assistant',
        object: 'model',
        created: Date.now(),
        owned_by: 'microblog',
      },
    ];
  }

  /**
   * 健康检查
   */
  async healthCheck() {
    const status = {
      openai_connected: false,
      api_key_configured: !!this.configService.get('OPENAI_API_KEY'),
      service_status: 'degraded',
    };

    if (this.openai) {
      try {
        await this.openai.models.list();
        status.openai_connected = true;
        status.service_status = 'healthy';
      } catch (error) {
        this.logger.warn('OpenAI health check failed:', error.message);
      }
    }

    if (!status.openai_connected && status.api_key_configured) {
      status.service_status = 'mock';
    }

    return status;
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `chatcmpl-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * 简单的token计数
   */
  private countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
} 