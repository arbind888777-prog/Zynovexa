import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto/post.dto';

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  create(@Request() req, @Body() dto: CreatePostDto) {
    return this.postsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts (paginated)' })
  findAll(@Request() req, @Query() query: PostQueryDto) {
    return this.postsService.findAll(req.user.id, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get post statistics' })
  getStats(@Request() req) {
    return this.postsService.getStats(req.user.id);
  }

  @Get('scheduled')
  @ApiOperation({ summary: 'Get all scheduled posts' })
  getScheduled(@Request() req) {
    return this.postsService.getScheduled(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single post' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.postsService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, req.user.id, dto);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a post immediately' })
  publish(@Request() req, @Param('id') id: string) {
    return this.postsService.publish(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  remove(@Request() req, @Param('id') id: string) {
    return this.postsService.remove(id, req.user.id);
  }
}
