import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { PostEntity } from '../posts/entities/post.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async getOverview() {
    const totalUsers = await this.userRepository.count();
    const totalPosts = await this.postRepository.count();
    return { totalUsers, totalPosts };
  }

  async getAllUsers(pagination: { page: number; limit: number; skip: number }, search?: string) {
    const qb = this.userRepository.createQueryBuilder('user');
    if (search) {
      qb.where('user.email LIKE :search OR user.name LIKE :search', { search: `%${search}%` });
    }
    qb.orderBy('user.createdAt', 'DESC')
      .skip(pagination.skip)
      .take(pagination.limit);
    const [users, total] = await qb.getManyAndCount();
    return { users, total };
  }

  async deletePost(id: string) {
    await this.postRepository.delete(id);
    return { message: 'Post deleted' };
  }
}
