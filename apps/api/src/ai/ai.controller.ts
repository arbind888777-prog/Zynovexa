import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import {
  GenerateCaptionDto, GenerateScriptDto, GenerateHashtagsDto,
  GenerateImageDto, ChatMessageDto, BestTimeDto,
} from './dto/ai.dto';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('caption')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate AI captions for a post' })
  generateCaption(@Request() req, @Body() dto: GenerateCaptionDto) {
    return this.aiService.generateCaption(req.user.id, dto);
  }

  @Post('script')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate video script' })
  generateScript(@Request() req, @Body() dto: GenerateScriptDto) {
    return this.aiService.generateScript(req.user.id, dto);
  }

  @Post('hashtags')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate hashtags for content' })
  generateHashtags(@Request() req, @Body() dto: GenerateHashtagsDto) {
    return this.aiService.generateHashtags(req.user.id, dto);
  }

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate AI image with DALL-E 3' })
  generateImage(@Request() req, @Body() dto: GenerateImageDto) {
    return this.aiService.generateImage(req.user.id, dto);
  }

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chat with Zyx AI assistant' })
  chat(@Request() req, @Body() dto: ChatMessageDto) {
    return this.aiService.chat(req.user.id, dto);
  }

  @Post('public-chat')
  @Throttle({ default: { limit: 12, ttl: 60000 } })
  @ApiOperation({ summary: 'Public chat with Zyx AI assistant' })
  publicChat(@Body() dto: ChatMessageDto) {
    return this.aiService.publicChat(dto);
  }

  @Post('best-time')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get AI-suggested best times to post' })
  getBestTimes(@Request() req, @Body() dto: BestTimeDto) {
    return this.aiService.getBestTimes(req.user.id, dto);
  }

  @Get('usage')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get AI usage stats for current month' })
  getUsage(@Request() req) {
    return this.aiService.getUsageStats(req.user.id);
  }

  @Get('chat-memory')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export recent chat memory' })
  getChatMemory(@Request() req) {
    return this.aiService.getChatMemory(req.user.id);
  }

  @Post('chat-memory/reset')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset chat memory' })
  resetChatMemory(@Request() req) {
    return this.aiService.clearChatMemory(req.user.id);
  }
}
