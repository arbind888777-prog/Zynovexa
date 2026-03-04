import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Zynovexa for Agencies — Manage Unlimited Clients at Scale',
  description: 'Manage social media for dozens of clients from one dashboard. Client workspaces, approval workflows, white-label reports, and team collaboration. Built for agencies.',
  alternates: { canonical: 'https://zynovexa.com/solutions/agencies' },
};

export default function AgenciesPage() {
  return (
    <MarketingLayout>
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-blue w-96 h-96 -top-20 -right-10 opacity-20 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative">
          <span className="badge badge-purple mb-6 inline-block">🏆 For Agencies</span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight text-white">
            Scale your agency.<br /><span className="gradient-text">Impress every client.</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Manage unlimited client accounts, streamline approvals, and deliver exceptional results — all from one powerful platform built for agency workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">🚀 Start Agency Trial</Link>
            <a href="mailto:agencies@zynovexa.com" className="btn btn-secondary btn-xl">Talk to Sales</a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-12">Built for agency-scale operations</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🏢', title: 'Client Workspaces', desc: 'Separate, branded workspaces for each client. Grant clients view-only or approval access to their own content.' },
              { icon: '✅', title: 'Client Approval Portals', desc: 'Clients review and approve content in a clean, distraction-free portal without seeing your team tools.' },
              { icon: '📊', title: 'White-Label Reports', desc: 'Branded PDF and live performance reports to impress clients and justify your retainer fees.' },
              { icon: '⚡', title: 'Bulk AI Content', desc: 'Generate 30 posts per client in minutes with AI. Assign brand voices per client for consistent output.' },
              { icon: '👥', title: 'Team Management', desc: 'Assign team members to specific clients. Set permissions so no one sees accounts they shouldn\'t.' },
              { icon: '🔌', title: 'API Access', desc: 'Full REST API for custom integrations, automated reporting, and connecting your existing agency stack.' },
            ].map(f => (
              <div key={f.title} className="card card-hover p-6">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing for agencies */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Designed for agencies. Priced for growth.</h2>
          <p className="text-slate-400 mb-8">Business plan includes all agency features. Need custom pricing for 20+ clients? Contact us.</p>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="card p-7">
              <h3 className="text-white font-bold text-xl mb-2">Business</h3>
              <p className="text-4xl font-black text-white mb-1">$79<span className="text-slate-400 text-lg font-normal">/mo</span></p>
              <p className="text-slate-400 text-sm mb-5">Up to 10 client accounts</p>
              <ul className="space-y-2 text-sm text-slate-300 mb-6">
                {['Unlimited AI credits','Client workspaces','Approval workflows','White-label reports','API access','Team management'].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-green-400">✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/signup" className="btn btn-primary w-full justify-center">Start Business Trial</Link>
            </div>
            <div className="card p-7" style={{ border: '1px solid rgba(99,102,241,0.4)' }}>
              <h3 className="text-white font-bold text-xl mb-2">Enterprise</h3>
              <p className="text-4xl font-black text-white mb-1">Custom</p>
              <p className="text-slate-400 text-sm mb-5">Unlimited clients, custom needs</p>
              <ul className="space-y-2 text-sm text-slate-300 mb-6">
                {['Everything in Business','Unlimited client accounts','Dedicated account manager','Custom integrations','SLA & compliance','Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-purple-400">✓</span>{f}</li>
                ))}
              </ul>
              <a href="mailto:agencies@zynovexa.com" className="btn btn-secondary w-full justify-center">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
