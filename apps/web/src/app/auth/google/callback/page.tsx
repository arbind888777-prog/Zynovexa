'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { unwrapApiData } from '@/lib/api';
import { toast } from 'sonner';
import { getSupabaseAccessToken, isSupabaseEnabled, supabase } from '@/lib/supabase';

function setAuthCookie(loggedIn: boolean) {
  if (loggedIn) {
    document.cookie = 'zy_logged_in=1; path=/; max-age=604800; SameSite=Lax';
  } else {
    document.cookie = 'zy_logged_in=; path=/; max-age=0';
  }
}

function GoogleCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { exchangeSupabaseToken, fetchMe } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  const routeAfterAuth = () => {
    const redirectTarget = params.get('redirect');
    if (redirectTarget) {
      router.push(redirectTarget);
      return;
    }

    const currentUser = useAuthStore.getState().user;
    if (currentUser && !currentUser.onboardingCompleted) {
      router.push('/onboarding');
      return;
    }

    router.push('/dashboard');
  };

  useEffect(() => {
    const error = params.get('error');
    const success = params.get('success');

    if (error) {
      setStatus('error');
      toast.error('Google login failed. Please try again.');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    // Supabase OAuth callback path
    (async () => {
      try {
        if (isSupabaseEnabled && supabase) {
          const accessToken = await getSupabaseAccessToken();
          if (!accessToken) {
            throw new Error('No Supabase session found after Google sign-in.');
          }

          await exchangeSupabaseToken(accessToken);
          toast.success('Welcome! Signed in with Google 🎉');
          routeAfterAuth();
          return;
        }

        if (!success) {
          throw new Error('Google callback did not return success.');
        }

        // Legacy backend OAuth cookie exchange fallback
        const res = await fetch('/api/auth/google/exchange', {
          credentials: 'include', // sends cookies
        });

        if (!res.ok) throw new Error('Token exchange failed');

        const payload = unwrapApiData<{ accessToken: string; refreshToken: string }>(await res.json());
        const { accessToken, refreshToken } = payload;

        // Save tokens
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        setAuthCookie(true);
        useAuthStore.setState({ accessToken, refreshToken, isAuthenticated: true });

        await fetchMe();
        toast.success('Welcome! Signed in with Google 🎉');
        routeAfterAuth();
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