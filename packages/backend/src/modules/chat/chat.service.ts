import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { ChatCompletionDto, ChatResponseDto, } from '../ai/dto/chat.dto';
import { jobAgentPrompt } from '../../prompt/job.agent';
import * as fs from 'fs';
import { AIServiceFactory } from '../ai/ai-service.factory';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private configService: ConfigService,
    private aiServiceFactory: AIServiceFactory,
  ) {}

  /**
   * 聊天完成 - 非流式
   */
  async chatCompletion(chatDto: ChatCompletionDto): Promise<ChatResponseDto> {
    try {
      const { model = 'deepseek-chat' } = chatDto;
      
      // 根据模型自动选择AI服务
      const aiService = this.aiServiceFactory.getServiceByModel(model);
      
      return await aiService.chatCompletion(chatDto);
    } catch (error) {
      this.logger.error('Chat completion error:', error);
      throw new Error(`聊天服务错误: ${error.message}`);
    }
  }

  /**
   * 聊天完成 - 流式返回
   */
  chatCompletionStream(chatDto: ChatCompletionDto): Observable<string> {
    const { model = 'deepseek-chat' } = chatDto;
    
    // 根据模型自动选择AI服务
    const aiService = this.aiServiceFactory.getServiceByModel(model);
    
    return aiService.chatCompletionStream(chatDto);
  }

  /**
   * 简历匹配度流式分析
   */
  resumeMatchChatStream(dto: ChatCompletionDto): Observable<string> {
    // 读取简历内容
    const { messages: userMsg, model = 'deepseek-chat' } = dto;
    const resumePath = __dirname + '/../../resume.json';
    let resumeContent = '';
    try {
      resumeContent = fs.readFileSync(resumePath, 'utf-8');
    } catch (e) {
      this.logger.error('读取简历文件失败', e);
      return new Observable(observer => {
        observer.error(new Error('简历文件读取失败'));
      });
    }

    // 构造系统 prompt
    let systemPrompt = jobAgentPrompt + '\n\n';
    systemPrompt += '候选人简历内容如下：\n' + resumeContent + '\n';
    systemPrompt += '请根据上述内容，回答用户问题。';

    // 构造消息
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ... userMsg.map(msg => ({
        role: msg.role,
        content: msg.content,
      }))
    ];

    // 根据模型自动选择AI服务
    const aiService = this.aiServiceFactory.getServiceByModel(model);
    
    // 创建新的ChatCompletionDto
    const enhancedDto: ChatCompletionDto = {
      ...dto,
      messages,
    };

    return aiService.chatCompletionStream(enhancedDto);
  }

  


  /**
   * 获取支持的模型列表
   */
  async getModels() {
    try {
      return await this.aiServiceFactory.getAllModels();
    } catch (error) {
      this.logger.error('Failed to fetch models:', error);
      throw error;
    }
  }

  /**
   * 健康检查
   */
  async healthCheck() {
    try {
      return await this.aiServiceFactory.getAllServicesStatus();
    } catch (error) {
      this.logger.error('Health check failed:', error.message);
      throw error;
    }
  }
} 