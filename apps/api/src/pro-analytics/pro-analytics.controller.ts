import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProAnalyticsService } from './pro-analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Pro Analytics')
@Controller('pro-analytics')
@UseGuards(JwtAuthGuard)
export class ProAnalyticsController {
  constructor(private proAnalyticsService: ProAnalyticsService) {}

  @Get('overview')
  getOverview(@Request() req: any) {
    return this.proAnalyticsService.getOverview(req.user.id);
  }

  @Get('content-ranking')
  getContentRanking(@Request() req: any) {
    return this.proAnalyticsService.getContentRanking(req.user.id);
  }

  @Get('competitors')
  getCompetitors(@Request() req: any) {
    return this.proAnalyticsService.getCompetitors(req.user.id);
  }

  @Post('competitors')
  addCompetitor(@Request() req: any, @Body() body: { handle: string; platform: string }) {
    return this.proAnalyticsService.addCompetitor(req.user.id, body);
  }
}
