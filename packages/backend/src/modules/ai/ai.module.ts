import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeepSeekService } from './providers/deepseek.service';
import { KimiAIService } from './providers/kimi-ai.service';
import { AIServiceFactory } from './ai-service.factory';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    DeepSeekService,
    KimiAIService,
    AIServiceFactory,
  ],
  exports: [
    DeepSeekService,
    KimiAIService,
    AIServiceFactory,
  ],
})
export class AIModule {} 