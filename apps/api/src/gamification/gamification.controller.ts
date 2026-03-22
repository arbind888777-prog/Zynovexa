import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('profile')
  async getProfile(@Req() req: any) {
    return this.gamificationService.getProfile(req.user.id);
  }

  @Post('record-action')
  async recordAction(@Req() req: any, @Body() body: { action: string }) {
    return this.gamificationService.recordAction(req.user.id, body.action);
  }

  @Get('leaderboard')
  async getLeaderboard(@Query('limit') limit?: string) {
    return this.gamificationService.getLeaderboard(limit ? parseInt(limit) : 20);
  }

  @Get('reminders')
  async getStreakReminders() {
    return this.gamificationService.getStreakReminders();
  }
}
