import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { PostEntity } from '../posts/entities/post.entity';

describe('AdminService', () => {
  let service: AdminService;
  let mockUserRepository: any;
  let mockPostRepository: any;

  beforeEach(async () => {
    mockUserRepository = {
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
    };

    mockPostRepository = {
      count: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
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

    service = module.get<AdminService>(AdminService);
  });

  describe('getOverview', () => {
    it('should return system overview', async () => {
      mockUserRepository.count.mockResolvedValue(100);
      mockPostRepository.count.mockResolvedValue(500);

      const result = await service.getOverview();

      expect(result.totalUsers).toBe(100);
      expect(result.totalPosts).toBe(500);
    });
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const mockUsers = [{ id: '1', email: 'test@example.com' }];
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockUsers, 1]),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(mockQuery);

      const pagination = { page: 1, limit: 20, skip: 0 };
      const result = await service.getAllUsers(pagination, 'test');

      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      mockPostRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deletePost('1');

      expect(result.message).toBe('Post deleted');
      expect(mockPostRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
