'use client';

import Link from 'next/link';

interface UpgradeNudgeProps {
  feature: string;
  requiredPlan?: string;
  message?: string;
}

export default function UpgradeNudge({ feature, requiredPlan = 'Pro', message }: UpgradeNudgeProps) {
  return (
    <div className="rounded-2xl border border-purple-500/20 p-8 text-center max-w-lg mx-auto my-8"
      style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(168,85,247,0.05))' }}>
      <div className="text-5xl mb-4">🔒</div>
      <h3 className="text-xl font-bold text-white mb-2">{feature} requires {requiredPlan}</h3>
      <p className="text-sm text-slate-400 mb-6">
        {message || `Upgrade to ${requiredPlan} to unlock ${feature.toLowerCase()} and accelerate your creator growth.`}
      </p>
      <Link
        href={`/settings?tab=billing&plan=${requiredPlan.toUpperCase()}`}
        className="inline-block px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-opacity"
      >
        Upgrade to {requiredPlan} →
      </Link>
      <p className="text-xs text-slate-500 mt-4">7-day free trial included. Cancel anytime.</p>
    </div>
  );
}

/** Inline compact nudge for use in sidebars/cards */
export function InlineUpgradeNudge({ plan = 'Pro' }: { plan?: string }) {
  return (
    <Link
      href={`/settings?tab=billing&plan=${plan.toUpperCase()}`}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 text-purple-400 hover:text-white hover:border-purple-500/40 transition-all"
    >
      <span>⬆️</span>
      <span>Upgrade to {plan}</span>
    </Link>
  );
}
