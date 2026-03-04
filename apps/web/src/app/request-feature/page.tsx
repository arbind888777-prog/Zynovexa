'use client';
import MarketingLayout from '@/components/MarketingLayout';
import { useState } from 'react';
import { toast } from 'sonner';

const CATEGORIES = ['New Feature', 'Improvement', 'Integrations', 'Analytics', 'Mobile App', 'Other'];
const POPULAR = [
  { title: 'Pinterest & Snapchat support', votes: 847 },
  { title: 'Bulk post import via CSV', votes: 612 },
  { title: 'AI-powered best time to post', votes: 584 },
  { title: 'Reel & Short auto-captioning', votes: 521 },
  { title: 'Advanced audience demographics', votes: 488 },
  { title: 'iOS & Android mobile apps', votes: 463 },
];

export default function RequestFeaturePage() {
  const [form, setForm] = useState({ title: '', description: '', category: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [voted, setVoted] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category) return toast.error('Please fill in title and category.');
    setSubmitted(true);
    toast.success('Feature request submitted! We\'ll review it. 🙏');
  };

  const handleVote = (title: string) => {
    if (voted.includes(title)) return;
    setVoted(prev => [...prev, title]);
    toast.success('Vote recorded! ✅');
  };

  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="orb orb-purple w-[500px] h-[500px] -top-40 left-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="badge badge-purple mb-4 inline-block">💡 Feature Requests</span>
          <h1 className="text-5xl font-black text-white mb-4">Shape Zynovexa's Future</h1>
          <p className="text-slate-400 text-xl mb-2">Your ideas drive our roadmap. Vote on popular requests or submit your own.</p>
          <p className="text-slate-500 text-sm">We review every submission. Top voted features get built first.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Popular requests */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6">Most requested</h2>
          <div className="space-y-3">
            {POPULAR.map(item => {
              const hasVoted = voted.includes(item.title);
              return (
                <div key={item.title} className="card p-4 flex items-center gap-4">
                  <button onClick={() => handleVote(item.title)}
                    className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl shrink-0 transition-all ${hasVoted ? 'text-indigo-400' : 'text-slate-500 hover:text-white'}`}
                    style={{ background: hasVoted ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)' }}>
                    <span className="text-lg">{hasVoted ? '▲' : '△'}</span>
                    <span className="text-xs font-bold">{item.votes + (hasVoted ? 1 : 0)}</span>
                  </button>
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium text-sm">{item.title}</p>
                    {hasVoted && <p className="text-xs text-indigo-400 mt-0.5">You voted for this ✓</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit form */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6">Submit your idea</h2>
          {submitted ? (
            <div className="card p-10 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-white mb-2">Request submitted!</h3>
              <p className="text-slate-400 text-sm">Thank you! Our product team will review your idea. We respond to all submissions within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Feature Title *</label>
                <input type="text" placeholder="e.g. Pinterest scheduling support" value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="input-field w-full" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Category *</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="input-field w-full" required>
                  <option value="">Select a category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea rows={4} placeholder="Describe your feature idea in detail. What problem does it solve?"
                  value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="input-field w-full resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Your Email (optional)</label>
                <input type="email" placeholder="We'll notify you when it's built" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="input-field w-full" />
              </div>
              <button type="submit" className="btn btn-primary w-full py-3 font-bold">Submit Feature Request 🚀</button>
            </form>
          )}
        </div>
      </div>
    </MarketingLayout>
  );
}
