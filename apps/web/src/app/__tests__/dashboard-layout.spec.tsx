import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

const mockAuthState = {
  isAuthenticated: true,
  isLoading: false,
  _hydrated: true,
  user: { name: 'Test User', plan: 'PRO', onboardingCompleted: true },
  logout: jest.fn(),
  fetchMe: jest.fn(),
  accessToken: 'token',
  refreshToken: 'refresh',
};

const mockReplace = jest.fn();

const mockUseAuthStore = Object.assign(
  () => mockAuthState,
  {
    getState: jest.fn(() => mockAuthState),
  },
);

// Mock auth store — authenticated user
jest.mock('@/stores/auth.store', () => ({
  useAuthStore: mockUseAuthStore,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: mockReplace, prefetch: jest.fn() }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

import DashboardLayout from '../../app/(dashboard)/layout';

const expectLink = (label: string, href: string) => {
  const linkedElements = screen
    .getAllByText(label)
    .map((element) => element.closest('a'))
    .filter((link): link is HTMLAnchorElement => Boolean(link));

  expect(linkedElements.some((link) => link.getAttribute('href') === href)).toBe(true);
};

describe('Dashboard Layout — sidebar buttons & links', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthState.isAuthenticated = true;
    mockAuthState.user = { name: 'Test User', plan: 'PRO', onboardingCompleted: true } as any;
    mockAuthState.fetchMe.mockReset();
  });

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
    ['Products', '/products'],
    ['Courses', '/courses'],
    ['My Store', '/store'],
    ['Buyers', '/buyers'],
    ['Revenue', '/revenue'],
    ['My Purchases', '/purchases'],
    ['Analytics', '/analytics'],
    ['Accounts', '/accounts'],
    ['AI Studio', '/ai'],
    ['Settings', '/settings'],
  ])('sidebar nav "%s" links to %s', (label, href) => {
    expectLink(label, href);
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
    expect(screen.getAllByText('⚡ Pro').length).toBeGreaterThan(0);
  });

  // ─── Children rendered ────────────────────────────────
  it('renders children content', () => {
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('redirects to login if user restore fails after hydration', async () => {
    mockAuthState.user = null as any;
    mockAuthState.fetchMe.mockImplementation(async () => {
      mockAuthState.isAuthenticated = false;
      mockAuthState.user = null as any;
    });

    render(
      <DashboardLayout>
        <div data-testid="child">content</div>
      </DashboardLayout>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });
});
