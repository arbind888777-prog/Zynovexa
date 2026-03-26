const path = require('path');

const defaultApiOrigin = process.env.NODE_ENV === 'production'
  ? 'http://127.0.0.1:4000/api'
  : 'http://localhost:4000/api';

const apiDestination =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  process.env.INTERNAL_API_URL ||
  defaultApiOrigin;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'oaidalleapiprodscus.blob.core.windows.net' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${apiDestination}/:path*` },
    ];
  },
};

module.exports = nextConfig;
