import { Module } from '@nestjs/common';
import { ProAnalyticsService } from './pro-analytics.service';
import { ProAnalyticsController } from './pro-analytics.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProAnalyticsController],
  providers: [ProAnalyticsService],
  exports: [ProAnalyticsService],
})
export class ProAnalyticsModule {}
