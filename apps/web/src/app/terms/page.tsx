import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the Zynovexa Terms of Service. Understand your rights and obligations when using our AI social media management platform.',
  alternates: { canonical: 'https://zynovexa.com/terms' },
};

const LAST_UPDATED = 'March 1, 2026';

export default function TermsPage() {
  return (
    <div className="min-h-screen hero-bg">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>Z</div>
            <span className="text-xl font-extrabold gradient-text">Zynovexa</span>
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy</Link>
            <Link href="/login" className="text-slate-400 hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <div className="mb-12">
          <span className="badge badge-pink mb-4 inline-block">Legal</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400 text-base">
            Last updated: <span className="text-white font-medium">{LAST_UPDATED}</span> &nbsp;·&nbsp; Effective immediately
          </p>
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-white">Please read these Terms carefully.</strong> By creating an account or using Zynovexa, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part, you may not use our service.
            </p>
          </div>
        </div>

        <div className="space-y-10 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," "your") and Zynovexa Technologies ("Zynovexa," "we," "us," "our") governing your access to and use of the Zynovexa platform, website, and services (collectively, the "Service").</p>
            <p className="mt-3">By registering for an account, clicking "Sign Up," or otherwise accessing our Service, you represent that:</p>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>You are at least 13 years of age (or the applicable age of digital consent in your country)</li>
              <li>You have the legal capacity to enter into a binding contract</li>
              <li>You have read, understood, and agree to these Terms</li>
              <li>If using on behalf of an organization, you have authority to bind that organization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p>Zynovexa is a cloud-based AI-powered social media management platform that allows users to:</p>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>Schedule and publish content across multiple social media platforms</li>
              <li>Generate AI-powered captions, hashtags, and scripts using OpenAI technology</li>
              <li>Analyze social media performance with detailed analytics and insights</li>
              <li>Manage multiple social media accounts from a single dashboard</li>
              <li>Collaborate with team members on content creation</li>
            </ul>
            <p className="mt-3 text-sm">We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time with reasonable notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Account Registration & Security</h2>
            <div className="space-y-4">
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-2 text-sm">Account Creation</h3>
                <p className="text-sm text-slate-400">You must provide accurate, complete, and current information. One person may not maintain more than one free account. Accounts created by bots or automated methods are prohibited.</p>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-2 text-sm">Account Security</h3>
                <p className="text-sm text-slate-400">You are responsible for maintaining the confidentiality of your password and for all activities that occur under your account. Notify us immediately at security@zynovexa.com of any unauthorized use. We cannot and will not be liable for any loss resulting from unauthorized account use.</p>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-2 text-sm">Account Termination</h3>
                <p className="text-sm text-slate-400">You may close your account at any time from Settings. We may suspend or terminate accounts that violate these Terms, without prior notice for serious violations.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Subscription Plans & Billing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-3">Available Plans</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { plan: 'Free', price: '$0/month', features: '5 posts, 20 AI credits, 2 platforms' },
                    { plan: 'Pro', price: '$29/month', features: '100 posts, 500 AI credits, 5 platforms' },
                    { plan: 'Business', price: '$79/month', features: 'Unlimited posts, AI & all 7 platforms' },
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
                <p><strong className="text-white">Billing Cycle:</strong> Paid plans are billed monthly or annually (with a discount) in advance. Yearly plans are non-refundable except as described below.</p>
                <p><strong className="text-white">Automatic Renewal:</strong> Subscriptions automatically renew at the end of each billing period unless cancelled before the renewal date.</p>
                <p><strong className="text-white">Price Changes:</strong> We will give you at least 30 days' advance notice of any price changes via email.</p>
                <p><strong className="text-white">Refund Policy:</strong> Monthly plans: pro-rated refund within 7 days of billing. Annual plans: refund within 14 days of initial purchase only. No refunds for partial months after the refund window.</p>
                <p><strong className="text-white">Payment Processing:</strong> All payments are processed securely by Stripe. By providing payment information, you authorize Stripe to charge your payment method on a recurring basis.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Acceptable Use Policy</h2>
            <p className="mb-4">You agree to use Zynovexa only for lawful purposes. You <strong className="text-white">must not</strong> use our Service to:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Post spam, unsolicited messages, or bulk advertising',
                'Publish hateful, discriminatory, or harassing content',
                'Distribute malware, viruses, or malicious code',
                'Violate any applicable laws or regulations',
                'Infringe on intellectual property rights of others',
                'Impersonate any person or entity',
                'Engage in unauthorized data scraping or harvesting',
                'Circumvent platform usage limits or security measures',
                'Post sexually explicit content involving minors (strictly prohibited)',
                'Use AI features to generate misleading deepfakes or disinformation',
              ].map(item => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                  <span className="text-slate-400">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">Violations may result in immediate account suspension without refund. Serious violations will be reported to relevant authorities.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Content & Intellectual Property</h2>
            <div className="space-y-4 text-sm">
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-2">Your Content</h3>
                <p className="text-slate-400">You retain full ownership of all content you create and upload to Zynovexa. By using our Service, you grant Zynovexa a limited, non-exclusive license to store, process, and display your content solely as necessary to provide the Service. We will never claim ownership of your content.</p>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-2">AI-Generated Content</h3>
                <p className="text-slate-400">Content generated using our AI features (captions, scripts, hashtags) is yours to use commercially. You are responsible for reviewing AI-generated content before publishing. Zynovexa makes no guarantees about the accuracy, originality, or fitness for purpose of AI-generated content.</p>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-2">Zynovexa's Intellectual Property</h3>
                <p className="text-slate-400">The Zynovexa platform, logo, brand, software, design, and all related materials are owned by Zynovexa and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our platform without written permission.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Third-Party Services</h2>
            <p>Zynovexa integrates with third-party services including social media platforms (Instagram, YouTube, TikTok, etc.), payment processors (Stripe), and AI providers (OpenAI). Your use of these services is also subject to their respective terms of service. We are not responsible for the actions, content, or policies of third-party services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimer of Warranties</h2>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-sm text-slate-300">THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND. ZYNOVEXA EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND UNINTERRUPTED OR ERROR-FREE SERVICE.</p>
              <p className="text-sm text-slate-400 mt-3">We do not warrant that: (a) our Service will meet your specific requirements; (b) our Service will be uninterrupted, timely, or error-free; (c) results obtained from using our Service will be accurate or reliable; (d) any errors will be corrected.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
            <p className="text-sm">To the maximum extent permitted by law, Zynovexa shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, lost revenue, lost data, or business interruption, arising from your use of or inability to use the Service, even if we have been advised of the possibility of such damages.</p>
            <p className="mt-3 text-sm">Our total cumulative liability to you for all claims arising from the use of our Service shall not exceed the greater of: (a) the amount you paid to Zynovexa in the 12 months preceding the claim, or (b) USD $100.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
            <p className="text-sm">You agree to defend, indemnify, and hold harmless Zynovexa, its officers, directors, employees, and agents from any claims, damages, liabilities, costs, or expenses (including reasonable legal fees) arising from: (a) your use of the Service; (b) content you publish through the Service; (c) your violation of these Terms; or (d) your violation of any third-party rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law & Disputes</h2>
            <p className="text-sm">These Terms are governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration in accordance with the American Arbitration Association rules.</p>
            <p className="mt-3 text-sm text-slate-500">You waive any right to participate in class action lawsuits against Zynovexa.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Changes to Terms</h2>
            <p className="text-sm">We reserve the right to modify these Terms at any time. Material changes will be communicated via:</p>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>Email notification to your registered email address (at least 14 days before changes take effect)</li>
              <li>Prominent notice on the Zynovexa dashboard</li>
              <li>Updated "Last Updated" date on this page</li>
            </ul>
            <p className="mt-3 text-sm">Continued use of the Service after the effective date of changes constitutes your acceptance.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Contact Information</h2>
            <p className="mb-4 text-sm">For any questions or concerns regarding these Terms:</p>
            <div className="card p-5 space-y-2 text-sm">
              <p>📧 <strong className="text-white">Legal inquiries:</strong> legal@zynovexa.com</p>
              <p>📧 <strong className="text-white">Support:</strong> support@zynovexa.com</p>
              <p>🌐 <strong className="text-white">Website:</strong> https://zynovexa.com</p>
              <p>⏱️ <strong className="text-white">Response time:</strong> Within 3 business days</p>
            </div>
          </section>

        </div>

        {/* Footer nav */}
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
    </div>
  );
}
