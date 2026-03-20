import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';

const APP_URL = 'https://zynovexa.com';
const LAST_UPDATED = 'March 20, 2026';

const DISCLAIMER_TOC = [
  { id: 'service', label: '1. Service Provided As Is' },
  { id: 'results', label: '2. No Guaranteed Results' },
  { id: 'availability', label: '3. Platform and Feature Availability' },
  { id: 'ai-content', label: '4. AI Output and User Review' },
  { id: 'third-party', label: '5. Third-Party Platforms' },
  { id: 'contact', label: '6. Contact' },
];

const DISCLAIMER_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Disclaimer | Zynovexa',
  url: `${APP_URL}/disclaimer`,
  dateModified: '2026-03-20',
  description:
    'Disclaimer for Zynovexa SaaS services covering availability, third-party platforms, AI outputs, and no guaranteed growth results.',
};

export const metadata: Metadata = {
  title: 'Disclaimer | Zynovexa',
  description:
    'Read the Zynovexa disclaimer about service availability, AI outputs, third-party platforms, and no guaranteed performance outcomes.',
  alternates: { canonical: `${APP_URL}/disclaimer` },
};

export default function DisclaimerPage() {
  return (
    <LegalPageLayout
      badge="Legal Notice"
      title="Disclaimer"
      lastUpdated={LAST_UPDATED}
      summary={
        <p>
          <strong className="text-white">Plain-language summary:</strong> Zynovexa helps users create, schedule,
          and optimize content, but we cannot guarantee audience growth, engagement, leads, sales, or uninterrupted
          access to every connected platform feature.
        </p>
      }
      toc={DISCLAIMER_TOC}
      schemas={[DISCLAIMER_SCHEMA]}
      footerLinks={[
        { href: '/terms', label: 'Terms of Service' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: 'mailto:support@zynovexa.com', label: 'support@zynovexa.com', external: true },
      ]}
      summaryTone="pink"
    >
      <section id="service">
        <h2 className="text-2xl font-bold text-white mb-4">1. Service Provided As Is</h2>
        <p>
          Zynovexa is provided on an "as is" and "as available" basis. While we work to maintain secure,
          reliable, and useful software, we do not promise that the service will always be uninterrupted,
          error-free, or suitable for every business use case.
        </p>
      </section>

      <section id="results">
        <h2 className="text-2xl font-bold text-white mb-4">2. No Guaranteed Results</h2>
        <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
          <li>We do not guarantee follower growth, reach, engagement, conversions, or revenue.</li>
          <li>Scheduling content on time does not guarantee approval, delivery, or performance on third-party platforms.</li>
          <li>Analytics and recommendations are intended to support decisions, not replace professional judgment.</li>
        </ul>
      </section>

      <section id="availability">
        <h2 className="text-2xl font-bold text-white mb-4">3. Platform and Feature Availability</h2>
        <p>
          Some Zynovexa features depend on APIs, permissions, and policies controlled by third-party platforms such as
          Instagram, Facebook, YouTube, LinkedIn, or X. If a platform changes its rules, API access, or publishing
          capabilities, certain features may be limited, delayed, or unavailable.
        </p>
      </section>

      <section id="ai-content">
        <h2 className="text-2xl font-bold text-white mb-4">4. AI Output and User Review</h2>
        <div className="space-y-3">
          {[
            'AI-generated captions, hashtags, scripts, and suggestions may be incomplete, inaccurate, or not suitable for every audience.',
            'Users are responsible for reviewing all content before publishing.',
            'Users remain responsible for compliance with platform rules, advertising standards, copyright rules, and applicable law.',
          ].map((item) => (
            <div key={item} className="card p-4 text-sm text-slate-400">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="third-party">
        <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Platforms</h2>
        <p>
          Zynovexa is not affiliated with or endorsed by the social networks and external services integrated with the
          platform unless explicitly stated. Those third-party services operate under their own policies, availability,
          and technical limitations.
        </p>
      </section>

      <section id="contact">
        <h2 className="text-2xl font-bold text-white mb-4">6. Contact</h2>
        <div className="card p-5 space-y-2 text-sm">
          <p><strong className="text-white">Support email:</strong> support@zynovexa.com</p>
          <p><strong className="text-white">Response time:</strong> within 24 to 48 hours</p>
          <p><strong className="text-white">Website:</strong> {APP_URL}</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}