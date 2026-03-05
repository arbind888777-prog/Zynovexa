import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock auth store
jest.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({
    user: { name: 'Test User', plan: 'PRO' },
  }),
}));

// Mock react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: ({ queryKey }: any) => {
    if (queryKey[0] === 'dashboard-stats') return { data: { totalPosts: 42, scheduledPosts: 5, connectedAccounts: 3 } };
    if (queryKey[0] === 'analytics-overview') return { data: { totalImpressions: 12500, totalEngagements: 890, avgEngagementRate: 7.1, totalFollowers: 5000 } };
    if (queryKey[0] === 'top-posts') return { data: [{ id: 1, title: 'Top post', caption: 'Test', platforms: ['INSTAGRAM'], viralScore: 85, engagements: 500, impressions: 2000 }] };
    if (queryKey[0] === 'ai-usage') return { data: { used: 35, limit: 500 } };
    return { data: null };
  },
}));

// Mock API modules
jest.mock('@/lib/api', () => ({
  usersApi: { getDashboardStats: jest.fn() },
  postsApi: {},
  analyticsApi: { getOverview: jest.fn(), getTopPosts: jest.fn() },
  aiApi: { getUsage: jest.fn() },
}));

import DashboardPage from '../../app/(dashboard)/dashboard/page';

describe('Dashboard Page — buttons & links', () => {
  beforeEach(() => {
    render(<DashboardPage />);
  });

  // ─── Create Post CTA ─────────────────────────────────
  it('"+ Create Post" links to /create', () => {
    const el = screen.getByText('+ Create Post');
    expect(el.closest('a')).toHaveAttribute('href', '/create');
  });

  // ─── AI Studio link ──────────────────────────────────
  it('"Open AI Studio →" links to /ai', () => {
    const el = screen.getByText(/Open AI Studio/);
    expect(el.closest('a')).toHaveAttribute('href', '/ai');
  });

  // ─── Quick Action links ──────────────────────────────
  it.each([
    ['New Post', '/create'],
    ['AI Caption', '/ai'],
    ['Analytics', '/analytics'],
    ['Connect Account', '/accounts'],
  ])('quick action "%s" links to %s', (label, href) => {
    const el = screen.getByText(label);
    expect(el.closest('a')).toHaveAttribute('href', href);
  });

  // ─── View all posts link ─────────────────────────────
  it('"View all →" links to /posts', () => {
    const el = screen.getByText(/View all/);
    expect(el.closest('a')).toHaveAttribute('href', '/posts');
  });

  // ─── Stats rendered ──────────────────────────────────
  it('displays total posts stat', () => {
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('displays greeting with user name', () => {
    expect(screen.getByText(/Test/)).toBeTruthy();
  });
});
