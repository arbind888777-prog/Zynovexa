import { Controller, Get, Query, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics.dto';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get analytics overview (followers, impressions, engagement)' })
  getOverview(@Request() req, @Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getOverview(req.user.id, query);
  }

  @Get('chart')
  @ApiOperation({ summary: 'Get time-series chart data' })
  getChartData(@Request() req, @Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getChartData(req.user.id, query);
  }

  @Get('platforms')
  @ApiOperation({ summary: 'Get per-platform breakdown' })
  getPlatformBreakdown(@Request() req) {
    return this.analyticsService.getPlatformBreakdown(req.user.id);
  }

  @Get('top-posts')
  @ApiOperation({ summary: 'Get top performing posts' })
  getTopPosts(@Request() req, @Query('limit') limit: string) {
    return this.analyticsService.getTopPosts(req.user.id, limit ? parseInt(limit) : 10);
  }
}
