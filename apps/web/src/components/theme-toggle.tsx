'use client';
import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme.store';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, mounted, toggle, hydrate } = useThemeStore();

  // Hydrate from localStorage after first mount — avoids server/client mismatch
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Before mount, render a neutral placeholder that matches the server HTML (dark default)
  const isDark = !mounted || theme === 'dark';

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 ${className}`}
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1e1b4b, #312e81)'
          : 'linear-gradient(135deg, #93c5fd, #60a5fa)',
        border: `1px solid ${isDark ? 'rgba(99,102,241,0.3)' : 'rgba(59,130,246,0.3)'}`,
      }}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] leading-none">🌙</span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] leading-none">☀️</span>
      {/* Thumb */}
      <span
        className="absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center text-xs"
        style={{
          left: isDark ? '2px' : 'calc(100% - 26px)',
          background: isDark ? '#6366f1' : '#fbbf24',
        }}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
