import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Team Collaboration — Social Media Approval Workflows | Zynovexa',
  description: 'Invite your team, set approval workflows, manage permissions, and collaborate on social media content without the chaos. Built for agencies and growing brands.',
  alternates: { canonical: 'https://zynovexa.com/features/collaborate' },
};

const FEATURES = [
  { icon: '👥', title: 'Unlimited Team Members', desc: 'Invite designers, writers, and managers. No per-seat limits on Business plans.', href: '/pricing', cta: 'View team plans' },
  { icon: '✅', title: 'Approval Workflows', desc: 'Set up multi-step approval chains. Content goes live only after designated approvers sign off.', href: '#approval-workflow', cta: 'Jump to workflow' },
  { icon: '💬', title: 'Inline Comments', desc: 'Leave contextual feedback directly on posts. Thread conversations to keep feedback organized.', href: '#feedback-collaboration', cta: 'Jump to feedback flow' },
  { icon: '🔐', title: 'Role-Based Permissions', desc: 'Admin, Manager, Creator, and Read-Only roles with granular channel-level access control.', href: '#permissions-control', cta: 'See permissions detail' },
  { icon: '📋', title: 'Content Drafts', desc: 'Writers submit drafts, reviewers comment, editors polish, managers approve — all in one place.', href: '/features/create', cta: 'Open creation workflow' },
  { icon: '📊', title: 'Team Analytics', desc: 'See content volume, publishing frequency, and performance per team member.', href: '/features/analyze', cta: 'Open analytics' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Email and in-app alerts for approvals needed, comments, and scheduled post confirmations.', href: '#notifications-alerts', cta: 'See notification logic' },
  { icon: '📜', title: 'Audit Log', desc: 'Full history of every edit, approval, and publish action for compliance and accountability.', href: '#audit-history', cta: 'See audit trail value' },
];

const WORKFLOW_STEPS = [
  { icon: '✍️', step: 'Create', desc: 'Writer drafts the post', href: '/features/create' },
  { icon: '💬', step: 'Review', desc: 'Team adds feedback', href: '#feedback-collaboration' },
  { icon: '✅', step: 'Approve', desc: 'Manager approves', href: '#approval-workflow' },
  { icon: '🚀', step: 'Publish', desc: 'Auto-published on schedule', href: '/features/publish' },
];

const COLLAB_DETAILS = [
  { id: 'approval-workflow', title: 'Approval workflow', desc: 'Approvals remove ambiguity. Teams know who owns sign-off, what is blocked, and what is ready to publish next.' },
  { id: 'feedback-collaboration', title: 'Feedback and collaboration', desc: 'Inline comments keep context attached to the content asset, which reduces revision chaos and long message chains.' },
  { id: 'permissions-control', title: 'Permissions and access control', desc: 'Granular access helps agencies, brands, and growing teams protect channels while still moving quickly.' },
  { id: 'notifications-alerts', title: 'Notifications and alerts', desc: 'Useful alerts reduce missed approvals and make sure manual steps do not stall the publishing pipeline.' },
  { id: 'audit-history', title: 'Audit history', desc: 'Accountability matters when multiple people touch campaigns. Audit visibility helps compliance, clarity, and trust.' },
];

const HERO_STATS = [
  { icon: '👥', title: 'Shared workspace', desc: 'Writers, designers, managers, and clients work from one system.' },
  { icon: '✅', title: 'Approval-ready flow', desc: 'Draft, review, approve, and publish without losing context.' },
  { icon: '🔐', title: 'Controlled access', desc: 'Roles, permissions, audit history, and clear ownership at every step.' },
];

const SEO_SECTIONS = [
  {
    title: 'Why social media teams need structured collaboration',
    paragraphs: [
      'Most social media teams do not fail because they lack creative ideas. They fail because the workflow between ideation, drafting, reviewing, and publishing is broken. Posts sit in email threads waiting for feedback, approvals happen in Slack messages that get buried, and nobody is sure which version is final. That chaos becomes expensive fast — missed deadlines, duplicate work, off-brand posts going live, and frustrated team members.',
      'Zynovexa solves this by giving every team member a clear role in a visible workflow. Writers submit drafts. Reviewers leave inline feedback. Managers approve with one click. Approved content auto-publishes on schedule. Everyone sees the same dashboard, the same status, and the same timeline. For agencies managing multiple brands and growing teams adding new creators, this kind of structure is the difference between scaling smoothly and drowning in coordination overhead.',
    ],
  },
  {
    title: 'How approval workflows prevent costly publishing mistakes',
    paragraphs: [
      'A single off-brand post can cost a company weeks of reputation recovery. Multi-step approval workflows eliminate that risk by making sure every piece of content passes through the right eyes before it goes live. This is especially critical for regulated industries, franchise operations, agencies handling enterprise clients, and any brand where consistency is non-negotiable.',
      'Zynovexa lets you design custom approval chains — from simple creator-then-manager flows to complex multi-stakeholder review cycles. Each step is tracked in the audit log, notifications remind approvers before deadlines, and content cannot be published until all required sign-offs are complete. This does not slow teams down; it actually speeds them up because it removes ambiguity about who owns the next step and what "ready to publish" actually means.',
    ],
  },
  {
    title: 'From content chaos to content operations',
    paragraphs: [
      'Content operations (ContentOps) is the emerging discipline of treating content like a managed product pipeline instead of an ad-hoc creative exercise. High-performing teams use ContentOps principles to standardize naming conventions, approval thresholds, publishing cadences, and performance reviews. Zynovexa provides the operational layer that makes this practical: role-based permissions control who can edit and publish, audit logs provide accountability, and team analytics reveal bottlenecks.',
      'When your collaboration tool also connects to content creation, scheduling, analytics, and AI assistance, you gain a closed-loop system. Insights from the analytics dashboard inform the next content brief, AI assists in drafting, the team reviews and polishes, and the scheduler ensures timely delivery. That end-to-end visibility is what separates teams that post reactively from teams that execute a repeatable content strategy.',
    ],
  },
];

const FAQS = [
  {
    q: 'How many team members can I invite to Zynovexa?',
    a: 'It depends on your plan. Free plans include limited seats, Pro plans add more, and Business plans offer unlimited team members. Every plan includes the core approval workflow and collaboration features.',
  },
  {
    q: 'Can I set different permission levels for different team members?',
    a: 'Yes. Zynovexa supports Admin, Manager, Creator, and Read-Only roles with channel-level granularity. For example, a designer can be a Creator on Instagram but Read-Only on LinkedIn, while a social media manager has full access across all channels.',
  },
  {
    q: 'Is there an audit log for compliance purposes?',
    a: 'Yes. Every edit, comment, approval, status change, and publish event is recorded in a timestamped audit log. This is designed for teams in regulated industries, agencies with enterprise clients, and any organization that needs accountability and transparency.',
  },
];

export default function CollaborateFeaturePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative">
        <div className="orb orb-purple w-96 h-96 -top-20 -right-20 opacity-20 hidden lg:block" />
        <div className="orb orb-blue w-72 h-72 top-8 -left-14 opacity-15 hidden lg:block" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 badge badge-purple mb-6 text-sm px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Team Collaboration
          </div>
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
          <div className="hero-panel mt-10 grid gap-3 p-4 sm:grid-cols-3 sm:p-5 text-left">
            {HERO_STATS.map(stat => (
              <div key={stat.title} className="hero-stat-chip">
                <span className="text-xl shrink-0">{stat.icon}</span>
                <div>
                  <strong>{stat.title}</strong>
                  <span>{stat.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow diagram */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-12">Content approval in 4 steps</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {WORKFLOW_STEPS.map((s, i) => (
              <div key={s.step} className="flex items-center gap-4 flex-1">
                <Link href={s.href} className="card p-5 text-center flex-1 card-hover interactive-card-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <p className="text-white font-semibold">{s.step}</p>
                  <p className="text-slate-400 text-xs mt-1">{s.desc}</p>
                  <span className="inline-block mt-2 text-xs text-slate-500">{s.href.startsWith('#') ? '↓ this page' : '→ details'}</span>
                </Link>
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
              <Link key={f.title} href={f.href} className="card card-hover interactive-card-link p-5 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold mb-1.5">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
                <div className="interactive-card-cta">
                  <span className="interactive-card-label">{f.cta}</span>
                  <span className="interactive-card-arrow">{f.href.startsWith('#') ? '↓' : '→'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {COLLAB_DETAILS.map(item => (
            <article key={item.id} id={item.id} className="card p-6 scroll-mt-28">
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-7 text-sm sm:text-base">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-blue mb-4 inline-flex">SEO Content</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Team collaboration that actually scales</h2>
            <p className="text-slate-400 max-w-3xl mx-auto">Real-world insight into why structured collaboration matters for content teams, agencies, and growing brands.</p>
          </div>
          <div className="space-y-6">
            {SEO_SECTIONS.map(section => (
              <article key={section.title} className="card p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
                <div className="space-y-4 text-sm sm:text-base leading-8 text-slate-300">
                  {section.paragraphs.map(paragraph => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + Sidebar */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="card p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">Frequently asked questions about team collaboration</h2>
            <div className="space-y-5">
              {FAQS.map(item => (
                <div key={item.q} className="border-b border-white/8 pb-5 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-white mb-2">{item.q}</h3>
                  <p className="text-slate-400 leading-7 text-sm sm:text-base">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4">Explore related pages</h2>
            <div className="space-y-3 text-sm">
              <Link href="/features/create" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 hover:text-white hover:border-white/20 transition-colors">Content Creation <span>→</span></Link>
              <Link href="/features/publish" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 hover:text-white hover:border-white/20 transition-colors">Publish & Schedule <span>→</span></Link>
              <Link href="/features/analyze" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 hover:text-white hover:border-white/20 transition-colors">Analytics Dashboard <span>→</span></Link>
              <Link href="/features/ai-assistant" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300 hover:text-white hover:border-white/20 transition-colors">AI Assistant <span>→</span></Link>
            </div>
          </aside>
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
