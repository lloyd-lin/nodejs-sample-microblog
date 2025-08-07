import { Injectable, Inject } from "@nestjs/common";
import { CreateGalleryStreamDto } from "./dto/create-gallery-stream.dto";
import { Observable } from "rxjs";
import { AIServiceFactory } from "../ai/ai-service.factory";
import { ChatCompletionDto } from "../ai/dto/chat.dto";
import { imageAgentPrompt } from "../../prompt/image.agent";
@Injectable()
export class GalleryService {
  constructor(
    @Inject(AIServiceFactory)
    private readonly aiServiceFactory: AIServiceFactory
  ) {}

  /**
   * 简历匹配度流式分析
   */
  analyzeImageChatStream(dto: CreateGalleryStreamDto): Observable<string> {
    // 读取简历内容
    const model = "moonshot-v1-8k-vision-preview";
    const { imageData } = dto;
    const enhancedDto: ChatCompletionDto = {
      model,
      messages: [
        {
          role: "system",
          content: imageAgentPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageData,
              },
            },
            {
              type: "text",
              text: "请描述这个图片",
            },
          ],
        },
      ],
    };
    // 根据模型自动选择AI服务
    const aiService = this.aiServiceFactory.getServiceByModel(model);

    return aiService.chatCompletionStream(enhancedDto);
  }
}
