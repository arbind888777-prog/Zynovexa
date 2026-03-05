import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import { dashboardService } from '@/services/dashboard.service';

jest.mock('@/services/dashboard.service', () => ({
  dashboardService: {
    getStats: jest.fn(),
  },
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (dashboardService.getStats as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<DashboardPage />);

    expect(screen.getByText(/loading dashboard/i)).toBeTruthy();
  });

  it('shows stats when data is available', async () => {
    (dashboardService.getStats as jest.Mock).mockResolvedValue({
      followers: 1240,
      engagementRate: 6.2,
      posts: 87,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/total followers: 1240/i)).toBeTruthy();
      expect(screen.getByText(/engagement rate: 6.2%/i)).toBeTruthy();
      expect(screen.getByText(/total posts: 87/i)).toBeTruthy();
    });
  });

  it('shows empty state when no data exists', async () => {
    (dashboardService.getStats as jest.Mock).mockResolvedValue(null);

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/no dashboard data available/i)).toBeTruthy();
    });
  });
});
