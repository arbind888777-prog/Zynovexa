import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';

const APP_URL = 'https://zynovexa.com';
const LAST_UPDATED = 'March 20, 2026';

const REFUND_TOC = [
  { id: 'overview', label: '1. Overview' },
  { id: 'eligibility', label: '2. When Refunds May Be Approved' },
  { id: 'non-refundable', label: '3. Non-Refundable Situations' },
  { id: 'cancellations', label: '4. Cancellation Policy' },
  { id: 'process', label: '5. Refund Review and Processing' },
  { id: 'contact', label: '6. Support and Billing Contact' },
];

const REFUND_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Refund Policy | Zynovexa',
  url: `${APP_URL}/refund-policy`,
  dateModified: '2026-03-20',
  description:
    'Refund policy for Zynovexa subscription plans, including duplicate charges, technical billing errors, cancellations, and processing timelines.',
};

export const metadata: Metadata = {
  title: 'Refund Policy | Zynovexa',
  description:
    'Read the Zynovexa refund policy for subscription plans, duplicate charges, billing errors, cancellations, and processing timelines.',
  alternates: { canonical: `${APP_URL}/refund-policy` },
  openGraph: {
    title: 'Refund Policy | Zynovexa',
    description:
      'Clear refund rules for Zynovexa subscriptions, including approved exceptions and cancellation terms.',
    url: `${APP_URL}/refund-policy`,
    type: 'website',
  },
};

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      badge="Billing Policy"
      title="Refund Policy"
      lastUpdated={LAST_UPDATED}
      summary={
        <p>
          <strong className="text-white">Plain-language summary:</strong> Zynovexa is a digital SaaS platform,
          so subscription payments are generally non-refundable once a billing cycle starts. Refunds may be
          approved in limited cases such as duplicate payments or verified technical billing errors.
        </p>
      }
      toc={REFUND_TOC}
      schemas={[REFUND_SCHEMA]}
      footerLinks={[
        { href: '/terms', label: 'Terms of Service' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: 'mailto:support@zynovexa.com', label: 'support@zynovexa.com', external: true },
      ]}
      summaryTone="amber"
    >
      <section id="overview">
        <h2 className="text-2xl font-bold text-white mb-4">1. Overview</h2>
        <p>
          Zynovexa provides digital subscription services for social media scheduling, AI content generation,
          analytics, and video workflow tools. Because you receive access to software features immediately,
          refunds are generally not available for normal usage, partial usage, or unused remaining time in a
          billing period.
        </p>
      </section>

      <section id="eligibility">
        <h2 className="text-2xl font-bold text-white mb-4">2. When Refunds May Be Approved</h2>
        <p className="mb-4">A refund may be considered after internal review in the following limited situations:</p>
        <div className="space-y-3">
          {[
            {
              title: 'Duplicate payment',
              desc: 'You were charged more than once for the same subscription period because of an accidental repeat transaction.',
            },
            {
              title: 'Technical billing error',
              desc: 'A system or payment processing issue caused an incorrect charge, such as billing the wrong amount or charging after a valid cancellation.',
            },
            {
              title: 'Unauthorized billing caused by a platform-side error',
              desc: 'We may review verified cases where a payment was captured due to a confirmed billing malfunction on our side or an approved payment gateway issue.',
            },
          ].map((item) => (
            <div key={item.title} className="card p-4">
              <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="non-refundable">
        <h2 className="text-2xl font-bold text-white mb-4">3. Non-Refundable Situations</h2>
        <p className="mb-4">Refunds are normally not available for:</p>
        <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
          <li>Change of mind after purchasing a plan.</li>
          <li>Partial use, low use, or non-use of subscription features.</li>
          <li>Failure to cancel before the next renewal date.</li>
          <li>Unsatisfactory marketing or engagement results from posted content.</li>
          <li>Platform-side limitations, policy changes, outages, or API restrictions outside our control.</li>
          <li>Account suspension caused by violation of our Terms or misuse of the service.</li>
        </ul>
      </section>

      <section id="cancellations">
        <h2 className="text-2xl font-bold text-white mb-4">4. Cancellation Policy</h2>
        <div className="card p-5 text-sm space-y-3">
          <p>
            You can cancel your subscription at any time from your billing settings or by contacting
            support@zynovexa.com.
          </p>
          <p>
            After cancellation, your plan remains active until the end of the current paid billing period unless
            otherwise stated in a plan-specific offer.
          </p>
          <p>
            Once cancellation is confirmed, you will not be charged for future billing cycles.
          </p>
        </div>
      </section>

      <section id="process">
        <h2 className="text-2xl font-bold text-white mb-4">5. Refund Review and Processing</h2>
        <p className="mb-4">If you believe you qualify for a refund, please email support@zynovexa.com with:</p>
        <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
          <li>Your registered email address.</li>
          <li>Transaction ID, invoice number, or payment reference.</li>
          <li>A short explanation of the billing issue.</li>
          <li>Any supporting screenshot or proof, if available.</li>
        </ul>
        <p className="mt-4">
          Approved refunds are typically processed within 5 to 7 business days back to the original payment
          method. Actual settlement time may vary depending on your bank, card issuer, or payment provider.
        </p>
      </section>

      <section id="contact">
        <h2 className="text-2xl font-bold text-white mb-4">6. Support and Billing Contact</h2>
        <div className="card p-5 space-y-2 text-sm">
          <p><strong className="text-white">Support email:</strong> support@zynovexa.com</p>
          <p><strong className="text-white">Typical response time:</strong> within 24 to 48 hours</p>
          <p><strong className="text-white">Website:</strong> {APP_URL}</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}