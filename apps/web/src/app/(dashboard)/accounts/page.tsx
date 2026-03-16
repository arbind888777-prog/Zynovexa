'use client';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { accountsApi, unwrapApiResponse } from '@/lib/api';
import { toast } from 'sonner';
import { Platform, YoutubeInsights } from '@/types';
import ConfirmDialog from '@/components/confirm-dialog';
import { useFocusTrap } from '@/lib/use-focus-trap';

// ── Platform config ────────────────────────────────────────────
type PlatformMeta = {
  icon: string;
  color: string;
  label: string;
  oauthSupported: boolean;
  comingSoon?: boolean;
};

const PLATFORM_META: Record<Platform, PlatformMeta> = {
  YOUTUBE:   { icon: '▶️',  color: '#ff0000', label: 'YouTube',    oauthSupported: true },
  INSTAGRAM: { icon: '📸',  color: '#e1306c', label: 'Instagram',  oauthSupported: false, comingSoon: true },
  TIKTOK:    { icon: '🎵',  color: '#69c9d0', label: 'TikTok',     oauthSupported: false, comingSoon: true },
  TWITTER:   { icon: '𝕏',  color: '#1da1f2', label: 'X / Twitter', oauthSupported: false, comingSoon: true },
  LINKEDIN:  { icon: '💼',  color: '#0077b5', label: 'LinkedIn',   oauthSupported: false, comingSoon: true },
  FACEBOOK:  { icon: '👤',  color: '#1877f2', label: 'Facebook',   oauthSupported: false, comingSoon: true },
  SNAPCHAT:  { icon: '👻',  color: '#fffc00', label: 'Snapchat',   oauthSupported: false, comingSoon: true },
};

const ALL_PLATFORMS = Object.keys(PLATFORM_META) as Platform[];

// Error messages from OAuth callback redirect
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  youtube_denied:  'YouTube access was denied. Please try again and approve the permissions.',
  youtube_invalid: 'Invalid OAuth state. Please try connecting again.',
  youtube_failed:  'YouTube connection failed. Check your Google account permissions and retry.',
};

// ── Main Page ──────────────────────────────────────────────────
export default function AccountsPage() {
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [disconnectTarget, setDisconnectTarget] = useState<{
    id: string; platform: string; handle: string;
  } | null>(null);
  const [ytConnecting, setYtConnecting] = useState(false);

  // ── Handle OAuth redirect result from URL params ──
  useEffect(() => {
    const connected = searchParams.get('connected');
    const error     = searchParams.get('error');

    if (connected === 'youtube') {
      toast.success('✅ YouTube account connected successfully!');
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['account-stats'] });
      router.replace('/accounts'); // clean URL
    } else if (error && OAUTH_ERROR_MESSAGES[error]) {
      toast.error(OAUTH_ERROR_MESSAGES[error]);
      router.replace('/accounts');
    }
  }, []);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountsApi.getAll().then(r => r.data?.data ?? r.data),
  });

  const { data: stats } = useQuery({
    queryKey: ['account-stats'],
    queryFn: () => accountsApi.getStats().then(r => r.data?.data ?? r.data),
  });

  const youtubeAccount = (accounts ?? []).find((a: any) => a.platform === 'YOUTUBE');

  const { data: youtubeInsights, isLoading: ytInsightsLoading } = useQuery<YoutubeInsights>({
    queryKey: ['youtube-insights'],
    queryFn: () => accountsApi.getYoutubeInsights().then(unwrapApiResponse),
    enabled: !!youtubeAccount,
    retry: false,
  });

  const liveYoutubeSubscribers = youtubeInsights?.channel.subscriberCount;
  const liveYoutubeVideoCount = youtubeInsights?.channel.videoCount;
  const liveYoutubeLikes = youtubeInsights?.totals.totalLikes;
  const liveYoutubeComments = youtubeInsights?.totals.totalComments;

  const totalFollowers = (stats?.platforms ?? []).reduce((sum: number, platformAccount: any) => {
    if (platformAccount.platform === 'YOUTUBE' && typeof liveYoutubeSubscribers === 'number') {
      return sum + liveYoutubeSubscribers;
    }
    return sum + (platformAccount.followers || 0);
  }, 0);

  const disconnect = useMutation({
    mutationFn: (id: string) => accountsApi.disconnect(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['account-stats'] });
      toast.success('Account disconnected');
    },
    onError: () => toast.error('Failed to disconnect account'),
  });

  // ── YouTube OAuth: get URL from backend → redirect user to Google consent ──
  const handleConnectYoutube = async () => {
    setYtConnecting(true);
    try {
      const res = await accountsApi.getYoutubeConnectUrl();
      const { url } = res.data?.data ?? res.data;
      if (!url) throw new Error('No OAuth URL returned');
      window.location.href = url; // full-page redirect to Google consent screen
    } catch {
      toast.error('Could not initiate YouTube connection. Please try again.');
      setYtConnecting(false);
    }
  };

  // ── Reconnect handler ──
  const handleReconnect = (platform: Platform) => {
    if (platform === 'YOUTUBE') {
      handleConnectYoutube();
    } else {
      toast.info(`${PLATFORM_META[platform].label} reconnect coming soon.`);
    }
  };

  // ── Connect handler for un-connected platforms ──
  const handleConnect = (platform: Platform) => {
    const meta = PLATFORM_META[platform];
    if (platform === 'YOUTUBE') {
      handleConnectYoutube();
    } else if (meta.comingSoon) {
      toast.info(`${meta.label} OAuth connect is coming soon! Stay tuned.`);
    }
  };

  const reconnectCount = (stats?.platforms ?? []).filter((p: any) => p.reconnectRequired).length;

  return (
    <div className="p-6 sm:p-8 animate-fade-in">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">🔗 Connected Accounts</h1>
        <p className="text-sm text-slate-400 mt-1">Connect your social accounts to schedule posts, track analytics, and grow your audience.</p>
      </div>

      {/* Reconnect required banner */}
      {reconnectCount > 0 && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl text-sm"
          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)' }}>
          <span className="text-xl mt-0.5">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-300">
              {reconnectCount} account{reconnectCount > 1 ? 's' : ''} need{reconnectCount === 1 ? 's' : ''} reconnecting
            </p>
            <p className="text-slate-400 mt-0.5">Token expired or permissions revoked. Click "Reconnect" on the affected account card below.</p>
          </div>
        </div>
      )}

      {youtubeInsights && (
        <div className="mb-8 space-y-5">
          <div className="card p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                {youtubeInsights.channel.thumbnail ? (
                  <img
                    src={youtubeInsights.channel.thumbnail}
                    alt={youtubeInsights.channel.title}
                    className="w-16 h-16 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl bg-red-500/10">▶️</div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-white">YouTube Insights</h2>
                  <p className="text-sm text-slate-400">{youtubeInsights.channel.title}{youtubeInsights.channel.handle ? ` • ${youtubeInsights.channel.handle}` : ''}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="rounded-xl px-4 py-3 bg-white/5">
                  <p className="text-xs text-slate-400">Subscribers</p>
                  <p className="text-lg font-bold text-white">{youtubeInsights.channel.subscriberCount.toLocaleString()}</p>
                </div>
                <div className="rounded-xl px-4 py-3 bg-white/5">
                  <p className="text-xs text-slate-400">Videos</p>
                  <p className="text-lg font-bold text-white">{youtubeInsights.channel.videoCount.toLocaleString()}</p>
                </div>
                <div className="rounded-xl px-4 py-3 bg-white/5">
                  <p className="text-xs text-slate-400">Channel Views</p>
                  <p className="text-lg font-bold text-white">{youtubeInsights.channel.viewCount.toLocaleString()}</p>
                </div>
                <div className="rounded-xl px-4 py-3 bg-white/5">
                  <p className="text-xs text-slate-400">Recent Likes</p>
                  <p className="text-lg font-bold text-white">{youtubeInsights.totals.totalLikes.toLocaleString()}</p>
                </div>
                <div className="rounded-xl px-4 py-3 bg-white/5">
                  <p className="text-xs text-slate-400">Recent Comments</p>
                  <p className="text-lg font-bold text-white">{youtubeInsights.totals.totalComments.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">Latest YouTube Videos</h3>
              <span className="text-xs text-slate-400">Views, likes, comments live from YouTube</span>
            </div>
            {youtubeInsights.recentVideos.length === 0 ? (
              <p className="text-sm text-slate-400">No recent videos were found for this channel yet.</p>
            ) : (
              <div className="grid lg:grid-cols-2 gap-4">
                {youtubeInsights.recentVideos.map((video) => (
                  <div key={video.videoId} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="flex gap-3">
                      {video.thumbnail ? (
                        <img src={video.thumbnail} alt={video.title} className="w-28 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-28 h-16 rounded-lg bg-white/5 flex items-center justify-center">▶️</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white line-clamp-2">{video.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(video.publishedAt).toLocaleDateString()}</p>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                          <div className="rounded-lg bg-black/10 px-2 py-1 text-slate-300">👁 {video.viewCount.toLocaleString()}</div>
                          <div className="rounded-lg bg-black/10 px-2 py-1 text-slate-300">👍 {video.likeCount.toLocaleString()}</div>
                          <div className="rounded-lg bg-black/10 px-2 py-1 text-slate-300">💬 {video.commentCount.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {youtubeAccount && ytInsightsLoading && (
        <div className="mb-8 card p-5 text-sm text-slate-400">Loading YouTube insights...</div>
      )}

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <p className="text-2xl font-bold text-white">{stats.connected}</p>
            <p className="text-xs text-slate-400 mt-0.5">Connected Accounts</p>
          </div>
          <div className="card p-4">
            <p className="text-2xl font-bold text-white">{totalFollowers.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-0.5">Total Followers</p>
          </div>
          <div className="card p-4">
            <p className="text-2xl font-bold text-white">{ALL_PLATFORMS.length - stats.connected}</p>
            <p className="text-xs text-slate-400 mt-0.5">Available to Connect</p>
          </div>
          <div className="card p-4">
            <p className={`text-2xl font-bold ${reconnectCount > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
              {reconnectCount > 0 ? reconnectCount : '✓'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{reconnectCount > 0 ? 'Needs Reconnect' : 'All Healthy'}</p>
          </div>
        </div>
      )}

      {/* Platform cards grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ALL_PLATFORMS.map(p => (
            <div key={p} className="card p-5 animate-pulse">
              <div className="h-4 w-24 bg-white/10 rounded mb-3" />
              <div className="h-3 w-16 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ALL_PLATFORMS.map(p => {
            const meta      = PLATFORM_META[p];
            const account   = (accounts ?? []).find((a: any) => a.platform === p);
            const connected = !!account;
            const needsReconnect = connected && account.reconnectRequired;
            const isYoutube = p === 'YOUTUBE';
            const displayedFollowers = isYoutube && typeof liveYoutubeSubscribers === 'number'
              ? liveYoutubeSubscribers
              : (account?.followersCount || 0);

            return (
              <div key={p} className={`card p-5 flex flex-col transition-all duration-200 ${connected && !needsReconnect ? 'card-hover' : ''} ${needsReconnect ? 'ring-1 ring-yellow-500/40' : ''}`}>

                {/* Card header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                      style={{ background: `${meta.color}22` }}>
                      {meta.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{meta.label}</p>
                      {connected && (
                        <p className="text-xs text-slate-400 truncate max-w-[100px]">{account.handle || account.displayName}</p>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  {needsReconnect ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-yellow-400 bg-yellow-400/10">⚠ Reconnect</span>
                  ) : connected ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-green-400 bg-green-400/10">● Connected</span>
                  ) : meta.comingSoon ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-slate-500 bg-slate-500/10">Soon</span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-slate-500 bg-slate-500/10">Not connected</span>
                  )}
                </div>

                {/* Connected account details */}
                {connected && (
                  <div className="mb-4 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">{isYoutube ? 'Subscribers' : 'Followers'}</span>
                      <span className="text-white font-medium">{displayedFollowers.toLocaleString()}</span>
                    </div>
                    {isYoutube && typeof liveYoutubeVideoCount === 'number' && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Videos</span>
                          <span className="text-slate-400">{liveYoutubeVideoCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Recent Likes</span>
                          <span className="text-slate-400">{(liveYoutubeLikes || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Recent Comments</span>
                          <span className="text-slate-400">{(liveYoutubeComments || 0).toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    {account.tokenExpiresAt && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Token expires</span>
                        <span className={`font-medium ${new Date(account.tokenExpiresAt) < new Date() ? 'text-red-400' : 'text-slate-400'}`}>
                          {new Date(account.tokenExpiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {account.scopes?.length > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Permissions</span>
                        <span className="text-slate-400">{account.scopes.length} scopes granted</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-auto flex gap-2">
                  {needsReconnect ? (
                    <button
                      onClick={() => handleReconnect(p)}
                      disabled={p === 'YOUTUBE' && ytConnecting}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all text-yellow-400 hover:bg-yellow-400/10"
                      style={{ border: '1px solid rgba(251,191,36,0.3)' }}>
                      {p === 'YOUTUBE' && ytConnecting ? '...' : '🔄 Reconnect'}
                    </button>
                  ) : connected ? (
                    <button
                      onClick={() => setDisconnectTarget({ id: account.id, platform: p, handle: account.handle })}
                      className="flex-1 py-2 rounded-lg text-xs font-medium transition-all text-red-400 hover:bg-red-400/10"
                      style={{ border: '1px solid var(--border)' }}>
                      Disconnect
                    </button>
                  ) : p === 'YOUTUBE' ? (
                    <button
                      onClick={() => handleConnect(p)}
                      disabled={ytConnecting}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #ff0000, #cc0000)' }}>
                      {ytConnecting ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Connecting…
                        </span>
                      ) : (
                        '▶️ Connect YouTube'
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(p)}
                      className="flex-1 py-2 rounded-lg text-xs font-medium transition-all text-slate-400 hover:text-white hover:bg-white/5"
                      style={{ border: '1px solid var(--border)' }}>
                      {meta.comingSoon ? 'Coming Soon' : `Connect ${meta.label}`}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Disconnect confirm */}
      <ConfirmDialog
        open={!!disconnectTarget}
        title="Disconnect Account"
        message={disconnectTarget
          ? `Disconnect your ${PLATFORM_META[disconnectTarget.platform as Platform]?.label || disconnectTarget.platform} account${disconnectTarget.handle ? ` (${disconnectTarget.handle})` : ''}? Scheduled posts to this account will be paused.`
          : ''}
        confirmLabel="Disconnect"
        variant="danger"
        onConfirm={() => {
          if (disconnectTarget) disconnect.mutate(disconnectTarget.id);
          setDisconnectTarget(null);
        }}
        onCancel={() => setDisconnectTarget(null)}
      />
    </div>
  );
}
