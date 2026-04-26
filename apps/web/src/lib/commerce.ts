const DEFAULT_CURRENCY = 'INR';

function normalizeCurrency(currency?: string | null) {
  return (currency || DEFAULT_CURRENCY).toUpperCase();
}

export function formatMoneyFromMinor(
  amount: number | null | undefined,
  currency?: string | null,
  options?: Intl.NumberFormatOptions,
) {
  const normalizedCurrency = normalizeCurrency(currency);
  const value = Number.isFinite(amount) ? (amount as number) / 100 : 0;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: normalizedCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatCompactMoneyFromMinor(amount: number | null | undefined, currency?: string | null) {
  const normalizedCurrency = normalizeCurrency(currency);
  const value = Number.isFinite(amount) ? (amount as number) / 100 : 0;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: normalizedCurrency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatNumber(value: number | null | undefined, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat('en-IN', options).format(Number.isFinite(value) ? (value as number) : 0);
}

export function buildAbsoluteUrl(path: string) {
  if (typeof window === 'undefined') return path;
  return new URL(path, window.location.origin).toString();
}

export function getCreatorPagePath(handle?: string | null) {
  return handle ? `/${handle}` : '';
}

export function getCreatorPageUrl(handle?: string | null) {
  const path = getCreatorPagePath(handle);
  return path ? buildAbsoluteUrl(path) : '';
}

export function getStorefrontPath(slug?: string | null) {
  return slug ? `/store/${slug}` : '';
}

export function getStorefrontUrl(slug?: string | null) {
  const path = getStorefrontPath(slug);
  return path ? buildAbsoluteUrl(path) : '';
}