export type DashboardStats = {
  followers: number;
  engagementRate: number;
  posts: number;
};

export const dashboardService = {
  async getStats(): Promise<DashboardStats | null> {
    // Placeholder until API integration is wired.
    return {
      followers: 0,
      engagementRate: 0,
      posts: 0,
    };
  },
};
