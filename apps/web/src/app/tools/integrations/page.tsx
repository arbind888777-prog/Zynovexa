import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';
import IntegrationsFilter from '@/components/IntegrationsFilter';

export const metadata: Metadata = {
  title: 'Integrations — Connect Your Favorite Tools | Zynovexa',
  description: 'Connect Zynovexa with Canva, Zapier, Slack, Google Analytics, Shopify, and 50+ apps. Automate your workflow and power up your social media management.',
  alternates: { canonical: 'https://zynovexa.com/tools/integrations' },
};

const INTEGRATIONS = [
  { icon: '🎨', name: 'Canva', category: 'Design', desc: 'Import your Canva designs directly into Zynovexa composer.' },
  { icon: '⚡', name: 'Zapier', category: 'Automation', desc: 'Connect Zynovexa to 5,000+ apps via Zapier workflows.' },
  { icon: '💬', name: 'Slack', category: 'Communication', desc: 'Get posting notifications and team alerts in your Slack channels.' },
  { icon: '📊', name: 'Google Analytics', category: 'Analytics', desc: 'Track social media referral traffic in your GA4 dashboard.' },
  { icon: '🛒', name: 'Shopify', category: 'E-commerce', desc: 'Sync product data and track which posts drive sales.' },
  { icon: '📧', name: 'Mailchimp', category: 'Email', desc: 'Grow your email list from social media with embedded opt-ins.' },
  { icon: '🎵', name: 'Spotify', category: 'Music', desc: 'Share your podcast episodes and playlists with auto-formatting.' },
  { icon: '📝', name: 'Notion', category: 'Productivity', desc: 'Sync your content calendar to Notion for team planning.' },
  { icon: '🔔', name: 'Make (Integromat)', category: 'Automation', desc: 'Advanced workflow automations with Make scenarios.' },
  { icon: '📱', name: 'Google Drive', category: 'Storage', desc: 'Import media directly from Google Drive into your posts.' },
  { icon: '🌐', name: 'WordPress', category: 'CMS', desc: 'Auto-share blog posts to social media the moment they publish.' },
  { icon: '🎯', name: 'HubSpot', category: 'CRM', desc: 'Track social media leads in your HubSpot CRM pipeline.' },
];

const CATEGORIES = ['All', 'Design', 'Automation', 'Analytics', 'E-commerce', 'Communication', 'Productivity', 'CMS', 'Email'];

export default function IntegrationsPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 text-center relative">
        <div className="orb orb-blue w-96 h-96 -top-20 -left-10 opacity-15 hidden lg:block" />
        <div className="max-w-3xl mx-auto relative">
          <span className="badge badge-purple mb-6 inline-block">🔌 Integrations</span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 text-white">
            Connect <span className="gradient-text">everything</span> you use
          </h1>
          <p className="text-slate-400 text-lg mb-6">50+ integrations with design tools, automation platforms, analytics, and more. Zynovexa fits into your existing workflow.</p>
        </div>
      </section>

      <IntegrationsFilter categories={CATEGORIES} integrations={INTEGRATIONS} />

      {/* API section */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 sm:p-10" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">🔌 Build your own integration</h2>
                <p className="text-slate-400">Full REST API available on Business plan. Webhooks, OAuth, and detailed documentation included.</p>
              </div>
              <Link href="/pricing" className="btn btn-secondary shrink-0">View API Access →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Connect all your tools today</h2>
          <p className="text-slate-400 mb-6">Most integrations available on all plans. Advanced integrations require Pro or Business.</p>
          <Link href="/signup" className="btn btn-primary btn-xl inline-flex">Get Started Free →</Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
