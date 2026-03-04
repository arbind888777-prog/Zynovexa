import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity, PostStatus } from './entities/post.entity';
import { PaginationDto } from '@common/dto/pagination.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async create(userId: string, dto: { caption: string; platforms: string[] }) {
    const post = this.postRepository.create({ userId, ...dto, status: PostStatus.DRAFT });
    return this.postRepository.save(post);
  }

  async findAll(userId: string, pagination: PaginationDto) {
    const qb = this.postRepository.createQueryBuilder('post');
    qb.where('post.userId = :userId', { userId })
      .orderBy('post.createdAt', 'DESC')
      .skip(pagination.skip)
      .take(pagination.limit);
    const [posts, total] = await qb.getManyAndCount();
    return { posts, total };
  }

  async findOne(id: string, userId: string) {
    return this.postRepository.findOne({ where: { id, userId } });
  }

  async remove(id: string, userId: string) {
    return this.postRepository.delete({ id, userId });
  }

  async publish(id: string, userId: string) {
    const post = await this.postRepository.findOne({ where: { id, userId } });
    if (!post) throw new Error('Post not found');
    post.status = PostStatus.PUBLISHED;
    return this.postRepository.save(post);
  }
}
