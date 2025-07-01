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
      throw new Error('OPENAI_API_KEY is required');
    }

    try {
      this.openai = new OpenAI({
        apiKey,
        baseURL: baseURL || 'https://api.openai.com/v1',
      });
      this.logger.log('OpenAI client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize OpenAI client:', error);
      throw error;
    }
  }

  /**
   * 聊天完成 - 非流式
   */
  async chatCompletion(chatDto: ChatCompletionDto): Promise<ChatResponseDto> {
    try {
      const { messages, model = 'gpt-3.5-turbo', temperature = 0.7, max_tokens = 1000 } = chatDto;

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
      throw new Error(`聊天服务错误: ${error.message}`);
    }
  }

  /**
   * 聊天完成 - 流式返回
   */
  chatCompletionStream(chatDto: ChatCompletionDto): Observable<string> {
    const { messages, model = 'gpt-3.5-turbo', temperature = 0.7, max_tokens = 1000 } = chatDto;

    return new Observable(observer => {
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
        observer.error(error);
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
   * 获取支持的模型列表
   */
  async getModels() {
    try {
      const models = await this.openai.models.list();
      return models.data.filter(model => 
        model.id.includes('gpt') || 
        model.id.includes('text-davinci') ||
        model.id.includes('claude')
      );
    } catch (error) {
      this.logger.error('Failed to fetch models from OpenAI:', error);
      throw error;
    }
  }

  /**
   * 健康检查
   */
  async healthCheck() {
    const status = {
      openai_connected: false,
      api_key_configured: !!this.configService.get('OPENAI_API_KEY'),
      service_status: 'unhealthy',
    };

    try {
      await this.openai.models.list();
      status.openai_connected = true;
      status.service_status = 'healthy';
    } catch (error) {
      this.logger.error('OpenAI health check failed:', error.message);
      throw error;
    }

    return status;
  }
} 