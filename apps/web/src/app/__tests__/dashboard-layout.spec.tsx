import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock auth store — authenticated user
jest.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { name: 'Test User', plan: 'PRO', onboardingCompleted: true },
    logout: jest.fn(),
    fetchMe: jest.fn(),
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

import DashboardLayout from '../../app/(dashboard)/layout';

describe('Dashboard Layout — sidebar buttons & links', () => {
  beforeEach(() => {
    render(
      <DashboardLayout>
        <div data-testid="child">content</div>
      </DashboardLayout>
    );
  });

  // ─── Sidebar brand logo ───────────────────────────────
  it('sidebar logo links to /dashboard', () => {
    const logos = screen.getAllByText('Zynovexa');
    const sidebarLogo = logos[0].closest('a');
    expect(sidebarLogo).toHaveAttribute('href', '/dashboard');
  });

  // ─── Sidebar navigation links ─────────────────────────
  it.each([
    ['Dashboard', '/dashboard'],
    ['Create Post', '/create'],
    ['Video Studio', '/video'],
    ['My Posts', '/posts'],
    ['Analytics', '/analytics'],
    ['Accounts', '/accounts'],
    ['AI Studio', '/ai'],
    ['Settings', '/settings'],
    ['Billing', '/settings/billing'],
  ])('sidebar nav "%s" links to %s', (label, href) => {
    const el = screen.getByText(label);
    expect(el.closest('a')).toHaveAttribute('href', href);
  });

  // ─── Upgrade Plan link ────────────────────────────────
  it('"Upgrade Plan" links to /settings/billing', () => {
    const el = screen.getByText('Upgrade Plan');
    expect(el.closest('a')).toHaveAttribute('href', '/settings/billing');
  });

  // ─── Sign Out button ─────────────────────────────────
  it('"Sign Out" button exists', () => {
    const btn = screen.getByText('Sign Out');
    expect(btn.closest('button')).toBeTruthy();
  });

  // ─── User info displayed ──────────────────────────────
  it('displays user name', () => {
    expect(screen.getByText('Test User')).toBeTruthy();
  });

  it('displays plan badge', () => {
    expect(screen.getByText('⚡ Pro')).toBeTruthy();
  });

  // ─── Children rendered ────────────────────────────────
  it('renders children content', () => {
    expect(screen.getByTestId('child')).toBeTruthy();
  });
});
