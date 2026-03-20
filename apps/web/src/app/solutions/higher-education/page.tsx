import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Zynovexa for Higher Education — Social Media for Universities',
  description: 'Social media management platform built for universities, colleges, and educational institutions. Team collaboration, compliance tools, and brand consistency at scale.',
  alternates: { canonical: 'https://zynovexa.com/solutions/higher-education' },
};

export default function HigherEducationPage() {
  return (
    <MarketingLayout>
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-purple w-96 h-96 -top-20 -left-10 opacity-20 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative marketing-hero-panel">
          <span className="badge badge-purple mb-6 inline-block">🎓 For Higher Education</span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight text-white">
            Social media for<br /><span className="gradient-text">every department.</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Manage social media accounts across your entire institution from one central platform. Maintain brand consistency while giving departments the autonomy they need.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8 text-xs sm:text-sm">
            <span className="marketing-logo-pill">Governance across every department</span>
            <span className="marketing-logo-pill">Approval trails for sensitive messaging</span>
            <span className="marketing-logo-pill">Enrollment and community storytelling</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">🚀 Request a Demo</Link>
            <a href="mailto:edu@zynovexa.com" className="btn btn-secondary btn-xl">Contact Us</a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto marketing-grid-shell grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: '🏛️', title: 'Institution-Wide Governance', desc: 'Central admin controls across all departments. Enforce brand guidelines with content templates and locked fields.' },
            { icon: '✅', title: 'Compliance Workflows', desc: 'Multi-level approval chains ensure sensitive content is reviewed by legal, communications, and leadership.' },
            { icon: '👨‍🎓', title: 'Department Workspaces', desc: "Each department gets its own workspace. Marketing, Admissions, Athletics, Research — all connected, never confused." },
            { icon: '📊', title: 'Institutional Analytics', desc: 'Aggregate analytics across all accounts. See engagement, reach, and follower growth institution-wide.' },
            { icon: '🔒', title: 'SSO & Security', desc: 'Single Sign-On (SSO) integration with your institution\'s identity provider. FERPA and GDPR compliant.' },
            { icon: '🎓', title: 'Student Accounts', desc: 'Onboard student marketers and journalists with appropriate permissions. Train the next generation of communicators.' },
          ].map(f => (
            <div key={f.title} className="card card-hover marketing-metric-card premium-tilt-card p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center marketing-callout p-10">
          <h2 className="text-3xl font-extrabold text-white mb-4">Special pricing for education</h2>
          <p className="text-slate-400 mb-6">We offer discounted plans for qualifying educational institutions. Get in touch with our education team.</p>
          <a href="mailto:edu@zynovexa.com" className="btn btn-primary btn-xl inline-flex">Contact Education Team →</a>
        </div>
      </section>
    </MarketingLayout>
  );
}
