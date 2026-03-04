import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { PostEntity } from '../posts/entities/post.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async getDashboardStats(userId: string) {
    const totalPosts = await this.postRepository.count({ where: { userId } });
    const recentPosts = await this.postRepository.find({ where: { userId } });
    const avgViralScore =
      recentPosts.length > 0
        ? recentPosts.reduce((sum, p) => sum + (p.viralScore || 0), 0) / recentPosts.length
        : 0;
    const recommendations: string[] = [];
    if (avgViralScore < 50) recommendations.push('Post more consistently to improve engagement');
    if (totalPosts < 10) recommendations.push('Create more content to grow your audience');
    return { totalPosts, avgViralScore, recommendations };
  }

  async getTopPosts(userId: string, pagination: { page: number; limit: number; skip: number }) {
    const [posts, total] = await this.postRepository.findAndCount({
      where: { userId },
      order: { viralScore: 'DESC' },
      skip: pagination.skip,
      take: pagination.limit,
    });
    return { posts, total };
  }
}
