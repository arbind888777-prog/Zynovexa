'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { Suspense, useEffect, useMemo, useState } from 'react';
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

// --- Logic Component ---
function AdminUsersContent() {
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
    return () => { cancelled = true; };
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

        <form className="flex flex-col gap-2 md:flex-row" onSubmit={(e) => { e.preventDefault(); setQuery(searchDraft.trim()); }}>
          <input value={searchDraft} onChange={(e) => setSearchDraft(e.target.value)} placeholder="Search by email, name, or handle" className="input min-w-[280px]" />
          <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="input min-w-[150px]">
            <option value="">All plans</option>
            <option value="FREE">Free</option>
            <option value="STARTER">Starter</option>
            <option value="PRO">Pro</option>
            <option value="GROWTH">Growth</option>
            <option value="BUSINESS">Business</option>
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {[['Total', totals.total], ['Free', totals.FREE], ['Starter', totals.STARTER], ['Pro', totals.PRO], ['Growth', totals.GROWTH], ['Business', totals.BUSINESS]].map(([label, value]) => (
          <div key={label} className="card p-4">
            <div className="text-xs text-slate-400 mb-1">{label}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="card h-16 animate-pulse" />))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Plan</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-white/[0.02]" style={{ borderColor: 'var(--border)' }}>
                    <td className="p-4 align-top">
                      <div className="font-medium text-white">{row.name}</div>
                      <div className="text-sm text-slate-400">{row.email}</div>
                    </td>
                    <td className="p-4 align-top">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${planTone[row.plan]}`}>{row.plan}</span>
                    </td>
                    <td className="p-4 align-top text-sm text-slate-300">{new Date(row.createdAt).toLocaleDateString()}</td>
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

// --- Main Export with Suspense Boundary ---
export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading Admin Dashboard...</div>}>
      <AdminUsersContent />
    </Suspense>
  );
}
