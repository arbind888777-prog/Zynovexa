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

    it('should include both recommendations for low score and low volume', async () => {
      mockPostRepository.count.mockResolvedValue(3);
      mockPostRepository.find.mockResolvedValue([
        { viralScore: 20 },
        { viralScore: 40 },
      ]);

      const result = await service.getDashboardStats('user-1');

      expect(result.avgViralScore).toBe(30);
      expect(result.recommendations).toContain('Post more consistently to improve engagement');
      expect(result.recommendations).toContain('Create more content to grow your audience');
    });

    it('should return no recommendations when performance is healthy', async () => {
      mockPostRepository.count.mockResolvedValue(12);
      mockPostRepository.find.mockResolvedValue([
        { viralScore: 80 },
        { viralScore: 70 },
      ]);

      const result = await service.getDashboardStats('user-1');

      expect(result.avgViralScore).toBe(75);
      expect(result.recommendations).toEqual([]);
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
