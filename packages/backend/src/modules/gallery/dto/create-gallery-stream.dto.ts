import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGalleryStreamDto {
  @ApiPropertyOptional({
    description: '用户提示信息',
    example: '请分析这张图片的内容',
  })
  @IsString()
  @IsOptional()
  prompt?: string;


  @ApiProperty({
    description: '图片数据',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAADwAAAAhwCAI',
  })
  @IsString()
  @IsNotEmpty()
  imageData: string;

  @ApiPropertyOptional({
    description: '额外的元数据',
    example: { imageUrl: 'https://example.com/image.jpg' },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 