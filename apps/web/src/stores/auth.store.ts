import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authApi, unwrapApiResponse } from '@/lib/api';
import { supabase } from '@/lib/supabase';

// Set/clear a simple cookie so Next.js middleware can check auth state server-side
function setAuthCookie(loggedIn: boolean) {
  if (typeof document === 'undefined') return;
  if (loggedIn) {
    document.cookie = 'zy_logged_in=1; path=/; max-age=604800; SameSite=Lax';
  } else {
    document.cookie = 'zy_logged_in=; path=/; max-age=0';
  }
}

function isValidStoredToken(token: string | null | undefined) {
  return Boolean(token && token !== 'undefined' && token !== 'null');
}

function isAuthFailure(error: any) {
  const status = error?.response?.status;
  return status === 401 || status === 403;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  _hydrated: boolean;

  login: (email: string, password: string) => Promise<void>;
  exchangeSupabaseToken: (accessToken: string) => Promise<void>;
  demoLogin: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setUser: (user: User) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
      _hydrated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ email, password });
          const data = unwrapApiResponse<{ user: User; accessToken: string; refreshToken: string }>(response);
          localStorage.setItem('access_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);
          setAuthCookie(true);
          set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      exchangeSupabaseToken: async (accessToken) => {
        set({ isLoading: true });
        try {
          const response = await authApi.exchangeSupabaseToken(accessToken);
          const data = unwrapApiResponse<{ user: User; accessToken: string; refreshToken: string }>(response);
          localStorage.setItem('access_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);
          setAuthCookie(true);
          set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      demoLogin: () => {
        const demoUser: User = {
          id: 'demo-user-001',
          email: 'demo@zynovexa.com',
          name: 'Demo Creator',
          role: 'USER',
          plan: 'PRO',
          isVerified: true,
          onboardingCompleted: true,
          createdAt: new Date().toISOString(),
        };
        const demoToken = 'demo-token-zynovexa';
        localStorage.setItem('access_token', demoToken);
        localStorage.setItem('refresh_token', demoToken);
        setAuthCookie(true);
        set({ user: demoUser, accessToken: demoToken, refreshToken: demoToken, isAuthenticated: true, isLoading: false });
      },

      signup: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const response = await authApi.signup({ name, email, password });
          const data = unwrapApiResponse<{ user: User; accessToken: string; refreshToken: string }>(response);
          localStorage.setItem('access_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);
          setAuthCookie(true);
          set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try { await authApi.logout(); } catch {}
        try { await supabase?.auth.signOut(); } catch {}
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setAuthCookie(false);
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      fetchMe: async () => {
        set({ isLoading: true });
        try {
          const response = await authApi.me();
          const data = unwrapApiResponse<User>(response);
          set({ user: data, isAuthenticated: true });
        } catch (error: any) {
          if (isAuthFailure(error)) {
            get().clear();
            return;
          }

          const currentState = get();
          if (isValidStoredToken(currentState.accessToken) && isValidStoredToken(currentState.refreshToken)) {
            setAuthCookie(true);
            set({ isAuthenticated: true });
            return;
          }

          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      setUser: (user) => set({ user }),
      clear: () => {
        void supabase?.auth.signOut().catch(() => undefined);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setAuthCookie(false);
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'zynovexa-auth',
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken, isAuthenticated: s.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        const accessToken = state?.accessToken ?? null;
        const refreshToken = state?.refreshToken ?? null;
        const hasValidTokens = isValidStoredToken(accessToken) && isValidStoredToken(refreshToken);

        if (!hasValidTokens) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setAuthCookie(false);
          useAuthStore.setState({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            _hydrated: true,
          });
          return;
        }

        localStorage.setItem('access_token', accessToken!);
        localStorage.setItem('refresh_token', refreshToken!);
        setAuthCookie(true);
        useAuthStore.setState({ isAuthenticated: true, _hydrated: true });
      },
    },
  ),
);
