import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VideoAnalyticsService } from './video-analytics.service';
import { VideoAnalyticsController } from './video-analytics.controller';
import { YoutubeService } from './youtube.service';

@Module({
  imports: [ConfigModule],
  providers: [VideoAnalyticsService, YoutubeService],
  controllers: [VideoAnalyticsController],
  exports: [VideoAnalyticsService, YoutubeService],
})
export class VideoAnalyticsModule {}
