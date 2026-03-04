'use client';
import { useQuery } from '@tanstack/react-query';
import { usersApi, postsApi, analyticsApi, aiApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import Link from 'next/link';

function StatCard({ label, value, sub, icon, color }: any) {
  return (
    <div className="card card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: `${color}20` }}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value ?? '—'}</p>
      <p className="text-sm font-medium text-gray-300">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: stats } = useQuery({ queryKey: ['dashboard-stats'], queryFn: () => usersApi.getDashboardStats().then(r => r.data) });
  const { data: overview } = useQuery({ queryKey: ['analytics-overview'], queryFn: () => analyticsApi.getOverview().then(r => r.data) });
  const { data: topPosts } = useQuery({ queryKey: ['top-posts'], queryFn: () => analyticsApi.getTopPosts(5).then(r => r.data) });
  const { data: aiUsage } = useQuery({ queryKey: ['ai-usage'], queryFn: () => aiApi.getUsage().then(r => r.data) });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your content today.</p>
        </div>
        <Link href="/create" className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
          + Create Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📝" label="Total Posts" value={stats?.totalPosts} sub={`${stats?.scheduledPosts} scheduled`} color="#6366f1" />
        <StatCard icon="👁️" label="Impressions" value={overview?.totalImpressions?.toLocaleString()} sub="Last 30 days" color="#a855f7" />
        <StatCard icon="❤️" label="Engagements" value={overview?.totalEngagements?.toLocaleString()} sub={`${overview?.avgEngagementRate}% rate`} color="#ec4899" />
        <StatCard icon="👥" label="Total Followers" value={overview?.totalFollowers?.toLocaleString()} sub={`${stats?.connectedAccounts} platforms`} color="#10b981" />
      </div>

      {/* AI Usage + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Usage */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">🤖 AI Usage</h2>
            <span className="text-xs text-purple-400 font-medium">{user?.plan}</span>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">This month</span>
              <span className="text-white font-mono">{aiUsage?.used ?? 0} / {aiUsage?.limit ?? '∞'}</span>
            </div>
            {aiUsage?.limit && (
              <div className="w-full h-2 rounded-full" style={{ background: 'var(--border)' }}>
                <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (aiUsage.used / aiUsage.limit) * 100)}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
              </div>
            )}
          </div>
          <Link href="/ai" className="text-xs text-purple-400 hover:text-purple-300">Open AI Studio →</Link>
        </div>

        {/* Quick Actions */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold text-white mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/create', icon: '✏️', label: 'New Post' },
              { href: '/ai', icon: '🤖', label: 'AI Caption' },
              { href: '/analytics', icon: '📈', label: 'Analytics' },
              { href: '/accounts', icon: '🔗', label: 'Connect Account' },
            ].map(a => (
              <Link key={a.href} href={a.href} className="flex items-center gap-3 p-4 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-all hover:scale-[1.02]" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <span className="text-xl">{a.icon}</span>{a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Top Posts */}
      {topPosts && topPosts.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">🔥 Top Performing Posts</h2>
            <Link href="/posts" className="text-xs text-purple-400 hover:text-purple-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {topPosts.map((post: any) => (
              <div key={post.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{post.title || post.caption?.substring(0, 40) + '...'}</p>
                  <p className="text-xs text-gray-500">{post.platforms?.join(', ')}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="text-xs font-bold text-purple-400">{post.viralScore}%</div>
                  <div className="w-16 h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${post.viralScore}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
