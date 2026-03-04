import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Check API health' })
  async check() {
    let dbStatus = 'ok';
    try { await this.prisma.$queryRaw`SELECT 1`; } catch { dbStatus = 'error'; }
    return { status: 'ok', db: dbStatus, timestamp: new Date().toISOString(), version: '1.0.0' };
  }
}
