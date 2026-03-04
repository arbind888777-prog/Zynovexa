import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import {
  GenerateCaptionDto, GenerateScriptDto, GenerateHashtagsDto,
  GenerateImageDto, ChatMessageDto, BestTimeDto,
} from './dto/ai.dto';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('caption')
  @ApiOperation({ summary: 'Generate AI captions for a post' })
  generateCaption(@Request() req, @Body() dto: GenerateCaptionDto) {
    return this.aiService.generateCaption(req.user.id, dto);
  }

  @Post('script')
  @ApiOperation({ summary: 'Generate video script' })
  generateScript(@Request() req, @Body() dto: GenerateScriptDto) {
    return this.aiService.generateScript(req.user.id, dto);
  }

  @Post('hashtags')
  @ApiOperation({ summary: 'Generate hashtags for content' })
  generateHashtags(@Request() req, @Body() dto: GenerateHashtagsDto) {
    return this.aiService.generateHashtags(req.user.id, dto);
  }

  @Post('image')
  @ApiOperation({ summary: 'Generate AI image with DALL-E 3' })
  generateImage(@Request() req, @Body() dto: GenerateImageDto) {
    return this.aiService.generateImage(req.user.id, dto);
  }

  @Post('chat')
  @ApiOperation({ summary: 'Chat with Zyx AI assistant' })
  chat(@Request() req, @Body() dto: ChatMessageDto) {
    return this.aiService.chat(req.user.id, dto);
  }

  @Post('best-time')
  @ApiOperation({ summary: 'Get AI-suggested best times to post' })
  getBestTimes(@Request() req, @Body() dto: BestTimeDto) {
    return this.aiService.getBestTimes(req.user.id, dto);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get AI usage stats for current month' })
  getUsage(@Request() req) {
    return this.aiService.getUsageStats(req.user.id);
  }
}
