'use client';

import { useEffect, useMemo, useState } from 'react';
import { usersApi, unwrapApiResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  handle?: string | null;
  role: 'USER' | 'ADMIN';
  plan: 'FREE' | 'STARTER' | 'PRO' | 'GROWTH' | 'BUSINESS';
  isVerified: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  subscription?: {
    plan: string;
    status: string;
    currentPeriodEnd?: string | null;
  } | null;
  stats?: {
    posts: number;
    connectedAccounts: number;
  };
};

const planTone: Record<string, string> = {
  FREE: 'bg-slate-500/15 text-slate-300',
  STARTER: 'bg-sky-500/15 text-sky-300',
  PRO: 'bg-amber-500/15 text-amber-300',
  GROWTH: 'bg-emerald-500/15 text-emerald-300',
  BUSINESS: 'bg-fuchsia-500/15 text-fuchsia-300',
};

export default function AdminUsersPage() {
  const { user } = useAuthStore();
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const response = await usersApi.getAdminUsers({
          q: query || undefined,
          plan: planFilter || undefined,
          role: roleFilter || undefined,
        });
        const data = unwrapApiResponse<AdminUserRow[]>(response);
        if (!cancelled) {
          setRows(data);
        }
      } catch (error: any) {
        if (!cancelled) {
          toast.error(error?.response?.data?.message || 'Failed to load admin users');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [planFilter, query, roleFilter, user?.role]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.total += 1;
        acc[row.plan] = (acc[row.plan] || 0) + 1;
        return acc;
      },
      { total: 0, FREE: 0, STARTER: 0, PRO: 0, GROWTH: 0, BUSINESS: 0 } as Record<string, number>,
    );
  }, [rows]);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-6 md:p-8 animate-fade-in">
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-xl font-bold text-white mb-2">Admin access required</h1>
          <p className="text-slate-400 text-sm">Only admin users can view the users and plans dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">🛡️ Users & Plans</h1>
          <p className="text-slate-400 text-sm mt-1">See who has logged in, which plan they are on, and their latest subscription state.</p>
        </div>

        <form
          className="flex flex-col gap-2 md:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            setQuery(searchDraft.trim());
          }}
        >
          <input
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Search by email, name, or handle"
            className="input min-w-[280px]"
          />
          <select
            value={planFilter}
            onChange={(event) => setPlanFilter(event.target.value)}
            className="input min-w-[150px]"
          >
            <option value="">All plans</option>
            <option value="FREE">Free</option>
            <option value="STARTER">Starter</option>
            <option value="PRO">Pro</option>
            <option value="GROWTH">Growth</option>
            <option value="BUSINESS">Business</option>
          </select>
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="input min-w-[140px]"
          >
            <option value="">All roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setSearchDraft('');
              setQuery('');
              setPlanFilter('');
              setRoleFilter('');
            }}
          >
            Reset
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {[
          ['Total', totals.total],
          ['Free', totals.FREE],
          ['Starter', totals.STARTER],
          ['Pro', totals.PRO],
          ['Growth', totals.GROWTH],
          ['Business', totals.BUSINESS],
        ].map(([label, value]) => (
          <div key={label} className="card p-4">
            <div className="text-xs text-slate-400 mb-1">{label}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card h-16 animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-4xl mb-3">🧾</div>
          <h2 className="text-lg font-semibold text-white mb-2">No users matched this filter</h2>
          <p className="text-slate-400 text-sm">Try a different email, name, or handle.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Plan</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Subscription</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Login</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Usage</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="p-4 align-top">
                      <div className="font-medium text-white">{row.name}</div>
                      <div className="text-sm text-slate-400">{row.email}</div>
                      <div className="text-xs text-slate-500 mt-1">{row.handle ? `@${row.handle}` : 'No handle'}</div>
                      <div className="text-xs mt-2">
                        <span className={`inline-block px-2 py-0.5 rounded ${row.isVerified ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                          {row.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                        <span className={`inline-block ml-2 px-2 py-0.5 rounded ${row.onboardingCompleted ? 'bg-blue-500/15 text-blue-300' : 'bg-slate-500/15 text-slate-300'}`}>
                          {row.onboardingCompleted ? 'Onboarded' : 'Onboarding pending'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 align-top text-sm text-white">{row.role}</td>
                    <td className="p-4 align-top">
                      <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${planTone[row.plan] || 'bg-slate-500/15 text-slate-300'}`}>
                        {row.plan}
                      </span>
                    </td>
                    <td className="p-4 align-top text-sm text-slate-300">
                      <div>{row.subscription?.status || 'No subscription row'}</div>
                      <div className="text-xs text-slate-500 mt-1">{row.subscription?.plan || row.plan}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {row.subscription?.currentPeriodEnd ? `Renews ${new Date(row.subscription.currentPeriodEnd).toLocaleDateString()}` : 'No renewal date'}
                      </div>
                    </td>
                    <td className="p-4 align-top text-sm text-slate-300">
                      {row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString() : 'No login log yet'}
                    </td>
                    <td className="p-4 align-top text-sm text-slate-300">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-top text-sm text-slate-300">
                      <div>Posts: {row.stats?.posts || 0}</div>
                      <div className="text-xs text-slate-500 mt-1">Accounts: {row.stats?.connectedAccounts || 0}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}