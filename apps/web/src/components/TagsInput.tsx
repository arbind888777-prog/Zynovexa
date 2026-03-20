'use client';

import { useState } from 'react';
import { toast } from 'sonner';

function uniqueTags(tags: string[]) {
  return tags.filter((tag, index) => tags.indexOf(tag) === index);
}

export function normalizeTagLabel(value: string) {
  const cleaned = value.trim().replace(/^#+/, '').replace(/[\s,]+$/g, '').trim();
  return cleaned || null;
}

export function parseTagValue(value: string | string[]) {
  const source = Array.isArray(value) ? value.join(',') : value;
  const segments = source
    .split(/\n/)
    .flatMap((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return [] as string[];
      if (trimmedLine.includes(',')) return trimmedLine.split(',');

      const hashtagTokens = trimmedLine.match(/#[^\s#]+/g);
      if (hashtagTokens?.length) return hashtagTokens;
      return [trimmedLine];
    })
    .map((segment) => normalizeTagLabel(segment))
    .filter((segment): segment is string => Boolean(segment));

  return uniqueTags(segments);
}

export function formatTagsAsInput(tags: string[]) {
  return tags.map((tag) => `#${tag.replace(/\s+/g, '')}`).join(' ');
}

export function formatTagsForCopy(tags: string[]) {
  return tags.join(', ');
}

export function formatTagsAsHashtags(tags: string[]) {
  return tags.map((tag) => `#${tag.replace(/\s+/g, '')}`).join(' ');
}

type TagsInputProps = {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  helperText?: string;
};

export default function TagsInput({ label, tags, onChange, placeholder, helperText }: TagsInputProps) {
  const [draft, setDraft] = useState('');

  const commitTags = (incoming: string[]) => {
    const merged = uniqueTags([...tags, ...incoming]);
    onChange(merged);
  };

  const commitDraft = () => {
    const parsed = parseTagValue(draft);
    if (parsed.length > 0) {
      commitTags(parsed);
    }
    setDraft('');
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((item) => item !== tag));
  };

  const copyValue = async (value: string, message: string) => {
    if (!value) {
      toast.error('Pehle tags add karo.');
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      toast.success(message);
    } catch {
      toast.error('Clipboard copy failed.');
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => copyValue(formatTagsForCopy(tags), 'Tags copied!')}
            className="rounded-lg px-2.5 py-1 font-medium text-slate-300 transition-colors hover:text-white"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            📋 Copy Tags
          </button>
          <button
            type="button"
            onClick={() => copyValue(formatTagsAsHashtags(tags), 'Hashtags copied!')}
            className="rounded-lg px-2.5 py-1 font-medium text-slate-300 transition-colors hover:text-white"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            📋 Copy Hashtags
          </button>
        </div>
      </div>

      <div className="rounded-2xl px-4 py-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-white"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 transition-colors hover:text-white">
                ×
              </button>
            </span>
          ))}

          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitDraft}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ',') {
                event.preventDefault();
                commitDraft();
              }

              if (event.key === 'Backspace' && !draft && tags.length > 0) {
                event.preventDefault();
                onChange(tags.slice(0, -1));
              }
            }}
            onPaste={(event) => {
              const pasted = event.clipboardData.getData('text');
              const parsed = parseTagValue(pasted);
              if (parsed.length > 1) {
                event.preventDefault();
                commitTags(parsed);
                setDraft('');
              }
            }}
            placeholder={placeholder || 'Type a tag and press Enter'}
            className="min-w-[180px] flex-1 bg-transparent py-1 text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-slate-500">
        <span>{helperText || 'Press Enter or comma to add tags'}</span>
        <span>{tags.length} tags</span>
      </div>
    </div>
  );
}