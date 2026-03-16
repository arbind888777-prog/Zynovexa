import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Cookie Policy | Zynovexa',
  description:
    'Understand which cookies Zynovexa uses, why they are needed, and how to manage cookie preferences.',
  keywords: [
    'zynovexa cookie policy',
    'cookies and tracking',
    'essential cookies',
    'analytics cookies',
    'cookie preferences',
  ],
  alternates: { canonical: 'https://zynovexa.com/legal/cookies' },
  openGraph: {
    title: 'Cookie Policy | Zynovexa',
    description: 'A clear cookie policy covering essential, analytics, and preference cookies.',
    url: 'https://zynovexa.com/legal/cookies',
    type: 'website',
  },
};

const LAST_UPDATED = 'March 7, 2026';

export default function CookiePolicyPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="mb-12">
          <span className="badge badge-purple mb-4 inline-block">Legal</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Cookie Policy</h1>
          <p className="text-slate-400 text-base">
            Last updated: <span className="text-white font-medium">{LAST_UPDATED}</span>
          </p>
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-white">Summary:</strong> We use cookies to keep accounts secure, remember preferences,
              and improve product reliability. You can manage cookie behavior via browser settings.
            </p>
          </div>
        </div>

        <section className="card p-5 mb-10">
          <h2 className="text-lg font-semibold text-white mb-3">Contents</h2>
          <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-400">
            <a href="#what" className="hover:text-white transition-colors">1. What Cookies Are</a>
            <a href="#types" className="hover:text-white transition-colors">2. Cookie Categories</a>
            <a href="#why" className="hover:text-white transition-colors">3. Why We Use Cookies</a>
            <a href="#manage" className="hover:text-white transition-colors">4. Managing Preferences</a>
            <a href="#thirdparty" className="hover:text-white transition-colors">5. Third-Party Cookies</a>
            <a href="#updates" className="hover:text-white transition-colors">6. Policy Updates</a>
          </div>
        </section>

        <div className="space-y-10 text-slate-300 leading-relaxed">
          <section id="what">
            <h2 className="text-2xl font-bold text-white mb-4">1. What Cookies Are</h2>
            <p>Cookies are small text files placed on your browser to remember session state, settings, and usage context.</p>
          </section>

          <section id="types">
            <h2 className="text-2xl font-bold text-white mb-4">2. Cookie Categories We Use</h2>
            <div className="space-y-3">
              <div className="card p-4">
                <h3 className="font-semibold text-white text-sm mb-1">Essential Cookies</h3>
                <p className="text-sm text-slate-400">Required for login, session continuity, and security safeguards.</p>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold text-white text-sm mb-1">Preference Cookies</h3>
                <p className="text-sm text-slate-400">Store selected language, timezone, and interface preferences.</p>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold text-white text-sm mb-1">Analytics Cookies</h3>
                <p className="text-sm text-slate-400">Help us understand feature usage trends and improve product quality.</p>
              </div>
            </div>
          </section>

          <section id="why">
            <h2 className="text-2xl font-bold text-white mb-4">3. Why We Use Cookies</h2>
            <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>Authenticate users and maintain secure sessions.</li>
              <li>Reduce repeated setup effort by remembering settings.</li>
              <li>Measure reliability and improve user experience.</li>
            </ul>
          </section>

          <section id="manage">
            <h2 className="text-2xl font-bold text-white mb-4">4. Managing Cookie Preferences</h2>
            <p>You can control cookie settings through your browser controls. Blocking essential cookies may impact login or app stability.</p>
          </section>

          <section id="thirdparty">
            <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Cookies</h2>
            <p>Certain analytics and operational services may set cookies under their own policies, subject to contractual controls.</p>
          </section>

          <section id="updates">
            <h2 className="text-2xl font-bold text-white mb-4">6. Policy Updates</h2>
            <p>We may update this policy to reflect legal or technical changes and revise the date at the top of this page.</p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <Link href="/legal" className="text-slate-400 hover:text-white transition-colors">Back to Legal Center</Link>
          <div className="flex gap-5 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
