import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AiEngineService } from './ai-engine.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('AI Engine')
@Controller('ai-engine')
@UseGuards(JwtAuthGuard)
export class AiEngineController {
  constructor(private aiEngineService: AiEngineService) {}

  @Post('generate')
  generate(
    @Request() req: any,
    @Body() body: { niche: string; platform: string; tone: string; audience: string; contentType: string; topic?: string },
  ) {
    return this.aiEngineService.generate(req.user.id, body);
  }

  @Post('score')
  scoreContent(
    @Request() req: any,
    @Body() body: { content: string; platform: string },
  ) {
    return this.aiEngineService.scoreContentEndpoint(req.user.id, body);
  }
}
