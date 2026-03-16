'use client';
import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeStore {
  theme: Theme;
  mounted: boolean;
  toggle: () => void;
  setTheme: (t: Theme) => void;
  hydrate: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  // Always start with 'dark' to match server render (the inline <script> in layout.tsx
  // applies the correct class before paint, so there's no flash)
  theme: 'dark',
  mounted: false,
  toggle: () =>
    set((s) => {
      const next = s.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('zynovexa-theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      document.documentElement.classList.toggle('light', next === 'light');
      return { theme: next };
    }),
  setTheme: (t) => {
    localStorage.setItem('zynovexa-theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
    document.documentElement.classList.toggle('light', t === 'light');
    set({ theme: t });
  },
  hydrate: () => {
    const stored = localStorage.getItem('zynovexa-theme') as Theme | null;
    const resolved = stored === 'light' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.documentElement.classList.toggle('light', resolved === 'light');
    set({ theme: resolved, mounted: true });
  },
}));
