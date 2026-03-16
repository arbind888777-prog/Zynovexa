import { PostStatus } from '@prisma/client';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  const prisma = {
    post: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    postAccount: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
    socialAccount: {
      findMany: jest.fn(),
    },
    mediaFile: {
      findFirst: jest.fn(),
    },
  };

  const accountsService = {
    getConnectedAccountWithTokens: jest.fn(),
    markReconnectRequired: jest.fn(),
  };

  const configService = {
    get: jest.fn(),
  };

  let service: PostsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PostsService(prisma as any, accountsService as any, configService as any);
  });

  it('returns manual-required result for YouTube text scheduled post instead of throwing', async () => {
    const post = {
      id: 'post_1',
      userId: 'user_1',
      title: 'Community update',
      caption: 'Text-only YouTube update',
      mediaType: 'TEXT',
      mediaUrls: [],
      hashtags: [],
      platforms: ['YOUTUBE'],
      status: PostStatus.SCHEDULED,
      scheduledAt: new Date('2026-03-16T10:00:00.000Z'),
    };

    prisma.post.findFirst.mockResolvedValue(post);
    prisma.postAccount.findMany.mockResolvedValue([
      { id: 'link_1', socialAccount: { platform: 'YOUTUBE' } },
    ]);
    prisma.post.update.mockImplementation(async ({ data }: any) => ({
      ...post,
      ...data,
    }));

    const result = await service.publish(post.id, post.userId);

    const publishResults = result.publishResults as any;

    expect(result.status).toBe(PostStatus.DRAFT);
    expect(result.scheduledAt).toBeNull();
    expect(publishResults.YOUTUBE.manualRequired).toBe(true);
    expect(publishResults.YOUTUBE.mode).toBe('youtube-manual');
    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: post.userId,
        title: 'YouTube Manual Publish Required',
        type: 'INFO',
      }),
    });
    expect(prisma.postAccount.update).toHaveBeenCalledWith({
      where: { id: 'link_1' },
      data: expect.objectContaining({
        status: PostStatus.DRAFT,
      }),
    });
  });
});