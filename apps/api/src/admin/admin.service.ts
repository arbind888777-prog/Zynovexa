import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalPosts, activeSubscriptions, aiRequests] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.post.count(),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.aiRequest.count(),
    ]);

    const planBreakdown = await this.prisma.subscription.groupBy({ by: ['plan'], _count: true });
    const newUsersThisMonth = await this.prisma.user.count({
      where: { createdAt: { gte: new Date(new Date().setDate(1)) } },
    });

    return { totalUsers, totalPosts, activeSubscriptions, aiRequests, planBreakdown, newUsersThisMonth };
  }

  async getUsers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where = search ? { OR: [{ email: { contains: search } }, { name: { contains: search } }] } : {};
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip, take: limit, include: { subscription: { select: { plan: true, status: true } } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where }),
    ]);
    return { users, total, page, pages: Math.ceil(total / limit) };
  }

  async banUser(id: string) {
    return this.prisma.user.update({ where: { id }, data: { isActive: false } });
  }

  async unbanUser(id: string) {
    return this.prisma.user.update({ where: { id }, data: { isActive: true } });
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted' };
  }

  async getActivityLogs(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    return this.prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit });
  }
}
