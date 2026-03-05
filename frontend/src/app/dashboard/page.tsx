'use client';

import React, { useEffect, useState } from 'react';
import { dashboardService, type DashboardStats } from '@/services/dashboard.service';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      try {
        const data = await dashboardService.getStats();
        if (mounted) {
          setStats(data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main>
      <h1>Dashboard</h1>

      {loading && <p>Loading dashboard...</p>}

      {!loading && !stats && <p>No dashboard data available.</p>}

      {!loading && stats && (
        <section aria-label="Dashboard stats">
          <p>Total Followers: {stats.followers}</p>
          <p>Engagement Rate: {stats.engagementRate}%</p>
          <p>Total Posts: {stats.posts}</p>
        </section>
      )}
    </main>
  );
}
