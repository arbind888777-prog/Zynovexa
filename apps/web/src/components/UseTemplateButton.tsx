'use client';

import { toast } from 'sonner';

export default function UseTemplateButton({ title }: { title: string }) {
  return (
    <button
      onClick={() => toast.success(`Template "${title}" copied! Customize it in the composer.`)}
      className="mt-3 text-xs text-purple-400 hover:text-purple-300 transition-colors"
    >
      Use Template →
    </button>
  );
}
