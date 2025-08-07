import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import OpenAI from 'openai';
import { AIServiceInterface, AIServiceType } from '../interfaces/ai-service.interface';
import { ChatCompletionDto, ChatResponseDto } from '../dto/chat.dto';

@Injectable()
export class DeepSeekService implements AIServiceInterface {
  private readonly logger = new Logger(DeepSeekService.name);
  private openai: OpenAI;
  private isInitialized = false;

  constructor(private configService: ConfigService) {
    this.initialize();
  }

  private initialize() {
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');
    const baseURL = this.configService.get<string>('DEEPSEEK_BASE_URL');

    if (!apiKey) {
      this.logger.warn('DEEPSEEK_API_KEY is not configured');
      return;
    }

    try {
      this.openai = new OpenAI({
        apiKey,
        baseURL: baseURL || 'https://api.deepseek.com/v1',
        timeout: 60000, // 60 seconds
      });
      this.isInitialized = true;
      this.logger.log('DeepSeek client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize DeepSeek client:', error);
      this.isInitialized = false;
    }
  }

  getServiceName(): string {
    return 'DeepSeek';
  }

  isAvailable(): boolean {
    return this.isInitialized && !!this.configService.get('DEEPSEEK_API_KEY');
  }

  /**
   * 聊天完成 - 非流式
   */
  async chatCompletion(chatDto: ChatCompletionDto): Promise<ChatResponseDto> {
    if (!this.isAvailable()) {
      throw new Error('DeepSeek service is not available');
    }

    try {
      const { messages, model = 'deepseek-chat', temperature = 0.7, max_tokens = 1000 } = chatDto;

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
      this.logger.error('DeepSeek chat completion error:', error);
      throw new Error(`DeepSeek服务错误: ${error.message}`);
    }
  }

  /**
   * 聊天完成 - 流式返回
   */
  chatCompletionStream(chatDto: ChatCompletionDto): Observable<string> {
    if (!this.isAvailable()) {
      return new Observable(observer => {
        observer.error(new Error('DeepSeek service is not available'));
      });
    }

    const { messages, model = 'deepseek-chat', temperature = 0.7, max_tokens = 1000 } = chatDto;

    return new Observable(observer => {
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
            const sseData = this.formatDeepSeekChunk(chunk);
            if (sseData) {
              observer.next(sseData);
            }
          }
          observer.next('data: [DONE]\n\n');
          observer.complete();
        } catch (error) {
          this.logger.error('DeepSeek stream processing error:', error);
          observer.error(error);
        }
      }).catch(error => {
        this.logger.error('DeepSeek stream creation error:', error);
        observer.error(error);
      });
    });
  }

  /**
   * 获取支持的模型列表
   */
  async getModels(): Promise<any[]> {
    if (!this.isAvailable()) {
      throw new Error('DeepSeek service is not available');
    }

    try {
      const models = await this.openai.models.list();
      return models.data.filter(model => 
        model.id.includes('deepseek') || 
        model.id.includes('deepseek-chat') ||
        model.id.includes('deepseek-coder')
      );
    } catch (error) {
      this.logger.error('Failed to fetch DeepSeek models:', error);
      throw error;
    }
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<any> {
    const status: any = {
      service: 'DeepSeek',
      available: this.isAvailable(),
      api_key_configured: !!this.configService.get('DEEPSEEK_API_KEY'),
      initialized: this.isInitialized,
      status: 'unhealthy',
    };

    if (!this.isAvailable()) {
      return status;
    }

    try {
      await this.openai.models.list();
      status.status = 'healthy';
    } catch (error) {
      this.logger.error('DeepSeek health check failed:', error.message);
      status.status = 'error';
      status.error = error.message;
    }

    return status;
  }

  /**
   * 格式化DeepSeek流式响应块
   */
  private formatDeepSeekChunk(chunk: any): string {
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
      this.logger.error('Error formatting DeepSeek chunk:', error);
      return '';
    }
  }
} 