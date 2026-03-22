'use client';

import { useState } from 'react';
import Link from 'next/link';

interface QuickStartProps {
  userName?: string;
  postsCount?: number;
  accountsCount?: number;
  aiUsed?: boolean;
  streakDays?: number;
}

const QUICK_ACTIONS = [
  { href: '/create', icon: '✏️', label: 'Create Post', desc: 'Write and schedule content', color: 'from-purple-500 to-pink-500' },
  { href: '/ai', icon: '🤖', label: 'AI Generate', desc: 'Auto-generate captions & scripts', color: 'from-blue-500 to-cyan-500' },
  { href: '/accounts', icon: '🔗', label: 'Connect Account', desc: 'Link your social platforms', color: 'from-emerald-500 to-teal-500' },
  { href: '/analytics', icon: '📊', label: 'View Analytics', desc: 'Track your performance', color: 'from-orange-500 to-amber-500' },
];

export default function QuickStart({ userName, postsCount = 0, accountsCount = 0, aiUsed = false, streakDays = 0 }: QuickStartProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const checklist = [
    { done: true, label: 'Create your account', icon: '✅' },
    { done: accountsCount > 0, label: 'Connect a social platform', icon: accountsCount > 0 ? '✅' : '🔗' },
    { done: postsCount > 0, label: 'Create your first post', icon: postsCount > 0 ? '✅' : '✏️' },
    { done: aiUsed, label: 'Try AI content generation', icon: aiUsed ? '✅' : '🤖' },
    { done: streakDays >= 3, label: 'Build a 3-day streak', icon: streakDays >= 3 ? '✅' : '🔥' },
  ];

  const completed = checklist.filter((c) => c.done).length;
  const progress = (completed / checklist.length) * 100;

  // Hide if all done
  if (completed === checklist.length) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 border border-purple-500/20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.05))' }}>
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-slate-500 hover:text-white text-sm transition-colors"
          aria-label="Dismiss"
        >✕</button>

        <h2 className="text-xl font-bold text-white mb-1">
          Welcome{userName ? `, ${userName}` : ''}! 🚀
        </h2>
        <p className="text-sm text-slate-400 mb-4">Complete these steps to get the most out of Zynovexa.</p>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)' }}
            />
          </div>
          <span className="text-xs text-slate-400 whitespace-nowrap">{completed}/{checklist.length}</span>
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {checklist.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 text-sm ${item.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="dashboard-panel rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3 bg-gradient-to-br ${action.color}`}>
              {action.icon}
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{action.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
