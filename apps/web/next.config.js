const path = require('path');

// Production mein API port 4000 par hai, isliye ise update kiya hai
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
  output: 'standalone', // Ye line zaroori hai deployment ke liye
  outputFileTracingRoot: path.join(__dirname, '../..'),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'oaidalleapiprodscus.blob.core.windows.net' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${apiDestination}/:path*` },
    ];
  },
};

module.exports = nextConfig;
