function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, '');
}

function isLocalOrigin(value: string | null): boolean {
  if (!value) {
    return false;
  }

  try {
    const { hostname } = new URL(value);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function getBrowserOrigin(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return trimTrailingSlash(window.location.origin);
}

export function getPublicApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const browserOrigin = getBrowserOrigin();

  if (envUrl) {
    return trimTrailingSlash(envUrl);
  }

  if (browserOrigin && isLocalOrigin(browserOrigin)) {
    return 'http://localhost:4000/api';
  }

  if (browserOrigin) {
    return trimTrailingSlash(`${browserOrigin}/api`);
  }

  return '/api';
}

export function getPublicSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  const browserOrigin = getBrowserOrigin();

  if (browserOrigin && isLocalOrigin(browserOrigin)) {
    return browserOrigin;
  }

  if (envUrl) {
    return trimTrailingSlash(envUrl);
  }

  if (browserOrigin) {
    return browserOrigin;
  }

  return 'https://zynovexa.com';
}

export function getPublicAuthRedirectUrl(path: string): string {
  const browserOrigin = getBrowserOrigin();
  const baseUrl = browserOrigin || getPublicSiteUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
