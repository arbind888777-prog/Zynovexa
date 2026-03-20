import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Plans Starting Free | Zynovexa',
  description:
    'Zynovexa pricing: Free, Starter, Pro, and Growth plans. INR pricing for India, USD for global users. Save 20% with yearly billing. No hidden fees. Cancel anytime.',
  alternates: { canonical: 'https://zynovexa.com/pricing' },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
