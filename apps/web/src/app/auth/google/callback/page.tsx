'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

function GoogleCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { fetchMe } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  useEffect(() => {
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const error = params.get('error');

    if (error || !accessToken || !refreshToken) {
      setStatus('error');
      toast.error('Google login failed. Please try again.');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    // Save tokens to localStorage so the API interceptor can use them
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    // Also update Zustand persisted state
    useAuthStore.setState({ accessToken, refreshToken, isAuthenticated: true });

    // Fetch user data
    (async () => {
      try {
        await fetchMe();
        toast.success('Welcome! Signed in with Google 🎉');
        router.push('/dashboard');
      } catch {
        setStatus('error');
        toast.error('Failed to load user. Please try again.');
        setTimeout(() => router.push('/login'), 2000);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: 'linear-gradient(135deg, #0a0a14, #0d0d22)' }}>
      {status === 'loading' ? (
        <>
          <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          <p className="text-gray-300 text-sm">Signing you in with Google...</p>
        </>
      ) : (
        <>
          <div className="text-4xl">❌</div>
          <p className="text-red-400 text-sm">Login failed. Redirecting...</p>
        </>
      )}
    </div>
  );
}
export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0a0a14, #0d0d22)' }}>
        <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}