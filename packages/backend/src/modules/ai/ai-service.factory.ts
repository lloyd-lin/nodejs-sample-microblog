import { Injectable, Logger } from '@nestjs/common';
import { AIServiceInterface, AIServiceType } from './interfaces/ai-service.interface';
import { DeepSeekService } from './providers/deepseek.service';
import { KimiAIService } from './providers/kimi-ai.service';

@Injectable()
export class AIServiceFactory {
  private readonly logger = new Logger(AIServiceFactory.name);
  private services: Map<AIServiceType, AIServiceInterface>;

  constructor(
    private readonly deepSeekService: DeepSeekService,
    private readonly kimiAIService: KimiAIService,
  ) {
    this.services = new Map();
    this.services.set(AIServiceType.DEEPSEEK, deepSeekService);
    this.services.set(AIServiceType.KIMI, kimiAIService);
  }

  /**
   * 获取指定的AI服务
   */
  getService(type: AIServiceType): AIServiceInterface {
    const service = this.services.get(type);
    if (!service) {
      throw new Error(`AI service type '${type}' is not supported`);
    }
    return service;
  }

  /**
   * 获取所有可用的AI服务
   */
  getAvailableServices(): AIServiceInterface[] {
    return Array.from(this.services.values()).filter(service => service.isAvailable());
  }

  /**
   * 获取默认的AI服务（优先使用DeepSeek，如果不可用则使用KimiAI）
   */
  getDefaultService(): AIServiceInterface {
    // 优先使用DeepSeek
    if (this.deepSeekService.isAvailable()) {
      return this.deepSeekService;
    }

    // 如果DeepSeek不可用，使用KimiAI
    if (this.kimiAIService.isAvailable()) {
      return this.kimiAIService;
    }

    throw new Error('No AI service is available');
  }

  /**
   * 获取所有服务的状态
   */
  async getAllServicesStatus(): Promise<any[]> {
    const statuses = [];

    for (const [type, service] of this.services.entries()) {
      try {
        const status = await service.healthCheck();
        statuses.push({
          type,
          ...status,
        });
      } catch (error) {
        statuses.push({
          type,
          service: service.getServiceName(),
          available: false,
          status: 'error',
          error: error.message,
        });
      }
    }

    return statuses;
  }

  /**
   * 根据模型名称自动选择服务
   */
  getServiceByModel(model: string): AIServiceInterface {
    // 根据模型名称判断使用哪个服务
    if (model.includes('deepseek') || model.includes('deepseek-chat') || model.includes('deepseek-coder')) {
      return this.getService(AIServiceType.DEEPSEEK);
    }

    if (model.includes('moonshot') || model.includes('kimi')) {
      return this.getService(AIServiceType.KIMI);
    }

    // 默认使用DeepSeek
    return this.getDefaultService();
  }

  /**
   * 获取所有支持的模型
   */
  async getAllModels(): Promise<any[]> {
    const allModels = [];

    for (const service of this.services.values()) {
      if (service.isAvailable()) {
        try {
          const models = await service.getModels();
          allModels.push({
            service: service.getServiceName(),
            models,
          });
        } catch (error) {
          this.logger.error(`Failed to get models from ${service.getServiceName()}:`, error);
        }
      }
    }

    return allModels;
  }
} 