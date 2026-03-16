import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@ApiTags('Health')
@SkipThrottle()
@Controller('health')
export class HealthController {
  private redis: Redis | null = null;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    try {
      const redisUrl = this.config.get('REDIS_URL', 'redis://localhost:6379');
      this.redis = new Redis(redisUrl, { maxRetriesPerRequest: 1, lazyConnect: true, enableOfflineQueue: false });
      this.redis.on('error', () => { /* suppress unhandled ioredis errors */ });
      this.redis.connect().catch(() => { this.redis = null; });
    } catch {
      this.redis = null;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Check API health (DB + Redis)' })
  async check() {
    const checks: Record<string, string> = {};

    // Database check
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = 'ok';
    } catch {
      checks.database = 'error';
    }

    // Redis check
    try {
      if (this.redis?.status === 'ready') {
        await this.redis.ping();
        checks.redis = 'ok';
      } else {
        checks.redis = 'error';
      }
    } catch {
      checks.redis = 'error';
    }

    const allHealthy = Object.values(checks).every(v => v === 'ok');
    const memUsage = process.memoryUsage();

    return {
      status: allHealthy ? 'ok' : 'degraded',
      checks,
      uptime: Math.floor(process.uptime()),
      memory: {
        heapUsedMB: +(memUsage.heapUsed / 1024 / 1024).toFixed(1),
        rssMB: +(memUsage.rss / 1024 / 1024).toFixed(1),
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe (always 200)' })
  live() {
    return { status: 'alive' };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe (checks DB connection)' })
  async ready(@Res() res: Response) {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return res.status(HttpStatus.OK).json({ status: 'ready' });
    } catch {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ status: 'not_ready' });
    }
  }
}
