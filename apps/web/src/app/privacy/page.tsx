import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';

const APP_URL = 'https://zynovexa.com';
const LAST_UPDATED = 'March 20, 2026';

const PRIVACY_TOC = [
  { id: 'collect', label: '1. Information We Collect' },
  { id: 'use', label: '2. How We Use Information' },
  { id: 'payments', label: '3. Payments and Third-Party Services' },
  { id: 'sharing', label: '4. Data Sharing' },
  { id: 'security', label: '5. Data Security' },
  { id: 'retention', label: '6. Retention and Deletion' },
  { id: 'rights', label: '7. Your Rights and Choices' },
  { id: 'children', label: '8. Children' },
  { id: 'changes', label: '9. Policy Updates' },
  { id: 'contact', label: '10. Contact' },
];

const PRIVACY_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'PrivacyPolicy',
  name: 'Zynovexa Privacy Policy',
  url: `${APP_URL}/privacy`,
  dateModified: '2026-03-20',
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
        text: 'No. Zynovexa does not sell personal data to advertisers, brokers, or other third parties.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who processes subscription payments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Payments are processed by Razorpay. Zynovexa does not store full card details on its own servers.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I request deletion of my data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can email privacy@zynovexa.com or support@zynovexa.com to request account deletion or privacy assistance.',
      },
    },
  ],
};

export const metadata: Metadata = {
  title: 'Privacy Policy | Zynovexa',
  description:
    'Read the Zynovexa privacy policy covering account data, billing information, Razorpay payments, analytics tools, and your privacy rights.',
  alternates: { canonical: `${APP_URL}/privacy` },
  openGraph: {
    title: 'Privacy Policy | Zynovexa',
    description:
      'Clear privacy terms for a SaaS platform covering data collection, security, payments, and user rights.',
    url: `${APP_URL}/privacy`,
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      badge="Legal"
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      summary={
        <p>
          <strong className="text-white">Quick summary:</strong> We collect the data needed to create your
          account, process subscriptions, provide scheduling and AI features, improve reliability, and support your
          use of Zynovexa. We do not sell your personal data.
        </p>
      }
      toc={PRIVACY_TOC}
      schemas={[PRIVACY_SCHEMA, PRIVACY_FAQ_SCHEMA]}
      footerLinks={[
        { href: '/terms', label: 'Terms of Service' },
        { href: '/refund-policy', label: 'Refund Policy' },
        { href: 'mailto:privacy@zynovexa.com', label: 'privacy@zynovexa.com', external: true },
      ]}
    >
      <section id="collect">
        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
        <p className="mb-4">We collect information you provide directly and limited technical data needed to run the platform.</p>
        <div className="space-y-3">
          {[
            {
              title: 'Account details',
              desc: 'Your name, email address, password, profile settings, and subscription status.',
            },
            {
              title: 'Content and workspace data',
              desc: 'Posts, captions, hashtags, scheduled dates, uploaded media, AI prompts, and workspace preferences.',
            },
            {
              title: 'Billing data',
              desc: 'Plan details, invoice data, payment status, and transaction references. Full card details are handled by Razorpay, not stored by Zynovexa.',
            },
            {
              title: 'Technical and usage data',
              desc: 'IP address, browser type, device information, login events, and feature usage logs used for reliability, analytics, and security.',
            },
          ].map((item) => (
            <div key={item.title} className="card p-4">
              <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="use">
        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Information</h2>
        <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
          <li>Create and manage user accounts.</li>
          <li>Provide social media scheduling, AI content tools, analytics, and video workflow features.</li>
          <li>Process subscriptions, invoices, renewals, and billing support.</li>
          <li>Monitor service performance, prevent abuse, and improve product quality.</li>
          <li>Send essential service emails such as payment receipts, account alerts, and policy notices.</li>
        </ul>
      </section>

      <section id="payments">
        <h2 className="text-2xl font-bold text-white mb-4">3. Payments and Third-Party Services</h2>
        <p className="mb-4">We use trusted service providers to operate important parts of the platform.</p>
        <div className="space-y-3">
          <div className="card p-4">
            <h3 className="font-semibold text-white text-sm mb-1">Razorpay</h3>
            <p className="text-sm text-slate-400">
              Razorpay processes subscription payments and related billing information. Payment handling is subject to
              Razorpay's own privacy and security practices.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-white text-sm mb-1">Analytics tools</h3>
            <p className="text-sm text-slate-400">
              We may use analytics and monitoring tools to understand product usage, identify errors, and improve
              performance. These tools receive limited technical and event data.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-white text-sm mb-1">Connected platforms</h3>
            <p className="text-sm text-slate-400">
              When you connect social accounts, we process the access tokens and account identifiers needed to schedule
              or publish content on your behalf.
            </p>
          </div>
        </div>
      </section>

      <section id="sharing">
        <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing</h2>
        <p className="mb-4">We do not sell your personal data. We only share data in limited cases such as:</p>
        <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
          <li>With service providers that help us run the platform, under confidentiality and processing terms.</li>
          <li>With social platforms you explicitly connect and authorize.</li>
          <li>When required by law, court order, or valid legal process.</li>
          <li>To protect users, investigate fraud, or defend legal rights.</li>
        </ul>
      </section>

      <section id="security">
        <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
        <p>
          We use reasonable technical and organizational safeguards to protect user data, including access controls,
          authentication protections, encrypted transport, logging, and monitoring. No online system can be guaranteed
          to be 100% secure, but we work continuously to maintain a safe and reliable service.
        </p>
      </section>

      <section id="retention">
        <h2 className="text-2xl font-bold text-white mb-4">6. Retention and Deletion</h2>
        <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
          <li>We keep account and workspace data while your account is active.</li>
          <li>Billing and tax records may be retained for legal and accounting reasons.</li>
          <li>Deleted account data is removed from active systems and later cleared from backups according to our retention processes.</li>
        </ul>
      </section>

      <section id="rights">
        <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights and Choices</h2>
        <p className="mb-4">Depending on your location, you may have the right to:</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'Access the personal data we hold about you.',
            'Correct inaccurate or incomplete information.',
            'Request deletion of your account and personal data.',
            'Object to certain processing or request data portability where applicable.',
            'Opt out of marketing emails.',
          ].map((item) => (
            <div key={item} className="card p-4 text-sm text-slate-400">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="children">
        <h2 className="text-2xl font-bold text-white mb-4">8. Children</h2>
        <p>
          Zynovexa is not intended for children under the age required by applicable law. If you believe a child has
          provided personal data to us, please contact us so we can review and remove the information where appropriate.
        </p>
      </section>

      <section id="changes">
        <h2 className="text-2xl font-bold text-white mb-4">9. Policy Updates</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect product updates, legal changes, or security
          improvements. When material changes are made, we will update the date on this page and may notify users by
          email or inside the product.
        </p>
      </section>

      <section id="contact">
        <h2 className="text-2xl font-bold text-white mb-4">10. Contact</h2>
        <div className="card p-5 space-y-2 text-sm">
          <p><strong className="text-white">Privacy:</strong> privacy@zynovexa.com</p>
          <p><strong className="text-white">Support:</strong> support@zynovexa.com</p>
          <p><strong className="text-white">Response time:</strong> within 24 to 48 hours</p>
          <p><strong className="text-white">Website:</strong> {APP_URL}</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}