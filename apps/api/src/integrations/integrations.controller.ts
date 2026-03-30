import { Controller, Get, Post, Param, Body, Query, UseGuards, Req, Res } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get('platforms')
  @UseGuards(JwtAuthGuard)
  async getAvailablePlatforms(@Req() req: any) {
    return this.integrationsService.getAvailablePlatforms(req.user.id);
  }

  @Get('oauth/:platform')
  @UseGuards(JwtAuthGuard)
  async getOAuthUrl(@Req() req: any, @Param('platform') platform: string, @Query('frontend') frontend?: string) {
    return this.integrationsService.getOAuthUrl(req.user.id, platform, frontend);
  }

  @Get('callback/:platform')
  async handleCallback(
    @Param('platform') platform: string,
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: any,
  ) {
    try {
      const result = await this.integrationsService.handleOAuthCallback(platform, code, state);
      return res.redirect(result.redirectUrl);
    } catch {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      return res.redirect(`${frontendUrl.replace(/\/$/, '')}/accounts?error=${platform.toLowerCase()}_failed`);
    }
  }

  @Post('refresh/:platform')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Req() req: any, @Param('platform') platform: string) {
    return this.integrationsService.refreshToken(req.user.id, platform);
  }

  @Post('schedule')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async getScheduledQueue(@Req() req: any) {
    return this.integrationsService.getScheduledQueue(req.user.id);
  }
}
