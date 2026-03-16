import { PostSchedulerCron } from './post-scheduler.cron';

describe('PostSchedulerCron', () => {
  const prisma = {
    post: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  const postsService = {
    publish: jest.fn(),
  };

  let cron: PostSchedulerCron;

  beforeEach(() => {
    jest.clearAllMocks();
    cron = new PostSchedulerCron(prisma as any, postsService as any);
  });

  it('does not mark manual-required scheduled post as failed', async () => {
    prisma.post.findMany.mockResolvedValue([
      {
        id: 'post_1',
        userId: 'user_1',
        status: 'SCHEDULED',
        scheduledAt: new Date('2026-03-16T10:00:00.000Z'),
      },
    ]);

    postsService.publish.mockResolvedValue({
      id: 'post_1',
      status: 'DRAFT',
      publishResults: {
        YOUTUBE: {
          manualRequired: true,
          mode: 'youtube-manual',
        },
      },
    });

    await cron.handleScheduledPosts();

    expect(postsService.publish).toHaveBeenCalledWith('post_1', 'user_1', {
      suppressRecoverableError: true,
    });
    expect(prisma.post.update).not.toHaveBeenCalled();
  });
});