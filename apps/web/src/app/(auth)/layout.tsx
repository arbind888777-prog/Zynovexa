import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Zynovexa',
    default: 'Sign In | Zynovexa',
  },
  description: 'Sign in or create your Zynovexa account to manage social media with AI.',
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
