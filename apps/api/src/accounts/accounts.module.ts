import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TokenEncryptionService } from './token-encryption.service';
import { VideoAnalyticsModule } from '../video-analytics/video-analytics.module';

@Module({
  imports: [ConfigModule, VideoAnalyticsModule],
  providers: [AccountsService, TokenEncryptionService],
  controllers: [AccountsController],
  exports: [AccountsService, TokenEncryptionService],
})
export class AccountsModule {}
