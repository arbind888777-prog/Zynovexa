import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { PostEntity } from '../posts/entities/post.entity';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let mockUserRepository: any;
  let mockPostRepository: any;

  beforeEach(async () => {
    mockUserRepository = {
      count: jest.fn(),
    };

    mockPostRepository = {
      count: jest.fn(),
      find: jest.fn(),
      findAndCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(PostEntity),
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      mockPostRepository.count.mockResolvedValue(10);
      mockPostRepository.find.mockResolvedValue([]);

      const result = await service.getDashboardStats('user-1');

      expect(result.totalPosts).toBe(10);
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });
  });

  describe('getTopPosts', () => {
    it('should return top posts by viral score', async () => {
      const mockPosts = [
        { id: '1', viralScore: 95 },
        { id: '2', viralScore: 85 },
      ];

      mockPostRepository.findAndCount.mockResolvedValue([mockPosts, 2]);

      const pagination = { page: 1, limit: 20, skip: 0 };
      const result = await service.getTopPosts('user-1', pagination);

      expect(result.posts).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });
});
