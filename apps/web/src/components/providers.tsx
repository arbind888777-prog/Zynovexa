'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useState } from 'react';
import AiChatbot from '@/components/ai-chatbot';
import AuthHandler from '@/components/auth-handler';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } }));
  return (
    <QueryClientProvider client={queryClient}>
      <AuthHandler />
      {children}
      <Toaster richColors position="top-right" />
      <AiChatbot />
    </QueryClientProvider>
  );
}
