function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, '');
}

export function getPublicApiBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;

  if (envUrl) {
    return trimTrailingSlash(envUrl);
  }

  if (typeof window !== 'undefined') {
    return trimTrailingSlash(`${window.location.origin}/api`);
  }

  return '/api';
}

export function getPublicSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;

  if (envUrl) {
    return trimTrailingSlash(envUrl);
  }

  if (typeof window !== 'undefined') {
    return trimTrailingSlash(window.location.origin);
  }

  return 'https://zynovexa.com';
}