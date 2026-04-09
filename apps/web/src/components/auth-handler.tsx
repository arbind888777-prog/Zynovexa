'use client';
import { useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { supabase, isSupabaseEnabled, getSupabaseAccessToken } from '@/lib/supabase';

/**
 * Global auth handler — mounted in every page via <Providers>.
 *
 * Handles ALL Supabase OAuth callback scenarios:
 *
 * 1. PKCE flow  (?code=...) — Supabase JS exchanges the code automatically
 *    via detectSessionInUrl, then fires SIGNED_IN. The URL is cleaned to /
 *    or /# before React even mounts, so we CANNOT detect it via URL.
 *    Fix: always subscribe to onAuthStateChange when !isAuthenticated.
 *
 * 2. Implicit flow (#access_token=...) — token is in the hash fragment.
 *    detectSessionInUrl picks it up and fires SIGNED_IN.
 *    Same subscription handles this case too.
 *
 * 3. Already-have-session on page load — getSupabaseAccessToken() returns
 *    a token immediately (e.g. returning visitor, or just after PKCE exchange).
 *
 * After a successful exchange the user is redirected to /dashboard
 * (or /onboarding if they haven't completed onboarding yet).
 *
 * Auth pages (/login, /signup) are excluded to avoid redirect loops.
 */
export default function AuthHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { exchangeSupabaseToken, isAuthenticated } = useAuthStore();
  const exchanging = useRef(false);

  useEffect(() => {
    const oauthCode = searchParams.get('code');
    const oauthError = searchParams.get('error');

    // Safety net: some OAuth providers/site-url setups land on "/?code=..."
    // instead of the dedicated callback route. Normalize that here.
    if (pathname === '/' && (oauthCode || oauthError)) {
      const nextUrl = new URL('/auth/google/callback', window.location.origin);
      searchParams.forEach((value, key) => nextUrl.searchParams.set(key, value));
      router.replace(`${nextUrl.pathname}${nextUrl.search}`);
      return;
    }

    // Don't interfere if the user is already logged in or Supabase is off
    if (!isSupabaseEnabled || !supabase || isAuthenticated) return;

    // Don't redirect away from auth pages (prevents loops)
    const isAuthPage = pathname?.startsWith('/login') ||
      pathname?.startsWith('/signup') ||
      pathname?.startsWith('/auth/');
    if (isAuthPage) return;

    const handleSession = async (accessToken: string) => {
      if (exchanging.current) return;
      exchanging.current = true;
      try {
        await exchangeSupabaseToken(accessToken);
        // Clean up URL fragment if present
        if (typeof window !== 'undefined' && window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        const user = useAuthStore.getState().user;
        router.push(user && !user.onboardingCompleted ? '/onboarding' : '/dashboard');
      } catch {
        exchanging.current = false; // allow retry on next navigation
      }
    };

    // Case 3: session already exists (e.g. PKCE code was exchanged before mount)
    getSupabaseAccessToken().then((token) => {
      if (token) handleSession(token);
    });

    // Cases 1 & 2: listen for SIGNED_IN from Supabase (covers PKCE + implicit)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.access_token && !exchanging.current) {
        handleSession(session.access_token);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  // Re-run only when auth state or route changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, pathname, router, searchParams]);

  return null;
}
