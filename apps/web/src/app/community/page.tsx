import MarketingLayout from '@/components/MarketingLayout';
import EventRegisterButton from '@/components/EventRegisterButton';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Community | Zynovexa',
  description: 'Join the Zynovexa creator community. Share tips, get help, find collaboration partners, and grow together with 50,000+ creators.',
};

const CHANNELS = [
  { icon: '💬', name: 'Discord Server', desc: '12,000+ members. Daily discussions, tips, and support.', cta: 'Join Discord', href: 'https://discord.gg/zynovexa', color: '#5865F2' },
  { icon: '📘', name: 'Facebook Group', desc: 'Private Facebook group for Zynovexa users. Share wins and get feedback.', cta: 'Join Group', href: 'https://facebook.com/groups/zynovexa', color: '#1877F2' },
  { icon: '🐦', name: 'Twitter Community', desc: 'Follow @ZynovexaHQ and join the #CreatorTalk conversation.', cta: 'Follow Us', href: 'https://twitter.com/zynovexa', color: '#1D9BF0' },
  { icon: '▶️', name: 'YouTube Channel', desc: 'Tutorials, creator interviews, and strategy breakdowns every week.', cta: 'Subscribe', href: 'https://youtube.com/@zynovexa', color: '#FF0000' },
];

const FEATURED_CREATORS = [
  { name: 'Priya Sharma', handle: '@priyacreates', platform: 'YouTube', followers: '850K', niche: 'Finance' },
  { name: 'Marcus Webb', handle: '@marcuswebb', platform: 'Instagram', followers: '420K', niche: 'Fitness' },
  { name: 'Ananya Rao', handle: '@ananyarao', platform: 'Instagram', followers: '1.2M', niche: 'Food' },
  { name: 'Jay Patel', handle: '@jaypateltech', platform: 'LinkedIn', followers: '180K', niche: 'Tech' },
  { name: 'Sofia Chen', handle: '@sofiastyle', platform: 'Instagram', followers: '300K', niche: 'Fashion' },
  { name: 'Ravi Kumar', handle: '@ravidigital', platform: 'YouTube', followers: '650K', niche: 'Gaming' },
];

const EVENTS = [
  { title: 'Creator Masterclass: AI Content Strategy', date: 'Mar 15, 2026', type: 'Webinar', free: true },
  { title: 'Monthly Creator Meetup — Mumbai', date: 'Mar 22, 2026', type: 'In-person', free: true },
  { title: 'How to Hit 100K Subscribers Faster', date: 'Apr 2, 2026', type: 'Live Stream', free: true },
  { title: 'Advanced Analytics Workshop', date: 'Apr 10, 2026', type: 'Workshop', free: false },
];

export default function CommunityPage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-pink w-[600px] h-[600px] -top-60 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">🌍 Community</span>
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-none mb-6">
            Grow together with<br /><span className="gradient-text">50,000+ creators</span>
          </h1>
          <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
            The Zynovexa community is your tribe. Share wins, get feedback, find collaborators, and learn from the best.
          </p>
          <Link href="https://discord.gg/zynovexa" target="_blank" className="btn btn-primary btn-xl">Join Our Discord →</Link>
        </div>
      </section>

      {/* Community channels */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">Find your people</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CHANNELS.map(ch => (
              <Link key={ch.name} href={ch.href} target="_blank"
                className="card card-hover p-6 flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: `${ch.color}20`, border: `1px solid ${ch.color}40` }}>
                  {ch.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">{ch.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{ch.desc}</p>
                  <span className="text-sm font-semibold mt-3 inline-block" style={{ color: ch.color }}>{ch.cta} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured creators */}
      <section className="py-20 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-4">Featured community creators</h2>
          <p className="text-slate-400 text-center mb-12">Real people, real growth. Meet some of our top community members.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FEATURED_CREATORS.map(c => (
              <div key={c.name} className="card p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mx-auto mb-3 flex items-center justify-center text-white font-black text-lg">
                  {c.name[0]}
                </div>
                <p className="text-white font-bold text-sm">{c.name}</p>
                <p className="text-slate-500 text-xs">{c.handle}</p>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}>{c.platform}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc' }}>{c.followers}</span>
                </div>
                <p className="text-xs text-slate-600 mt-2">{c.niche}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">Upcoming events</h2>
          <div className="space-y-4">
            {EVENTS.map(ev => (
              <div key={ev.title} className="card card-hover p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center text-center shrink-0"
                    style={{ background: 'rgba(99,102,241,0.15)' }}>
                    <span className="text-indigo-300 font-bold text-xs">{ev.date.split(' ')[0]}</span>
                    <span className="text-white font-black text-lg">{ev.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{ev.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs text-slate-500">{ev.type}</span>
                      {ev.free && <span className="text-xs text-green-400">Free</span>}
                    </div>
                  </div>
                </div>
                <EventRegisterButton title={ev.title} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
