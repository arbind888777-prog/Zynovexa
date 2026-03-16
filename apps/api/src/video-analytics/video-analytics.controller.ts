import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, Request, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VideoAnalyticsService } from './video-analytics.service';
import { YoutubeService } from './youtube.service';
import {
  CreateVideoMetadataDto, UpdateVideoMetricsDto, VideoQueryDto,
} from './dto/video-analytics.dto';

@ApiTags('Video Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('video-analytics')
export class VideoAnalyticsController {
  constructor(
    private videoAnalyticsService: VideoAnalyticsService,
    private youtubeService: YoutubeService,
  ) {}

  // ─── CRUD ──────────────────────────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: 'Add video metadata' })
  create(@Request() req, @Body() dto: CreateVideoMetadataDto) {
    return this.videoAnalyticsService.createVideo(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all videos with analytics (paginated)' })
  findAll(@Request() req, @Query() query: VideoQueryDto) {
    return this.videoAnalyticsService.getVideos(req.user.id, query);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get video performance overview with platform breakdown' })
  getOverview(@Request() req) {
    return this.videoAnalyticsService.getVideoPerformanceOverview(req.user.id);
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top performing videos' })
  getTop(@Request() req, @Query('limit') limit?: string) {
    return this.videoAnalyticsService.getTopPerformingVideos(req.user.id, parseInt(limit) || 10);
  }

  @Get('trend')
  @ApiOperation({ summary: 'Get video growth trend over time' })
  getTrend(@Request() req, @Query('days') days?: string) {
    return this.videoAnalyticsService.getVideoGrowthTrend(req.user.id, parseInt(days) || 30);
  }

  @Get('retention')
  @ApiOperation({ summary: 'Get retention analysis grouped by video duration' })
  getRetention(@Request() req) {
    return this.videoAnalyticsService.getRetentionAnalysis(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single video details' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.videoAnalyticsService.getVideo(id, req.user.id);
  }

  @Put(':id/metrics')
  @ApiOperation({ summary: 'Update video metrics (views, likes, etc.)' })
  updateMetrics(@Request() req, @Param('id') id: string, @Body() dto: UpdateVideoMetricsDto) {
    return this.videoAnalyticsService.updateMetrics(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete video metadata' })
  remove(@Request() req, @Param('id') id: string) {
    return this.videoAnalyticsService.deleteVideo(id, req.user.id);
  }

  // ─── YouTube Data API v3 endpoints ────────────────────────────────────────

  @Get('youtube/channel')
  @ApiOperation({ summary: 'Fetch real YouTube channel stats (by channel ID or @handle)' })
  @ApiQuery({ name: 'channelId', description: 'Channel ID (UCxxxx) or @handle', required: true })
  getYoutubeChannel(@Query('channelId') channelId: string) {
    return this.youtubeService.getChannelStats(channelId);
  }

  @Get('youtube/videos')
  @ApiOperation({ summary: 'Fetch real YouTube video stats by video ID(s)' })
  @ApiQuery({ name: 'ids', description: 'Comma-separated video IDs (max 50)', required: true })
  getYoutubeVideos(@Query('ids') ids: string) {
    return this.youtubeService.getVideoStats(ids);
  }

  @Get('youtube/search')
  @ApiOperation({ summary: 'Search YouTube videos by keyword' })
  @ApiQuery({ name: 'q', description: 'Search query', required: true })
  @ApiQuery({ name: 'maxResults', description: 'Number of results (default 10, max 50)', required: false })
  searchYoutubeVideos(@Query('q') q: string, @Query('maxResults') maxResults?: string) {
    return this.youtubeService.searchVideos(q, parseInt(maxResults || '10'));
  }

  @Get('youtube/trending')
  @ApiOperation({ summary: 'Get trending YouTube videos by region' })
  @ApiQuery({ name: 'regionCode', description: 'ISO 3166-1 alpha-2 country code (default: IN)', required: false })
  @ApiQuery({ name: 'maxResults', description: 'Number of results (default 10, max 50)', required: false })
  getTrendingYoutubeVideos(
    @Query('regionCode') regionCode?: string,
    @Query('maxResults') maxResults?: string,
  ) {
    return this.youtubeService.getTrendingVideos(regionCode || 'IN', parseInt(maxResults || '10'));
  }
}
