import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000/api');
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
  exchangeSupabaseToken: (accessToken: string) => api.post('/auth/supabase/exchange', { accessToken }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  sendMagicLink: (email: string) => api.post('/auth/magic-link', { email }),
  verifyMagicLink: (token: string) => api.post('/auth/magic-link/verify', { token }),
};

// ─── Users API ─────────────────────────────────────────────────────────────
export const usersApi = {
  updateProfile: (data: any) => api.put('/users/me', data),
  getDashboardStats: () => api.get('/users/dashboard-stats'),
  getAdminUsers: (filters?: { q?: string; plan?: string; role?: string }) =>
    api.get('/users/admin/list', {
      params: filters && Object.values(filters).some(Boolean) ? filters : undefined,
    }),
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
  publicChat: (data: any) => api.post('/ai/public-chat', data),
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

// ─── Trust API ─────────────────────────────────────────────────────────────
export const trustApi = {
  getTestimonials: (featured?: boolean) => api.get('/trust/testimonials', { params: featured ? { featured: 1 } : {} }),
  getCaseStudies: () => api.get('/trust/case-studies'),
  getRoadmap: () => api.get('/trust/roadmap'),
  voteRoadmap: (id: string) => api.post(`/trust/roadmap/${id}/vote`),
};

// ─── Growth Coach API ──────────────────────────────────────────────────────
export const growthCoachApi = {
  getDaily: () => api.get('/growth-coach/daily'),
  getWeeklyReport: () => api.get('/growth-coach/weekly-report'),
};

// ─── AI Engine API ─────────────────────────────────────────────────────────
export const aiEngineApi = {
  generate: (data: { niche: string; platform: string; tone: string; audience: string; contentType: string; topic?: string }) =>
    api.post('/ai-engine/generate', data),
  scoreContent: (data: { content: string; platform: string }) =>
    api.post('/ai-engine/score', data),
};

// ─── Integrations API ──────────────────────────────────────────────────────
export const integrationsApi = {
  getPlatforms: () => api.get('/integrations/platforms'),
  getOAuthUrl: (platform: string) => api.get(`/integrations/oauth/${platform}`),
  refreshToken: (platform: string) => api.post(`/integrations/refresh/${platform}`),
  schedulePost: (data: { postId: string; platforms: string[]; scheduledAt: string }) =>
    api.post('/integrations/schedule', data),
  getQueue: () => api.get('/integrations/queue'),
};

// ─── Gamification API ──────────────────────────────────────────────────────
export const gamificationApi = {
  getProfile: () => api.get('/gamification/profile'),
  recordAction: (action: string) => api.post('/gamification/record-action', { action }),
  getLeaderboard: (limit?: number) => api.get('/gamification/leaderboard', { params: { limit } }),
};

// ─── Pro Analytics API ─────────────────────────────────────────────────────
export const proAnalyticsApi = {
  getOverview: () => api.get('/pro-analytics/overview'),
  getContentRanking: () => api.get('/pro-analytics/content-ranking'),
  getCompetitors: () => api.get('/pro-analytics/competitors'),
  addCompetitor: (data: { handle: string; platform: string }) => api.post('/pro-analytics/competitors', data),
};

// ─── Commerce API ──────────────────────────────────────────────────────────
export const commerceApi = {
  // Store
  getStore: () => api.get('/commerce/store'),
  upsertStore: (data: any) => api.put('/commerce/store', data),

  // Products
  getCreatorProducts: () => api.get('/commerce/products'),
  createProduct: (data: any) => api.post('/commerce/products', data),
  updateProduct: (id: string, data: any) => api.put(`/commerce/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/commerce/products/${id}`),
  getPublicProduct: (storeSlug: string, productSlug: string) =>
    api.get(`/commerce/public/stores/${storeSlug}/products/${productSlug}`),
  downloadProduct: (productId: string) =>
    api.get(`/commerce/buyer/products/${productId}/download`),

  // Courses
  getCreatorCourses: () => api.get('/commerce/courses'),
  createCourse: (data: any) => api.post('/commerce/courses', data),
  updateCourse: (id: string, data: any) => api.put(`/commerce/courses/${id}`, data),
  deleteCourse: (id: string) => api.delete(`/commerce/courses/${id}`),
  addLesson: (courseId: string, data: any) => api.post(`/commerce/courses/${courseId}/lessons`, data),
  updateLesson: (courseId: string, lessonId: string, data: any) => api.put(`/commerce/courses/${courseId}/lessons/${lessonId}`, data),
  deleteLesson: (courseId: string, lessonId: string) => api.delete(`/commerce/courses/${courseId}/lessons/${lessonId}`),
  getPublicCourse: (storeSlug: string, courseSlug: string) =>
    api.get(`/commerce/public/stores/${storeSlug}/courses/${courseSlug}`),

  // Buyer Course Access
  getOwnedCourse: (courseId: string) => api.get(`/commerce/buyer/courses/${courseId}`),
  getOwnedLesson: (courseId: string, lessonId: string) => api.get(`/commerce/buyer/courses/${courseId}/lessons/${lessonId}`),
  updateLessonProgress: (courseId: string, lessonId: string, completed: boolean) =>
    api.post(`/commerce/buyer/courses/${courseId}/lessons/${lessonId}/progress`, { completed }),

  // Checkout & Payments
  createCheckout: (data: { itemType: string; productId?: string; courseId?: string }) =>
    api.post('/commerce/checkout', data),
  createRazorpayCheckout: (data: { itemType: string; productId?: string; courseId?: string }) =>
    api.post('/commerce/checkout/razorpay', data),

  // Revenue
  getRevenue: (days?: number) => api.get('/commerce/revenue', { params: { days } }),

  // Creator Buyers
  getCreatorBuyers: (page?: number) => api.get('/commerce/buyers', { params: { page } }),

  // Public Store by Handle
  getStoreByHandle: (handle: string) => api.get(`/commerce/public/handle/${handle}`),

  // Buyer
  getBuyerDashboard: () => api.get('/commerce/buyer/dashboard'),
};

// ─── Monetization API ──────────────────────────────────────────────────────
export const monetizationApi = {
  createDeal: (data: any) => api.post('/monetization/deals', data),
  getDeals: (params?: any) => api.get('/monetization/deals', { params }),
  getDeal: (id: string) => api.get(`/monetization/deals/${id}`),
  updateDeal: (id: string, data: any) => api.put(`/monetization/deals/${id}`, data),
  deleteDeal: (id: string) => api.delete(`/monetization/deals/${id}`),
  getEarnings: () => api.get('/monetization/earnings'),
  calculateRates: () => api.get('/monetization/rates'),
  generateMediaKit: () => api.get('/monetization/media-kit'),
};
