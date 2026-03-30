import {
  Controller, Post, Get, Body, UseGuards, Request, HttpCode, HttpStatus, Res, Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto, RefreshTokenDto, MagicLinkDto, MagicLinkVerifyDto, SupabaseExchangeDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GoogleCallbackGuard } from './guards/google-callback.guard';
import { decodeFrontendState, sanitizeFrontendUrl } from '../common/utils/frontend-url';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email & password' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout (invalidate refresh token)' })
  logout(@Request() req, @Body() dto: RefreshTokenDto) {
    return this.authService.logout(req.user.id, dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged-in user' })
  getMe(@Request() req) {
    return this.authService.getMe(req.user.id);
  }

  // ─── Magic Link (Passwordless) Login ──────────────────────────────────────

  @Post('magic-link')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a passwordless magic login link via email' })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  sendMagicLink(@Body() dto: MagicLinkDto) {
    return this.authService.sendMagicLink(dto.email);
  }

  @Post('magic-link/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify a magic login link token and return auth tokens' })
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  verifyMagicLink(@Body() dto: MagicLinkVerifyDto) {
    return this.authService.verifyMagicLink(dto.token);
  }

  @Post('supabase/exchange')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange a Supabase access token for local API JWT tokens' })
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  exchangeSupabaseToken(@Body() dto: SupabaseExchangeDto) {
    return this.authService.exchangeSupabaseToken(dto.accessToken);
  }

  // ─── Google OAuth ─────────────────────────────────────────────────────────

  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @UseGuards(GoogleAuthGuard)
  googleAuth() { /* passport redirects to Google */ }

  @Get('google/callback')
  @ApiExcludeEndpoint()
  @UseGuards(GoogleCallbackGuard)
  async googleCallback(@Request() req, @Res() res: Response) {
    const fallbackFrontendUrl = sanitizeFrontendUrl(process.env.FRONTEND_URL);
    const frontendUrl = decodeFrontendState(req.query?.state) || fallbackFrontendUrl;

    try {
      const result = await this.authService.googleLogin(req.user);
      const isProduction = process.env.NODE_ENV === 'production';

      // Set tokens as httpOnly cookies instead of URL query params
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 15 * 60 * 1000, // 15 min — frontend reads once then clears
      };

      res.cookie('zy_access_token', result.accessToken, cookieOptions);
      res.cookie('zy_refresh_token', result.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.redirect(`${frontendUrl}/auth/google/callback?success=true`);
    } catch {
      return res.redirect(`${frontendUrl}/login?error=google_failed`);
    }
  }

  @Get('google/exchange')
  @ApiOperation({ summary: 'Exchange OAuth cookies for tokens (called by frontend after Google redirect)' })
  @SkipThrottle()
  async googleExchange(@Request() req: any, @Res() res: Response) {
    const accessToken = req.cookies?.zy_access_token;
    const refreshToken = req.cookies?.zy_refresh_token;

    if (!accessToken || !refreshToken) {
      return res.status(401).json({ message: 'No OAuth tokens found' });
    }

    // Clear the one-time cookies
    res.clearCookie('zy_access_token', { path: '/' });
    res.clearCookie('zy_refresh_token', { path: '/' });

    return res.json({ accessToken, refreshToken });
  }
}
