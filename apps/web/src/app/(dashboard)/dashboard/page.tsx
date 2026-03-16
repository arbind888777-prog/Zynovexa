'use client';
import { useQuery } from '@tanstack/react-query';
import { usersApi, analyticsApi, aiApi, unwrapApiResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import Link from 'next/link';

function getMediaBadge(post: any) {
  const count = post.mediaUrls?.length || 0;

  if (post.mediaType === 'TEXT' || count === 0) {
    return { label: 'TEXT', color: '#34d399' };
  }

  if (post.mediaType === 'VIDEO') {
    return { label: count > 1 ? `VIDEO x${count}` : 'VIDEO', color: '#38bdf8' };
  }

  if (post.mediaType === 'IMAGE') {
    return { label: count > 1 ? `IMAGE x${count}` : 'IMAGE', color: '#f472b6' };
  }

  return { label: post.mediaType || 'MEDIA', color: '#c084fc' };
}

function getPostHint(post: any) {
  const isYoutubeSelected = post.platforms?.includes('YOUTUBE');
  const isYoutubeVideoPost = isYoutubeSelected && ['VIDEO', 'REEL', 'SHORT'].includes(post.mediaType);

  if (isYoutubeSelected && !isYoutubeVideoPost) {
    return { text: 'YouTube text/image scheduled, manual publish required', color: '#fbbf24' };
  }

  if (isYoutubeVideoPost && (!post.mediaUrls || post.mediaUrls.length === 0)) {
    return { text: 'YouTube video missing', color: '#f87171' };
  }

  if (post.mediaType && post.mediaType !== 'TEXT' && (!post.mediaUrls || post.mediaUrls.length === 0)) {
    return { text: 'Media missing', color: '#fbbf24' };
  }

  return null;
}

function getPublishModeBadge(post: any) {
  if (!post?.publishResults || typeof post.publishResults !== 'object') {
    return null;
  }

  const youtubeResult = post.publishResults.YOUTUBE;
  if (youtubeResult?.success && youtubeResult.mode === 'youtube-live') {
    return { label: 'YT VIDEO', color: '#ef4444' };
  }

  if (youtubeResult?.manualRequired && youtubeResult.mode === 'youtube-manual') {
    return { label: 'YT MANUAL', color: '#f59e0b' };
  }

  return null;
}

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

  const { data: stats, isLoading: statsLoading, isError: statsError } = useQuery({ queryKey: ['dashboard-stats'], queryFn: () => usersApi.getDashboardStats().then(unwrapApiResponse) });
  const { data: overview, isLoading: overviewLoading } = useQuery({ queryKey: ['analytics-overview'], queryFn: () => analyticsApi.getOverview().then(unwrapApiResponse) });
  const { data: topPosts, isLoading: postsLoading } = useQuery({ queryKey: ['top-posts'], queryFn: () => analyticsApi.getTopPosts(5).then(unwrapApiResponse) });
  const { data: aiUsage, isLoading: aiLoading } = useQuery({ queryKey: ['ai-usage'], queryFn: () => aiApi.getUsage().then(unwrapApiResponse) });

  const isLoading = statsLoading || overviewLoading;

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

      {/* Error State */}
      {statsError && (
        <div className="card p-6 text-center">
          <p className="text-red-400 mb-2">⚠️ Failed to load dashboard data</p>
          <button onClick={() => window.location.reload()} className="btn btn-secondary btn-sm">Retry</button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="shimmer w-10 h-10 rounded-lg mb-4" />
              <div className="shimmer h-8 w-20 rounded mb-2" />
              <div className="shimmer h-4 w-28 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      {!isLoading && (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📝" label="Total Posts" value={stats?.totalPosts} sub={`${stats?.scheduledPosts} scheduled`} color="#6366f1" />
        <StatCard icon="👁️" label="Impressions" value={overview?.totalImpressions?.toLocaleString()} sub="Last 30 days" color="#a855f7" />
        <StatCard icon="❤️" label="Engagements" value={overview?.totalEngagements?.toLocaleString()} sub={`${overview?.avgEngagementRate}% rate`} color="#ec4899" />
        <StatCard icon="👥" label="Total Followers" value={overview?.totalFollowers?.toLocaleString()} sub={`${stats?.connectedAccounts} platforms`} color="#10b981" />
      </div>
      )}

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
                  {(() => {
                    const mediaBadge = getMediaBadge(post);
                    const postHint = getPostHint(post);
                    const publishModeBadge = getPublishModeBadge(post);

                    return (
                      <>
                  <p className="text-sm font-medium text-white truncate">{post.title || post.caption?.substring(0, 40) + '...'}</p>
                  <p className="text-xs text-gray-500">{post.platforms?.join(', ')}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${mediaBadge.color}20`, color: mediaBadge.color }}
                    >
                      {mediaBadge.label}
                    </span>
                    {publishModeBadge && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${publishModeBadge.color}20`, color: publishModeBadge.color }}
                      >
                        {publishModeBadge.label}
                      </span>
                    )}
                    {postHint && (
                      <span className="text-[10px]" style={{ color: postHint.color }}>
                        {postHint.text}
                      </span>
                    )}
                  </div>
                      </>
                    );
                  })()}
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
