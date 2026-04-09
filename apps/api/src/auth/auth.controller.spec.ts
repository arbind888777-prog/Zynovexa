import { AuthController } from './auth.controller';
import { encodeFrontendState } from '../common/utils/frontend-url';

describe('AuthController Google flow', () => {
  const authService = {
    signup: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
    getMe: jest.fn(),
    sendMagicLink: jest.fn(),
    verifyMagicLink: jest.fn(),
    exchangeSupabaseToken: jest.fn(),
    googleLogin: jest.fn(),
  };

  let controller: AuthController;
  let originalNodeEnv: string | undefined;
  let originalFrontendUrl: string | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(authService as any);
    originalNodeEnv = process.env.NODE_ENV;
    originalFrontendUrl = process.env.FRONTEND_URL;
    process.env.NODE_ENV = 'production';
    process.env.FRONTEND_URL = 'https://zynovexa.com';
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.FRONTEND_URL = originalFrontendUrl;
  });

  it('sets auth cookies and redirects to frontend callback after successful Google login', async () => {
    authService.googleLogin.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    const redirect = jest.fn();
    const cookie = jest.fn();
    const req = {
      user: {
        googleId: 'google_1',
        email: 'creator@example.com',
        name: 'Creator One',
      },
      query: {
        state: encodeFrontendState('https://www.zynovexa.com'),
      },
    };
    const res = { cookie, redirect };

    await controller.googleCallback(req as any, res as any);

    expect(authService.googleLogin).toHaveBeenCalledWith(req.user);
    expect(cookie).toHaveBeenNthCalledWith(1, 'zy_access_token', 'access-token', expect.objectContaining({
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    }));
    expect(cookie).toHaveBeenNthCalledWith(2, 'zy_refresh_token', 'refresh-token', expect.objectContaining({
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }));
    expect(redirect).toHaveBeenCalledWith('https://www.zynovexa.com/auth/google/callback?success=true');
  });

  it('ignores localhost frontend state in production and falls back to the configured frontend URL', async () => {
    authService.googleLogin.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    const redirect = jest.fn();
    const cookie = jest.fn();
    const req = {
      user: {
        googleId: 'google_2',
        email: 'creator@example.com',
        name: 'Creator One',
      },
      query: {
        state: encodeFrontendState('http://localhost:3001'),
      },
    };
    const res = { cookie, redirect };

    await controller.googleCallback(req as any, res as any);

    expect(redirect).toHaveBeenCalledWith('https://zynovexa.com/auth/google/callback?success=true');
  });

  it('exchanges Google auth cookies into JSON tokens and clears the one-time cookies', async () => {
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const clearCookie = jest.fn();
    const req = {
      cookies: {
        zy_access_token: 'access-token',
        zy_refresh_token: 'refresh-token',
      },
    };
    const res = { status, json, clearCookie };

    await controller.googleExchange(req as any, res as any);

    expect(clearCookie).toHaveBeenNthCalledWith(1, 'zy_access_token', { path: '/' });
    expect(clearCookie).toHaveBeenNthCalledWith(2, 'zy_refresh_token', { path: '/' });
    expect(json).toHaveBeenCalledWith({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(status).not.toHaveBeenCalled();
  });
});