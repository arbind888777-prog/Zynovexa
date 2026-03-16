import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Request, Query, Res, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiExcludeEndpoint, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountsService } from './accounts.service';
import { ConnectAccountDto, UpdateAccountDto } from './dto/account.dto';

@ApiTags('Accounts')
@ApiBearerAuth()
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all connected social accounts (tokens hidden)' })
  getAll(@Request() req) { return this.accountsService.getAll(req.user.id); }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get account stats (total followers, reconnect status per platform)' })
  getStats(@Request() req) { return this.accountsService.getStats(req.user.id); }

  @Get('youtube/insights')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get connected YouTube channel insights with latest videos' })
  getYoutubeInsights(@Request() req) {
    return this.accountsService.getYoutubeInsights(req.user.id);
  }

  @Post('connect')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Manually connect a social account (with access token)' })
  connect(@Request() req, @Body() dto: ConnectAccountDto) {
    return this.accountsService.connect(req.user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update account tokens/info' })
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accountsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Disconnect a social account' })
  disconnect(@Request() req, @Param('id') id: string) {
    return this.accountsService.disconnect(req.user.id, id);
  }

  // ─── YouTube OAuth Connect Flow ───────────────────────────────────────────────

  @Get('connect/youtube')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get Google OAuth URL to connect YouTube account',
    description: 'Returns { url }. Frontend does window.location.href = url to initiate OAuth.',
  })
  getYoutubeConnectUrl(@Request() req) {
    return this.accountsService.generateYoutubeConnectUrl(req.user.id);
  }

  @Get('connect/youtube/callback')
  @ApiExcludeEndpoint() // Google calls this directly — not for Swagger
  async youtubeCallback(
    @Query('code')  code:  string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

    if (error) {
      return res.redirect(`${frontendUrl}/accounts?error=youtube_denied`);
    }
    if (!code || !state) {
      return res.redirect(`${frontendUrl}/accounts?error=youtube_invalid`);
    }

    try {
      await this.accountsService.handleYoutubeCallback(code, state);
      return res.redirect(`${frontendUrl}/accounts?connected=youtube`);
    } catch (err: any) {
      return res.redirect(`${frontendUrl}/accounts?error=youtube_failed`);
    }
  }
}

