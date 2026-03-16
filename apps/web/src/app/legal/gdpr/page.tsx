import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'GDPR Notice | Zynovexa',
  description:
    'Learn how Zynovexa supports GDPR rights for EU/EEA users, including access, deletion, portability, and objection requests.',
  keywords: [
    'gdpr zynovexa',
    'data subject rights',
    'eu privacy rights',
    'data portability',
    'right to erasure',
  ],
  alternates: { canonical: 'https://zynovexa.com/legal/gdpr' },
};

const LAST_UPDATED = 'March 7, 2026';

export default function GdprPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="mb-12">
          <span className="badge badge-purple mb-4 inline-block">Compliance</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">GDPR Notice</h1>
          <p className="text-slate-400 text-base">
            Last updated: <span className="text-white font-medium">{LAST_UPDATED}</span>
          </p>
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-white">Summary:</strong> If you are in the EU/EEA, you can request access,
              correction, deletion, portability, and objection rights under GDPR.
            </p>
          </div>
        </div>

        <div className="space-y-10 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Scope</h2>
            <p>This notice applies to personal data processing for users located in the European Economic Area, United Kingdom, and Switzerland where GDPR-like rights apply.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Legal Bases for Processing</h2>
            <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>Contract performance to deliver service features.</li>
              <li>Legitimate interests in reliability, security, and abuse prevention.</li>
              <li>Legal obligations for tax, billing, and compliance records.</li>
              <li>Consent where required for optional processing activities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Subject Rights</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ['Access', 'Request confirmation and a copy of personal data.'],
                ['Correction', 'Request correction of inaccurate data.'],
                ['Erasure', 'Request deletion where legal grounds apply.'],
                ['Portability', 'Receive data in a portable format where applicable.'],
                ['Restriction', 'Request limited processing in specific cases.'],
                ['Objection', 'Object to processing based on legitimate interests.'],
              ].map(([title, desc]) => (
                <div key={title} className="card p-4">
                  <p className="font-semibold text-white text-sm">{title}</p>
                  <p className="text-xs text-slate-400 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Exercising Rights</h2>
            <p>Submit requests at <strong className="text-purple-400">privacy@zynovexa.com</strong>. We may verify identity before processing requests.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Supervisory Authority Complaints</h2>
            <p>You may lodge a complaint with your local data protection authority if you believe processing violates applicable data protection laws.</p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <Link href="/legal" className="text-slate-400 hover:text-white transition-colors">Back to Legal Center</Link>
          <div className="flex gap-5 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <a href="mailto:privacy@zynovexa.com" className="hover:text-white transition-colors">privacy@zynovexa.com</a>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
