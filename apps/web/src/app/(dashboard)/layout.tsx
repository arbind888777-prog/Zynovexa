'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import ThemeToggle from '@/components/theme-toggle';
import FloatingSocialIcons from '@/components/FloatingSocialIcons';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', icon: '📊', label: 'Dashboard' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/create',  icon: '✏️', label: 'Create Post' },
      { href: '/video',   icon: '🎬', label: 'Video Studio', locked: true },
      { href: '/posts',   icon: '📋', label: 'My Posts' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { href: '/products',  icon: '🛍️', label: 'Products' },
      { href: '/courses',   icon: '🎓', label: 'Courses' },
      { href: '/store',     icon: '🏪', label: 'My Store' },
      { href: '/buyers',    icon: '👥', label: 'Buyers' },
      { href: '/revenue',   icon: '💰', label: 'Revenue' },
      { href: '/purchases', icon: '📥', label: 'My Purchases' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { href: '/analytics',     icon: '📈', label: 'Analytics' },
      { href: '/seo',           icon: '🔍', label: 'SEO Scanner' },
    ],
  },
  {
    label: 'AI Tools',
    items: [
      { href: '/ai',           icon: '🤖', label: 'AI Studio' },
      { href: '/image-editor', icon: '🎨', label: 'Image Editor' },
      { href: '/growth-coach', icon: '🧠', label: 'Growth Coach' },
    ],
  },
  {
    label: 'Connect',
    items: [
      { href: '/brand-deals',  icon: '🤝', label: 'Brand Deals' },
      { href: '/accounts',     icon: '🔗', label: 'Accounts' },
      { href: '/gamification', icon: '🎮', label: 'Gamification' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { href: '/settings',         icon: '⚙️', label: 'Settings' },
    ],
  },
];

const PLAN_STYLES: Record<string, string> = {
  FREE: 'badge-purple',
  STARTER: 'badge-blue',
  PRO: 'badge-yellow',
  GROWTH: 'badge-green',
  BUSINESS: 'badge-green',
};
const PLAN_LABELS: Record<string, string> = {
  FREE: '🆓 Free',
  STARTER: '🌱 Starter',
  PRO: '⚡ Pro',
  GROWTH: '📈 Growth',
  BUSINESS: '💼 Business',
};

function LoadingSplash() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setProgress(p => Math.min(p + Math.random() * 25 + 10, 98)), 200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center hero-bg overflow-hidden relative">
      <div className="orb orb-purple w-[500px] h-[500px] -top-40 -left-40 animate-pulse" />
      <div className="orb orb-pink w-[400px] h-[400px] -bottom-40 -right-40 animate-pulse" style={{ animationDelay: '1s' }} />
      <FloatingSocialIcons />
      <div className="text-center relative z-10 animate-fade-in">
        <div className="relative mx-auto mb-6" style={{ width: 80, height: 80 }}>
          <div className="absolute inset-0 rounded-3xl animate-ping opacity-20"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
          <div className="relative w-full h-full rounded-3xl flex items-center justify-center text-white font-black text-4xl"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              boxShadow: '0 20px 60px rgba(99,102,241,0.4), inset 0 -4px 12px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.2)',
              transform: 'perspective(600px) rotateX(5deg)',
              animation: 'logoPulse 2s ease-in-out infinite',
            }}>
            Z
          </div>
        </div>
        <div className="text-2xl font-extrabold gradient-text mb-2">Zynovexa</div>
        <p className="text-slate-400 text-sm mb-6">Loading your studio...</p>
        <div className="w-48 h-1.5 rounded-full mx-auto overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)' }} />
        </div>
      </div>
      <style>{`
        @keyframes logoPulse {
          0%, 100% { transform: perspective(600px) rotateX(5deg) scale(1); }
          50% { transform: perspective(600px) rotateX(0deg) scale(1.05); }
        }
      `}</style>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout, fetchMe } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Wait for persisted auth to hydrate, then restore the user session before redirecting.
  useEffect(() => {
    let cancelled = false;

    const restoreAuth = async () => {
      const state = useAuthStore.getState();
      if (state.isAuthenticated) {
        if (!state.user) {
          try {
            await fetchMe();
          } catch {}

          if (cancelled) return;

          const nextState = useAuthStore.getState();
          if (!nextState.isAuthenticated || !nextState.user) {
            router.replace('/login');
            return;
          }
        }

        if (!cancelled) setReady(true);
        return;
      }

      const hasTokens = Boolean(state.accessToken && state.refreshToken);
      if (!hasTokens) {
        if (!cancelled) router.replace('/login');
        return;
      }

      try {
        await fetchMe();
      } catch {}

      if (cancelled) return;

      if (useAuthStore.getState().isAuthenticated) {
        setReady(true);
        return;
      }

      router.replace('/login');
    };

    if (useAuthStore.getState()._hydrated) {
      void restoreAuth();
      return () => {
        cancelled = true;
      };
    }

    const interval = setInterval(() => {
      if (!useAuthStore.getState()._hydrated) return;
      clearInterval(interval);
      void restoreAuth();
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!cancelled) {
        void restoreAuth();
      }
    }, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [fetchMe, router]);

  // Watch for logout while on dashboard
  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, ready, router]);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Show splash only while waiting for hydration or initial auth check
  if (!ready) {
    return <LoadingSplash />;
  }

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/login');
  };

  const plan = user?.plan || 'FREE';
  const planBadge = PLAN_LABELS[plan] ?? plan;
  const planCls = PLAN_STYLES[plan] ?? 'badge-purple';
  const navGroups = user?.role === 'ADMIN'
    ? [
        ...NAV_GROUPS,
        {
          label: 'Admin',
          items: [
            { href: '/admin/users', icon: '🛡️', label: 'Users & Plans' },
          ],
        },
      ]
    : NAV_GROUPS;

  const SidebarContent = () => (
    <aside className="dashboard-sidebar flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Z</div>
            <span className="text-lg font-extrabold gradient-text">Zynovexa</span>
          </Link>
          <span className="dashboard-inline-stat hidden xl:inline-flex px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">Live workspace</span>
        </div>
        <button className="lg:hidden p-1 text-slate-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)} aria-label="Close menu">✕</button>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
        <div className="dashboard-panel flex items-center gap-3 p-3.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-none mb-1">{user?.name || 'Creator'}</p>
            <p className="text-[11px] text-slate-500 truncate mb-1.5">{user?.email || 'workspace@zynovexa.com'}</p>
            <span className={`badge ${planCls} text-[10px] px-2 py-0.5`}>{planBadge}</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {navGroups.map(group => (
          <div key={group.label}>
            <div className="px-3 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                
                if ('locked' in item && item.locked) {
                  return (
                    <div key={item.href} className="dashboard-nav-item flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all text-slate-500 opacity-60 cursor-not-allowed select-none" title="Coming soon">
                      <span className="text-base leading-none grayscale opacity-50">{item.icon}</span>
                      <span>{item.label}</span>
                      <span className="ml-auto text-xs" title="Locked feature">🔒</span>
                    </div>
                  );
                }

                return (
                  <Link key={item.href} href={item.href}
                    className={`dashboard-nav-item flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                      active ? 'nav-active text-white font-medium' : 'text-slate-400 hover:text-white'
                    }`}>
                    <span className="text-base leading-none">{item.icon}</span>
                    <span>{item.label}</span>
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Theme & Logout */}
      <div className="p-3 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
        <div className="dashboard-panel p-2.5">
        <div className="flex items-center justify-between px-3 py-2 mb-1">
          <span className="text-xs text-slate-500">Theme</span>
          <ThemeToggle />
        </div>
        <Link href="/settings/billing"
          className="dashboard-quick-link flex items-center gap-2 px-3 py-2 text-xs text-slate-300 transition-all mb-1">
          <span>⬆️</span><span>Upgrade Plan</span>
        </Link>
        <button onClick={handleLogout}
          className="dashboard-surface-muted w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-red-400 transition-all">
          <span>🚪</span><span>Sign Out</span>
        </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="dashboard-shell flex min-h-screen">
      {/* ── Desktop Sidebar ──────────────────────────── */}
      <div className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 z-30">
        <SidebarContent />
      </div>

      {/* ── Mobile Overlay ───────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-72 z-50 shadow-2xl animate-fade-in">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* ── Main Content ─────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Mobile Top Bar */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b shrink-0 sticky top-0 z-20 glass-dark"
          style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu"
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <span className="w-5 h-0.5 bg-current rounded-full" />
            <span className="w-5 h-0.5 bg-current rounded-full" />
            <span className="w-3 h-0.5 bg-current rounded-full self-start ml-0" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Z</div>
            <span className="font-extrabold gradient-text">Zynovexa</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className={`badge ${planCls} hidden sm:inline-flex text-[10px] px-2 py-0.5`}>{planBadge}</span>
            <ThemeToggle className="scale-[0.8]" />
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
