import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      {/* Decorative orbs */}
      <div className="orb orb-purple" style={{ width: 300, height: 300, top: '10%', left: '15%' }} />
      <div className="orb orb-pink" style={{ width: 200, height: 200, bottom: '20%', right: '10%' }} />

      <div className="card p-10 text-center max-w-md w-full relative z-10 animate-fade-in">
        <div className="text-7xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          Page Not Found
        </h1>
        <p className="mb-8" style={{ color: 'var(--text2)' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-primary btn-lg">
            Go Home
          </Link>
          <Link href="/dashboard" className="btn btn-secondary btn-lg">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
