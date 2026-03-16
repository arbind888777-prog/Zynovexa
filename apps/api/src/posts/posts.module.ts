import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from '../accounts/accounts.module';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostSchedulerCron } from './post-scheduler.cron';

@Module({
  imports: [ConfigModule, AccountsModule],
  providers: [PostsService, PostSchedulerCron],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
