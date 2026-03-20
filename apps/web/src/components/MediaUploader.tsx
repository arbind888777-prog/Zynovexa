'use client';

import type { ChangeEvent, ReactNode } from 'react';
import type { MediaType } from '@/types';

type MediaUploaderProps = {
  mediaTypes: MediaType[];
  selectedMediaType: MediaType;
  onSelectMediaType: (mediaType: MediaType) => void;
  mediaRequired: boolean;
  mediaUrls: string[];
  mediaLink: string;
  onMediaLinkChange: (value: string) => void;
  onAddMediaLink: () => void;
  onRemoveMedia: (url: string) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  accept: string;
  hint?: ReactNode;
  intro?: ReactNode;
  textModeEmptyState?: ReactNode;
};

export default function MediaUploader({
  mediaTypes,
  selectedMediaType,
  onSelectMediaType,
  mediaRequired,
  mediaUrls,
  mediaLink,
  onMediaLinkChange,
  onAddMediaLink,
  onRemoveMedia,
  onFileChange,
  uploading,
  accept,
  hint,
  intro,
  textModeEmptyState,
}: MediaUploaderProps) {
  const isVideo = selectedMediaType === 'VIDEO';

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-300">
          Media Upload
          {mediaRequired
            ? <span className="ml-1.5 text-xs text-red-400 font-normal">*</span>
            : <span className="ml-1.5 text-xs text-emerald-400 font-normal">(Optional)</span>}
        </label>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {mediaTypes.map((mediaType) => (
          <button
            key={mediaType}
            type="button"
            onClick={() => onSelectMediaType(mediaType)}
            className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
            style={{
              background: selectedMediaType === mediaType
                ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                : 'var(--surface)',
              border: `1px solid ${selectedMediaType === mediaType ? '#a855f7' : 'var(--border)'}`,
              color: selectedMediaType === mediaType ? '#fff' : '#9ca3af',
            }}
          >
            {mediaType}
          </button>
        ))}
      </div>

      {hint}

      {selectedMediaType !== 'TEXT' ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white">{isVideo ? 'Video upload karo ya link paste karo' : 'Image upload karo ya link paste karo'}</p>
              <p className="text-xs text-slate-400 mt-1">{intro || 'Quick posts ke liye yahan simple text, image aur video hi support hai.'}</p>
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              {uploading ? 'Uploading...' : isVideo ? 'Upload Video' : 'Upload Image'}
              <input type="file" className="hidden" accept={accept} onChange={onFileChange} disabled={uploading} />
            </label>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={mediaLink}
              onChange={(event) => onMediaLinkChange(event.target.value)}
              placeholder="Paste image/video link, for example https://.../video.mp4"
              className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            />
            <button
              type="button"
              onClick={onAddMediaLink}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'rgba(99,102,241,0.3)', border: '1px solid #6366f1' }}
            >
              Add Link
            </button>
          </div>

          {mediaRequired && mediaUrls.length === 0 && (
            <p className="mt-3 text-xs text-amber-400">{selectedMediaType} post ke liye media required hai.</p>
          )}

          {mediaUrls.length > 0 && (
            <div className="mt-4 grid gap-2">
              {mediaUrls.map((url) => (
                <div key={url} className="flex items-center justify-between rounded-lg bg-black/10 px-3 py-2 text-xs text-slate-300">
                  <span className="truncate pr-3">{url}</span>
                  <button type="button" onClick={() => onRemoveMedia(url)} className="text-red-400 hover:text-red-300">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        mediaUrls.length > 0 ? (
          <div className="mt-1 grid gap-2">
            {mediaUrls.map((url) => (
              <div key={url} className="flex items-center justify-between rounded-lg bg-black/10 px-3 py-2 text-xs text-slate-300">
                <span className="truncate pr-3">{url}</span>
                <button type="button" onClick={() => onRemoveMedia(url)} className="text-red-400 hover:text-red-300">Remove</button>
              </div>
            ))}
          </div>
        ) : (
          textModeEmptyState || <p className="text-xs text-emerald-400">Text-only post ke liye media zaroori nahi hai.</p>
        )
      )}
    </div>
  );
}