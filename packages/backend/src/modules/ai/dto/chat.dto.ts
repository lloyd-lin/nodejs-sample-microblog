import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class ChatMessageDto {
  @ApiProperty({ description: '角色', enum: ['user', 'assistant', 'system'] })
  @IsString()
  role: 'user' | 'assistant' | 'system';

  @ApiProperty({ description: '消息内容' })
  @IsString()
  content: string | any;
}

export class ChatCompletionDto {
  @ApiProperty({ 
    description: '对话消息列表', 
    type: [ChatMessageDto],
    example: [
      { role: 'user', content: '你好，请介绍一下这个微博应用' }
    ]
  })
  @IsArray()
  messages: ChatMessageDto[];

  @ApiProperty({ description: '模型名称', default: 'gpt-3.5-turbo', required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ description: '温度参数', default: 0.7, required: false })
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiProperty({ description: '最大token数', default: 1000, required: false })
  @IsOptional()
  @IsNumber()
  max_tokens?: number;

  @ApiProperty({ description: '是否流式返回', default: false, required: false })
  @IsOptional()
  @IsBoolean()
  stream?: boolean;
}

export class ChatResponseDto {
  @ApiProperty({ description: '响应ID' })
  id: string;

  @ApiProperty({ description: '对象类型' })
  object: string;

  @ApiProperty({ description: '创建时间戳' })
  created: number;

  @ApiProperty({ description: '模型名称' })
  model: string;

  @ApiProperty({ description: '选择列表' })
  choices: {
    index: number;
    message: ChatMessageDto;
    finish_reason: string;
  }[];

  @ApiProperty({ description: '使用情况' })
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
} 