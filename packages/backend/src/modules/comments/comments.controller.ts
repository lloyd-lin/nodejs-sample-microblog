import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentsService } from './comments.service';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: '创建评论' })
  @ApiResponse({ status: 201, description: '评论创建成功' })
  create(@Body() createCommentDto: any) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: '获取评论列表' })
  @ApiResponse({ status: 200, description: '返回评论列表' })
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取评论详情' })
  @ApiResponse({ status: 200, description: '返回评论详情' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新评论' })
  @ApiResponse({ status: 200, description: '评论更新成功' })
  update(@Param('id') id: string, @Body() updateCommentDto: any) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除评论' })
  @ApiResponse({ status: 200, description: '评论删除成功' })
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
} 