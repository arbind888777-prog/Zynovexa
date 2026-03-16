'use client';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, subscriptionsApi, unwrapApiData, unwrapApiResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

type Tab = 'profile' | 'billing' | 'security';

export default function SettingsPage() {
  const qc = useQueryClient();
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState({ name: user?.name || '', bio: user?.bio || '', website: user?.website || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [customPosts, setCustomPosts] = useState(50);
  const [customAi, setCustomAi] = useState(200);

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    if (requestedTab === 'profile' || requestedTab === 'billing' || requestedTab === 'security') {
      setTab(requestedTab);
    }
  }, [searchParams]);

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      toast.success('Payment completed successfully. Your billing details have been updated.');
      qc.invalidateQueries({ queryKey: ['subscription'] });
      qc.invalidateQueries({ queryKey: ['invoices'] });
      router.replace('/settings?tab=billing');
      return;
    }

    if (canceled === 'true') {
      toast.error('Payment was canceled. No changes were made to your subscription.');
      router.replace('/settings?tab=billing');
    }
  }, [qc, router, searchParams]);

  const { data: plans } = useQuery({ queryKey: ['plans'], queryFn: () => subscriptionsApi.getPlans().then(unwrapApiResponse) });
  const { data: subscription } = useQuery({ queryKey: ['subscription'], queryFn: () => subscriptionsApi.getMySubscription().then(unwrapApiResponse), retry: false });
  const { data: invoices } = useQuery({ queryKey: ['invoices'], queryFn: () => subscriptionsApi.getInvoices().then(unwrapApiResponse), enabled: tab === 'billing' });

  const updateProfile = useMutation({
    mutationFn: () => usersApi.updateProfile(profile),
    onSuccess: (res) => { setUser(unwrapApiResponse(res)); toast.success('Profile updated!'); },
    onError: () => toast.error('Update failed'),
  });

  const changePassword = useMutation({
    mutationFn: () => usersApi.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
    onSuccess: () => { toast.success('Password updated!'); setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed'),
  });

  const checkout = useMutation({
    mutationFn: (opts: { plan: string; customPosts?: number; customAiCredits?: number }) =>
      subscriptionsApi.createCheckout({ plan: opts.plan, billingCycle, customPosts: opts.customPosts, customAiCredits: opts.customAiCredits }),
    onSuccess: (res) => {
      const payload = unwrapApiResponse<{ demoMode?: boolean; url?: string }>(res);
      if (payload.demoMode) {
        toast.error('⚠️ Stripe not configured. Add STRIPE_SECRET_KEY to .env file.', { duration: 5000 });
        return;
      }
      if (payload.url) {
        window.location.href = payload.url;
      }
    },
    onError: () => toast.error('Checkout failed'),
  });

  const portal = useMutation({
    mutationFn: () => subscriptionsApi.createPortal(),
    onSuccess: (res) => {
      const payload = unwrapApiResponse<{ demoMode?: boolean; url?: string }>(res);
      if (payload.demoMode) { toast.error('⚠️ Stripe not configured.'); return; }
      if (payload.url) {
        window.location.href = payload.url;
      }
    },
  });

  // Calculate custom plan price
  const customMonthlyPrice = 15 + Math.ceil(customPosts / 10) * 5 + Math.ceil(customAi / 100) * 3;
  const customYearlyPrice = customMonthlyPrice * 10;

  const inputClass = "w-full px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-purple-500";
  const inputStyle = { background: 'var(--surface)', border: '1px solid var(--border)' };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">⚙️ Settings</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['profile', 'billing', 'security'] as Tab[]).map(t => (
          <button key={t} onClick={() => {
            setTab(t);
            router.replace(`/settings?tab=${t}`);
          }}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            style={{ background: tab === t ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))' : 'var(--card)', border: `1px solid ${tab === t ? '#6366f1' : 'var(--border)'}` }}>
            {t === 'profile' ? '👤' : t === 'billing' ? '💳' : '🔒'} {t}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-white">Profile Information</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-white">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <p className="text-xs text-purple-400 mt-1">{user?.plan} Plan</p>
            </div>
          </div>
          {[
            { label: 'Full Name', key: 'name', placeholder: 'Your name' },
            { label: 'Bio', key: 'bio', placeholder: 'Creator & digital marketer 🚀' },
            { label: 'Website', key: 'website', placeholder: 'https://yoursite.com' },
          ].map(f => (
            <div key={f.key}>
              <label htmlFor={`settings-${f.key}`} className="block text-sm font-medium text-gray-300 mb-1.5">{f.label}</label>
              <input id={`settings-${f.key}`} value={(profile as any)[f.key]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder} className={inputClass} style={inputStyle} />
            </div>
          ))}
          <button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Billing Tab */}
      {tab === 'billing' && (
        <div className="space-y-6">
          {/* Current plan */}
          <div className="card p-6">
            <h2 className="font-semibold text-white mb-3">Current Plan</h2>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-white">{subscription?.plan || user?.plan}</span>
                <p className="text-sm text-gray-400 mt-0.5">
                  {subscription?.status === 'ACTIVE' ? '✅ Active' : ''}
                  {subscription?.currentPeriodEnd ? ` · Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}` : ''}
                </p>
              </div>
              {subscription?.stripeCustomerId && (
                <button onClick={() => portal.mutate()} className="px-4 py-2 rounded-lg text-sm text-gray-300 card card-hover">
                  Manage Billing →
                </button>
              )}
            </div>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(c => c === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 rounded-full transition-all"
              style={{ background: billingCycle === 'yearly' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${billingCycle === 'yearly' ? 'left-8' : 'left-1'}`}></span>
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
              Yearly <span className="text-xs text-green-400 font-bold ml-1">Save 33%</span>
            </span>
          </div>

          {/* Plan cards */}
          {plans && (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              {Object.entries(plans).map(([key, plan]: any) => (
                <div key={key} className={`card p-5 relative flex flex-col ${key === user?.plan ? 'glow' : ''}`}
                  style={{ border: `1px solid ${key === user?.plan ? '#6366f1' : 'var(--border)'}` }}>
                  {plan.badge && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs px-3 py-0.5 rounded-full text-white font-bold"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>{plan.badge}</span>
                  )}
                  <h3 className="font-bold text-white mb-1">{plan.name}</h3>

                  {/* Price display */}
                  {key === 'CUSTOM' ? (
                    <p className="text-xl font-extrabold text-white mb-1">
                      ${billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly}
                    </p>
                  ) : (
                    <div className="mb-1">
                      <span className="text-2xl font-extrabold text-white">
                        ${billingCycle === 'yearly' ? (plan.price.yearly / 12).toFixed(0) : plan.price.monthly}
                      </span>
                      <span className="text-sm text-gray-400">/mo</span>
                      {billingCycle === 'yearly' && key !== 'FREE' && plan.savings && (
                        <span className="ml-2 text-xs text-green-400 font-bold">Save {plan.savings}!</span>
                      )}
                    </div>
                  )}
                  {billingCycle === 'yearly' && key !== 'FREE' && key !== 'CUSTOM' && (
                    <p className="text-xs text-gray-500 mb-2">Billed ${plan.price.yearly}/year</p>
                  )}

                  <ul className="space-y-1 mb-4 flex-1">
                    {(plan.features || []).map((f: string) => (
                      <li key={f} className="text-xs text-gray-400 flex items-center gap-1.5">
                        <span className="text-green-400 text-[10px]">✔</span>{f}
                      </li>
                    ))}
                  </ul>

                  {key !== user?.plan && key !== 'FREE' && key !== 'CUSTOM' && (
                    <button onClick={() => checkout.mutate({ plan: key })} disabled={checkout.isPending}
                      className="w-full py-2 rounded-lg text-xs font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                      Upgrade to {plan.name}
                    </button>
                  )}
                  {key === 'CUSTOM' && key !== user?.plan && (
                    <button onClick={() => checkout.mutate({ plan: 'CUSTOM', customPosts, customAiCredits: customAi })} disabled={checkout.isPending}
                      className="w-full py-2 rounded-lg text-xs font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)' }}>
                      Get Custom Plan
                    </button>
                  )}
                  {key === user?.plan && <p className="text-center text-xs text-purple-400 font-medium">Current Plan ✔</p>}
                </div>
              ))}
            </div>
          )}

          {/* Custom Plan Configurator */}
          <div className="card p-6" style={{ border: '1px solid rgba(236,72,153,0.3)' }}>
            <h2 className="font-semibold text-white mb-1">🎛️ Custom Plan Builder</h2>
            <p className="text-xs text-gray-400 mb-5">Only pay for what you need — build your own plan</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-300">Posts per month</label>
                  <span className="text-sm font-bold text-white">{customPosts}</span>
                </div>
                <input type="range" min={10} max={500} step={10} value={customPosts}
                  onChange={e => setCustomPosts(Number(e.target.value))}
                  className="w-full accent-purple-500" />
                <div className="flex justify-between text-xs text-gray-500 mt-1"><span>10</span><span>500+</span></div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-300">AI Credits per month</label>
                  <span className="text-sm font-bold text-white">{customAi}</span>
                </div>
                <input type="range" min={100} max={2000} step={100} value={customAi}
                  onChange={e => setCustomAi(Number(e.target.value))}
                  className="w-full accent-purple-500" />
                <div className="flex justify-between text-xs text-gray-500 mt-1"><span>100</span><span>2000+</span></div>
              </div>
            </div>
            <div className="mt-5 p-4 rounded-lg flex items-center justify-between" style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)' }}>
              <div>
                <p className="text-sm text-gray-300">Your custom price</p>
                <p className="text-xs text-gray-500">
                  Base $15 + {Math.ceil(customPosts/10)} post blocks + {Math.ceil(customAi/100)} AI blocks
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-white">
                  ${billingCycle === 'yearly' ? customYearlyPrice : customMonthlyPrice}
                </p>
                <p className="text-xs text-gray-400">/{billingCycle === 'yearly' ? 'year' : 'mo'}</p>
              </div>
            </div>
            <button
              onClick={() => checkout.mutate({ plan: 'CUSTOM', customPosts, customAiCredits: customAi })}
              disabled={checkout.isPending}
              className="mt-4 w-full py-3 rounded-lg text-sm font-semibold text-white transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)' }}>
              {checkout.isPending ? 'Processing...' : `Subscribe — $${billingCycle === 'yearly' ? customYearlyPrice : customMonthlyPrice}/${billingCycle === 'yearly' ? 'yr' : 'mo'}`}
            </button>
          </div>

          {/* Invoices */}
          {invoices && invoices.length > 0 && (
            <div className="card p-6">
              <h2 className="font-semibold text-white mb-4">Invoice History</h2>
              <div className="space-y-2">
                {invoices.map((inv: any) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
                    <div>
                      <p className="text-sm text-gray-300">{new Date(inv.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{inv.status}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-white">${(inv.amount / 100).toFixed(2)}</span>
                      {inv.invoiceUrl && <a href={inv.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400">View →</a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-white">Change Password</h2>
          {[
            { label: 'Current Password', key: 'currentPassword' },
            { label: 'New Password', key: 'newPassword' },
            { label: 'Confirm New Password', key: 'confirmPassword' },
          ].map(f => (
            <div key={f.key}>
              <label htmlFor={`security-${f.key}`} className="block text-sm font-medium text-gray-300 mb-1.5">{f.label}</label>
              <input id={`security-${f.key}`} type="password" value={(passwords as any)[f.key]} onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder="••••••••" className={inputClass} style={inputStyle} />
            </div>
          ))}
          <button onClick={() => {
            if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords must match');
            changePassword.mutate();
          }} disabled={changePassword.isPending}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            {changePassword.isPending ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      )}
    </div>
  );
}
