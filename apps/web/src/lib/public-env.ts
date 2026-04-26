function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, '');
}

const HOSTED_FRONTEND_HOSTS = new Set([
  'zynovexa.com',
  'www.zynovexa.com',
  'zynovexa.in',
  'www.zynovexa.in',
]);

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

function isHostedFrontendOrigin(value: string | null): boolean {
  if (!value) {
    return false;
  }

  try {
    const { hostname } = new URL(value);
    return HOSTED_FRONTEND_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

function shouldUseSameOriginApi(envUrl: string | undefined, browserOrigin: string | null): boolean {
  if (!browserOrigin || !isHostedFrontendOrigin(browserOrigin)) {
    return false;
  }

  if (!envUrl) {
    return true;
  }

  try {
    const envHostname = new URL(envUrl).hostname;
    const browserHostname = new URL(browserOrigin).hostname;
    return envHostname === `api.${browserHostname}` || HOSTED_FRONTEND_HOSTS.has(envHostname);
  } catch {
    return true;
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

  if (browserOrigin && isLocalOrigin(browserOrigin)) {
    return 'http://localhost:4000/api';
  }

  if (shouldUseSameOriginApi(envUrl, browserOrigin)) {
    return trimTrailingSlash(`${browserOrigin}/api`);
  }

  if (envUrl) {
    return trimTrailingSlash(envUrl);
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
  const isLocal = browserOrigin && (browserOrigin.includes('localhost') || browserOrigin.includes('127.0.0.1'));
  const baseUrl = isLocal ? browserOrigin : (browserOrigin || getPublicSiteUrl());
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (isLocal) {
    console.log('[DEBUG] Auth Redirect URL set to:', `${baseUrl}${normalizedPath}`);
  }
  return `${baseUrl}${normalizedPath}`;
}
