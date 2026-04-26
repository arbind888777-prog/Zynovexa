'use client';
import { Suspense, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, subscriptionsApi, unwrapApiData, unwrapApiResponse } from '@/lib/api';
import { formatMoneyFromMinor } from '@/lib/commerce';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

type Tab = 'profile' | 'billing' | 'security';

function SettingsPageContent() {
  const qc = useQueryClient();
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState({ name: user?.name || '', bio: user?.bio || '', website: user?.website || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const currency = 'inr' as const;
  const sym = '₹';

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
    mutationFn: (opts: { plan: string }) =>
      subscriptionsApi.createCheckout({ plan: opts.plan, billingCycle }),
    onSuccess: (res) => {
      const payload = unwrapApiResponse<{ demoMode?: boolean; url?: string; razorpayMode?: boolean; message?: string }>(res);
      if (payload.demoMode) {
        toast.error('⚠️ Payment gateway not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file.', { duration: 5000 });
        return;
      }
      if (payload.url) {
        window.location.href = payload.url;
      }
    },
    onError: () => toast.error('Checkout failed'),
  });

  const inputClass = "w-full px-4 py-3 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-purple-500";
  const inputStyle = { background: 'var(--surface)', border: '1px solid var(--border)' };

  return (
    <div className="dashboard-content-shell max-w-5xl animate-fade-in">
      <div className="dashboard-headerband mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">⚙️ Settings</h1>
          <p className="text-sm text-gray-400 mt-2">Manage your profile, subscription, and security from one place.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['profile', 'billing', 'security'] as Tab[]).map(t => (
          <button key={t} onClick={() => {
            setTab(t);
            router.replace(`/settings?tab=${t}`);
          }}
            className={`dashboard-tab px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'dashboard-tab-active text-white' : 'text-gray-400 hover:text-white'}`}>
            {t === 'profile' ? '👤' : t === 'billing' ? '💳' : '🔒'} {t}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="dashboard-surface p-6 space-y-5">
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
          <div className="dashboard-surface p-6">
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold text-white">Current Plan</h2>
                <p className="mt-1 text-xs text-slate-400">Subscription state, renewal timing aur billing controls ek view me.</p>
              </div>
              <div className="dashboard-inline-stat px-3 py-2 text-xs text-slate-300">
                INR billing view
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-white">{subscription?.plan || user?.plan}</span>
                <p className="text-sm text-gray-400 mt-0.5">
                  {subscription?.status === 'ACTIVE' ? '✅ Active' : ''}
                  {subscription?.currentPeriodEnd ? ` · Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}` : ''}
                </p>
              </div>
              {subscription?.stripeSubscriptionId && (
                <p className="text-xs text-gray-500">To cancel, check your Razorpay email or contact support.</p>
              )}
            </div>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="dashboard-surface-muted flex items-center justify-center gap-4 p-4">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(c => c === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-7 rounded-full transition-all"
              style={{ background: billingCycle === 'yearly' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${billingCycle === 'yearly' ? 'left-8' : 'left-1'}`}></span>
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
              Yearly <span className="text-xs text-green-400 font-bold ml-1">Save 20%</span>
            </span>
          </div>

          {/* Currency: INR only */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 text-xs text-gray-500">
              <span>Prices in INR (₹) &bull; Payments via Razorpay</span>
            </div>
          </div>

          {/* Plan cards */}
          {plans && (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              {Object.entries(plans).map(([key, plan]: any) => {
                const priceData = plan.price?.inr || plan.price;
                const monthlyPrice = priceData?.monthly ?? 0;
                const yearlyPrice = priceData?.yearly ?? 0;
                const displayPrice = billingCycle === 'yearly' && key !== 'FREE'
                  ? Math.round(yearlyPrice / 12)
                  : monthlyPrice;

                return (
                  <div key={key} className={`dashboard-metric-card p-5 relative flex flex-col ${key === user?.plan ? 'glow' : ''}`}
                    style={{ border: `1px solid ${key === user?.plan ? '#6366f1' : 'var(--border)'}` }}>
                    {plan.badge && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs px-3 py-0.5 rounded-full text-white font-bold"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>{plan.badge}</span>
                    )}
                    <h3 className="font-bold text-white mb-1">{plan.name}</h3>
                    <div className="mb-1">
                      <span className="text-2xl font-extrabold text-white">
                        {sym}{displayPrice}
                      </span>
                      <span className="text-sm text-gray-400">/mo</span>
                      {billingCycle === 'yearly' && key !== 'FREE' && plan.savings && (
                        <span className="ml-2 text-xs text-green-400 font-bold">Save {plan.savings}!</span>
                      )}
                    </div>
                    {billingCycle === 'yearly' && key !== 'FREE' && (
                      <p className="text-xs text-gray-500 mb-2">Billed {sym}{yearlyPrice}/year</p>
                    )}
                    {key === 'FREE' && <p className="text-xs text-green-400 mb-2">Forever free</p>}

                    <ul className="space-y-1 mb-4 flex-1">
                      {(plan.features || []).map((f: string) => (
                        <li key={f} className="text-xs text-gray-400 flex items-center gap-1.5">
                          <span className="text-green-400 text-[10px]">✔</span>{f}
                        </li>
                      ))}
                    </ul>

                    {key !== user?.plan && key !== 'FREE' && (
                      <button onClick={() => checkout.mutate({ plan: key })} disabled={checkout.isPending}
                        className="w-full py-2 rounded-lg text-xs font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                        Upgrade to {plan.name}
                      </button>
                    )}
                    {key === user?.plan && <p className="text-center text-xs text-purple-400 font-medium">Current Plan ✔</p>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" /> Cancel anytime
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" /> No hidden charges
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" /> Secure payments via Razorpay
            </span>
          </div>

          {/* Invoices */}
          {invoices && invoices.length > 0 && (
            <div className="dashboard-surface p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-white">Invoice History</h2>
                  <p className="mt-1 text-xs text-slate-400">Recent charges, status aur receipt access.</p>
                </div>
                <div className="dashboard-inline-stat px-3 py-2 text-xs text-slate-300">{invoices.length} invoices</div>
              </div>
              <div className="space-y-2">
                {invoices.map((inv: any) => (
                  <div key={inv.id} className="dashboard-list-row flex items-center justify-between p-3">
                    <div>
                      <p className="text-sm text-gray-300">{new Date(inv.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{inv.status}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-white">{formatMoneyFromMinor(inv.amount, currency)}</span>
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
        <div className="dashboard-surface p-6 space-y-5">
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

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="dashboard-content-shell animate-fade-in" />}>
      <SettingsPageContent />
    </Suspense>
  );
}
