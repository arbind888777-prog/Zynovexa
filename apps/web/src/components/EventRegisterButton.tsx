'use client';

import { toast } from 'sonner';

export default function EventRegisterButton({ title }: { title: string }) {
  return (
    <button
      className="btn btn-secondary btn-sm shrink-0"
      onClick={() => toast.success(`Registered for "${title}"! Check your email for details.`)}
    >
      Register →
    </button>
  );
}
