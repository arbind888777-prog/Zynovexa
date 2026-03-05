import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock auth store
const mockSignup = jest.fn();
const mockPush = jest.fn();
jest.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({
    signup: mockSignup,
    isLoading: false,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => '/signup',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

import SignupPage from '../../app/(auth)/signup/page';

describe('Signup Page — buttons & links', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<SignupPage />);
  });

  // ─── Logo links ───────────────────────────────────────
  it('logo links navigate to /', () => {
    const logos = screen.getAllByText('Zynovexa');
    logos.forEach(logo => {
      const anchor = logo.closest('a');
      if (anchor) expect(anchor).toHaveAttribute('href', '/');
    });
  });

  // ─── Google signup button ─────────────────────────────
  it('renders "Sign up with Google" button', () => {
    const btn = screen.getByText('Sign up with Google');
    expect(btn.closest('button')).toBeTruthy();
  });

  // ─── Submit button ────────────────────────────────────
  it('renders "Create Free Account" submit button', () => {
    const btn = screen.getByText(/Create Free Account/);
    expect(btn.closest('button')).toHaveAttribute('type', 'submit');
  });

  // ─── Password toggle ─────────────────────────────────
  it('"Show" button toggles to "Hide"', () => {
    const toggle = screen.getByText('Show');
    fireEvent.click(toggle);
    expect(screen.getByText('Hide')).toBeTruthy();
  });

  // ─── Terms & Privacy links ────────────────────────────
  it('renders Terms link', () => {
    const el = screen.getByText('Terms');
    expect(el.closest('a')).toBeTruthy();
  });

  it('renders Privacy Policy link', () => {
    const el = screen.getByText('Privacy Policy');
    expect(el.closest('a')).toBeTruthy();
  });

  // ─── Login link ───────────────────────────────────────
  it('"Sign in →" links to /login', () => {
    const el = screen.getByText(/Sign in →/);
    expect(el.closest('a')).toHaveAttribute('href', '/login');
  });

  // ─── Form fields exist ────────────────────────────────
  it('renders name input', () => {
    expect(screen.getByPlaceholderText('John Doe')).toBeTruthy();
  });

  it('renders email input', () => {
    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
  });

  it('renders password input', () => {
    expect(screen.getByPlaceholderText('Min 6 characters')).toBeTruthy();
  });

  it('renders confirm password input', () => {
    expect(screen.getByPlaceholderText('Repeat password')).toBeTruthy();
  });
});
