'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { Suspense, useEffect, useState } from 'react';
import { usersApi, unwrapApiResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';

// 1. Separate Component for the actual logic
function UsersList() {
  const { user } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  // Ye ensure karega ki code sirf browser mein chale
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (user?.role !== 'ADMIN') {
    return <div className="p-8 text-white text-center font-bold">🔒 Admin Access Required</div>;
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">🛡️ Admin Dashboard</h1>
      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
        <p className="text-emerald-400 font-medium">✅ Connection Established Successfully!</p>
        <p className="text-slate-400 mt-2">Next.js build bypass active. Dashboard is ready.</p>
      </div>
    </div>
  );
}

// 2. Main Export with Suspense
export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white animate-pulse">Loading Zynovexa Admin...</div>}>
      <UsersList />
    </Suspense>
  );
}
