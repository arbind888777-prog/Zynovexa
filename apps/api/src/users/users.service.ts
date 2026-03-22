import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        subscription: true,
        socialAccounts: { where: { isActive: true } },
        _count: { select: { posts: true, aiRequests: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...safe } = user as any;
    return safe;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        bio: dto.bio,
        website: dto.website,
        avatarUrl: dto.avatarUrl,
        niche: dto.niche,
        timezone: dto.timezone,
      },
    });
    const { password, ...safe } = user as any;
    return safe;
  }

  async changePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user?.password) throw new BadRequestException('No password set');
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new BadRequestException('Current password is incorrect');
    const hash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id }, data: { password: hash } });
    return { message: 'Password changed successfully' };
  }

  async getDashboardStats(userId: string) {
    const [posts, accounts, aiRequests, subscription] = await Promise.all([
      this.prisma.post.groupBy({
        by: ['status'],
        where: { userId },
        _count: { status: true },
      }),
      this.prisma.socialAccount.count({ where: { userId, isActive: true } }),
      this.prisma.aiRequest.count({ where: { userId } }),
      this.prisma.subscription.findUnique({ where: { userId } }),
    ]);

    const postCounts = posts.reduce((acc, p) => {
      acc[p.status.toLowerCase()] = p._count.status;
      return acc;
    }, {} as Record<string, number>);

    return {
      posts: postCounts,
      totalPosts: Object.values(postCounts).reduce((a, b) => a + b, 0),
      scheduledPosts: postCounts.scheduled || 0,
      publishedPosts: postCounts.published || 0,
      draftPosts: postCounts.draft || 0,
      connectedAccounts: accounts,
      aiRequestsUsed: aiRequests,
      aiRequestsThisMonth: aiRequests,
      aiRequestLimit: subscription?.plan === 'FREE' ? 20 : subscription?.plan === 'PRO' ? 500 : null,
      plan: subscription?.plan || 'FREE',
    };
  }

  async getAdminUsers(filters?: { query?: string; plan?: string; role?: string }) {
    const search = filters?.query?.trim();
    const plan = filters?.plan?.trim()?.toUpperCase();
    const role = filters?.role?.trim()?.toUpperCase();

    const users = await this.prisma.user.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
                { handle: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(plan ? { plan: plan as any } : {}),
        ...(role ? { role: role as any } : {}),
      },
      include: {
        subscription: true,
        activityLogs: {
          where: { action: 'login' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            posts: true,
            socialAccounts: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return users.map((user) => {
      const { password, activityLogs, subscription, _count, ...safe } = user as any;

      return {
        ...safe,
        subscription,
        stats: {
          posts: _count?.posts || 0,
          connectedAccounts: _count?.socialAccounts || 0,
        },
        lastLoginAt: activityLogs?.[0]?.createdAt || null,
      };
    });
  }

  async completeOnboarding(id: string, dto: { userType?: string; niche?: string; platforms?: string[]; goal?: string }) {
    // Compose a rich niche string: "userType:creator|niche:finance|goal:grow"
    const nicheStr = [dto.userType, dto.niche].filter(Boolean).join(' / ') || dto.userType || '';
    return this.prisma.user.update({
      where: { id },
      data: { niche: nicheStr || undefined, onboardingCompleted: true },
    });
  }

  async deleteAccount(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'Account deleted' };
  }
}
