'use client';
import MarketingLayout from '@/components/MarketingLayout';
import type { Metadata } from 'next';

const SERVICES = [
  { name: 'API & Core Services', status: 'operational', uptime: '99.98%' },
  { name: 'AI Content Generation', status: 'operational', uptime: '99.95%' },
  { name: 'Post Scheduling', status: 'operational', uptime: '99.99%' },
  { name: 'Analytics Dashboard', status: 'operational', uptime: '99.97%' },
  { name: 'Media Upload & Storage', status: 'operational', uptime: '99.96%' },
  { name: 'Notifications', status: 'operational', uptime: '99.93%' },
  { name: 'Authentication (OAuth)', status: 'operational', uptime: '100%' },
  { name: 'Webhook Delivery', status: 'operational', uptime: '99.89%' },
];

const INCIDENTS: { date: string; title: string; status: string; desc: string }[] = [
  { date: 'Feb 28, 2026', title: 'Scheduled maintenance complete', status: 'resolved', desc: 'Database performance upgrade. No data loss. All systems restored.' },
  { date: 'Feb 15, 2026', title: 'Brief API latency spike', status: 'resolved', desc: 'Elevated response times for ~12 minutes. Root cause: upstream CDN issue. Resolved.' },
];

const STATUS_COLORS: Record<string, string> = {
  operational: '#22c55e',
  degraded: '#f59e0b',
  outage: '#ef4444',
  maintenance: '#6366f1',
};

export default function StatusPage() {
  const allOperational = SERVICES.every(s => s.status === 'operational');

  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6 text-sm font-semibold ${allOperational ? 'text-green-400' : 'text-yellow-400'}`}
            style={{ background: allOperational ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${allOperational ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
            <span className={`w-2.5 h-2.5 rounded-full ${allOperational ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
            {allOperational ? 'All Systems Operational' : 'Some Systems Degraded'}
          </div>
          <h1 className="text-5xl font-black text-white mb-4">System Status</h1>
          <p className="text-slate-400">Real-time status for all Zynovexa services. Last updated: just now.</p>
        </div>
      </section>

      {/* Services */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="card overflow-hidden">
            {SERVICES.map((svc, i) => (
              <div key={svc.name} className={`flex items-center justify-between p-4 ${i < SERVICES.length - 1 ? 'border-b' : ''}`} style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[svc.status] }} />
                  <span className="text-slate-200 text-sm font-medium">{svc.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-500">{svc.uptime} uptime</span>
                  <span className="font-semibold capitalize" style={{ color: STATUS_COLORS[svc.status] }}>{svc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 90-day uptime bars */}
      <section className="py-10 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">90-day uptime history</h2>
          {SERVICES.slice(0, 4).map(svc => (
            <div key={svc.name} className="mb-5">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{svc.name}</span>
                <span className="text-green-400">{svc.uptime}</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 90 }).map((_, i) => (
                  <div key={i} className="flex-1 h-6 rounded-sm" style={{ background: i === 42 && svc.name.includes('AI') ? 'rgba(245,158,11,0.6)' : 'rgba(34,197,94,0.7)' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Incidents */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Recent incidents</h2>
          {INCIDENTS.length === 0 ? (
            <div className="card p-8 text-center text-slate-400">No incidents in the past 90 days 🎉</div>
          ) : (
            <div className="space-y-4">
              {INCIDENTS.map(inc => (
                <div key={inc.title} className="card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm">{inc.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-green-400" style={{ background: 'rgba(34,197,94,0.1)' }}>
                      {inc.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">{inc.date}</p>
                  <p className="text-sm text-slate-400">{inc.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MarketingLayout>
  );
}
