import { Module } from '@nestjs/common';
import { GrowthCoachService } from './growth-coach.service';
import { GrowthCoachController } from './growth-coach.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [GrowthCoachController],
  providers: [GrowthCoachService],
  exports: [GrowthCoachService],
})
export class GrowthCoachModule {}
