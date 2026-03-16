import { Module } from '@nestjs/common';
import { MonetizationService } from './monetization.service';
import { MonetizationController } from './monetization.controller';

@Module({
  providers: [MonetizationService],
  controllers: [MonetizationController],
  exports: [MonetizationService],
})
export class MonetizationModule {}
