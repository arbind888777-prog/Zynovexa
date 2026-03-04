'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

const NAV = [
  { href: '/dashboard',        icon: '📊', label: 'Dashboard' },
  { href: '/create',           icon: '✏️', label: 'Create Post' },
  { href: '/video',            icon: '🎬', label: 'Video Studio' },
  { href: '/posts',            icon: '📋', label: 'My Posts' },
  { href: '/analytics',        icon: '📈', label: 'Analytics' },
  { href: '/accounts',         icon: '🔗', label: 'Accounts' },
  { href: '/ai',               icon: '🤖', label: 'AI Studio' },
  { href: '/settings',         icon: '⚙️', label: 'Settings' },
  { href: '/settings/billing', icon: '💳', label: 'Billing' },
];

const PLAN_STYLES: Record<string, string> = {
  FREE: 'badge-purple',
  PRO: 'badge-yellow',
  BUSINESS: 'badge-green',
};
const PLAN_LABELS: Record<string, string> = {
  FREE: '🆓 Free',
  PRO: '⚡ Pro',
  BUSINESS: '💼 Business',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout, fetchMe, isLoading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      fetchMe().catch(() => router.push('/login'));
    }
  }, []);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-bg">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Z</div>
          <div className="text-xl font-extrabold gradient-text mb-3">Zynovexa</div>
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isLoading) {
    router.push('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/login');
  };

  const plan = user?.plan || 'FREE';
  const planBadge = PLAN_LABELS[plan] ?? plan;
  const planCls = PLAN_STYLES[plan] ?? 'badge-purple';

  const SidebarContent = () => (
    <aside className="flex flex-col h-full" style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Z</div>
          <span className="text-lg font-extrabold gradient-text">Zynovexa</span>
        </Link>
        <button className="lg:hidden p-1 text-slate-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)} aria-label="Close menu">✕</button>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-none mb-1">{user?.name || 'Creator'}</p>
            <span className={`badge ${planCls} text-[10px] px-2 py-0.5`}>{planBadge}</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active ? 'nav-active text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              <span className="text-base leading-none">{item.icon}</span>
              <span>{item.label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
        <Link href="/settings/billing"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-white hover:bg-white/5 transition-all mb-1">
          <span>⬆️</span><span>Upgrade Plan</span>
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
          <span>🚪</span><span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen hero-bg">
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
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
