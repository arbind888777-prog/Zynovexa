import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Zynovexa Creator Revenue OS',
  description:
    'Read the Zynovexa Privacy Policy. Learn what we collect, why we collect it, how we protect it, and which privacy rights you can exercise.',
  keywords: [
    'zynovexa privacy policy',
    'creator platform data privacy',
    'social media automation privacy',
    'data processing creator tools',
    'gdpr and privacy rights',
  ],
  alternates: { canonical: 'https://zynovexa.com/privacy' },
  openGraph: {
    title: 'Privacy Policy | Zynovexa',
    description:
      'A clear breakdown of data collection, security controls, retention, and user rights at Zynovexa.',
    url: 'https://zynovexa.com/privacy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Zynovexa',
    description:
      'Understand how Zynovexa handles account data, AI usage logs, connected social accounts, and privacy requests.',
  },
};

const APP_URL = 'https://zynovexa.com';
const LAST_UPDATED = 'March 7, 2026';

const PRIVACY_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'PrivacyPolicy',
  name: 'Zynovexa Privacy Policy',
  url: `${APP_URL}/privacy`,
  dateModified: '2026-03-07',
  publisher: {
    '@type': 'Organization',
    name: 'Zynovexa',
    url: APP_URL,
  },
};

const PRIVACY_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do you sell personal data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Zynovexa does not sell personal data to data brokers or advertisers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can users delete account data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Users can request deletion through account settings or by emailing privacy@zynovexa.com.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can users send privacy requests?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Privacy requests can be sent to privacy@zynovexa.com. We verify and respond within the legal response window.',
      },
    },
  ],
};

export default function PrivacyPolicyPage() {
  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRIVACY_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRIVACY_FAQ_SCHEMA) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="mb-12">
          <span className="badge badge-purple mb-4 inline-block">Legal</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400 text-base">
            Last updated: <span className="text-white font-medium">{LAST_UPDATED}</span> and effective immediately
          </p>
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-white">Quick summary:</strong> We collect only required data to operate the product,
              protect accounts, process billing, and improve service quality. We do not sell personal data.
              You can access, export, correct, or delete your data using account tools or direct request channels.
            </p>
          </div>
        </div>

        <section className="card p-5 mb-10">
          <h2 className="text-lg font-semibold text-white mb-3">Contents</h2>
          <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-400">
            <a href="#scope" className="hover:text-white transition-colors">1. Scope and Controller Information</a>
            <a href="#collect" className="hover:text-white transition-colors">2. Data We Collect</a>
            <a href="#use" className="hover:text-white transition-colors">3. How We Use Data</a>
            <a href="#share" className="hover:text-white transition-colors">4. Data Sharing and Processors</a>
            <a href="#cookies" className="hover:text-white transition-colors">5. Cookies and Tracking</a>
            <a href="#security" className="hover:text-white transition-colors">6. Security Controls</a>
            <a href="#rights" className="hover:text-white transition-colors">7. Your Privacy Rights</a>
            <a href="#retention" className="hover:text-white transition-colors">8. Retention and Deletion</a>
            <a href="#transfers" className="hover:text-white transition-colors">9. International Transfers</a>
            <a href="#children" className="hover:text-white transition-colors">10. Children and Age Limits</a>
            <a href="#changes" className="hover:text-white transition-colors">11. Policy Updates</a>
            <a href="#contact" className="hover:text-white transition-colors">12. Contact and Requests</a>
          </div>
        </section>

        <div className="space-y-10 text-slate-300 leading-relaxed">

          <section id="scope">
            <h2 className="text-2xl font-bold text-white mb-4">1. Scope and Controller Information</h2>
            <p>
              This Privacy Policy explains how Zynovexa Technologies ("Zynovexa", "we", "us") collects,
              uses, stores, and protects personal data when you use our website, web app, APIs,
              and related creator workflow services.
            </p>
            <div className="mt-4 card p-4 text-sm">
              <p><strong className="text-white">Controller:</strong> Zynovexa Technologies</p>
              <p className="mt-1"><strong className="text-white">Website:</strong> {APP_URL}</p>
              <p className="mt-1"><strong className="text-white">Privacy Contact:</strong> privacy@zynovexa.com</p>
              <p className="mt-1"><strong className="text-white">Security Contact:</strong> security@zynovexa.com</p>
            </div>
          </section>

          <section id="collect">
            <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
            <p className="mb-4">We collect the minimum data needed to provide and secure the service:</p>
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-2">Account and Profile Data</h3>
                <ul className="space-y-1 text-sm list-disc list-inside text-slate-400">
                  <li>Name, email address, hashed password, profile settings, and timezone preferences.</li>
                  <li>Security metadata such as login history and session information for account protection.</li>
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-2">Product Usage Data</h3>
                <ul className="space-y-1 text-sm list-disc list-inside text-slate-400">
                  <li>Feature usage events such as post creation, scheduling actions, and analytics views.</li>
                  <li>AI request metadata for usage limits, quality monitoring, and abuse prevention.</li>
                  <li>Technical telemetry including browser, device type, and coarse location inferred from IP.</li>
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-2">Connected Platform Data</h3>
                <ul className="space-y-1 text-sm list-disc list-inside text-slate-400">
                  <li>OAuth access credentials, account identifiers, and platform-level permissions.</li>
                  <li>Public and business metrics needed for publishing and performance analysis.</li>
                  <li>We do not request or store social network passwords.</li>
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-2">Billing and Transaction Data</h3>
                <ul className="space-y-1 text-sm list-disc list-inside text-slate-400">
                  <li>Payments are processed by Stripe. Card numbers are not stored by Zynovexa.</li>
                  <li>We store plan status, invoice history, and payment outcomes for compliance and support.</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="use">
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Data</h2>
            <p className="mb-4">We use personal data for service delivery, security, and product improvement:</p>
            <ul className="space-y-2 list-none">
              {[
                ['Yes', 'Provide scheduling, publishing, analytics, and creator monetization workflows.'],
                ['Yes', 'Process billing events and send invoices, renewal reminders, and account notices.'],
                ['Yes', 'Detect abuse, enforce limits, and prevent unauthorized access.'],
                ['Yes', 'Improve reliability and product quality through aggregated usage insights.'],
                ['No', 'We do not sell personal data for advertising brokerage.'],
                ['No', 'We do not use your private content to train third-party foundation models without notice or legal basis.'],
              ].map(([icon, text]) => (
                <li key={text as string} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 shrink-0 text-slate-500">{icon}</span>
                  <span>{text as string}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="share">
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing and Processors</h2>
            <p className="mb-4">We share data only with approved subprocessors and lawful authorities when required:</p>
            <div className="space-y-3">
              {[
                {
                  title: 'Infrastructure and Core Processors',
                  desc: 'Hosting, email, AI inference, and billing providers process data under contractual controls and security obligations.',
                },
                {
                  title: 'Connected Social Platforms',
                  desc: 'When you publish, selected content and metadata are sent to the social networks you connect and authorize.',
                },
                {
                  title: 'Legal and Safety Requests',
                  desc: 'We may disclose data where required by law or where necessary to prevent fraud, abuse, or imminent harm.',
                },
                {
                  title: 'Corporate Transactions',
                  desc: 'If ownership changes, data may transfer to a successor entity with continuity obligations and user notice.',
                },
              ].map(item => (
                <div key={item.title} className="card p-4">
                  <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-bold text-white mb-4">5. Cookies and Tracking</h2>
            <p className="mb-4">Cookies and similar technologies support secure sessions, preferences, and service analytics:</p>
            <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
              <li><strong className="text-white">Essential:</strong> authentication, security checks, and core functionality.</li>
              <li><strong className="text-white">Analytics:</strong> aggregated performance and feature usage analytics.</li>
              <li><strong className="text-white">Preference:</strong> language and interface settings for usability.</li>
            </ul>
            <p className="mt-3 text-sm">You can manage cookie behavior via browser settings. Blocking essential cookies may affect login and app stability.</p>
          </section>

          <section id="security">
            <h2 className="text-2xl font-bold text-white mb-4">6. Security Controls</h2>
            <p className="mb-3">We apply layered security controls to protect user data:</p>
            <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>Transport encryption for web and API traffic.</li>
              <li>Hashed credentials, secure session handling, and access control enforcement.</li>
              <li>Rate limiting, request validation, and monitoring for abuse patterns.</li>
              <li>Security patching, dependency monitoring, and incident response procedures.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-500">No internet system is fully risk free. Report suspected incidents to security@zynovexa.com.</p>
          </section>

          <section id="rights">
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Privacy Rights</h2>
            <p className="mb-4">Depending on your jurisdiction, you may have the rights below:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Access', desc: 'Request confirmation and a copy of your personal data.' },
                { title: 'Correction', desc: 'Correct incomplete or inaccurate account information.' },
                { title: 'Deletion', desc: 'Request account and related personal data deletion.' },
                { title: 'Portability', desc: 'Receive data export where applicable and technically feasible.' },
                { title: 'Objection', desc: 'Object to certain processing activities where allowed.' },
                { title: 'Marketing Opt-Out', desc: 'Unsubscribe from product marketing communications.' },
              ].map(r => (
                <div key={r.title} className="card p-4">
                  <div>
                    <p className="font-semibold text-white text-sm">{r.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm">
              Submit requests at <strong className="text-purple-400">privacy@zynovexa.com</strong>. We may verify identity before fulfilling data requests.
            </p>
          </section>

          <section id="retention">
            <h2 className="text-2xl font-bold text-white mb-4">8. Retention and Deletion</h2>
            <p>Retention periods are based on product necessity, support requirements, and legal obligations:</p>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>Active account data is retained for ongoing service delivery.</li>
              <li>Deleted account records are removed from production systems and then rotated from backups.</li>
              <li>Billing and tax records may be retained as required by law.</li>
              <li>Aggregated, non-identifiable analytics may be retained for performance benchmarking.</li>
            </ul>
          </section>

          <section id="transfers">
            <h2 className="text-2xl font-bold text-white mb-4">9. International Transfers</h2>
            <p>
              Depending on service configuration and processor location, data may be processed in multiple jurisdictions.
              Where required, we apply contractual and technical safeguards for cross-border transfers.
            </p>
          </section>

          <section id="children">
            <h2 className="text-2xl font-bold text-white mb-4">10. Children and Age Limits</h2>
            <p>
              Zynovexa is not intended for children under 13, or a higher minimum age where required by local law.
              If you believe child data was submitted in error, contact privacy@zynovexa.com for immediate review.
            </p>
          </section>

          <section id="changes">
            <h2 className="text-2xl font-bold text-white mb-4">11. Policy Updates</h2>
            <p>We may update this policy as legal requirements and product practices evolve. For material changes, we will:</p>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>Revise the update date at the top of this page.</li>
              <li>Publish a notice in product or via email where appropriate.</li>
              <li>Document meaningful policy changes in clear language.</li>
            </ul>
            <p className="mt-3 text-sm">Continued use of services after updates means you acknowledge the revised policy.</p>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact and Requests</h2>
            <p className="mb-4">For questions, complaints, or rights requests:</p>
            <div className="card p-5 space-y-2 text-sm">
              <p><strong className="text-white">Privacy:</strong> privacy@zynovexa.com</p>
              <p><strong className="text-white">Security:</strong> security@zynovexa.com</p>
              <p><strong className="text-white">Website:</strong> {APP_URL}</p>
              <p><strong className="text-white">Standard response time:</strong> within 2 business days</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-white">Do you sell user data?</h3>
                <p className="text-sm text-slate-400 mt-1">No. We do not sell personal data.</p>
              </div>
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-white">Can I request deletion of my account data?</h3>
                <p className="text-sm text-slate-400 mt-1">Yes. Use account settings or email privacy@zynovexa.com.</p>
              </div>
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-white">How do I report a privacy issue?</h3>
                <p className="text-sm text-slate-400 mt-1">Email privacy@zynovexa.com with your account email and details of the issue.</p>
              </div>
            </div>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Z</div>
            <span className="font-bold gradient-text">Zynovexa</span>
          </Link>
          <div className="flex gap-5 text-sm text-slate-500">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-purple-400">Privacy Policy</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up Free</Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
