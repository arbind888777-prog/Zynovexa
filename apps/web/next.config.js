const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';
const defaultApiOrigin =
  process.env.INTERNAL_API_URL ||
  (isDevelopment ? 'http://localhost:4000/api' : process.env.NEXT_PUBLIC_API_URL || 'https://zynovexa.com/api');

const apiDestination =
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
