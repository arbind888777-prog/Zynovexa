import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zynovexa for Nonprofits | Social Media Management for NGOs',
  description: 'Powerful social media tools built for nonprofits. Tell your story, fundraise, and grow your mission with Zynovexa\'s discounted nonprofit plan.',
};

const FEATURES = [
  { icon: '❤️', title: 'Mission-Driven Content', desc: 'AI trained to write inspirational, donor-friendly content that drives action and shares.' },
  { icon: '💰', title: 'Fundraising Campaigns', desc: 'Plan, schedule, and track donation-drive campaigns across all your social channels.' },
  { icon: '👥', title: 'Volunteer Recruitment', desc: 'Create compelling calls-to-action that attract volunteers and community members.' },
  { icon: '📊', title: 'Impact Reporting', desc: 'Show donors exactly how their contributions help with visual analytics and reports.' },
  { icon: '🤝', title: 'Partner Collaboration', desc: 'Multi-user access for your entire team and board members with role-based permissions.' },
  { icon: '🌍', title: '50% Nonprofit Discount', desc: 'Verified nonprofits get 50% off all paid plans. Because your mission matters.' },
];

const ORGS = ['Red Cross', 'UNICEF', 'WWF', 'Doctors Without Borders', 'Amnesty International', 'Habitat for Humanity'];

export default function NonprofitsPage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-pink w-[500px] h-[500px] -top-40 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">❤️ For Nonprofits</span>
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-none mb-6">
            Amplify your<br /><span className="gradient-text">mission</span>
          </h1>
          <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
            Zynovexa helps nonprofits, NGOs, and charities grow their online presence, engage supporters, and drive real-world impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">Apply for Nonprofit Plan</Link>
            <Link href="/pricing" className="btn btn-secondary btn-xl">See Nonprofit Pricing</Link>
          </div>
        </div>
      </section>

      {/* Trust logos */}
      <section className="py-10 px-4 sm:px-6 border-y" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-600 mb-6">Trusted by nonprofits worldwide</p>
          <div className="flex flex-wrap justify-center gap-6">
            {ORGS.map(org => (
              <span key={org} className="text-slate-500 text-sm font-medium px-4 py-2 rounded-lg" style={{ background: 'var(--bg2)' }}>{org}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-3">Tools built for your mission</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card card-hover p-6">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nonprofit discount highlight */}
      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-10">
            <div className="text-5xl mb-4">🌍</div>
            <h2 className="text-3xl font-black text-white mb-3">50% off for verified nonprofits</h2>
            <p className="text-slate-400 mb-6">We believe technology should be accessible to organizations doing good in the world. Apply with your EIN or charity registration number.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="btn btn-primary">Apply Now</Link>
              <Link href="/contact" className="btn btn-secondary">Contact Our Team</Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
