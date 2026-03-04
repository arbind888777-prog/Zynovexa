import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Team Collaboration — Social Media Approval Workflows | Zynovexa',
  description: 'Invite your team, set approval workflows, manage permissions, and collaborate on social media content without the chaos. Built for agencies and growing brands.',
  alternates: { canonical: 'https://zynovexa.com/features/collaborate' },
};

const FEATURES = [
  { icon: '👥', title: 'Unlimited Team Members', desc: 'Invite designers, writers, and managers. No per-seat limits on Business plans.' },
  { icon: '✅', title: 'Approval Workflows', desc: 'Set up multi-step approval chains. Content goes live only after designated approvers sign off.' },
  { icon: '💬', title: 'Inline Comments', desc: 'Leave contextual feedback directly on posts. Thread conversations to keep feedback organized.' },
  { icon: '🔐', title: 'Role-Based Permissions', desc: 'Admin, Manager, Creator, and Read-Only roles with granular channel-level access control.' },
  { icon: '📋', title: 'Content Drafts', desc: 'Writers submit drafts, reviewers comment, editors polish, managers approve — all in one place.' },
  { icon: '📊', title: 'Team Analytics', desc: 'See content volume, publishing frequency, and performance per team member.' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Email and in-app alerts for approvals needed, comments, and scheduled post confirmations.' },
  { icon: '📜', title: 'Audit Log', desc: 'Full history of every edit, approval, and publish action for compliance and accountability.' },
];

export default function CollaborateFeaturePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-purple w-96 h-96 -top-20 -right-20 opacity-20 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative">
          <span className="badge badge-purple mb-6 inline-block">🤝 Team Collaboration</span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight text-white">
            Your team. One workspace.<br /><span className="gradient-text">Zero chaos.</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Content creation is a team sport. Zynovexa gives your whole team — writers, designers, managers, and clients — a seamless, approval-ready workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">🚀 Start Collaborating Free</Link>
            <Link href="/solutions/agencies" className="btn btn-secondary btn-xl">For Agencies →</Link>
          </div>
        </div>
      </section>

      {/* Workflow diagram */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-12">Content approval in 4 steps</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {[
              { icon: '✍️', step: 'Create', desc: 'Writer drafts the post' },
              { icon: '💬', step: 'Review', desc: 'Team adds feedback' },
              { icon: '✅', step: 'Approve', desc: 'Manager approves' },
              { icon: '🚀', step: 'Publish', desc: 'Auto-published on schedule' },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-4 flex-1">
                <div className="card p-5 text-center flex-1">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <p className="text-white font-semibold">{s.step}</p>
                  <p className="text-slate-400 text-xs mt-1">{s.desc}</p>
                </div>
                {i < 3 && <span className="text-slate-600 text-2xl hidden md:block">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Built for modern teams</h2>
            <p className="text-slate-400">Whether you're a team of 2 or 200, Zynovexa scales with you.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="card card-hover p-5">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold mb-1.5">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.08))', border: '1px solid rgba(16,185,129,0.2)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Invite your whole team today</h2>
          <p className="text-slate-400 mb-6">Collaboration features included on all plans. Business plan gets unlimited seats.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">Start Free Trial →</Link>
            <Link href="/pricing" className="btn btn-secondary btn-xl">Compare Plans</Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
