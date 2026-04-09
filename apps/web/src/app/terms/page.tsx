import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';

const APP_URL = 'https://zynovexa.com';
const LAST_UPDATED = 'March 20, 2026';

const TERMS_TOC = [
  { id: 'acceptance', label: '1. Acceptance of Terms' },
  { id: 'service', label: '2. Our Service' },
  { id: 'accounts', label: '3. User Responsibilities' },
  { id: 'subscriptions', label: '4. Subscription and Payment Terms' },
  { id: 'misuse', label: '5. Account Misuse and Prohibited Activities' },
  { id: 'content', label: '6. Content and Intellectual Property' },
  { id: 'termination', label: '7. Suspension and Termination' },
  { id: 'disclaimer', label: '8. Disclaimer and Limitation' },
  { id: 'changes', label: '9. Changes to These Terms' },
  { id: 'contact', label: '10. Contact' },
];

const TERMS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'TermsOfService',
  name: 'Zynovexa Terms of Service',
  url: `${APP_URL}/terms`,
  dateModified: '2026-03-20',
  publisher: {
    '@type': 'Organization',
    name: 'Zynovexa',
    url: APP_URL,
  },
};

export const metadata: Metadata = {
  title: 'Terms of Service | Zynovexa',
  description:
    'Read the Zynovexa terms and conditions covering subscriptions, payments, user responsibilities, misuse, and termination rights.',
  alternates: { canonical: `${APP_URL}/terms` },
  openGraph: {
    title: 'Terms of Service | Zynovexa',
    description:
      'Simple and clear terms for using Zynovexa, including subscription billing, account rules, and service limitations.',
    url: `${APP_URL}/terms`,
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      badge="Legal"
      title="Terms & Conditions"
      lastUpdated={LAST_UPDATED}
      summary={
        <p>
          <strong className="text-white">Plain-language summary:</strong> These Terms explain the rules for using
          Zynovexa, how subscription billing works, what users are responsible for, and when we may suspend or close
          an account.
        </p>
      }
      toc={TERMS_TOC}
      schemas={[TERMS_SCHEMA]}
      footerLinks={[
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/refund-policy', label: 'Refund Policy' },
        { href: 'mailto:legal@zynovexa.com', label: 'legal@zynovexa.com', external: true },
      ]}
      summaryTone="pink"
    >
      <section id="acceptance">
        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
        <p>
          By using Zynovexa, creating an account, or purchasing a subscription, you agree to these Terms and our
          Privacy Policy. If you are using the service on behalf of a company or organization, you confirm that you
          have authority to accept these Terms for that entity.
        </p>
      </section>

      <section id="service">
        <h2 className="text-2xl font-bold text-white mb-4">2. Our Service</h2>
        <p className="mb-4">Zynovexa is a subscription-based SaaS platform that may include:</p>
        <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
          <li>Social media post creation, scheduling, and automation</li>
          <li>AI-generated captions, hashtags, scripts, and content suggestions</li>
          <li>Video workflow tools for reels, shorts, and related content formats</li>
          <li>Analytics, insights, and other productivity features</li>
        </ul>
      </section>

      <section id="accounts">
        <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
        <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
          <li>You must provide accurate account information and keep it updated.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>You are responsible for all activity that happens under your account.</li>
          <li>You must review AI-generated or scheduled content before publishing it.</li>
          <li>You must ensure your use of Zynovexa complies with platform rules and applicable law.</li>
        </ul>
      </section>

      <section id="subscriptions">
        <h2 className="text-2xl font-bold text-white mb-4">4. Subscription and Payment Terms</h2>
        <div className="space-y-3 text-sm text-slate-400">
          <p>
            Paid plans are billed in advance on a monthly or yearly basis, depending on the plan you choose.
          </p>
          <p>
            Subscriptions renew automatically unless cancelled before the next billing date.
          </p>
          <p>
            Payments are processed through Razorpay (for INR transactions) and Stripe (for international/USD
            transactions). By making a purchase, you agree to the applicable payment terms of the respective
            payment processor.
          </p>
          <p>
            If a payment fails, we may retry billing, limit paid features, or suspend access until payment is
            completed.
          </p>
          <p>
            Refunds are governed by our Refund Policy. Cancelling a subscription stops future renewals but does not
            automatically create a refund for the current billing period.
          </p>
        </div>
      </section>

      <section id="misuse">
        <h2 className="text-2xl font-bold text-white mb-4">5. Account Misuse and Prohibited Activities</h2>
        <p className="mb-4">You may not use Zynovexa to:</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'Publish unlawful, abusive, fraudulent, or misleading content',
            'Spam users or violate social platform policies',
            'Interfere with the security or normal operation of the platform',
            'Upload malware, exploit code, or harmful files',
            'Infringe the intellectual property or privacy rights of others',
            'Share accounts in a way that violates your subscription plan',
          ].map((item) => (
            <div key={item} className="card p-4 text-sm text-slate-400">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="content">
        <h2 className="text-2xl font-bold text-white mb-4">6. Content and Intellectual Property</h2>
        <p className="mb-3">
          You keep ownership of the content you upload or create using Zynovexa. You give us a limited right to host,
          process, and transmit that content only as needed to provide the service.
        </p>
        <p>
          Zynovexa owns the software, branding, interface, and other platform materials unless otherwise stated.
          You may not copy, reverse engineer, resell, or misuse the platform beyond the rights granted by your plan.
        </p>
      </section>

      <section id="termination">
        <h2 className="text-2xl font-bold text-white mb-4">7. Suspension and Termination</h2>
        <p className="mb-4">We may suspend, restrict, or terminate your account if:</p>
        <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
          <li>You violate these Terms or applicable law.</li>
          <li>Your account is used for fraud, abuse, or security threats.</li>
          <li>Required payments remain unpaid.</li>
          <li>We are required to act by law or by a valid legal request.</li>
        </ul>
      </section>

      <section id="disclaimer">
        <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimer and Limitation</h2>
        <p className="mb-3">
          Zynovexa is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted service,
          error-free operation, or specific business results such as follower growth, engagement, or revenue.
        </p>
        <p>
          To the maximum extent permitted by law, Zynovexa is not liable for indirect, incidental, or consequential
          damages arising from your use of the service.
        </p>
      </section>

      <section id="changes">
        <h2 className="text-2xl font-bold text-white mb-4">9. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. If we make material changes, we may notify users by email,
          inside the product, or by updating the date on this page. Continued use of the service after changes become
          effective means you accept the updated Terms.
        </p>
      </section>

      <section id="contact">
        <h2 className="text-2xl font-bold text-white mb-4">10. Contact</h2>
        <div className="card p-5 space-y-2 text-sm">
          <p><strong className="text-white">Support:</strong> support@zynovexa.com</p>
          <p><strong className="text-white">Legal:</strong> legal@zynovexa.com</p>
          <p><strong className="text-white">Response time:</strong> within 24 to 48 hours</p>
          <p><strong className="text-white">Website:</strong> {APP_URL}</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}