import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto/post.dto';
import { PostStatus } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePostDto) {
    // Calculate a simple viral score based on platforms count and hashtags
    const viralScore = Math.min(100, (dto.platforms.length * 15) + ((dto.hashtags?.length || 0) * 3));

    return this.prisma.post.create({
      data: {
        userId,
        title: dto.title,
        caption: dto.caption,
        mediaUrls: dto.mediaUrls || [],
        mediaType: dto.mediaType || 'TEXT',
        platforms: dto.platforms,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        hashtags: dto.hashtags || [],
        location: dto.location,
        viralScore,
        status: dto.scheduledAt ? 'SCHEDULED' : 'DRAFT',
      },
    });
  }

  async findAll(userId: string, query: PostQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (query.status) where.status = query.status;
    if (query.platform) where.platforms = { has: query.platform };

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, userId: string) {
    const post = await this.prisma.post.findFirst({ where: { id, userId } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, userId: string, dto: UpdatePostDto) {
    await this.findOne(id, userId);
    return this.prisma.post.update({
      where: { id },
      data: {
        ...dto,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.post.delete({ where: { id } });
    return { message: 'Post deleted' };
  }

  async publish(id: string, userId: string) {
    const post = await this.findOne(id, userId);
    return this.prisma.post.update({
      where: { id },
      data: { status: PostStatus.PUBLISHED, publishedAt: new Date() },
    });
  }

  async getScheduled(userId: string) {
    return this.prisma.post.findMany({
      where: { userId, status: 'SCHEDULED', scheduledAt: { gte: new Date() } },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async getStats(userId: string) {
    const [total, published, scheduled, drafts, avgViral] = await Promise.all([
      this.prisma.post.count({ where: { userId } }),
      this.prisma.post.count({ where: { userId, status: 'PUBLISHED' } }),
      this.prisma.post.count({ where: { userId, status: 'SCHEDULED' } }),
      this.prisma.post.count({ where: { userId, status: 'DRAFT' } }),
      this.prisma.post.aggregate({ where: { userId }, _avg: { viralScore: true } }),
    ]);
    return { total, published, scheduled, drafts, avgViralScore: avgViral._avg.viralScore || 0 };
  }
}
