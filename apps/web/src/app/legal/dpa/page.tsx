import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Data Processing Agreement | Zynovexa',
  description:
    'Review the Zynovexa Data Processing Agreement covering processor obligations, subprocessors, security controls, and transfer safeguards.',
  keywords: [
    'zynovexa dpa',
    'data processing agreement',
    'subprocessor terms',
    'processor obligations',
    'enterprise compliance',
  ],
  alternates: { canonical: 'https://zynovexa.com/legal/dpa' },
};

const LAST_UPDATED = 'March 7, 2026';

export default function DpaPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="mb-12">
          <span className="badge badge-purple mb-4 inline-block">Enterprise</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Data Processing Agreement (DPA)</h1>
          <p className="text-slate-400 text-base">
            Last updated: <span className="text-white font-medium">{LAST_UPDATED}</span>
          </p>
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-white">Summary:</strong> This page outlines processor obligations for enterprise customers.
              A signed DPA can be requested from legal@zynovexa.com.
            </p>
          </div>
        </div>

        <div className="space-y-10 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Roles and Scope</h2>
            <p>For customer-provided data, customer acts as controller and Zynovexa acts as processor, limited to documented instructions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Processing Purposes</h2>
            <p>Processing is limited to service delivery, support, security, monitoring, and lawful operational activities required to provide contracted functionality.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Security Measures</h2>
            <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>Technical safeguards for confidentiality, integrity, and availability.</li>
              <li>Access control and least-privilege operational principles.</li>
              <li>Incident response workflow with customer notification where required.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Subprocessors</h2>
            <p>Zynovexa may use vetted subprocessors for infrastructure, communications, AI inference, and payment operations under contractual controls.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. International Transfers</h2>
            <p>Cross-border data transfers are protected using appropriate contractual and technical safeguards where required by law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Deletion and Return</h2>
            <p>Upon termination, customer data is deleted or returned according to contractual terms, subject to legal retention requirements.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Request Signed DPA</h2>
            <p>Email <strong className="text-purple-400">legal@zynovexa.com</strong> with your account domain, legal entity name, and primary compliance contact.</p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <Link href="/legal" className="text-slate-400 hover:text-white transition-colors">Back to Legal Center</Link>
          <div className="flex gap-5 text-sm text-slate-500">
            <a href="mailto:legal@zynovexa.com" className="hover:text-white transition-colors">legal@zynovexa.com</a>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
