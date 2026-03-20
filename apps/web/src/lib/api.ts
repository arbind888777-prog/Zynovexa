import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const DEMO_TOKEN = 'demo-token-zynovexa';

type ApiEnvelope<T> = {
  success?: boolean;
  data: T;
};

export function unwrapApiData<T>(payload: T | ApiEnvelope<T>): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
}

export function unwrapApiResponse<T>(response: { data: T | ApiEnvelope<T> }): T {
  return unwrapApiData<T>(response.data);
}

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token from localStorage to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh access token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isUnauthorized = error.response?.status === 401;

    // Keep demo sessions on dashboard even if backend rejects demo token.
    if (isUnauthorized && typeof window !== 'undefined') {
      const currentToken = localStorage.getItem('access_token');
      if (currentToken === DEMO_TOKEN) {
        return Promise.reject(error);
      }
    }

    if (isUnauthorized && original && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('No refresh token');
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken: refresh });
        const tokens = unwrapApiData<{ accessToken: string; refreshToken: string }>(data);
        localStorage.setItem('access_token', tokens.accessToken);
        localStorage.setItem('refresh_token', tokens.refreshToken);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// ─── Auth API ──────────────────────────────────────────────────────────────
export const authApi = {
  signup: (data: { email: string; password: string; name: string }) => api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// ─── Users API ─────────────────────────────────────────────────────────────
export const usersApi = {
  updateProfile: (data: any) => api.put('/users/me', data),
  getDashboardStats: () => api.get('/users/dashboard-stats'),
  changePassword: (data: { currentPassword: string; newPassword: string }) => api.patch('/users/password', data),
  deleteAccount: () => api.delete('/users/me'),
  completeOnboarding: (data: { userType?: string; platforms?: string[]; niche?: string; goal?: string }) =>
    api.patch('/users/onboarding', data),
};

// ─── Posts API ─────────────────────────────────────────────────────────────
export const postsApi = {
  getAll: (params?: any) => api.get('/posts', { params }),
  getOne: (id: string) => api.get(`/posts/${id}`),
  create: (data: any) => api.post('/posts', data),
  update: (id: string, data: any) => api.put(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
  publish: (id: string) => api.post(`/posts/${id}/publish`),
  getStats: () => api.get('/posts/stats'),
  getScheduled: () => api.get('/posts/scheduled'),
};

// ─── Uploads API ───────────────────────────────────────────────────────────
export const uploadsApi = {
  uploadSingle: (file: File, folder = 'posts', alt?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const headers: Record<string, string> = {};

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    return axios.post(`${API_URL}/uploads/single`, formData, {
      params: { folder, alt },
      headers,
      withCredentials: true,
    });
  },
};

// ─── Accounts API ──────────────────────────────────────────────────────────
export const accountsApi = {
  getAll: () => api.get('/accounts'),
  getStats: () => api.get('/accounts/stats'),
  getYoutubeInsights: () => api.get('/accounts/youtube/insights'),
  connect: (data: any) => api.post('/accounts/connect', data),
  disconnect: (id: string) => api.delete(`/accounts/${id}`),
  update: (id: string, data: any) => api.put(`/accounts/${id}`, data),
  // YouTube OAuth connect flow
  getYoutubeConnectUrl: (frontend?: string) => api.get('/accounts/connect/youtube', { params: frontend ? { frontend } : undefined }),
};

// ─── Analytics API ─────────────────────────────────────────────────────────
export const analyticsApi = {
  getOverview: (params?: any) => api.get('/analytics/overview', { params }),
  getChartData: (params?: any) => api.get('/analytics/chart', { params }),
  getPlatforms: () => api.get('/analytics/platforms'),
  getTopPosts: (limit?: number) => api.get('/analytics/top-posts', { params: { limit } }),
};

// ─── AI API ────────────────────────────────────────────────────────────────
export const aiApi = {
  generateCaption: (data: any) => api.post('/ai/caption', data),
  generateScript: (data: any) => api.post('/ai/script', data),
  generateHashtags: (data: any) => api.post('/ai/hashtags', data),
  generateImage: (data: any) => api.post('/ai/image', data),
  chat: (data: any) => api.post('/ai/chat', data),
  getBestTimes: (data: any) => api.post('/ai/best-time', data),
  getUsage: () => api.get('/ai/usage'),
  getChatMemory: () => api.get('/ai/chat-memory'),
  resetChatMemory: () => api.post('/ai/chat-memory/reset'),
};

// ─── Subscriptions API ─────────────────────────────────────────────────────
export const subscriptionsApi = {
  getPlans: () => api.get('/subscriptions/plans'),
  getMySubscription: () => api.get('/subscriptions/me'),
  createCheckout: (opts: { plan: string; billingCycle?: string; customPosts?: number; customAiCredits?: number }) =>
    api.post('/subscriptions/checkout', opts),
  createPortal: () => api.post('/subscriptions/portal'),
  getInvoices: () => api.get('/subscriptions/invoices'),
};

// ─── Notifications API ─────────────────────────────────────────────────────
export const notificationsApi = {
  getAll: (page?: number) => api.get('/notifications', { params: { page } }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  deleteAll: () => api.delete('/notifications'),
};
