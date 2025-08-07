import { Controller, Post, Body, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GalleryService } from './gallery.service';
import { CreateGalleryStreamDto } from './dto/create-gallery-stream.dto';
import { ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post('analyze-image')
  @ApiOperation({ summary: '解析图片内容' })
  @ApiResponse({
    status: 200,
    description: 'SSE流式解析图片内容',
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
  async analyzeImage(
    @Body() createGalleryStreamDto: CreateGalleryStreamDto,
    @Res() res: Response,
  ) {
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', 'https://openapi.lgforest.fun,https://introduce.lgforest.fun');
        res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.flushHeaders();
        try {
          const stream = this.galleryService.analyzeImageChatStream(createGalleryStreamDto);
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
}
