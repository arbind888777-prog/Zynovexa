import type { ReactNode } from 'react';
import Link from 'next/link';
import MarketingLayout from '@/components/MarketingLayout';

type TocItem = {
  id: string;
  label: string;
};

type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
};

type SummaryTone = 'purple' | 'pink' | 'amber';

const SUMMARY_STYLES: Record<SummaryTone, { background: string; border: string }> = {
  purple: {
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.2)',
  },
  pink: {
    background: 'rgba(168,85,247,0.08)',
    border: '1px solid rgba(168,85,247,0.2)',
  },
  amber: {
    background: 'rgba(245,158,11,0.08)',
    border: '1px solid rgba(245,158,11,0.2)',
  },
};

interface LegalPageLayoutProps {
  badge: string;
  title: string;
  lastUpdated: string;
  summary: ReactNode;
  children: ReactNode;
  toc?: TocItem[];
  footerLinks?: FooterLink[];
  summaryTone?: SummaryTone;
  schemas?: Array<Record<string, unknown>>;
}

export default function LegalPageLayout({
  badge,
  title,
  lastUpdated,
  summary,
  children,
  toc,
  footerLinks = [],
  summaryTone = 'purple',
  schemas = [],
}: LegalPageLayoutProps) {
  const summaryStyle = SUMMARY_STYLES[summaryTone];

  return (
    <MarketingLayout>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="mb-12">
          <span className="badge badge-purple mb-4 inline-block">{badge}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">{title}</h1>
          <p className="text-slate-400 text-base">
            Last updated: <span className="text-white font-medium">{lastUpdated}</span>
          </p>
          <div className="mt-6 p-4 rounded-xl" style={summaryStyle}>
            <div className="text-slate-300 text-sm leading-relaxed">{summary}</div>
          </div>
        </div>

        {toc && toc.length > 0 ? (
          <section className="card p-5 mb-10">
            <h2 className="text-lg font-semibold text-white mb-3">Contents</h2>
            <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-400">
              {toc.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="hover:text-white transition-colors">
                  {item.label}
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <div className="space-y-10 text-slate-300 leading-relaxed">{children}</div>

        <div
          className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <Link href="/legal" className="text-slate-400 hover:text-white transition-colors">
            Back to Legal Center
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-slate-500">
            {footerLinks.map((item) =>
              item.external ? (
                <a key={item.label} href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}