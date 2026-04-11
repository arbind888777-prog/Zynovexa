const fs = require('fs');
const path = require('path');

const webStandaloneCandidates = [
  path.join(__dirname, 'apps/web/.next/standalone/apps/web/server.js'),
  path.join(__dirname, 'apps/web/.next/standalone/server.js'),
];

const webStandaloneScript =
  webStandaloneCandidates.find((candidate) => fs.existsSync(candidate)) ||
  webStandaloneCandidates[0];

/**
 * PM2 Ecosystem Config — Zynovexa
 * Used for Hostinger VPS deployment WITHOUT Docker.
 * Prerequisites:
 *   - apps/api:  npm run build  (creates apps/api/dist/)
 *   - apps/web:  npm run build  (creates apps/web/.next/standalone/)
 *   - An external Postgres-compatible database (for example Supabase) and Redis must be available
 */
module.exports = {
  apps: [
    // ──────────────────────────────────────────────────────────
    // NestJS API  (port 4000)
    // ──────────────────────────────────────────────────────────
    {
      name: 'zynovexa-api',
      script: path.join(__dirname, 'apps/api/dist/main.js'),
      cwd: path.join(__dirname, 'apps/api'),
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      restart_delay: 3000,
      max_restarts: 10,
      error_file: path.join(__dirname, 'logs/api-error.log'),
      out_file: path.join(__dirname, 'logs/api-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    },

    // ──────────────────────────────────────────────────────────
    // Next.js Web  (port 3001)
    // Requires: next.config.js → output: 'standalone'
    // ──────────────────────────────────────────────────────────
    {
      name: 'zynovexa-web',
      script: webStandaloneScript,
      cwd: path.join(__dirname, 'apps/web'),
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      restart_delay: 3000,
      max_restarts: 10,
      error_file: path.join(__dirname, 'logs/web-error.log'),
      out_file: path.join(__dirname, 'logs/web-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: '0.0.0.0'
      }
    }
  ]
}

