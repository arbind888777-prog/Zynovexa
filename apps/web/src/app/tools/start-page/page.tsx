import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Start Page — Beautiful Link-in-Bio for Creators | Zynovexa',
  description: 'Create a stunning link-in-bio page with Zynovexa Start Page. Custom domain, analytics, 50+ themes, and seamless integration with your social media scheduling.',
  alternates: { canonical: 'https://zynovexa.com/tools/start-page' },
};

const FEATURES = [
  { icon: '🎨', title: '50+ Beautiful Themes', desc: 'Dark, colorful, minimal, gradient — pick a theme that matches your brand perfectly.' },
  { icon: '🔗', title: 'Unlimited Links', desc: 'Add links to YouTube videos, merch stores, newsletters, podcasts, and anywhere else.' },
  { icon: '📊', title: 'Link Analytics', desc: 'See exactly how many people click each link. Optimize your bio for maximum conversions.' },
  { icon: '🌐', title: 'Custom Domain', desc: 'Use your own domain (like yourname.com) instead of a zynovexa.com/u/yourname URL.' },
  { icon: '📧', title: 'Email Capture', desc: 'Built-in email opt-in forms. Grow your list directly from your link-in-bio page.' },
  { icon: '🎬', title: 'Video Embed', desc: 'Embed your latest YouTube video directly on your Start Page. Always fresh.' },
];

export default function StartPageToolPage() {
  return (
    <MarketingLayout>
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-pink w-96 h-96 -top-20 -right-10 opacity-15 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative">
          <span className="badge badge-pink mb-6 inline-block">🔗 Start Page</span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight text-white">
            Your link-in-bio,<br /><span className="gradient-text">elevated.</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Replace boring link pages with a stunning, conversion-optimized Start Page. Drive traffic where it matters — and see exactly what works.
          </p>
          <Link href="/signup" className="btn btn-primary btn-xl inline-flex">🚀 Create Your Start Page</Link>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="card card-hover p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(168,85,247,0.08))', border: '1px solid rgba(236,72,153,0.2)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Included on all plans</h2>
          <p className="text-slate-400 mb-6">Start Page is included at no extra cost. Custom domain requires Pro or higher.</p>
          <Link href="/signup" className="btn btn-primary btn-xl inline-flex">Create Your Page Free →</Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
