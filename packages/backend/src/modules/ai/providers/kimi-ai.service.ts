import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import OpenAI from 'openai';
import { AIServiceInterface } from '../interfaces/ai-service.interface';
import { ChatCompletionDto, ChatResponseDto } from '../dto/chat.dto';

@Injectable()
export class KimiAIService implements AIServiceInterface {
  private readonly logger = new Logger(KimiAIService.name);
  private isInitialized = false;
  private openai: OpenAI;
  private baseURL: string;
  private apiKey: string;

  constructor(private configService: ConfigService) {
    this.initialize();
  }

  private initialize() {
    this.apiKey = this.configService.get<string>('KIMI_API_KEY');
    this.baseURL = this.configService.get<string>('KIMI_BASE_URL') || 'https://api.moonshot.cn/v1';

    if (!this.apiKey) {
      this.logger.warn('KIMI_API_KEY is not configured');
      return;
    }

    this.openai = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseURL,
    });
    this.isInitialized = true;
    this.logger.log('KimiAI client initialized successfully');
  }

  getServiceName(): string {
    return 'KimiAI';
  }

  isAvailable(): boolean {
    return this.isInitialized && !!this.apiKey;
  }

  /**
   * 聊天完成 - 非流式
   */
  async chatCompletion(chatDto: ChatCompletionDto): Promise<ChatResponseDto> {
    if (!this.isAvailable()) {
      throw new Error('KimiAI service is not available');
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: chatDto.model,
        messages: chatDto.messages,
        temperature: chatDto.temperature,
        max_tokens: chatDto.max_tokens,
      });
      return {
        id: response.id,
        object: response.object,
        created: response.created,
        model: response.model,
        choices: response.choices,
        usage: response.usage,
      };
    } catch (error) {
      this.logger.error('KimiAI chat completion error:', error);
      throw new Error(`KimiAI服务错误: ${error.message}`);
    }
  }

  /**
   * 聊天完成 - 流式返回
   */
  chatCompletionStream(chatDto: ChatCompletionDto): Observable<string> {
    if (!this.isAvailable()) {
      return new Observable(observer => {
        observer.error(new Error('KimiAI service is not available'));
      });
    }

    const { messages, model = 'moonshot-v1-8k', temperature = 0.7, max_tokens = 1000 } = chatDto;

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
            const sseData = this.formatKimiChunk(chunk);
            if (sseData) {
              observer.next(sseData);
            }
          }
          observer.next('data: [DONE]\n\n');
          observer.complete();
        } catch (error) {
          this.logger.error('Kimi stream processing error:', error);
          observer.error(error);
        }
      }).catch(error => {
        this.logger.error('Kimi stream creation error:', error);
        observer.error(error);
      });
    });
  }

  /**
   * 获取支持的模型列表
   */
  async getModels(): Promise<any[]> {
    if (!this.isAvailable()) {
      throw new Error('KimiAI service is not available');
    }

    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`KimiAI API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      this.logger.error('Failed to fetch KimiAI models:', error);
      // 返回默认模型列表
      return [
        { id: 'moonshot-v1-8k', name: 'Moonshot V1 8K' },
        { id: 'moonshot-v1-32k', name: 'Moonshot V1 32K' },
        { id: 'moonshot-v1-128k', name: 'Moonshot V1 128K' },
      ];
    }
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<any> {
    const status: any = {
      service: 'KimiAI',
      available: this.isAvailable(),
      api_key_configured: !!this.apiKey,
      initialized: this.isInitialized,
      status: 'unhealthy',
    };

    if (!this.isAvailable()) {
      return status;
    }

    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (response.ok) {
        status.status = 'healthy';
      } else {
        status.status = 'error';
        status.error = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (error) {
      this.logger.error('KimiAI health check failed:', error.message);
      status.status = 'error';
      status.error = error.message;
    }

    return status;
  }

  /**
   * 格式化KimiAI流式响应块
   */
  private formatKimiChunk(chunk: any): string {
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
      console.log(JSON.stringify(sseChunk));
      return `data: ${JSON.stringify(sseChunk)}\n\n`;
    } catch (error) {
      this.logger.error('Error formatting KimiAI chunk:', error);
      return '';
    }
  }
} 