'use client';

// Next.js ko force karne ke liye ye lines sabse upar honi chahiye
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { Suspense, useEffect, useState } from 'react';
import { usersApi, unwrapApiResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

// 1. Content Component
function AdminUsersContent() {
  const { user } = useAuthStore();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const response = await usersApi.getAdminUsers({});
        const data = unwrapApiResponse<any[]>(response);
        setRows(data || []);
      } catch (error) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.role]);

  if (user?.role !== 'ADMIN') return <div className="p-8 text-white text-center">🔒 Access Denied</div>;

  return (
    <div className="p-6 md:p-8 animate-fade-in text-white">
      <h1 className="text-2xl font-bold mb-4">🛡️ Admin Users List</h1>
      <p>Total Users: {rows.length}</p>
      <div className="mt-4 p-4 border border-slate-700 rounded bg-slate-900/50">
        Data loaded successfully on the server.
      </div>
    </div>
  );
}

// 2. Main Page Component
export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white text-center animate-pulse">Initializing Admin Panel...</div>}>
      <AdminUsersContent />
    </Suspense>
  );
}
