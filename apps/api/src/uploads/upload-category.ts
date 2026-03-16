import { extname } from 'path';

export type UploadCategory = 'images' | 'videos' | 'audio' | 'documents';

const ALLOWED_IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.avif', '.heic', '.heif',
]);

const ALLOWED_VIDEO_EXTENSIONS = new Set([
  '.mp4', '.mov', '.webm', '.avi', '.mkv', '.m4v', '.mpeg', '.mpg', '.3gp',
]);

const ALLOWED_AUDIO_EXTENSIONS = new Set([
  '.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac',
]);

const ALLOWED_DOCUMENT_EXTENSIONS = new Set([
  '.pdf', '.txt', '.md',
]);

export function resolveUploadCategory(fileName?: string, mimeType?: string): UploadCategory | null {
  const extension = extname(fileName || '').toLowerCase();
  const normalizedMimeType = (mimeType || '').toLowerCase();

  if (normalizedMimeType.startsWith('image/') || ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
    return 'images';
  }

  if (normalizedMimeType.startsWith('video/') || ALLOWED_VIDEO_EXTENSIONS.has(extension)) {
    return 'videos';
  }

  if (normalizedMimeType.startsWith('audio/') || ALLOWED_AUDIO_EXTENSIONS.has(extension)) {
    return 'audio';
  }

  if (
    normalizedMimeType === 'application/pdf'
    || normalizedMimeType === 'text/plain'
    || ALLOWED_DOCUMENT_EXTENSIONS.has(extension)
  ) {
    return 'documents';
  }

  return null;
}