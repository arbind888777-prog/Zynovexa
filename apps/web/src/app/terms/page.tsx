import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | Zynovexa Creator Revenue OS',
  description:
    'Read Zynovexa Terms of Service. Understand account rules, payment terms, acceptable use, intellectual property, and legal conditions.',
  keywords: [
    'zynovexa terms of service',
    'creator platform terms',
    'social media automation terms',
    'ai creator platform legal terms',
    'subscription terms zynovexa',
  ],
  alternates: { canonical: 'https://zynovexa.com/terms' },
  openGraph: {
    title: 'Terms of Service | Zynovexa',
    description:
      'Detailed legal terms for using Zynovexa, including billing, acceptable use, user content, and liability limits.',
    url: 'https://zynovexa.com/terms',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | Zynovexa',
    description:
      'Review the legal terms that govern your use of the Zynovexa Creator Revenue OS.',
  },
};

const APP_URL = 'https://zynovexa.com';
const LAST_UPDATED = 'March 7, 2026';

const TERMS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'TermsOfService',
  name: 'Zynovexa Terms of Service',
  url: `${APP_URL}/terms`,
  dateModified: '2026-03-07',
  publisher: {
    '@type': 'Organization',
    name: 'Zynovexa',
    url: APP_URL,
  },
};

export default function TermsPage() {
  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TERMS_SCHEMA) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="mb-12">
          <span className="badge badge-pink mb-4 inline-block">Legal</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400 text-base">
            Last updated: <span className="text-white font-medium">{LAST_UPDATED}</span> and effective immediately
          </p>
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-white">Plain-language summary:</strong> These Terms govern your use of Zynovexa.
              They explain account eligibility, acceptable use, payments, ownership rights, and legal limits.
              By using the service, you agree to these Terms and our Privacy Policy.
            </p>
          </div>
        </div>

        <section className="card p-5 mb-10">
          <h2 className="text-lg font-semibold text-white mb-3">Contents</h2>
          <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-400">
            <a href="#acceptance" className="hover:text-white transition-colors">1. Acceptance and Eligibility</a>
            <a href="#service" className="hover:text-white transition-colors">2. Service Description</a>
            <a href="#accounts" className="hover:text-white transition-colors">3. Account Responsibilities</a>
            <a href="#billing" className="hover:text-white transition-colors">4. Subscription and Billing</a>
            <a href="#usage" className="hover:text-white transition-colors">5. Acceptable Use</a>
            <a href="#ip" className="hover:text-white transition-colors">6. Content and Intellectual Property</a>
            <a href="#third-party" className="hover:text-white transition-colors">7. Third-Party Services</a>
            <a href="#disclaimer" className="hover:text-white transition-colors">8. Warranty Disclaimer</a>
            <a href="#liability" className="hover:text-white transition-colors">9. Liability Limit</a>
            <a href="#termination" className="hover:text-white transition-colors">10. Suspension and Termination</a>
            <a href="#law" className="hover:text-white transition-colors">11. Governing Law</a>
            <a href="#changes" className="hover:text-white transition-colors">12. Changes and Contact</a>
          </div>
        </section>

        <div className="space-y-10 text-slate-300 leading-relaxed">

          <section id="acceptance">
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance and Eligibility</h2>
            <p>
              These Terms form a binding agreement between you and Zynovexa Technologies for access to and use of
              the website, dashboard, APIs, and related services.
            </p>
            <p className="mt-3">By creating an account or using the service, you confirm that:</p>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>You are legally able to accept these Terms (and at least 13 years old, or higher where required).</li>
              <li>The registration details you provide are accurate and complete.</li>
              <li>If acting for a company, you have authority to bind that entity.</li>
            </ul>
          </section>

          <section id="service">
            <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
            <p>Zynovexa is a cloud-based Creator Revenue OS that may include:</p>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>Content drafting, AI assistance, and scheduling workflows.</li>
              <li>Cross-platform account connection and publishing operations.</li>
              <li>Performance analytics and creator monetization features.</li>
              <li>Team and admin governance capabilities for business users.</li>
            </ul>
            <p className="mt-3 text-sm">We can update, improve, or retire features with reasonable notice when required.</p>
          </section>

          <section id="accounts">
            <h2 className="text-2xl font-bold text-white mb-4">3. Account Responsibilities</h2>
            <div className="space-y-4">
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-2 text-sm">Account Setup</h3>
                <p className="text-sm text-slate-400">You must maintain accurate information and keep your credentials secure. Automated account creation and identity spoofing are prohibited.</p>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-2 text-sm">Security and Access</h3>
                <p className="text-sm text-slate-400">You are responsible for account activity under your credentials. Report unauthorized access immediately at security@zynovexa.com.</p>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-2 text-sm">Account Closure</h3>
                <p className="text-sm text-slate-400">You can close your account through settings. We may suspend or terminate accounts for Terms violations, abuse, or legal requirements.</p>
              </div>
            </div>
          </section>

          <section id="billing">
            <h2 className="text-2xl font-bold text-white mb-4">4. Subscription and Billing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-3">Plan Categories</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { plan: 'Free', price: '$0/month', features: 'Core trial features and platform limits' },
                    { plan: 'Pro', price: '$29/month', features: 'Expanded publishing and AI capacity' },
                    { plan: 'Business', price: '$79/month', features: 'Advanced operations and full platform scope' },
                  ].map(p => (
                    <div key={p.plan} className="card p-4 text-sm">
                      <p className="font-bold text-white">{p.plan}</p>
                      <p className="text-purple-400 font-semibold mt-1">{p.price}</p>
                      <p className="text-slate-500 text-xs mt-1">{p.features}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <p><strong className="text-white">Billing cycle:</strong> Paid plans are charged in advance based on selected monthly or annual cycles.</p>
                <p><strong className="text-white">Auto-renewal:</strong> Subscriptions renew automatically until cancelled before renewal date.</p>
                <p><strong className="text-white">Price updates:</strong> Material pricing changes are communicated before they become effective.</p>
                <p><strong className="text-white">Refunds:</strong> Refund eligibility depends on plan type, billing date, and applicable law.</p>
                <p><strong className="text-white">Processor:</strong> Payments are processed by Stripe and governed by Stripe payment terms.</p>
              </div>
            </div>
          </section>

          <section id="usage">
            <h2 className="text-2xl font-bold text-white mb-4">5. Acceptable Use</h2>
            <p className="mb-4">You must use Zynovexa lawfully and responsibly. You may not:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Send spam, fraudulent promotions, or abusive campaign traffic.',
                'Publish illegal, hateful, or harassing content.',
                'Distribute malware, exploit code, or security bypass tools.',
                'Infringe copyright, trademark, privacy, or publicity rights.',
                'Impersonate individuals, brands, or institutions.',
                'Bypass account, quota, or platform security controls.',
                'Use unauthorized scraping or data extraction methods.',
                'Generate deceptive deepfakes or coordinated disinformation.',
                'Use services for activities that violate local or international law.',
                'Submit content involving child sexual exploitation or abuse.',
              ].map(item => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <span className="text-red-400 shrink-0 mt-0.5">X</span>
                  <span className="text-slate-400">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">Violations can lead to content takedown, account limits, suspension, or termination.</p>
          </section>

          <section id="ip">
            <h2 className="text-2xl font-bold text-white mb-4">6. Content and Intellectual Property</h2>
            <div className="space-y-4 text-sm">
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-2">Your Content</h3>
                <p className="text-slate-400">You keep ownership of content you create or upload. You grant Zynovexa a limited license to host, process, and transmit that content to provide requested services.</p>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-2">AI-Generated Content</h3>
                <p className="text-slate-400">AI outputs are generated based on prompts and model behavior. You are responsible for reviewing legal, factual, and brand suitability before publishing.</p>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-2">Platform IP</h3>
                <p className="text-slate-400">The software, interface, and Zynovexa marks are owned by Zynovexa and protected by IP law. Reverse engineering or unauthorized reuse is prohibited.</p>
              </div>
            </div>
          </section>

          <section id="third-party">
            <h2 className="text-2xl font-bold text-white mb-4">7. Third-Party Services</h2>
            <p>
              Zynovexa depends on external services such as social platforms, payment processors, cloud infrastructure,
              and AI providers. Your use of those integrations is subject to their own terms and policies.
            </p>
          </section>

          <section id="disclaimer">
            <h2 className="text-2xl font-bold text-white mb-4">8. Warranty Disclaimer</h2>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-sm text-slate-300">THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" TO THE MAXIMUM EXTENT PERMITTED BY LAW. WE DISCLAIM IMPLIED WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
              <p className="text-sm text-slate-400 mt-3">We do not guarantee uninterrupted service, error-free output, or guaranteed business outcomes.</p>
            </div>
          </section>

          <section id="liability">
            <h2 className="text-2xl font-bold text-white mb-4">9. Liability Limit</h2>
            <p className="text-sm">To the extent allowed by law, Zynovexa is not liable for indirect, incidental, or consequential damages, including lost revenue, lost data, or reputational loss from service use.</p>
            <p className="mt-3 text-sm">Total aggregate liability for claims related to service use is limited to the amount paid by you in the prior 12 months or USD 100, whichever is greater.</p>
          </section>

          <section id="termination">
            <h2 className="text-2xl font-bold text-white mb-4">10. Suspension and Termination</h2>
            <p className="text-sm">We can suspend or terminate access for Terms violations, unlawful activity, non-payment, or risk to service integrity. You remain responsible for obligations incurred before termination.</p>
          </section>

          <section id="law">
            <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law and Disputes</h2>
            <p className="text-sm">These Terms are governed by applicable laws specified in your service agreement. Disputes should first be attempted through good-faith negotiation, then handled through the agreed legal forum.</p>
          </section>

          <section id="changes">
            <h2 className="text-2xl font-bold text-white mb-4">12. Changes and Contact</h2>
            <p className="text-sm">We may update these Terms as product, legal, or operational requirements evolve. For material changes, we will provide notice through one or more channels:</p>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>Email notification to registered account email.</li>
              <li>Dashboard notice or release note update.</li>
              <li>Updated revision date on this page.</li>
            </ul>
            <p className="mt-3 text-sm">Continued use after the effective date means you accept the updated Terms.</p>

            <p className="mb-4 text-sm mt-6">For questions regarding these Terms:</p>
            <div className="card p-5 space-y-2 text-sm">
              <p><strong className="text-white">Legal:</strong> legal@zynovexa.com</p>
              <p><strong className="text-white">Support:</strong> support@zynovexa.com</p>
              <p><strong className="text-white">Website:</strong> {APP_URL}</p>
              <p><strong className="text-white">Response time:</strong> within 3 business days</p>
            </div>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Z</div>
            <span className="font-bold gradient-text">Zynovexa</span>
          </Link>
          <div className="flex gap-5 text-sm text-slate-500">
            <Link href="/terms" className="text-purple-400">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up Free</Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
