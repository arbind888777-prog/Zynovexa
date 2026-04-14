'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

// ─── Step data ───────────────────────────────────────────────────────────────

const USER_TYPES = [
  { id: 'creator', icon: '🎬', label: 'Content Creator', desc: 'Influencer, YouTuber, Blogger' },
  { id: 'small-business', icon: '🏪', label: 'Small Business', desc: 'Local shop, Startup, Brand' },
  { id: 'agency', icon: '🏢', label: 'Agency', desc: 'Digital marketing, PR firm' },
  { id: 'higher-education', icon: '🎓', label: 'Higher Education', desc: 'University, College, Institute' },
  { id: 'enterprise', icon: '🌐', label: 'Enterprise', desc: 'Large company, Corporation' },
  { id: 'personal', icon: '👤', label: 'Personal Brand', desc: 'Coach, Speaker, Consultant' },
];

const PLATFORMS = [
  { id: 'INSTAGRAM', icon: '📸', label: 'Instagram', color: '#e1306c' },
  { id: 'YOUTUBE', icon: '▶️', label: 'YouTube', color: '#ff0000' },
  { id: 'TWITTER', icon: '𝕏', label: 'Twitter / X', color: '#1d9bf0' },
  { id: 'LINKEDIN', icon: '💼', label: 'LinkedIn', color: '#0077b5' },
  { id: 'FACEBOOK', icon: '📘', label: 'Facebook', color: '#1877f2' },
];

const NICHES = [
  { id: 'tech', icon: '💻', label: 'Tech & Gadgets' },
  { id: 'fashion', icon: '👗', label: 'Fashion & Beauty' },
  { id: 'food', icon: '🍕', label: 'Food & Recipes' },
  { id: 'fitness', icon: '💪', label: 'Fitness & Health' },
  { id: 'finance', icon: '💰', label: 'Finance & Crypto' },
  { id: 'travel', icon: '✈️', label: 'Travel & Lifestyle' },
  { id: 'gaming', icon: '🎮', label: 'Gaming & Esports' },
  { id: 'education', icon: '📚', label: 'Education & Career' },
  { id: 'music', icon: '🎵', label: 'Music & Entertainment' },
  { id: 'ecommerce', icon: '🛍️', label: 'E-commerce & Retail' },
  { id: 'real-estate', icon: '🏠', label: 'Real Estate' },
  { id: 'other', icon: '✨', label: 'Other / Mixed' },
];

const GOALS = [
  { id: 'grow', icon: '🚀', label: 'Grow my following fast', desc: 'Reach more people organically' },
  { id: 'monetize', icon: '💰', label: 'Monetize my content', desc: 'Earn from brand deals & ads' },
  { id: 'brand', icon: '🎯', label: 'Build brand awareness', desc: 'Make my brand recognizable' },
  { id: 'traffic', icon: '📈', label: 'Drive website traffic', desc: 'Send followers to my store/site' },
  { id: 'engage', icon: '🤝', label: 'Engage my community', desc: 'Build loyal, active audience' },
];

// ─── Progress bar ────────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full transition-all duration-500"
          style={{
            background: i < step
              ? 'linear-gradient(90deg, #6366f1, #a855f7)'
              : 'rgba(255,255,255,0.1)',
          }}
        />
      ))}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const { user, fetchMe, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [userType, setUserType] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [niche, setNiche] = useState('');
  const [goal, setGoal] = useState('');

  // Guard: must be logged in; if already onboarded, go to dashboard
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (user?.onboardingCompleted) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const togglePlatform = (id: string) => {
    setPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await api.patch('/users/onboarding', { userType, platforms, niche, goal });
      await fetchMe(); // refresh user state so onboardingCompleted = true
      toast.success('Welcome to Zynovexa! 🎉');
      router.push('/dashboard');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const canNext1 = !!userType;
  const canNext2 = platforms.length > 0;
  const canNext3 = !!niche;
  const canFinish = !!goal;

  return (
    <div className="min-h-screen hero-bg flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Orbs */}
      <div className="orb orb-purple w-[500px] h-[500px] -top-40 -left-40 fixed pointer-events-none" />
      <div className="orb orb-pink w-[400px] h-[400px] -bottom-20 -right-20 fixed pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Z</div>
          <span className="text-xl font-extrabold gradient-text">Zynovexa</span>
        </div>

        {/* Card */}
        <div className="card p-6 sm:p-10">
          <ProgressBar step={step} total={4} />

          {/* ── Step 1: User Type ─────────────────────────────────── */}
          {step === 1 && (
            <div>
              <p className="text-sm font-medium text-indigo-400 mb-1">Step 1 of 4</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                What best describes you?
              </h1>
              <p className="text-slate-400 text-sm mb-7">
                Help us personalize your Zynovexa experience.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {USER_TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setUserType(t.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] ${
                      userType === t.id
                        ? 'border-indigo-500 bg-indigo-500/15'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <div>
                      <p className={`font-semibold text-sm ${userType === t.id ? 'text-white' : 'text-slate-200'}`}>
                        {t.label}
                      </p>
                      <p className="text-xs text-slate-500">{t.desc}</p>
                    </div>
                    {userType === t.id && (
                      <span className="ml-auto text-indigo-400 text-lg">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!canNext1}
                className="btn-primary w-full mt-8 py-3 text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          )}

          {/* ── Step 2: Platforms ─────────────────────────────────── */}
          {step === 2 && (
            <div>
              <p className="text-sm font-medium text-indigo-400 mb-1">Step 2 of 4</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                Which platforms do you use?
              </h1>
              <p className="text-slate-400 text-sm mb-7">
                Select all that apply — you can always add more later.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PLATFORMS.map(p => {
                  const sel = platforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.03] ${
                        sel
                          ? 'border-indigo-500 bg-indigo-500/15'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="text-3xl">{p.icon}</span>
                      <span className={`text-xs font-semibold ${sel ? 'text-white' : 'text-slate-300'}`}>
                        {p.label}
                      </span>
                      {sel && <span className="text-indigo-400 text-xs">✓ Selected</span>}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(1)} className="btn-ghost px-6 py-3 text-sm">
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canNext2}
                  className="btn-primary flex-1 py-3 text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Niche ─────────────────────────────────────── */}
          {step === 3 && (
            <div>
              <p className="text-sm font-medium text-indigo-400 mb-1">Step 3 of 4</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                What's your content niche?
              </h1>
              <p className="text-slate-400 text-sm mb-7">
                We'll use this to generate better AI content for you.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {NICHES.map(n => (
                  <button
                    key={n.id}
                    onClick={() => setNiche(n.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] ${
                      niche === n.id
                        ? 'border-indigo-500 bg-indigo-500/15'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xl">{n.icon}</span>
                    <span className={`text-xs font-semibold leading-tight ${niche === n.id ? 'text-white' : 'text-slate-300'}`}>
                      {n.label}
                    </span>
                    {niche === n.id && <span className="ml-auto text-indigo-400 text-xs">✓</span>}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(2)} className="btn-ghost px-6 py-3 text-sm">
                  ← Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!canNext3}
                  className="btn-primary flex-1 py-3 text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Goal ──────────────────────────────────────── */}
          {step === 4 && (
            <div>
              <p className="text-sm font-medium text-indigo-400 mb-1">Step 4 of 4</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                What's your main goal?
              </h1>
              <p className="text-slate-400 text-sm mb-7">
                We'll tailor your dashboard and AI suggestions to help you achieve it.
              </p>
              <div className="space-y-3">
                {GOALS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`flex items-center gap-4 w-full p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01] ${
                      goal === g.id
                        ? 'border-indigo-500 bg-indigo-500/15'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl">{g.icon}</span>
                    <div className="flex-1">
                      <p className={`font-semibold text-sm ${goal === g.id ? 'text-white' : 'text-slate-200'}`}>
                        {g.label}
                      </p>
                      <p className="text-xs text-slate-500">{g.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      goal === g.id ? 'border-indigo-400 bg-indigo-500' : 'border-white/20'
                    }`}>
                      {goal === g.id && <span className="text-white text-xs">✓</span>}
                    </div>
                  </button>
                ))}
              </div>

              {/* Summary pill */}
              {canFinish && (
                <div className="mt-5 p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <p className="text-xs text-indigo-300 font-medium mb-1">Your profile summary</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-slate-300">
                      {USER_TYPES.find(t => t.id === userType)?.icon} {USER_TYPES.find(t => t.id === userType)?.label}
                    </span>
                    {platforms.slice(0, 3).map(p => (
                      <span key={p} className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-slate-300">
                        {PLATFORMS.find(pl => pl.id === p)?.label}
                      </span>
                    ))}
                    {platforms.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-slate-300">
                        +{platforms.length - 3} more
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-slate-300">
                      {NICHES.find(n => n.id === niche)?.label}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(3)} className="btn-ghost px-6 py-3 text-sm">
                  ← Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={!canFinish || saving}
                  className="btn-primary flex-1 py-3 text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Setting up your account…
                    </span>
                  ) : (
                    '🚀 Launch My Dashboard'
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-slate-600 mt-4">
                You can always change these in Settings.{' '}
                <Link href="/dashboard" className="text-indigo-400 hover:underline">
                  Skip for now →
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
