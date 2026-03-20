'use client';

import Link from 'next/link';

export type Currency = 'inr' | 'usd';

export interface PricingPlan {
  plan: string;
  inrMonthly: number;
  inrYearly: number;
  usdMonthly: number;
  usdYearly: number;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  featured: boolean;
  badge: string | null;
}

interface PricingCardProps {
  tier: PricingPlan;
  yearly: boolean;
  currency: Currency;
}

const SYMBOLS: Record<Currency, string> = { inr: '₹', usd: '$' };

export default function PricingCard({ tier, yearly, currency }: PricingCardProps) {
  const sym = SYMBOLS[currency];
  const monthly = currency === 'inr' ? tier.inrMonthly : tier.usdMonthly;
  const yearlyMo = currency === 'inr' ? tier.inrYearly : tier.usdYearly;
  const price = yearly ? yearlyMo : monthly;
  const isFree = monthly === 0;

  return (
    <div
      className={`relative p-7 sm:p-8 rounded-2xl flex flex-col transition-all duration-300 ${
        tier.featured
          ? 'pricing-popular ring-2 ring-purple-500/40 scale-[1.02]'
          : 'card hover:border-purple-500/20'
      }`}
    >
      {tier.badge && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1.5 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            boxShadow: '0 0 20px rgba(99,102,241,0.5)',
          }}
        >
          {tier.badge}
        </div>
      )}

      <div className="mb-5">
        <h3 className="text-xl font-black text-white">{tier.plan}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{tier.desc}</p>
      </div>

      <div className="mb-7">
        <span className="text-5xl font-black text-white">{sym}{price}</span>
        {!isFree && <span className="text-slate-400 text-sm">/mo</span>}
        {isFree && <span className="block text-xs text-green-400 mt-1">Forever free</span>}
        {!isFree && yearly && (
          <span className="block text-xs text-green-400 mt-1">
            Save 20% &bull; Billed {sym}{price * 12}/year
          </span>
        )}
        {!isFree && !yearly && (
          <span className="block text-xs text-slate-500 mt-1">Cancel anytime</span>
        )}
      </div>

      <ul className="space-y-2.5 mb-8 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
            <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[10px] shrink-0 mt-0.5">
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={tier.href}
        className={`btn w-full justify-center ${tier.featured ? 'btn-primary' : 'btn-secondary'}`}
      >
        {tier.cta}
      </Link>
    </div>
  );
}
