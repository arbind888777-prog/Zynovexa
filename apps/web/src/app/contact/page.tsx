import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

const APP_URL = 'https://zynovexa.com';

export const metadata: Metadata = {
  title: 'Contact Us | Zynovexa',
  description:
    'Contact the Zynovexa support team for billing, account, legal, and product questions. We typically respond within 24 to 48 hours.',
  alternates: { canonical: `${APP_URL}/contact` },
  openGraph: {
    title: 'Contact Us | Zynovexa',
    description:
      'Get in touch with Zynovexa support for account, billing, legal, or business questions.',
    url: `${APP_URL}/contact`,
    type: 'website',
  },
};

const CONTACT_CHANNELS = [
  {
    title: 'General Support',
    email: 'support@zynovexa.com',
    desc: 'For product help, account access, subscription billing, and platform connection issues.',
  },
  {
    title: 'Privacy Requests',
    email: 'privacy@zynovexa.com',
    desc: 'For data access, correction, deletion, or privacy-related questions.',
  },
  {
    title: 'Legal & Compliance',
    email: 'legal@zynovexa.com',
    desc: 'For contracts, policy questions, brand verification, or compliance requests.',
  },
];

export default function ContactPage() {
  return (
    <MarketingLayout>
      <section className="pt-28 sm:pt-36 pb-12 px-4 sm:px-6 text-center relative">
        <div className="max-w-3xl mx-auto">
          <span className="badge badge-purple mb-6 inline-block">Contact Us</span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 text-white leading-tight">
            Reach the team behind <span className="gradient-text">Zynovexa</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed">
            Need help with billing, account setup, legal documents, or platform support? Email us and our team will
            typically respond within 24 to 48 hours.
          </p>
        </div>
      </section>

      <section className="pb-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
          {CONTACT_CHANNELS.map((item) => (
            <a key={item.title} href={`mailto:${item.email}`} className="dashboard-surface card-hover p-6">
              <h2 className="text-white font-semibold mb-2">{item.title}</h2>
              <p className="text-purple-400 text-sm mb-3">{item.email}</p>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto dashboard-surface p-8">
          <h2 className="text-2xl font-extrabold text-white mb-4">Support Details</h2>
          <div className="grid sm:grid-cols-2 gap-5 text-sm">
            <div>
              <p className="text-slate-500 uppercase tracking-wider text-xs mb-2">Response time</p>
              <p className="text-slate-300">Within 24 to 48 hours on business days</p>
            </div>
            <div>
              <p className="text-slate-500 uppercase tracking-wider text-xs mb-2">Business address</p>
              <p className="text-slate-300">Zynovexa Technologies</p>
              <p className="text-slate-400">New Delhi, Delhi, India</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="dashboard-inline-stat px-3 py-1.5">Billing help</span>
            <span className="dashboard-inline-stat px-3 py-1.5">Legal requests</span>
            <span className="dashboard-inline-stat px-3 py-1.5">Privacy support</span>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto dashboard-surface p-8">
          <h2 className="text-2xl font-extrabold text-white mb-6">Send us a message</h2>
          <form
            action="mailto:support@zynovexa.com"
            method="GET"
            className="space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm text-slate-400 mb-1.5">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/50"
                  style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm text-slate-400 mb-1.5">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/50"
                  style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-sm text-slate-400 mb-1.5">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                required
                placeholder="How can we help?"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/50"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
              />
            </div>
            <div>
              <label htmlFor="contact-body" className="block text-sm text-slate-400 mb-1.5">Message</label>
              <textarea
                id="contact-body"
                name="body"
                rows={5}
                required
                placeholder="Describe your issue or question…"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/50 resize-y"
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary w-full justify-center">
              Send Message
            </button>
            <p className="text-xs text-slate-500 text-center">We typically respond within 24–48 hours.</p>
          </form>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
          <div className="dashboard-surface p-6">
            <h2 className="text-xl font-bold text-white mb-3">What to include in your email</h2>
            <ul className="space-y-2 text-sm list-disc list-inside text-slate-400">
              <li>Your registered email address</li>
              <li>Short description of the issue or request</li>
              <li>Order ID, invoice number, or screenshot for billing questions</li>
              <li>Relevant platform name if your request is about scheduling or publishing</li>
            </ul>
          </div>
          <div className="dashboard-surface p-6">
            <h2 className="text-xl font-bold text-white mb-3">Helpful pages</h2>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/pricing" className="text-purple-400 hover:text-purple-300 transition-colors">Pricing</Link>
              <Link href="/refund-policy" className="text-purple-400 hover:text-purple-300 transition-colors">Refund Policy</Link>
              <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}