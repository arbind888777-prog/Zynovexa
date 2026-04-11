'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi, unwrapApiResponse } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import Link from 'next/link';

function MagicLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('No login token provided.');
      return;
    }

    const verify = async () => {
      try {
        const response = await authApi.verifyMagicLink(token);
        const data = unwrapApiResponse<{ user: any; accessToken: string; refreshToken: string }>(response);
        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        // Hydrate the auth store
        useAuthStore.setState({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
        document.cookie = 'zy_logged_in=1; path=/; max-age=604800; SameSite=Lax';
        setStatus('success');
        // Redirect to buyer dashboard after brief delay
        setTimeout(() => router.push('/purchases'), 1500);
      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err?.response?.data?.message || 'Magic link expired or invalid. Please request a new one.');
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center hero-bg">
      <div className="w-full max-w-md mx-auto p-8">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            {status === 'verifying' ? '🔗' : status === 'success' ? '✅' : '❌'}
          </div>

          {status === 'verifying' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-3">Verifying your login...</h1>
              <p className="text-slate-400">Please wait while we sign you in.</p>
              <div className="mt-6 flex justify-center">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-3">You're signed in! 🎉</h1>
              <p className="text-slate-400">Redirecting to your dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-3">Login Failed</h1>
              <p className="text-slate-400 mb-6">{errorMsg}</p>
              <Link href="/login"
                className="inline-block px-6 py-3 rounded-xl text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                Go to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MagicLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen hero-bg" />}>
      <MagicLoginContent />
    </Suspense>
  );
}
