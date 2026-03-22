import {
  Injectable, UnauthorizedException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { SupabaseService } from '../supabase/supabase.service';
import * as bcrypt from 'bcryptjs';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { v4 as uuidv4 } from 'uuid';

// Reserved handles that cannot be claimed by users
const RESERVED_HANDLES = new Set([
  'admin', 'api', 'dashboard', 'login', 'register', 'signup', 'support',
  'help', 'about', 'contact', 'blog', 'pricing', 'features', 'terms',
  'privacy', 'settings', 'store', 'checkout', 'onboarding', 'legal',
  'status', 'press', 'careers', 'community', 'changelog', 'roadmap',
  'templates', 'compare', 'sitemap', 'disclaimer', 'refund-policy',
  'return-policy', 'partner-program', 'resource-library', 'request-feature',
  'free-marketing-tools', 'zynovexa', 'www', 'mail', 'ftp',
]);

export interface GoogleUser {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mail: MailService,
    private supabase: SupabaseService,
  ) {}

  /** Generate a unique handle from user's name, e.g. techmaster436 */
  private async generateHandle(name: string): Promise<string> {
    const normalized = name.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20);
    const base = normalized || 'creator';
    for (let i = 0; i < 10; i++) {
      const num = Math.floor(Math.random() * 900) + 100; // 100-999
      const candidate = `${base}${num}`;
      if (RESERVED_HANDLES.has(candidate)) continue;
      const existing = await this.prisma.user.findUnique({ where: { handle: candidate } });
      if (!existing) return candidate;
    }
    // Fallback with cuid suffix
    return `${base}${Date.now().toString(36)}`;
  }

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (existing) throw new ConflictException('Email already registered');

    const hash = await bcrypt.hash(dto.password, 12);
    const handle = await this.generateHandle(dto.name);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        handle,
        password: hash,
        provider: 'email',
        niche: dto.niche,
        subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.password) {
      if (user.provider === 'google') {
        throw new BadRequestException('This account was created with Google. Use Google sign-in.');
      }

      if (user.provider === 'magic-link') {
        throw new BadRequestException('This account uses magic link login. Use email link sign-in.');
      }

      throw new BadRequestException('This account does not have a password yet.');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      if (user.provider === 'google') {
        throw new BadRequestException('This account was created with Google. Use Google sign-in.');
      }

      if (user.provider === 'magic-link') {
        throw new BadRequestException('This account uses magic link login. Use email link sign-in.');
      }

      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    // Log activity
    await this.prisma.activityLog.create({
      data: { userId: user.id, action: 'login', resource: 'auth' },
    });

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refreshTokens(refreshToken: string) {
    const saved = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!saved || saved.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: saved.userId } });
    if (!user) throw new UnauthorizedException('User not found');

    // Rotate refresh token
    await this.prisma.refreshToken.delete({ where: { token: refreshToken } });
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string, refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken, userId } });
    return { message: 'Logged out successfully' };
  }

  async googleLogin(googleUser: GoogleUser) {
    // Check if user exists by email
    let user = await this.prisma.user.findUnique({ where: { email: googleUser.email.toLowerCase() } });

    if (!user) {
      // Auto-register Google user
      const handle = await this.generateHandle(googleUser.name);
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email.toLowerCase(),
          name: googleUser.name,
          handle,
          provider: 'google',
          password: null,
          avatarUrl: googleUser.avatar,
          isVerified: true,
          subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
        },
      });
    } else if (!user.avatarUrl && googleUser.avatar) {
      // Update avatar if missing
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl: googleUser.avatar, isVerified: true, provider: user.provider === 'email' ? 'email' : 'google' },
      });
    } else if (user.provider !== 'email') {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { provider: 'google', isVerified: true },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true, socialAccounts: { select: { platform: true, isActive: true, followersCount: true } } },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return this.sanitizeUser(user);
  }

  // ─── Magic Link (Passwordless) Login ──────────────────────────────────────

  async sendMagicLink(email: string) {
    const normalizedEmail = email.toLowerCase();

    // Generate a short-lived magic-link JWT (15 min)
    const token = await this.jwt.signAsync(
      { email: normalizedEmail, purpose: 'magic-link' },
      {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    await this.mail.sendMagicLogin(normalizedEmail, token);

    return { message: 'Magic login link sent to your email' };
  }

  async verifyMagicLink(token: string) {
    let payload: { email: string; purpose: string };
    try {
      payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Magic link expired or invalid');
    }

    if (payload.purpose !== 'magic-link') {
      throw new UnauthorizedException('Invalid token purpose');
    }

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      // Auto-register on first magic-link login
      const handle = await this.generateHandle(payload.email.split('@')[0]);
      user = await this.prisma.user.create({
        data: {
          email: payload.email,
          name: payload.email.split('@')[0],
          handle,
          provider: 'magic-link',
          password: null,
          isVerified: true,
          subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
        },
      });
    } else if (!user.isVerified) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true, provider: user.provider === 'email' ? 'email' : 'magic-link' },
      });
    } else if (user.provider !== 'email') {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { provider: 'magic-link' },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async exchangeSupabaseToken(accessToken: string) {
    if (!accessToken) {
      throw new BadRequestException('Supabase access token is required');
    }

    const supabaseUser = await this.supabase.verifyAccessToken(accessToken);
    if (!supabaseUser?.email) {
      throw new UnauthorizedException('Supabase session is invalid or missing email');
    }

    return this.syncSupabaseUser(supabaseUser);
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  private async syncSupabaseUser(supabaseUser: any) {
    const email = supabaseUser.email.toLowerCase();
    const metadata = supabaseUser.user_metadata || {};
    const displayName = metadata.full_name || metadata.name || email.split('@')[0];
    const avatarUrl = metadata.avatar_url || metadata.picture || null;

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      const handle = await this.generateHandle(displayName);
      user = await this.prisma.user.create({
        data: {
          email,
          name: displayName,
          handle,
          provider: 'supabase',
          password: null,
          avatarUrl,
          isVerified: Boolean(supabaseUser.email_confirmed_at || supabaseUser.confirmed_at),
          subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name || displayName,
          avatarUrl: user.avatarUrl || avatarUrl,
          isVerified: user.isVerified || Boolean(supabaseUser.email_confirmed_at || supabaseUser.confirmed_at),
          provider: user.provider === 'email' ? 'email' : 'supabase',
        },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    await this.prisma.activityLog.create({
      data: { userId: user.id, action: 'login', resource: 'auth:supabase' },
    });

    return { user: this.sanitizeUser(user), ...tokens };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES') || '15m',
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES') || '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.refreshToken.create({ data: { token, userId, expiresAt } });
  }

  private sanitizeUser(user: any) {
    const { password, ...safe } = user;
    return safe;
  }
}
