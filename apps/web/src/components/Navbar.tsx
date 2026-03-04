'use client';
import { useState } from 'react';
import Link from 'next/link';

const NAV: Array<{
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string; desc?: string }>;
}> = [
  {
    label: 'Features',
    children: [
      { label: '🤖 AI Assistant', href: '/features/ai-assistant', desc: 'Generate captions, scripts & images' },
      { label: '📅 Publish & Schedule', href: '/features/publish', desc: 'Queue posts across all platforms' },
      { label: '📊 Analytics', href: '/features/analyze', desc: 'Deep insights & growth tracking' },
      { label: '🤝 Collaborate', href: '/features/collaborate', desc: 'Team workflows & approvals' },
      { label: '🔗 Start Page', href: '/tools/start-page', desc: 'Beautiful link-in-bio page' },
      { label: '🔌 Integrations', href: '/tools/integrations', desc: '50+ app connections' },
    ],
  },
  {
    label: 'Channels',
    children: [
      { label: '📸 Instagram', href: '/channels/instagram' },
      { label: '🎵 TikTok', href: '/channels/tiktok' },
      { label: '▶️ YouTube', href: '/channels/youtube' },
      { label: '𝕏 Twitter / X', href: '/channels/twitter' },
      { label: '💼 LinkedIn', href: '/channels/linkedin' },
      { label: '📘 Facebook', href: '/channels/facebook' },
      { label: '🏪 Google Business Profile', href: '/channels/google-business-profile' },
    ],
  },
  {
    label: 'Solutions',
    children: [
      { label: '🎨 Creators', href: '/solutions/creators', desc: 'For solo creators & influencers' },
      { label: '🏢 Small Business', href: '/solutions/small-business', desc: 'Grow your brand online' },
      { label: '🏆 Agencies', href: '/solutions/agencies', desc: 'Manage multiple clients' },
      { label: '🎗️ Nonprofits', href: '/solutions/nonprofits', desc: '50% discount for NGOs' },
      { label: '🎓 Higher Education', href: '/solutions/higher-education', desc: 'For universities & colleges' },
    ],
  },
  {
    label: 'Resources',
    children: [
      { label: '📝 Blog', href: '/blog', desc: 'Tips, guides & social media news' },
      { label: '📊 Social Media Insights', href: '/blog/social-media-insights', desc: 'Data-driven research & reports' },
      { label: '📚 Template Library', href: '/templates', desc: '500+ ready-to-use templates' },
      { label: '🔧 Free Marketing Tools', href: '/free-marketing-tools', desc: 'AI captions, hashtags & more' },
      { label: '🌍 Community', href: '/community', desc: '50,000+ creators & marketers' },
      { label: '❓ Help Center', href: '/help', desc: 'Docs, tutorials & FAQs' },
      { label: '🔄 Changelog', href: '/changelog', desc: "What's new in Zynovexa" },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
];

export default function Navbar() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Z</div>
          <span className="text-xl font-extrabold gradient-text">Zynovexa</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          {NAV.map(item =>
            item.children ? (
              <div key={item.label} className="relative" onMouseEnter={() => setOpen(item.label)} onMouseLeave={() => setOpen(null)}>
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                  {item.label}
                  <svg className={`w-3 h-3 transition-transform ${open === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {open === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-64 glass rounded-xl p-2 shadow-xl border" style={{ borderColor: 'var(--border2)' }}>
                    {item.children.map(c => (
                      <Link key={c.href} href={c.href} className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                        <span className="text-white text-sm font-medium group-hover:text-purple-300 transition-colors">{c.label}</span>
                        {c.desc && <span className="text-xs text-slate-500 mt-0.5">{c.desc}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.label} href={item.href!} className="px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">{item.label}</Link>
            )
          )}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link href="/signup" className="btn btn-primary btn-sm">Get Started Free</Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white" onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen
            ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          }
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-dark border-t px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto" style={{ borderColor: 'var(--border)' }}>
          {NAV.map(item =>
            item.children ? (
              <div key={item.label}>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2 pt-3 pb-1">{item.label}</p>
                {item.children.map(c => (
                  <Link key={c.href} href={c.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-colors">{c.label}</Link>
                ))}
              </div>
            ) : (
              <Link key={item.label} href={item.href!} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 text-sm transition-colors">{item.label}</Link>
            )
          )}
          <div className="pt-4 flex flex-col gap-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <Link href="/login" onClick={() => setMobileOpen(false)} className="btn btn-ghost w-full justify-center">Sign in</Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn btn-primary w-full justify-center">Get Started Free</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
