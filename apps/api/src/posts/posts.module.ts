import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from '../accounts/accounts.module';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostSchedulerCron } from './post-scheduler.cron';

import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [ConfigModule, AccountsModule, GamificationModule],
  providers: [PostsService, PostSchedulerCron],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
