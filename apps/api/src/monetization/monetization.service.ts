import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDealDto, UpdateBrandDealDto, BrandDealQueryDto } from './dto/monetization.dto';

@Injectable()
export class MonetizationService {
  constructor(private prisma: PrismaService) {}

  // ─── Brand Deals CRUD ──────────────────────────────────────────────────────

  async createDeal(userId: string, dto: CreateBrandDealDto) {
    return this.prisma.brandDeal.create({
      data: {
        userId,
        brandName: dto.brandName,
        contactEmail: dto.contactEmail,
        contactName: dto.contactName,
        platform: dto.platform as any,
        dealValue: dto.dealValue,
        currency: dto.currency || 'usd',
        status: (dto.status as any) || 'PENDING',
        deliverables: dto.deliverables,
        notes: dto.notes,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async getDeals(userId: string, query: BrandDealQueryDto) {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (query.status) where.status = query.status;
    if (query.platform) where.platform = query.platform;

    const [deals, total] = await Promise.all([
      this.prisma.brandDeal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.brandDeal.count({ where }),
    ]);

    return {
      deals,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getDeal(id: string, userId: string) {
    const deal = await this.prisma.brandDeal.findFirst({ where: { id, userId } });
    if (!deal) throw new NotFoundException('Brand deal not found');
    return deal;
  }

  async updateDeal(id: string, userId: string, dto: UpdateBrandDealDto) {
    await this.getDeal(id, userId);
    return this.prisma.brandDeal.update({
      where: { id },
      data: {
        ...dto,
        platform: dto.platform as any,
        status: dto.status as any,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async deleteDeal(id: string, userId: string) {
    await this.getDeal(id, userId);
    await this.prisma.brandDeal.delete({ where: { id } });
    return { message: 'Brand deal deleted' };
  }

  // ─── Earnings Overview ─────────────────────────────────────────────────────

  async getEarningsOverview(userId: string) {
    const deals = await this.prisma.brandDeal.findMany({ where: { userId } });

    const totalEarnings = deals.reduce((sum, d) => sum + d.paidAmount, 0);
    const pendingEarnings = deals
      .filter(d => !d.isPaid && ['ACCEPTED', 'IN_PROGRESS'].includes(d.status))
      .reduce((sum, d) => sum + d.dealValue, 0);
    const completedDeals = deals.filter(d => d.status === 'COMPLETED').length;
    const activeDeals = deals.filter(d => ['ACCEPTED', 'IN_PROGRESS'].includes(d.status)).length;

    // Monthly earnings breakdown
    const monthlyEarnings = this.calculateMonthlyEarnings(deals);

    // Platform breakdown
    const platformBreakdown = this.calculatePlatformBreakdown(deals);

    return {
      totalEarnings,
      pendingEarnings,
      completedDeals,
      activeDeals,
      totalDeals: deals.length,
      monthlyEarnings,
      platformBreakdown,
      averageDealValue: deals.length > 0 ? +(totalEarnings / deals.length).toFixed(2) : 0,
    };
  }

  // ─── Rate Calculator ───────────────────────────────────────────────────────

  async calculateRates(userId: string) {
    const accounts = await this.prisma.socialAccount.findMany({
      where: { userId, isActive: true },
    });

    const rates: Record<string, any> = {};

    for (const account of accounts) {
      const followers = account.followersCount;
      // Industry standard rates per 1K followers
      const baseCPM = this.getBaseCPM(account.platform);
      const postRate = +((followers / 1000) * baseCPM).toFixed(2);
      const storyRate = +(postRate * 0.4).toFixed(2);
      const reelRate = +(postRate * 1.5).toFixed(2);
      const videoRate = +(postRate * 2).toFixed(2);

      rates[account.platform] = {
        handle: account.handle,
        followers,
        postRate,
        storyRate,
        reelRate,
        videoRate,
        sponsoredPostRate: +(postRate * 1.2).toFixed(2),
      };
    }

    return { rates };
  }

  // ─── Media Kit Generator ───────────────────────────────────────────────────

  async generateMediaKit(userId: string) {
    const [user, accounts, deals, recentPosts] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, bio: true, niche: true, avatarUrl: true, website: true },
      }),
      this.prisma.socialAccount.findMany({
        where: { userId, isActive: true },
        select: { platform: true, handle: true, followersCount: true, followingCount: true },
      }),
      this.prisma.brandDeal.findMany({
        where: { userId, status: 'COMPLETED' },
        select: { brandName: true, platform: true, dealValue: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.post.findMany({
        where: { userId, status: 'PUBLISHED' },
        orderBy: { viralScore: 'desc' },
        take: 5,
        select: { title: true, caption: true, platforms: true, viralScore: true, publishedAt: true },
      }),
    ]);

    const totalFollowers = accounts.reduce((sum, a) => sum + a.followersCount, 0);
    const completedDealsCount = deals.length;
    const rates = await this.calculateRates(userId);

    return {
      profile: user,
      socialAccounts: accounts,
      stats: {
        totalFollowers,
        platformCount: accounts.length,
        completedBrandDeals: completedDealsCount,
        topBrands: deals.map(d => d.brandName).slice(0, 5),
      },
      topContent: recentPosts,
      rates: rates.rates,
      generatedAt: new Date().toISOString(),
    };
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private getBaseCPM(platform: string): number {
    const cpmRates: Record<string, number> = {
      INSTAGRAM: 10,
      YOUTUBE: 18,
      TIKTOK: 8,
      TWITTER: 5,
      LINKEDIN: 12,
      FACEBOOK: 6,
      SNAPCHAT: 7,
    };
    return cpmRates[platform] || 8;
  }

  private calculateMonthlyEarnings(deals: any[]) {
    const monthly: Record<string, number> = {};
    for (const deal of deals.filter(d => d.isPaid && d.updatedAt)) {
      const key = deal.updatedAt.toISOString().slice(0, 7); // YYYY-MM
      monthly[key] = (monthly[key] || 0) + deal.paidAmount;
    }
    return Object.entries(monthly)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);
  }

  private calculatePlatformBreakdown(deals: any[]) {
    const platforms: Record<string, { count: number; totalValue: number }> = {};
    for (const deal of deals) {
      const key = deal.platform || 'OTHER';
      if (!platforms[key]) platforms[key] = { count: 0, totalValue: 0 };
      platforms[key].count++;
      platforms[key].totalValue += deal.dealValue;
    }
    return platforms;
  }
}
