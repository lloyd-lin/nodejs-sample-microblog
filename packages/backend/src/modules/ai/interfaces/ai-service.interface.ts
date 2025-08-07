import { Observable } from 'rxjs';
import { ChatCompletionDto, ChatResponseDto } from '../dto/chat.dto';

export interface AIServiceInterface {
  /**
   * 聊天完成 - 非流式
   */
  chatCompletion(chatDto: ChatCompletionDto): Promise<ChatResponseDto>;

  /**
   * 聊天完成 - 流式返回
   */
  chatCompletionStream(chatDto: ChatCompletionDto): Observable<string>;

  /**
   * 获取支持的模型列表
   */
  getModels(): Promise<any[]>;

  /**
   * 健康检查
   */
  healthCheck(): Promise<any>;

  /**
   * 获取服务名称
   */
  getServiceName(): string;

  /**
   * 检查服务是否可用
   */
  isAvailable(): boolean;
}

export enum AIServiceType {
  DEEPSEEK = 'deepseek',
  KIMI = 'kimi',
}

export interface AIServiceConfig {
  type: AIServiceType;
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  maxRetries?: number;
} 