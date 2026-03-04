import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal | Zynovexa',
  description: 'Zynovexa legal documents — Terms of Service, Privacy Policy, Cookie Policy, GDPR, and more.',
};

const DOCS = [
  { icon: '📋', title: 'Terms of Service', desc: 'The agreement between you and Zynovexa governing use of our platform.', href: '/terms', updated: 'January 1, 2026' },
  { icon: '🔒', title: 'Privacy Policy', desc: 'How we collect, use, and protect your personal information.', href: '/privacy', updated: 'January 1, 2026' },
  { icon: '🍪', title: 'Cookie Policy', desc: 'What cookies we use, why we use them, and how to manage them.', href: '/legal/cookies', updated: 'January 1, 2026' },
  { icon: '🇪🇺', title: 'GDPR Compliance', desc: 'Your rights under the General Data Protection Regulation.', href: '/legal/gdpr', updated: 'January 1, 2026' },
  { icon: '©️', title: 'Copyright Policy', desc: 'Our DMCA policy and how to report copyright infringement.', href: '/legal/copyright', updated: 'January 1, 2026' },
  { icon: '📑', title: 'Acceptable Use Policy', desc: 'What you can and cannot do with Zynovexa services.', href: '/legal/acceptable-use', updated: 'January 1, 2026' },
  { icon: '🤝', title: 'Data Processing Agreement', desc: 'DPA for enterprise customers and business users.', href: '/legal/dpa', updated: 'January 1, 2026' },
  { icon: '♿', title: 'Accessibility Statement', desc: 'Our commitment to making Zynovexa accessible for everyone.', href: '/legal/accessibility', updated: 'January 1, 2026' },
];

export default function LegalPage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">Legal</h1>
          <p className="text-slate-400 text-xl">All our legal documents in one place. We believe in transparency and keeping things simple.</p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DOCS.map(doc => (
            <Link key={doc.title} href={doc.href} className="card card-hover p-6 flex items-start gap-4 group">
              <span className="text-3xl shrink-0">{doc.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">{doc.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{doc.desc}</p>
                <p className="text-xs text-slate-600 mt-2">Last updated: {doc.updated}</p>
              </div>
              <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Legal inquiries */}
      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-3">Legal inquiries</h2>
          <p className="text-slate-400 mb-6 text-sm">For legal requests, data subject requests, or compliance questions, contact our legal team directly.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:legal@zynovexa.com" className="btn btn-primary">legal@zynovexa.com</a>
            <a href="mailto:privacy@zynovexa.com" className="btn btn-secondary">privacy@zynovexa.com</a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
