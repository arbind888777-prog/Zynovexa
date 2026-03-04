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
      connectedAccounts: accounts,
      aiRequestsUsed: aiRequests,
      plan: subscription?.plan || 'FREE',
    };
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
