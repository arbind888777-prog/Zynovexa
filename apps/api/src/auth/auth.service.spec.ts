import { AuthService } from './auth.service';

describe('AuthService Google login flow', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    subscription: {
      upsert: jest.fn(),
    },
    userStreak: {
      upsert: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
    },
    activityLog: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
    $queryRaw: jest.fn(),
    $executeRaw: jest.fn(),
  };

  const jwt = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const config = {
    get: jest.fn(),
  };

  const mail = {
    sendMagicLogin: jest.fn(),
  };

  const supabase = {
    verifyAccessToken: jest.fn(),
  };

  let service: AuthService;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    fetchMock = jest.fn();
    (global as any).fetch = fetchMock;

    prisma.$transaction.mockImplementation(async (operations: Array<Promise<unknown>>) => Promise.all(operations));
    prisma.subscription.upsert.mockResolvedValue({ id: 'sub_1' });
    prisma.userStreak.upsert.mockResolvedValue({ id: 'streak_1' });
    prisma.refreshToken.create.mockResolvedValue({ id: 'refresh_1' });
    prisma.$queryRaw.mockResolvedValue([{ profileTable: null }]);

    jwt.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    config.get.mockImplementation((key: string) => {
      switch (key) {
        case 'JWT_ACCESS_SECRET':
          return 'access-secret';
        case 'JWT_REFRESH_SECRET':
          return 'refresh-secret';
        case 'JWT_ACCESS_EXPIRES':
          return '15m';
        case 'JWT_REFRESH_EXPIRES':
          return '7d';
        case 'RESEND_API_KEY':
          return 'resend-key';
        case 'RESEND_AUDIENCE_ID':
          return 'audience-id';
        default:
          return undefined;
      }
    });

    service = new AuthService(prisma as any, jwt as any, config as any, mail as any, supabase as any);
  });

  it('allows Google login to succeed when Resend contact creation fails', async () => {
    const createdUser = {
      id: 'user_1',
      email: 'creator@example.com',
      name: 'Creator One',
      role: 'USER',
      provider: 'google',
      avatarUrl: 'https://cdn.example.com/avatar.png',
      isVerified: true,
      password: null,
    };

    prisma.user.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        handle: 'creator123',
        avatarUrl: createdUser.avatarUrl,
        bio: null,
        website: null,
        niche: null,
        timezone: 'UTC',
        onboardingCompleted: false,
        isVerified: true,
        plan: 'FREE',
      });
    prisma.user.create.mockResolvedValue(createdUser);
    fetchMock.mockRejectedValue(new Error('Resend is unavailable'));

    const result = await service.googleLogin({
      googleId: 'google_1',
      email: 'creator@example.com',
      name: 'Creator One',
      avatar: createdUser.avatarUrl,
    });

    expect(result).toEqual({
      user: expect.objectContaining({
        id: 'user_1',
        email: 'creator@example.com',
        provider: 'google',
      }),
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(prisma.refreshToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user_1',
        token: 'refresh-token',
      }),
    });
  });
});