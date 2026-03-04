import axios from 'axios';
import { authService } from './auth.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          user: { id: '1', email: 'test@example.com', name: 'Test' },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.token).toBe('test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
    });
  });

  describe('signup', () => {
    it('should signup user successfully', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          user: { id: '1', email: 'new@example.com' },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await authService.signup({
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      });

      expect(result.token).toBe('test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
    });
  });

  describe('logout', () => {
    it('should clear token from storage', () => {
      localStorage.setItem('token', 'test-token');
      authService.logout();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
