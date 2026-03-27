import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AiEngineService } from './ai-engine.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('AI Engine')
@Controller('ai-engine')
export class AiEngineController {
  constructor(private aiEngineService: AiEngineService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate AI content (hooks, captions, scripts)' })
  generate(
    @Request() req: any,
    @Body() body: { niche: string; platform: string; tone: string; audience: string; contentType: string; topic?: string },
  ) {
    return this.aiEngineService.generate(req.user.id, body);
  }

  @Post('score')
  @ApiOperation({ summary: 'Score content for engagement potential (no auth needed)' })
  scoreContent(
    @Body() body: { content: string; platform: string },
  ) {
    return this.aiEngineService.scoreContentEndpoint(body);
  }
}
