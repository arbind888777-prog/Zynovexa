import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers at Zynovexa | Join Our Team',
  description: 'Join Zynovexa and help build the future of AI-powered social media. We\'re a remote-first team on a mission to empower 1 million creators.',
};

const VALUES = [
  { icon: '🚀', title: 'Move Fast', desc: 'We ship every week. If you love seeing your work in production quickly, you\'ll thrive here.' },
  { icon: '🌍', title: 'Remote First', desc: 'Work from anywhere. Our team is spread across 12 countries and 4 continents.' },
  { icon: '📈', title: 'Grow Together', desc: '$2,000 annual learning budget. Weekly knowledge shares. We invest in your growth.' },
  { icon: '❤️', title: 'Creator Obsessed', desc: 'We are creators ourselves. We build with empathy for our users every single day.' },
];

const BENEFITS = [
  '🏠 Work from anywhere in the world',
  '💰 Competitive salary + equity package',
  '🏥 Full health, dental, and vision coverage',
  '📚 $2,000 annual learning & development budget',
  '🖥️ $1,500 home office setup stipend',
  '✈️ 2× yearly team retreats',
  '🛌 Unlimited PTO + 15 holidays',
  '👶 Generous parental leave (20 weeks)',
];

const JOBS = [
  { title: 'Senior Full-Stack Engineer', team: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'AI/ML Engineer', team: 'AI Team', location: 'Remote', type: 'Full-time' },
  { title: 'Product Designer (UI/UX)', team: 'Design', location: 'Remote', type: 'Full-time' },
  { title: 'Growth Marketing Manager', team: 'Marketing', location: 'Remote', type: 'Full-time' },
  { title: 'Customer Success Manager', team: 'Support', location: 'Remote', type: 'Full-time' },
  { title: 'Content Marketing Lead', team: 'Marketing', location: 'Remote', type: 'Full-time' },
];

export default function CareersPage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">We're Hiring 🎉</span>
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-none mb-6">
            Build the future<br />of <span className="gradient-text">social media</span>
          </h1>
          <p className="text-slate-400 text-xl mb-8 max-w-2xl mx-auto">
            We're a small, mighty team on a mission to empower 1 million creators. If you love product, AI, and creators — come work with us.
          </p>
          <Link href="#open-roles" className="btn btn-primary btn-xl">See Open Roles</Link>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">Our values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="card p-6 flex gap-4">
                <span className="text-3xl shrink-0">{v.icon}</span>
                <div>
                  <h3 className="font-bold text-white mb-1">{v.title}</h3>
                  <p className="text-sm text-slate-400">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">Benefits & perks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BENEFITS.map(b => (
              <div key={b} className="card p-4 text-sm text-slate-300">{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section id="open-roles" className="py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-4">Open positions</h2>
          <p className="text-slate-400 text-center mb-12">{JOBS.length} open roles • Remote worldwide</p>
          <div className="space-y-3">
            {JOBS.map(job => (
              <div key={job.title} className="card card-hover p-5 flex items-center justify-between gap-4 group">
                <div>
                  <h3 className="font-bold text-white">{job.title}</h3>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-slate-500">{job.team}</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-500">{job.location}</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-500">{job.type}</span>
                  </div>
                </div>
                <span className="text-purple-400 text-lg group-hover:translate-x-1 transition-transform shrink-0">Apply →</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-slate-400 text-sm mb-4">Don't see your role? We're always looking for exceptional people.</p>
            <Link href="mailto:careers@zynovexa.com" className="btn btn-secondary">Send us your resume</Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
