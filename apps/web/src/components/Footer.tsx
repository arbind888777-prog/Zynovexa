import Link from 'next/link';

const FOOTER_COLS = [
  {
    heading: 'Features',
    links: [
      { label: 'Create Content', href: '/features/create' },
      { label: 'Publish & Schedule', href: '/features/publish' },
      { label: 'AI Assistant', href: '/features/ai-assistant' },
      { label: 'Analytics', href: '/features/analyze' },
      { label: 'Collaborate', href: '/features/collaborate' },
    ],
  },
  {
    heading: 'Tools',
    links: [
      { label: 'Start Page', href: '/tools/start-page' },
      { label: 'AI Caption Generator', href: '/tools/ai-caption-generator' },
      { label: 'Hashtag Generator', href: '/tools/hashtag-generator' },
      { label: 'Free Marketing Tools', href: '/free-marketing-tools' },
      { label: 'Integrations', href: '/tools/integrations' },
    ],
  },
  {
    heading: 'Channels',
    links: [
      { label: 'Instagram', href: '/channels/instagram' },
      { label: 'YouTube', href: '/channels/youtube' },
      { label: 'Twitter / X', href: '/channels/twitter' },
      { label: 'LinkedIn', href: '/channels/linkedin' },
      { label: 'Facebook', href: '/channels/facebook' },
      { label: 'Google Business Profile', href: '/channels/google-business-profile' },
    ],
  },
  {
    heading: 'Solutions',
    links: [
      { label: 'Creators', href: '/solutions/creators' },
      { label: 'Small Business', href: '/solutions/small-business' },
      { label: 'Agencies', href: '/solutions/agencies' },
      { label: 'Nonprofits', href: '/solutions/nonprofits' },
      { label: 'Higher Education', href: '/solutions/higher-education' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Social Media Insights', href: '/blog/social-media-insights' },
      { label: 'Social Media Glossary', href: '/blog/social-media-glossary' },
      { label: 'Resource Library', href: '/resource-library' },
      { label: 'Template Library', href: '/templates' },
      { label: 'Community', href: '/community' },
      { label: 'Help Center', href: '/help' },
    ],
  },
  {
    heading: 'Compare',
    links: [
      { label: '⚡ Compare All', href: '/compare/all' },
      { label: 'vs Gudsho', href: '/compare/gudsho-alternative' },
      { label: 'vs Buffer', href: '/compare/buffer-alternative' },
      { label: 'vs Hootsuite', href: '/compare/hootsuite-alternative' },
      { label: 'vs Later', href: '/compare/later-alternative' },
      { label: 'vs Sprout Social', href: '/compare/sprout-social-alternative' },
      { label: 'vs SocialBee', href: '/compare/socialbee-alternative' },
      { label: 'vs Planable', href: '/compare/planable-alternative' },
      { label: 'Request a Feature', href: '/request-feature' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Status', href: '/status' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Partner Program', href: '/partner-program' },
      { label: 'Legal', href: '/legal' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Sitemap', href: '/sitemap-page' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Refund Policy', href: '/refund-policy' },
      { label: 'Return Policy', href: '/return-policy' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Cookie Policy', href: '/legal/cookies' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12 rounded-3xl border p-6 sm:p-8" style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.06))' }}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Built for disciplined growth</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white">Run your content operation from one premium workflow.</h2>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">Plan, publish, measure, and refine without stitching together multiple tools.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="btn btn-primary">Start free</Link>
              <Link href="/pricing" className="btn btn-secondary">View pricing</Link>
            </div>
          </div>
        </div>

        {/* Logo + tagline */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Z</div>
            <span className="text-xl font-extrabold gradient-text">Zynovexa</span>
          </Link>
          <p className="text-slate-500 text-sm max-w-sm">The all-in-one AI social media platform for creators and businesses. Schedule, create, and grow — all in one place.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="dashboard-inline-stat px-3 py-1.5">50K+ creators</span>
            <span className="dashboard-inline-stat px-3 py-1.5">7 social platforms</span>
            <span className="dashboard-inline-stat px-3 py-1.5">AI + analytics + publishing</span>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-8 mb-12">
          {FOOTER_COLS.map(col => (
            <div
              key={col.heading}
              className={col.heading === 'Legal' ? 'rounded-xl p-3 border dashboard-surface-muted' : undefined}
              style={col.heading === 'Legal' ? { borderColor: 'var(--border)' } : undefined}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
                {col.heading}
                {col.heading === 'Legal' && (
                  <span className="ml-2 align-middle text-[10px] px-1.5 py-0.5 rounded-md border border-purple-400/40 text-purple-300">
                    Trusted
                  </span>
                )}
              </p>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Zynovexa. Built for creators, by creators. 🚀</p>
          <div className="flex items-center gap-4">
            <a href="https://twitter.com/zynovexa" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://instagram.com/zynovexa" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://youtube.com/@zynovexa" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://linkedin.com/company/zynovexa" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
