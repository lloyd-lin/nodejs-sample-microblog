import {
    Controller,
    Post,
    Get,
    Body,
    Res,
    Headers,
    ValidationPipe,
  } from '@nestjs/common';
  import { Response } from 'express';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiHeader,
    ApiBody,
  } from '@nestjs/swagger';
  import { ChatService } from './chat.service';
  import { ChatCompletionDto, ChatResponseDto } from '../ai/dto/chat.dto';
  
  @ApiTags('chat')
  @Controller('chat')
  export class ChatController {
    constructor(private readonly chatService: ChatService) {}
  
    @Post('completions')
    @ApiOperation({ summary: '聊天完成 - OpenAI兼容API' })
    @ApiResponse({
      status: 200,
      description: '聊天响应',
      type: ChatResponseDto,
    })
    @ApiBody({ type: ChatCompletionDto })
    async chatCompletion(
      @Body(ValidationPipe) chatDto: ChatCompletionDto,
      @Res() res: Response,
    ) {
      // 检查是否为流式请求
      if (chatDto.stream) {
        return this.streamChat(chatDto, res);
      }
  
      // 非流式请求
      const response = await this.chatService.chatCompletion(chatDto);
      return res.json(response);
    }
  
    @Post('stream')
    @ApiOperation({ summary: '流式聊天完成 - SSE' })
    @ApiResponse({
      status: 200,
      description: 'SSE流式响应',
      headers: {
        'Content-Type': {
          description: 'text/event-stream; charset=utf-8',
        },
        'Cache-Control': {
          description: 'no-cache',
        },
        Connection: {
          description: 'keep-alive',
        },
      },
    })
    @ApiHeader({
      name: 'Accept',
      description: 'text/event-stream',
      required: false,
    })
    async streamChat(
      @Body(ValidationPipe) chatDto: ChatCompletionDto,
      @Res() res: Response,
    ) {
      // 设置SSE响应头
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', 'https://openapi.lgforest.fun,https://introduce.lgforest.fun');
      res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.flushHeaders();
      try {
        // 创建流式响应
        const stream = this.chatService.chatCompletionStream({
          ...chatDto,
          stream: true,
        });
  
        // 订阅流并发送数据
        stream.subscribe({
          next: (data) => {
            res.write(data);
          },
          complete: () => {
            res.end();
          },
          error: (error) => {
            console.error('Stream error:', error);
            res.write(`data: {"error": "${error.message}"}\n\n`);
            res.end();
          },
        });
      } catch (error) {
        console.error('Failed to create stream:', error);
        res.status(500).json({ error: 'Failed to create stream' });
      }
    }
  
    @Post('resume-match-sse')
    @ApiOperation({ summary: '简历匹配度分析 - SSE流式' })
    @ApiResponse({
      status: 200,
      description: 'SSE流式简历匹配度分析响应',
      headers: {
        'Content-Type': { description: 'text/event-stream; charset=utf-8' },
        'Cache-Control': { description: 'no-cache' },
        Connection: { description: 'keep-alive' },
      },
    })
    @ApiHeader({
      name: 'Accept',
      description: 'text/event-stream',
      required: false,
    })
    async resumeMatchSse(
      @Body(ValidationPipe) dto: ChatCompletionDto,
      @Res() res: Response,
    ) {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', 'https://openapi.lgforest.fun,https://introduce.lgforest.fun');
      res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.flushHeaders();
      try {
        const stream = this.chatService.resumeMatchChatStream(dto);
        stream.subscribe({
          next: (data) => {
            res.write(data);
          },
          complete: () => {
            res.end();
          },
          error: (error) => {
            console.error('ResumeMatch SSE error:', error);
            res.write(`data: {"error": "${error.message}"}\n\n`);
            res.end();
          },
        });
      } catch (error) {
        console.error('Failed to create resume match stream:', error);
        res.status(500).json({ error: 'Failed to create resume match stream' });
      }
    }
  
    @Get('models')
    @ApiOperation({ summary: '获取可用模型列表' })
    @ApiResponse({
      status: 200,
      description: '模型列表',
      schema: {
        type: 'object',
        properties: {
          object: { type: 'string', example: 'list' },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                object: { type: 'string' },
                created: { type: 'number' },
                owned_by: { type: 'string' },
              },
            },
          },
        },
      },
    })
    getModels() {
      return {
        object: 'list',
        data: this.chatService.getModels(),
      };
    }
  
    @Post('test')
    @ApiOperation({ summary: '测试聊天功能' })
    @ApiResponse({ status: 200, description: '测试成功' })
    async testChat() {
      const testMessage = {
        messages: [
          {
            role: 'user' as const,
            content: '你好，请介绍一下这个微博应用',
          },
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      };
  
      const response = await this.chatService.chatCompletion(testMessage);
      return {
        success: true,
        data: response,
        message: '聊天功能测试成功',
      };
    }
  }