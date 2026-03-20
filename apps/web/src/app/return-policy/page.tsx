import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';

const APP_URL = 'https://zynovexa.com';
const LAST_UPDATED = 'March 20, 2026';

const RETURN_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Return Policy | Zynovexa',
  url: `${APP_URL}/return-policy`,
  dateModified: '2026-03-20',
  description:
    'Return policy for Zynovexa digital subscription services. No physical goods are sold or delivered.',
};

export const metadata: Metadata = {
  title: 'Return Policy | Zynovexa',
  description:
    'Read the Zynovexa return policy. Zynovexa provides digital SaaS subscriptions, so no physical returns apply.',
  alternates: { canonical: `${APP_URL}/return-policy` },
};

export default function ReturnPolicyPage() {
  return (
    <LegalPageLayout
      badge="Billing Policy"
      title="Return Policy"
      lastUpdated={LAST_UPDATED}
      summary={
        <p>
          <strong className="text-white">Plain-language summary:</strong> Zynovexa is a digital software service.
          We do not sell or ship physical products, so returns are not applicable.
        </p>
      }
      schemas={[RETURN_SCHEMA]}
      footerLinks={[
        { href: '/refund-policy', label: 'Refund Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: 'mailto:support@zynovexa.com', label: 'support@zynovexa.com', external: true },
      ]}
      summaryTone="amber"
    >
      <section id="digital-service">
        <h2 className="text-2xl font-bold text-white mb-4">No Returns for Digital Services</h2>
        <p>
          Zynovexa offers subscription-based access to online software features, including social media scheduling,
          AI caption and hashtag generation, analytics, and video workflow tools. Since no physical item is shipped
          or delivered, there is nothing to return.
        </p>
      </section>

      <section id="related-billing">
        <h2 className="text-2xl font-bold text-white mb-4">Related Billing Questions</h2>
        <p>
          If your concern is about an incorrect charge, duplicate payment, or cancellation, please review our Refund
          Policy or contact support@zynovexa.com for billing assistance.
        </p>
      </section>
    </LegalPageLayout>
  );
}