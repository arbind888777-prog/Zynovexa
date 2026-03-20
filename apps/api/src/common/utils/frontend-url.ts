const DEFAULT_FRONTEND_URL = 'http://localhost:3001';

const ALLOWED_FRONTEND_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  'zynovexa.com',
  'www.zynovexa.com',
  'zynovexa.in',
  'www.zynovexa.in',
]);

const DEFAULT_ALLOWED_FRONTEND_ORIGINS = [
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'https://zynovexa.com',
  'https://www.zynovexa.com',
  'https://zynovexa.in',
  'https://www.zynovexa.in',
];

function toOrigin(urlValue: string): string | null {
  try {
    const parsed = new URL(urlValue);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    if (!ALLOWED_FRONTEND_HOSTS.has(parsed.hostname)) {
      return null;
    }

    return parsed.origin;
  } catch {
    return null;
  }
}

export function sanitizeFrontendUrl(candidate?: string | null, fallback = DEFAULT_FRONTEND_URL): string {
  return toOrigin(candidate || '') || toOrigin(fallback) || DEFAULT_FRONTEND_URL;
}

export function getAllowedFrontendOrigins(configuredFrontendUrl?: string | null): string[] {
  const origins = new Set<string>(DEFAULT_ALLOWED_FRONTEND_ORIGINS);
  const configuredOrigin = toOrigin(configuredFrontendUrl || '');

  if (configuredOrigin) {
    origins.add(configuredOrigin);
  }

  return [...origins];
}

export function encodeFrontendState(frontendUrl?: string | null): string | undefined {
  if (!frontendUrl) {
    return undefined;
  }

  const safeFrontendUrl = sanitizeFrontendUrl(frontendUrl);
  return Buffer.from(JSON.stringify({ frontendUrl: safeFrontendUrl }), 'utf8').toString('base64url');
}

export function decodeFrontendState(state?: string | string[] | null): string | undefined {
  const stateValue = Array.isArray(state) ? state[0] : state;

  if (!stateValue) {
    return undefined;
  }

  try {
    const decoded = JSON.parse(Buffer.from(stateValue, 'base64url').toString('utf8')) as { frontendUrl?: string };
    return decoded.frontendUrl ? sanitizeFrontendUrl(decoded.frontendUrl) : undefined;
  } catch {
    return undefined;
  }
}