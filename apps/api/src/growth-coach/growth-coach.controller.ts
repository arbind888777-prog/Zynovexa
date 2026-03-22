import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { GrowthCoachService } from './growth-coach.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('growth-coach')
@UseGuards(JwtAuthGuard)
export class GrowthCoachController {
  constructor(private growthCoachService: GrowthCoachService) {}

  @Get('daily')
  getDailyRecommendations(@Request() req: any) {
    return this.growthCoachService.getDailyRecommendations(req.user.id);
  }

  @Get('weekly-report')
  getWeeklyReport(@Request() req: any) {
    return this.growthCoachService.getWeeklyReport(req.user.id);
  }
}
