import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostEntity, PostStatus } from './entities/post.entity';
import { PaginationDto } from '@common/dto/pagination.dto';

describe('PostsService', () => {
  let service: PostsService;
  let mockPostRepository: any;

  const mockPost = {
    id: '1',
    userId: 'user-1',
    caption: 'Test caption',
    platforms: ['instagram', 'tiktok'],
    status: PostStatus.DRAFT,
    viralScore: 75,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    mockPostRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  describe('create', () => {
    it('should create a new post', async () => {
      mockPostRepository.create.mockReturnValue(mockPost);
      mockPostRepository.save.mockResolvedValue(mockPost);

      const result = await service.create('user-1', {
        caption: 'Test caption',
        platforms: ['instagram', 'tiktok'],
      });

      expect(result.caption).toBe('Test caption');
      expect(mockPostRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockPost], 1]),
      };

      mockPostRepository.createQueryBuilder.mockReturnValue(mockQuery);

      const pagination = new PaginationDto();
      const result = await service.findAll('user-1', pagination);

      expect(result.posts).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);

      const result = await service.findOne('1', 'user-1');

      expect(result).toEqual(mockPost);
    });

    it('should return null if post not found', async () => {
      mockPostRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('999', 'user-1');

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a post', async () => {
      mockPostRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('1', 'user-1');

      expect(mockPostRepository.delete).toHaveBeenCalledWith({ id: '1', userId: 'user-1' });
    });
  });

  describe('publish', () => {
    it('should publish a post', async () => {
      mockPostRepository.findOne.mockResolvedValue(mockPost);
      mockPostRepository.save.mockResolvedValue({
        ...mockPost,
        status: PostStatus.PUBLISHED,
      });

      const result = await service.publish('1', 'user-1');

      expect(result.status).toBe(PostStatus.PUBLISHED);
    });
  });
});
