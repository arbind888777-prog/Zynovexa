'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { unwrapApiData } from '@/lib/api';
import { getPublicApiBaseUrl } from '@/lib/public-env';
import { toast } from 'sonner';
import { getSupabaseAccessToken, isSupabaseEnabled, supabase } from '@/lib/supabase';

function setAuthCookie(loggedIn: boolean) {
  if (loggedIn) {
    document.cookie = 'zy_logged_in=1; path=/; max-age=604800; SameSite=Lax';
  } else {
    document.cookie = 'zy_logged_in=; path=/; max-age=0';
  }
}

function getApiBaseUrl() {
  return getPublicApiBaseUrl();
}

/**
 * Wait for Supabase to exchange the OAuth code / implicit token and return
 * an access token.  Works for both PKCE (?code=…) and implicit (#access_token=…).
 */
async function waitForSupabaseAccessToken(timeoutMs = 8000): Promise<string | null> {
  // Immediate check — covers the case where Supabase already exchanged the code
  const immediateToken = await getSupabaseAccessToken();
  if (immediateToken) return immediateToken;

  if (!supabase) return null;

  return new Promise<string | null>((resolve) => {
    let settled = false;

    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      sub.data.subscription.unsubscribe();
      resolve(null);
    }, timeoutMs);

    const sub = supabase!.auth.onAuthStateChange(async (event, session) => {
      if (settled) return;
      if (event === 'SIGNED_IN' && session?.access_token) {
        settled = true;
        window.clearTimeout(timer);
        sub.data.subscription.unsubscribe();
        resolve(session.access_token);
      }
    });
  });
}

function GoogleCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { exchangeSupabaseToken, fetchMe } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const ran = useRef(false);

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
    if (ran.current) return;
    ran.current = true;

    const error = params.get('error');
    if (error) {
      setStatus('error');
      toast.error('Google login failed. Please try again.');
      setTimeout(() => router.push('/login'), 2500);
      return;
    }

    (async () => {
      try {
        const success = params.get('success');

        // ── Legacy backend OAuth cookie exchange ────────────────────
        if (success) {
          const res = await fetch(`${getApiBaseUrl()}/auth/google/exchange`, {
            credentials: 'include',
          });

          if (!res.ok) throw new Error('Token exchange failed');

          const payload = unwrapApiData<{ accessToken: string; refreshToken: string }>(await res.json());
          const { accessToken, refreshToken } = payload;

          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
          setAuthCookie(true);
          useAuthStore.setState({ accessToken, refreshToken, isAuthenticated: true });

          await fetchMe();
          toast.success('Welcome! Signed in with Google 🎉');
          routeAfterAuth();
          return;
        }

        // ── Supabase OAuth path (PKCE or implicit) ──────────────────
        if (isSupabaseEnabled && supabase) {
          const accessToken = await waitForSupabaseAccessToken(8000);

          if (!accessToken) {
            throw new Error('Google sign-in timed out. Please try again.');
          }

          await exchangeSupabaseToken(accessToken);
          toast.success('Welcome! Signed in with Google 🎉');
          routeAfterAuth();
          return;
        }

        throw new Error('Google callback did not return a usable auth session.');
      } catch (err: any) {
        setStatus('error');
        toast.error(err?.message || 'Failed to sign in with Google. Please try again.');
        setTimeout(() => router.push('/login'), 2500);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: 'linear-gradient(135deg, #0a0a14, #0d0d22)' }}>
      {status === 'loading' ? (
        <>
          <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
          <p className="text-gray-300 text-sm">Signing you in with Google...</p>
          <p className="text-gray-600 text-xs">This may take a few seconds</p>
        </>
      ) : (
        <>
          <div className="text-4xl">❌</div>
          <p className="text-red-400 text-sm">Login failed. Redirecting to login...</p>
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
        <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}