import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how Zynovexa collects, uses, and protects your personal data. We are committed to your privacy and data security.',
  alternates: { canonical: 'https://zynovexa.com/privacy' },
};

const LAST_UPDATED = 'March 1, 2026';

export default function PrivacyPolicyPage() {
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
            <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms</Link>
            <Link href="/login" className="text-slate-400 hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <div className="mb-12">
          <span className="badge badge-purple mb-4 inline-block">Legal</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400 text-base">
            Last updated: <span className="text-white font-medium">{LAST_UPDATED}</span> &nbsp;·&nbsp; Effective immediately
          </p>
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-white">Summary:</strong> Zynovexa collects only what's necessary to provide our service. We never sell your personal data to third parties. You have full control over your data and can delete it at any time. Read on for the full details.
            </p>
          </div>
        </div>

        <div className="space-y-10 text-slate-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><span>1.</span> Who We Are</h2>
            <p>Zynovexa ("we," "us," "our") is an AI-powered social media management platform operated by Zynovexa Technologies. Our platform helps creators schedule content, generate AI-powered captions, and analyze performance across social media networks.</p>
            <div className="mt-4 card p-4 text-sm">
              <p><strong className="text-white">Company:</strong> Zynovexa Technologies</p>
              <p className="mt-1"><strong className="text-white">Website:</strong> https://zynovexa.com</p>
              <p className="mt-1"><strong className="text-white">Contact:</strong> privacy@zynovexa.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <p className="mb-4">We collect information you provide directly to us and information generated through your use of our service:</p>
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-2">📋 Account Information</h3>
                <ul className="space-y-1 text-sm list-disc list-inside text-slate-400">
                  <li>Name, email address, and password (hashed with bcrypt)</li>
                  <li>Profile picture (optional)</li>
                  <li>Account preferences and settings</li>
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-2">📊 Usage Data</h3>
                <ul className="space-y-1 text-sm list-disc list-inside text-slate-400">
                  <li>Pages visited, features used, and time spent on the platform</li>
                  <li>Posts created, scheduled, and published</li>
                  <li>AI generation requests and content created</li>
                  <li>Device type, browser, and operating system</li>
                  <li>IP address and approximate geographic location (country/city level)</li>
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-2">🔗 Connected Social Accounts</h3>
                <ul className="space-y-1 text-sm list-disc list-inside text-slate-400">
                  <li>OAuth tokens for connected social media platforms (Instagram, YouTube, TikTok, etc.)</li>
                  <li>Public profile data from those platforms (username, follower count)</li>
                  <li>We never store your social media passwords</li>
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-2">💳 Payment Information</h3>
                <ul className="space-y-1 text-sm list-disc list-inside text-slate-400">
                  <li>Payment processing is handled entirely by <strong className="text-white">Stripe</strong> — we never store your card numbers</li>
                  <li>We store subscription status, plan type, and billing history only</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="space-y-2 list-none">
              {[
                ['✅', 'Provide, operate, and improve our platform and services'],
                ['✅', 'Process transactions and send billing-related communications'],
                ['✅', 'Personalize your content experience and AI recommendations'],
                ['✅', 'Analyze usage trends to improve features and fix bugs'],
                ['✅', 'Send product updates, newsletters, and marketing emails (you can opt out anytime)'],
                ['✅', 'Detect and prevent fraud, abuse, and security incidents'],
                ['✅', 'Comply with legal obligations and respond to lawful requests'],
                ['❌', 'We do NOT sell, rent, or trade your personal data to third parties'],
                ['❌', 'We do NOT use your content to train AI models without explicit consent'],
              ].map(([icon, text]) => (
                <li key={text as string} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 shrink-0">{icon}</span>
                  <span>{text as string}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing & Third Parties</h2>
            <p className="mb-4">We share your information only in these limited circumstances:</p>
            <div className="space-y-3">
              {[
                { title: 'Service Providers', desc: 'We use trusted third-party services to operate our platform: AWS (hosting), Stripe (payments), SendGrid (email), OpenAI (AI generation). These providers are contractually bound to protect your data.' },
                { title: 'Social Media Platforms', desc: 'When you connect your accounts, we share content you explicitly choose to publish on those platforms, subject to their respective privacy policies.' },
                { title: 'Legal Requirements', desc: 'We may disclose information if required by law, court order, or government authority, or if we believe disclosure is necessary to protect our rights, your safety, or public safety.' },
                { title: 'Business Transfers', desc: 'If Zynovexa is acquired or merges with another company, your data may be transferred as part of that transaction. We will notify you before your data becomes subject to a different privacy policy.' },
              ].map(item => (
                <div key={item.title} className="card p-4">
                  <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Cookies & Tracking</h2>
            <p className="mb-4">We use cookies and similar technologies to:</p>
            <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
              <li><strong className="text-white">Essential cookies:</strong> Keep you logged in and remember your preferences</li>
              <li><strong className="text-white">Analytics cookies:</strong> Understand how users interact with our platform (Google Analytics, anonymized)</li>
              <li><strong className="text-white">Marketing cookies:</strong> Measure the effectiveness of our ads (you can opt out)</li>
            </ul>
            <p className="mt-3 text-sm">You can control cookie settings through your browser preferences. Disabling certain cookies may affect platform functionality.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
            <p className="mb-3">We take data security seriously and implement industry-standard protections:</p>
            <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>All data is encrypted in transit using TLS 1.3</li>
              <li>Passwords are hashed using bcrypt with salt rounds</li>
              <li>Database access is restricted with role-based permissions</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Two-factor authentication available for all accounts</li>
            </ul>
            <p className="mt-3 text-sm text-slate-500">No system is 100% secure. If you suspect a security issue, please contact us immediately at security@zynovexa.com.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights & Choices</h2>
            <p className="mb-4">You have the following rights regarding your personal data:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: '👁️', title: 'Access', desc: 'Request a copy of all personal data we hold about you' },
                { icon: '✏️', title: 'Correction', desc: 'Update or correct inaccurate personal information' },
                { icon: '🗑️', title: 'Deletion', desc: 'Request deletion of your account and all associated data' },
                { icon: '📤', title: 'Portability', desc: 'Export your data in a machine-readable format (JSON/CSV)' },
                { icon: '🚫', title: 'Opt-Out', desc: 'Unsubscribe from marketing emails at any time' },
                { icon: '⏸️', title: 'Restriction', desc: 'Request we limit how we process your data in certain cases' },
              ].map(r => (
                <div key={r.title} className="card p-4 flex items-start gap-3">
                  <span className="text-xl shrink-0 mt-0.5">{r.icon}</span>
                  <div>
                    <p className="font-semibold text-white text-sm">{r.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm">To exercise any of these rights, email us at <strong className="text-purple-400">privacy@zynovexa.com</strong> or use the data settings in your account dashboard. We respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
            <p>We retain your personal data for as long as your account is active. If you delete your account:</p>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>Your profile and posts are deleted immediately</li>
              <li>Backups are purged within 30 days</li>
              <li>Billing records are retained for 7 years as required by tax law</li>
              <li>Anonymized usage statistics may be retained indefinitely</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
            <p>Zynovexa is not directed at children under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child under 13, we will delete it immediately. If you believe we have inadvertently collected such information, please contact us at privacy@zynovexa.com.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. International Data Transfers</h2>
            <p>Your data may be stored and processed in the United States or other countries where our service providers operate. By using Zynovexa, you consent to the transfer of your information to countries that may have different data protection laws than your country. We ensure appropriate safeguards are in place for such transfers.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. When we make significant changes, we will:</p>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>Update the "Last Updated" date at the top of this page</li>
              <li>Send an email notification to registered users</li>
              <li>Display a prominent notice on our platform</li>
            </ul>
            <p className="mt-3 text-sm">Continued use of Zynovexa after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
            <p className="mb-4">If you have questions, concerns, or requests regarding this Privacy Policy or your personal data:</p>
            <div className="card p-5 space-y-2 text-sm">
              <p>📧 <strong className="text-white">Email:</strong> privacy@zynovexa.com</p>
              <p>🌐 <strong className="text-white">Website:</strong> https://zynovexa.com</p>
              <p>⏱️ <strong className="text-white">Response time:</strong> Within 2 business days</p>
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
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-purple-400">Privacy Policy</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up Free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
