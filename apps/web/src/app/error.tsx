'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="orb orb-pink" style={{ width: 250, height: 250, top: '15%', right: '20%' }} />

      <div className="card p-10 text-center max-w-md w-full relative z-10 animate-fade-in">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          Something went wrong
        </h1>
        <p className="mb-8" style={{ color: 'var(--text2)' }}>
          An unexpected error occurred. Please try again.
        </p>
        <button onClick={reset} className="btn btn-primary btn-lg">
          Try Again
        </button>
      </div>
    </div>
  );
}
