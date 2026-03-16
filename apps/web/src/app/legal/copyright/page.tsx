import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Copyright Policy | Zynovexa',
  description:
    'Learn how to report copyright infringement on Zynovexa and how counter-notice and repeat infringement handling works.',
  keywords: [
    'zynovexa copyright policy',
    'dmca notice',
    'counter notice',
    'copyright infringement report',
  ],
  alternates: { canonical: 'https://zynovexa.com/legal/copyright' },
};

const LAST_UPDATED = 'March 7, 2026';

export default function CopyrightPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="mb-12">
          <span className="badge badge-purple mb-4 inline-block">IP Policy</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Copyright Policy</h1>
          <p className="text-slate-400 text-base">
            Last updated: <span className="text-white font-medium">{LAST_UPDATED}</span>
          </p>
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-white">Summary:</strong> If you believe content on Zynovexa infringes copyright,
              submit a complete notice. We review notices and support lawful counter-notice handling.
            </p>
          </div>
        </div>

        <div className="space-y-10 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Reporting Copyright Infringement</h2>
            <p>To submit a notice, send an email to <strong className="text-purple-400">legal@zynovexa.com</strong> with complete details listed below.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Required Notice Elements</h2>
            <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>Identification of copyrighted work claimed to be infringed.</li>
              <li>Specific URL or location of allegedly infringing content.</li>
              <li>Contact details of the reporting party.</li>
              <li>Good-faith statement and accuracy statement under penalty of perjury where required.</li>
              <li>Authorized signature (electronic signature accepted where lawful).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Counter-Notice Process</h2>
            <p>If your content is removed due to a copyright complaint and you believe it was removed in error, you may submit a counter-notice with legal basis and required declarations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Repeat Infringer Policy</h2>
            <p>Zynovexa may suspend or terminate accounts associated with repeated infringement based on policy review and applicable law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. False Claims</h2>
            <p>Submitting knowingly false notices or counter-notices may result in account action and legal consequences.</p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <Link href="/legal" className="text-slate-400 hover:text-white transition-colors">Back to Legal Center</Link>
          <div className="flex gap-5 text-sm text-slate-500">
            <a href="mailto:legal@zynovexa.com" className="hover:text-white transition-colors">legal@zynovexa.com</a>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
