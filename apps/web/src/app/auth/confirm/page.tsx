'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';
import { getSupabaseAccessToken, isSupabaseEnabled } from '@/lib/supabase';

type ConfirmState = 'pending' | 'verifying' | 'success' | 'error';

function ConfirmPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { exchangeSupabaseToken } = useAuthStore();
  const [state, setState] = useState<ConfirmState>(params.get('pending') ? 'pending' : 'verifying');
  const [message, setMessage] = useState('Checking your verification link...');

  useEffect(() => {
    if (params.get('pending')) {
      setMessage('Check your inbox and click the verification link from Supabase to finish setup.');
      return;
    }

    if (!isSupabaseEnabled) {
      setState('error');
      setMessage('Supabase auth is not configured for this environment.');
      return;
    }

    let cancelled = false;

    const completeVerification = async () => {
      try {
        const accessToken = await getSupabaseAccessToken();
        if (!accessToken) {
          throw new Error('No active Supabase session found. Please open the latest email link again.');
        }

        await exchangeSupabaseToken(accessToken);
        if (cancelled) {
          return;
        }

        setState('success');
        setMessage('Your email is confirmed. Redirecting you into Zynovexa...');
        toast.success('Email verified successfully.');

        const currentUser = useAuthStore.getState().user;
        setTimeout(() => {
          if (currentUser && !currentUser.onboardingCompleted) {
            router.push('/onboarding');
            return;
          }

          router.push('/dashboard');
        }, 1200);
      } catch (error: any) {
        if (cancelled) {
          return;
        }

        setState('error');
        setMessage(error?.message || 'Verification failed. Please request a fresh email and try again.');
      }
    };

    void completeVerification();

    return () => {
      cancelled = true;
    };
  }, [exchangeSupabaseToken, params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center hero-bg px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
          >
            {state === 'pending' ? '📧' : state === 'verifying' ? '🔐' : state === 'success' ? '✅' : '❌'}
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">Email Confirmation</h1>
          <p className="text-slate-400 text-sm">{message}</p>

          {(state === 'pending' || state === 'error') && (
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/login"
                className="inline-block px-6 py-3 rounded-xl text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
              >
                Go to Login
              </Link>
              <Link href="/signup" className="text-sm text-purple-400 hover:text-purple-300">
                Back to Signup
              </Link>
            </div>
          )}

          {state === 'verifying' && (
            <div className="mt-6 flex justify-center">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen hero-bg" />}>
      <ConfirmPageContent />
    </Suspense>
  );
}
