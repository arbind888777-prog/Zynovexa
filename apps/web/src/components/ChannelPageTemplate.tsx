import Link from 'next/link';
import MarketingLayout from './MarketingLayout';

type Feature = { icon: string; title: string; desc: string };
type Stat = [string, string];

interface ChannelPageProps {
  icon: string;
  platform: string;
  tagline: string;
  description: string;
  color: string;
  features: Feature[];
  stats: Stat[];
  tips: string[];
}

export default function ChannelPageTemplate({
  icon, platform, tagline, description, color, features, stats, tips,
}: ChannelPageProps) {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(ellipse at 50% 0%, ${color} 0%, transparent 60%)` }} />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-6xl sm:text-7xl mb-6">{icon}</div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight text-white">
            Zynovexa for<br /><span className="gradient-text">{platform}</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mb-4 font-semibold">{tagline}</p>
          <p className="text-slate-500 text-base mb-8 max-w-2xl mx-auto">{description}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-xl">🚀 Get Started Free</Link>
            <Link href="/features/publish" className="btn btn-secondary btn-xl">See All Features</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(([v, l]) => (
            <div key={l} className="card text-center p-5 card-hover">
              <div className="text-xl font-black text-white mb-1">{v}</div>
              <div className="text-xs text-slate-400">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-12">
            Everything you need for {platform}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <div key={f.title} className="card card-hover p-6">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro tips */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 sm:p-10" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.04)' }}>
            <h2 className="text-2xl font-extrabold text-white mb-6">🧠 AI-powered {platform} growth tips</h2>
            <ul className="space-y-4">
              {tips.map(tip => (
                <li key={tip} className="flex items-start gap-3">
                  <span className="text-purple-400 mt-0.5 shrink-0">→</span>
                  <span className="text-slate-300 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card p-10" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <h2 className="text-3xl font-extrabold text-white mb-4">Start growing on {platform} today</h2>
          <p className="text-slate-400 mb-6">Connect your {platform} account free. No credit card required.</p>
          <Link href="/signup" className="btn btn-primary btn-xl inline-flex">Connect {platform} Free →</Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
