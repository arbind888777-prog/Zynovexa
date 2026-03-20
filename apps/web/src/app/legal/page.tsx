import MarketingLayout from '@/components/MarketingLayout';
import Link from 'next/link';
import type { Metadata } from 'next';

const APP_URL = 'https://zynovexa.com';

export const metadata: Metadata = {
  title: 'Legal Center | Zynovexa',
  description:
    'Explore Zynovexa legal documents including Terms, Privacy, Cookie Policy, GDPR rights, DPA, and copyright reporting guidance.',
  keywords: [
    'zynovexa legal',
    'terms and privacy',
    'cookie policy',
    'gdpr compliance',
    'data processing agreement',
    'copyright policy',
  ],
  alternates: { canonical: 'https://zynovexa.com/legal' },
  openGraph: {
    title: 'Legal Center | Zynovexa',
    description:
      'A structured legal center with all compliance, privacy, and policy documents for users and enterprise teams.',
    url: 'https://zynovexa.com/legal',
    type: 'website',
  },
};

const DOCS = [
  {
    title: 'Terms of Service',
    desc: 'The legal agreement governing access, subscriptions, acceptable use, and account responsibilities.',
    href: '/terms',
    updated: 'March 20, 2026',
    label: 'Core Policy',
  },
  {
    title: 'Privacy Policy',
    desc: 'Clear disclosure on data collection, Razorpay billing data, analytics tools, security, and user rights.',
    href: '/privacy',
    updated: 'March 20, 2026',
    label: 'Core Policy',
  },
  {
    title: 'Refund Policy',
    desc: 'Explains when subscription refunds may be approved, including duplicate charges and technical billing errors.',
    href: '/refund-policy',
    updated: 'March 20, 2026',
    label: 'Billing',
  },
  {
    title: 'Return Policy',
    desc: 'States that no returns apply because Zynovexa is a digital SaaS product with no physical delivery.',
    href: '/return-policy',
    updated: 'March 20, 2026',
    label: 'Billing',
  },
  {
    title: 'Disclaimer',
    desc: 'Clarifies that Zynovexa is provided as is and does not guarantee growth, engagement, or uninterrupted platform availability.',
    href: '/disclaimer',
    updated: 'March 20, 2026',
    label: 'Legal Notice',
  },
  {
    title: 'Cookie Policy',
    desc: 'Cookie categories, operational purpose, legal basis, and user preference controls.',
    href: '/legal/cookies',
    updated: 'March 7, 2026',
    label: 'Privacy',
  },
  {
    title: 'GDPR Notice',
    desc: 'EU/EEA data subject rights and request channels for access, correction, deletion, and portability.',
    href: '/legal/gdpr',
    updated: 'March 7, 2026',
    label: 'Compliance',
  },
  {
    title: 'Data Processing Agreement',
    desc: 'Processor obligations, security commitments, subprocessor controls, and cross-border safeguards.',
    href: '/legal/dpa',
    updated: 'March 7, 2026',
    label: 'Enterprise',
  },
  {
    title: 'Copyright Policy',
    desc: 'Copyright reporting process, repeat infringement policy, and counter-notice workflow.',
    href: '/legal/copyright',
    updated: 'March 7, 2026',
    label: 'IP',
  },
];

const FAQ = [
  {
    q: 'Where should users submit legal requests?',
    a: 'General legal requests can be sent to legal@zynovexa.com. Privacy requests should be sent to privacy@zynovexa.com and billing issues can be sent to support@zynovexa.com.',
  },
  {
    q: 'How fast does Zynovexa respond to support and compliance requests?',
    a: 'Most standard support emails are answered within 24 to 48 hours. Compliance and legal requests are acknowledged as quickly as possible based on request type.',
  },
  {
    q: 'Where can I review refund and return rules?',
    a: 'You can review them on the Refund Policy and Return Policy pages in the Legal Center.',
  },
];

const legalWebPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Legal Center | Zynovexa',
  url: `${APP_URL}/legal`,
  description:
    'Structured legal center with Terms, Privacy, Refund, Return, Disclaimer, Cookie Policy, GDPR notice, DPA, and Copyright Policy.',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Zynovexa',
    url: APP_URL,
  },
};

const legalBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: APP_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Legal',
      item: `${APP_URL}/legal`,
    },
  ],
};

const legalFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default function LegalPage() {
  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalWebPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalBreadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalFaqSchema) }}
      />

      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <span className="badge badge-purple mb-4 inline-block">Legal Center</span>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">Trust, Compliance, and Transparency</h1>
          <p className="text-slate-400 text-xl">
            All legal documents in one structured hub so users, teams, and partners can understand rights,
            responsibilities, and compliance commitments quickly.
          </p>
        </div>
      </section>

      <section className="py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto card p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Quick Access</h2>
          <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-400">
            {DOCS.map(doc => (
              <Link key={doc.title} href={doc.href} className="hover:text-white transition-colors">
                {doc.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DOCS.map(doc => (
            <Link key={doc.title} href={doc.href} className="card card-hover p-6 group">
              <div className="flex-1">
                <span className="badge badge-purple mb-3 inline-block">{doc.label}</span>
                <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">{doc.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{doc.desc}</p>
                <p className="text-xs text-slate-600 mt-2">Last updated: {doc.updated}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-5">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map(item => (
              <div key={item.q} className="card p-5">
                <h3 className="text-white font-semibold">{item.q}</h3>
                <p className="text-slate-400 text-sm mt-2">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6" style={{ background: 'var(--bg2)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-3">Legal and Compliance Contact</h2>
          <p className="text-slate-400 mb-6 text-sm">
            For legal requests, data subject rights, enterprise compliance documentation, or copyright notices,
            contact our policy team directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:legal@zynovexa.com" className="btn btn-primary">legal@zynovexa.com</a>
            <a href="mailto:privacy@zynovexa.com" className="btn btn-secondary">privacy@zynovexa.com</a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
