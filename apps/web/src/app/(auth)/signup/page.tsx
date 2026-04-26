'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import { getSupabaseAccessToken, isSupabaseEnabled, supabase } from '@/lib/supabase';
import { getPublicApiBaseUrl, getPublicAuthRedirectUrl } from '@/lib/public-env';

function getErrorMessage(err: any, fallback: string) {
  const apiMessage = err?.response?.data?.message;
  if (Array.isArray(apiMessage)) return apiMessage.join(' ');
  if (typeof apiMessage === 'string' && apiMessage.trim()) return apiMessage;
  if (typeof err?.message === 'string' && err.message.trim()) return err.message;
  return fallback;
}

const PERKS = [
  { icon: '🎁', text: 'Free forever — no credit card needed' },
  { icon: '⚡', text: '5 AI-generated posts every month' },
  { icon: '📊', text: 'Analytics for 2 platforms included' },
  { icon: '🤖', text: 'Access to Zyx AI Chatbot' },
];

export default function SignupPage() {
  const router = useRouter();
  const { signup, exchangeSupabaseToken, isLoading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Welcome to Zynovexa! 🎉');
      router.push('/onboarding');
    } catch (err: any) {
      if (isSupabaseEnabled && supabase) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
              data: {
                name: form.name,
                full_name: form.name,
              },
              emailRedirectTo: getPublicAuthRedirectUrl('/auth/confirm'),
            },
          });

          if (error) {
            throw error;
          }

          const accessToken = data.session?.access_token || await getSupabaseAccessToken();

          if (accessToken) {
            await exchangeSupabaseToken(accessToken);
            toast.success('Welcome to Zynovexa!');
            router.push('/onboarding');
            return;
          }

          toast.success('Check your email to verify your account.');
          router.push('/auth/confirm?pending=1');
          return;
        } catch (supabaseErr: any) {
          toast.error(getErrorMessage(supabaseErr, getErrorMessage(err, 'Signup failed. Try again.')));
          return;
        }
      }

      toast.error(getErrorMessage(err, 'Signup failed. Try again.'));
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const getStrength = (pw: string): { score: number; label: string; color: string } => {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    if (s <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (s <= 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
    if (s <= 3) return { score: 3, label: 'Good', color: '#6366f1' };
    return { score: 4, label: 'Strong', color: '#22c55e' };
  };

  const strength = form.password ? getStrength(form.password) : null;

  const handleGoogleSignup = async () => {
    // Force localhost redirect for development to avoid Supabase fallback issues
    const isLocal = typeof window !== 'undefined' && window.location.origin.includes('localhost');
    const localRedirect = `http://localhost:3001/auth/google/callback`;
    const targetUrl = isLocal ? localRedirect : getPublicAuthRedirectUrl('/auth/google/callback');

    if (isSupabaseEnabled && supabase) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: targetUrl,
        },
      });
      return;
    }

    const frontend = encodeURIComponent(targetUrl);
    const apiBase = getPublicApiBaseUrl();
    window.location.href = `${apiBase}/auth/google?frontend=${frontend}`;
  };

  return (
    <div className="min-h-screen flex hero-bg">
      {/* ── Left Panel ──────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(99,102,241,0.08) 100%)', borderRight: '1px solid var(--border)' }}>
        <div className="orb orb-pink w-80 h-80 -top-10 -right-10" />
        <div className="orb orb-purple w-56 h-56 bottom-20 -left-10" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Z</div>
            <span className="text-2xl font-extrabold gradient-text">Zynovexa</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-3">
              Join <span className="gradient-text">50,000+</span><br />creators today
            </h2>
            <p className="text-slate-400 text-base">Start your free account. No credit card. No risk. Just growth.</p>
          </div>

          <div className="space-y-3">
            {PERKS.map(p => (
              <div key={p.text} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                  style={{ background: 'rgba(168,85,247,0.2)' }}>{p.icon}</span>
                {p.text}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: '50K+', lbl: 'Creators' },
              { val: '4.9★', lbl: 'Rating' },
              { val: 'Free', lbl: 'To Start' },
            ].map(s => (
              <div key={s.lbl} className="card p-3 text-center">
                <div className="text-lg font-extrabold text-white">{s.val}</div>
                <div className="text-xs text-slate-500">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-600">© 2026 Zynovexa. All data encrypted & secure.</p>
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Create account</h1>
            <p className="text-slate-400 text-sm mt-1">Free forever. Upgrade anytime.</p>
          </div>

          <button onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-sm text-white mb-3 card card-hover transition-all active:scale-95">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>
          <p className="mb-5 text-center text-[11px] text-slate-500">
            Google sign-up secure external page par open hota hai, phir wapas app me aata hai.
          </p>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs text-slate-500">or email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input id="name" type="text" value={form.name} onChange={set('name')} required
                className="input w-full" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <input id="email" type="email" value={form.email} onChange={set('email')} required
                className="input w-full" placeholder="you@example.com" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-xs text-purple-400 hover:text-purple-300" aria-label={showPass ? 'Hide password' : 'Show password'}>{showPass ? 'Hide' : 'Show'}</button>
              </div>
              <input id="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} required
                className="input w-full" placeholder="Min 8 characters" />
              {strength && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-colors" style={{ background: i <= strength.score ? strength.color : 'var(--border)' }} />
                    ))}
                  </div>
                  <p className="text-xs mt-1" style={{ color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <input id="confirmPassword" type={showPass ? 'text' : 'password'} value={form.confirmPassword} onChange={set('confirmPassword')} required
                className="input w-full" placeholder="Repeat password" />
            </div>

            <button type="submit" disabled={isLoading}
              className="btn btn-primary w-full justify-center py-3 text-base mt-2 disabled:opacity-60">
              {isLoading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</span>
              ) : '🎉 Create Free Account'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-purple-400 hover:underline">Terms</Link> &{' '}
            <Link href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</Link>
          </p>
          <p className="mt-4 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
