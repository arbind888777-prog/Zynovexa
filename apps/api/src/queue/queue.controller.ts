import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { QueueService } from './queue.service';

@ApiTags('Queue (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('queue')
export class QueueController {
  constructor(private queueService: QueueService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get all queue statistics (Admin only)' })
  getStats() {
    return this.queueService.getQueueStats();
  }
}
