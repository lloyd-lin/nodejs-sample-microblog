import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: '创建文章' })
  @ApiResponse({ status: 201, description: '文章创建成功' })
  create(@Body() createPostDto: any) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: '获取文章列表' })
  @ApiResponse({ status: 200, description: '返回文章列表' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取文章详情' })
  @ApiResponse({ status: 200, description: '返回文章详情' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新文章' })
  @ApiResponse({ status: 200, description: '文章更新成功' })
  update(@Param('id') id: string, @Body() updatePostDto: any) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文章' })
  @ApiResponse({ status: 200, description: '文章删除成功' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
} 