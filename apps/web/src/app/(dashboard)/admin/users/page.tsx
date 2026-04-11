'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { usersApi, unwrapApiResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

// --- Logic Component (Yahan saara kaam hoga) ---
function AdminUsersContent() {
  const { user } = useAuthStore();
  const [rows, setRows] = useState<any[]>([]);
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
        const data = unwrapApiResponse<any[]>(response);
        if (!cancelled) setRows(data);
      } catch (error: any) {
        if (!cancelled) toast.error('Failed to load users');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [planFilter, query, roleFilter, user?.role]);

  if (user?.role !== 'ADMIN') return <div className="p-8 text-white">Access Denied</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-white mb-4">🛡️ Users & Plans</h1>
      {/* Search and Table logic remains the same */}
      <div className="text-slate-400">Manage your {rows.length} users here.</div>
      {/* ... baaki table code ... */}
    </div>
  );
}

// --- Main Page (Ye sirf Suspense handle karega) ---
export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading Dashboard...</div>}>
      <AdminUsersContent />
    </Suspense>
  );
}
