import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock auth store
const mockLogin = jest.fn();
const mockPush = jest.fn();
jest.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({
    login: mockLogin,
    exchangeSupabaseToken: jest.fn(),
    demoLogin: jest.fn(),
    isAuthenticated: false,
    isLoading: false,
    user: null,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => '/login',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('@/lib/supabase', () => ({
  isSupabaseEnabled: false,
  supabase: null,
  getSupabaseAccessToken: jest.fn(),
}));

import LoginPage from '../../app/(auth)/login/page';

describe('Login Page — buttons & links', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<LoginPage />);
  });

  // ─── Logo links ───────────────────────────────────────
  it('logo links navigate to /', () => {
    const logos = screen.getAllByText('Zynovexa');
    logos.forEach(logo => {
      const anchor = logo.closest('a');
      if (anchor) expect(anchor).toHaveAttribute('href', '/');
    });
  });

  // ─── Google login button ──────────────────────────────
  it('renders "Continue with Google" button', () => {
    const btn = screen.getByText('Continue with Google');
    expect(btn.closest('button')).toBeTruthy();
  });

  // ─── Submit button ────────────────────────────────────
  it('renders "Sign In →" submit button', () => {
    const btn = screen.getByText('Sign In →');
    expect(btn.closest('button')).toHaveAttribute('type', 'submit');
  });

  // ─── Password toggle button ───────────────────────────
  it('"Show" button toggles to "Hide"', () => {
    const toggle = screen.getByText('Show');
    expect(toggle.closest('button')).toBeTruthy();
    fireEvent.click(toggle);
    expect(screen.getByText('Hide')).toBeTruthy();
  });

  // ─── Demo fill button ─────────────────────────────────
  it('demo button fills credentials', () => {
    const demo = screen.getByText(/demo@zynovexa\.com/);
    expect(demo.closest('button')).toBeTruthy();
    fireEvent.click(demo);
    const emailInput = screen.getByPlaceholderText('you@example.com') as HTMLInputElement;
    expect(emailInput.value).toBe('demo@zynovexa.com');
  });

  // ─── Signup link ──────────────────────────────────────
  it('"Create free account →" links to /signup', () => {
    const el = screen.getByText(/Create free account/);
    expect(el.closest('a')).toHaveAttribute('href', '/signup');
  });

  // ─── Form fields exist ────────────────────────────────
  it('renders email input', () => {
    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
  });

  it('renders password input', () => {
    expect(screen.getByPlaceholderText('••••••••')).toBeTruthy();
  });
});
