'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

const LEFT_FEATURES = [
  { icon: '🤖', text: 'AI-powered content generation' },
  { icon: '📅', text: 'Smart scheduling across 7 platforms' },
  { icon: '📊', text: 'Real-time analytics & growth insights' },
  { icon: '🚀', text: 'Viral score predictions' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back! 🚀');
      // Check if the user has completed onboarding
      const currentUser = useAuthStore.getState().user;
      if (currentUser && !currentUser.onboardingCompleted) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  const fillDemo = () => { setEmail('demo@zynovexa.com'); setPassword('demo123'); };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex hero-bg">
      {/* ── Left Branding Panel ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.1) 100%)', borderRight: '1px solid var(--border)' }}>
        {/* Orbs */}
        <div className="orb orb-purple w-96 h-96 -top-20 -left-20" />
        <div className="orb orb-pink w-64 h-64 bottom-20 right-0" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Z</div>
            <span className="text-2xl font-extrabold gradient-text">Zynovexa</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-3">
              Welcome back,<br /><span className="gradient-text">creator!</span>
            </h2>
            <p className="text-slate-400 text-base">Your AI content studio is waiting. Let's build something viral today.</p>
          </div>

          <div className="space-y-3">
            {LEFT_FEATURES.map(f => (
              <div key={f.text} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: 'rgba(99,102,241,0.2)' }}>{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="card p-4 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_,i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
              <span className="text-xs text-slate-400 ml-1">4.9/5</span>
            </div>
            <p className="text-xs text-slate-400 italic">"Zynovexa doubled my engagement in just 3 weeks!"</p>
            <p className="text-xs text-slate-500 mt-1.5">— Rahul S., 250K YouTube subscribers</p>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-600">© 2026 Zynovexa. Your data is encrypted & secure.</p>
      </div>

      {/* ── Right Form Panel ────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Z</div>
            <span className="text-2xl font-extrabold gradient-text">Zynovexa</span>
          </Link>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Sign in</h1>
            <p className="text-slate-400 text-sm mt-1">Enter your credentials to continue</p>
          </div>

          {/* Google */}
          <button onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-sm text-white mb-5 card card-hover transition-all active:scale-95">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs text-slate-500">or email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus
                className="input w-full" placeholder="you@example.com" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-xs text-purple-400 hover:text-purple-300">{showPass ? 'Hide' : 'Show'}</button>
              </div>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="input w-full" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={isLoading}
              className="btn btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-60">
              {isLoading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-xs text-slate-500 mb-1.5 font-medium">Demo accounts:</p>
            <button onClick={fillDemo} className="text-xs text-purple-400 hover:text-purple-300 font-mono block">
              demo@zynovexa.com / demo123
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            New here?{' '}
            <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold">Create free account →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
