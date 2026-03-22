import { Module } from '@nestjs/common';
import { AiEngineService } from './ai-engine.service';
import { AiEngineController } from './ai-engine.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiEngineController],
  providers: [AiEngineService],
  exports: [AiEngineService],
})
export class AiEngineModule {}
