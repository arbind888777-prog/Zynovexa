import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get('platforms')
  async getAvailablePlatforms(@Req() req: any) {
    return this.integrationsService.getAvailablePlatforms(req.user.id);
  }

  @Get('oauth/:platform')
  async getOAuthUrl(@Req() req: any, @Param('platform') platform: string) {
    return this.integrationsService.getOAuthUrl(req.user.id, platform);
  }

  @Get('callback/:platform')
  async handleCallback(
    @Param('platform') platform: string,
    @Query('code') code: string,
    @Req() req: any,
  ) {
    return this.integrationsService.handleOAuthCallback(platform, code, req.user.id);
  }

  @Post('refresh/:platform')
  async refreshToken(@Req() req: any, @Param('platform') platform: string) {
    return this.integrationsService.refreshToken(req.user.id, platform);
  }

  @Post('schedule')
  async schedulePost(
    @Req() req: any,
    @Body() body: { postId: string; platforms: string[]; scheduledAt: string },
  ) {
    return this.integrationsService.schedulePost(
      req.user.id,
      body.postId,
      body.platforms,
      body.scheduledAt,
    );
  }

  @Get('queue')
  async getScheduledQueue(@Req() req: any) {
    return this.integrationsService.getScheduledQueue(req.user.id);
  }
}
