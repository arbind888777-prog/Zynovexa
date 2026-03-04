import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConnectAccountDto, UpdateAccountDto } from './dto/account.dto';
import { Platform } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    return this.prisma.socialAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async connect(userId: string, dto: ConnectAccountDto) {
    const existing = await this.prisma.socialAccount.findFirst({
      where: { userId, platform: dto.platform },
    });
    if (existing) {
      return this.prisma.socialAccount.update({
        where: { id: existing.id },
        data: { accessToken: dto.accessToken, refreshToken: dto.refreshToken, handle: dto.handle, displayName: dto.displayName, avatarUrl: dto.avatarUrl, followersCount: dto.followersCount || 0, isActive: true },
      });
    }
    return this.prisma.socialAccount.create({
      data: { userId, platform: dto.platform, accessToken: dto.accessToken, refreshToken: dto.refreshToken, handle: dto.handle, displayName: dto.displayName, avatarUrl: dto.avatarUrl, followersCount: dto.followersCount || 0 },
    });
  }

  async disconnect(userId: string, id: string) {
    const account = await this.prisma.socialAccount.findFirst({ where: { id, userId } });
    if (!account) throw new NotFoundException('Account not found');
    await this.prisma.socialAccount.delete({ where: { id } });
    return { message: 'Account disconnected' };
  }

  async update(userId: string, id: string, dto: UpdateAccountDto) {
    const account = await this.prisma.socialAccount.findFirst({ where: { id, userId } });
    if (!account) throw new NotFoundException('Account not found');
    return this.prisma.socialAccount.update({ where: { id }, data: dto });
  }

  async getStats(userId: string) {
    const accounts = await this.prisma.socialAccount.findMany({ where: { userId, isActive: true } });
    const totalFollowers = accounts.reduce((s, a) => s + (a.followersCount || 0), 0);
    return {
      connected: accounts.length,
      totalFollowers,
      platforms: accounts.map(a => ({ platform: a.platform, handle: a.handle, followers: a.followersCount })),
    };
  }
}
