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
      { label: 'TikTok', href: '/channels/tiktok' },
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
      { label: 'vs Buffer', href: '/compare#buffer' },
      { label: 'vs Hootsuite', href: '/compare#hootsuite' },
      { label: 'vs Later', href: '/compare#later' },
      { label: 'vs Sprout Social', href: '/compare#sprout' },
      { label: 'Request a Feature', href: '/request-feature' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Status', href: '/status' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Partner Program', href: '/partner-program' },
      { label: 'Legal', href: '/legal' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Sitemap', href: '/sitemap.xml' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Logo + tagline */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Z</div>
            <span className="text-xl font-extrabold gradient-text">Zynovexa</span>
          </Link>
          <p className="text-slate-500 text-sm max-w-sm">The all-in-one AI social media platform for creators and businesses. Schedule, create, and grow — all in one place.</p>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-8 mb-12">
          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>{col.heading}</p>
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
            <a href="https://twitter.com/zynovexa" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm">𝕏</a>
            <a href="https://instagram.com/zynovexa" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm">📸</a>
            <a href="https://youtube.com/@zynovexa" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm">▶️</a>
            <a href="https://linkedin.com/company/zynovexa" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm">💼</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
