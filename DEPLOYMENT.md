# Zynovexa Hostinger VPS Deployment Guide

This repository is prepared for Docker-based deployment on a Hostinger VPS.

Recommended flow:

1. Clone the repo on the VPS.
2. Create `.env` and `apps/api/.env`.
3. Run `./deploy.sh --domain=yourdomain.com --email=admin@yourdomain.com`.

The deployment script now:

1. Validates required files and tools.
2. Renders `nginx/nginx.conf` from `nginx/nginx.conf.template`.
3. Obtains a Let's Encrypt SSL certificate when needed.
4. Builds the API and web containers.
5. Starts Redis, API, web, Nginx, and Certbot renewal.
6. Runs Prisma migrations.
7. Prints service health.

## Architecture

```text
Internet -> Nginx (80/443) -> Next.js web (3001)
                         -> NestJS API (4000)
                         -> Redis (internal)
                         -> Supabase Postgres (external)
```

## Prerequisites

You need:

1. A Hostinger VPS running Ubuntu or Debian.
2. A domain whose A record points to the VPS IP.
3. Supabase project credentials.
4. Google OAuth credentials if using Google login / YouTube connect.
5. SMTP credentials if using email features.

## Step 1: Prepare the VPS

SSH into the server:

```bash
ssh root@YOUR_VPS_IP
```

Manual install path:

```bash
apt-get update -y
apt-get upgrade -y
apt-get install -y ca-certificates curl git ufw gettext-base docker-compose-plugin
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

Bootstrap helper:

[scripts/hostinger-bootstrap.sh](scripts/hostinger-bootstrap.sh)

Example:

```bash
git clone https://github.com/arbind888777-prog/Zynovexa.git /var/www/zynovexa
cd /var/www/zynovexa
chmod +x scripts/hostinger-bootstrap.sh deploy.sh
sudo APP_DIR=/var/www/zynovexa APP_USER=root bash scripts/hostinger-bootstrap.sh
```

## Step 2: Clone the repo on Hostinger

```bash
mkdir -p /var/www
git clone https://github.com/arbind888777-prog/Zynovexa.git /var/www/zynovexa
cd /var/www/zynovexa
```

## Step 3: Create the root `.env`

```bash
cp .env.example .env
```

Minimum recommended values:

```env
DOMAIN=yourdomain.com
SSL_EMAIL=admin@yourdomain.com
ENABLE_WWW_DOMAIN=false
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
COMPOSE_PROFILES=
```

Notes:

1. Keep `COMPOSE_PROFILES=` empty if you are using Supabase.
2. Set `ENABLE_WWW_DOMAIN=true` only if you want both `yourdomain.com` and `www.yourdomain.com` on the same cert.

## Step 4: Create `apps/api/.env`

```bash
cp apps/api/.env.example apps/api/.env
```

Production example:

```env
NODE_ENV=production
PORT=4000

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
DIRECT_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require

SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_public_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=media

REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

JWT_ACCESS_SECRET=generate_a_long_random_secret
JWT_REFRESH_SECRET=generate_a_different_long_random_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com
API_URL=https://yourdomain.com/api

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
YOUTUBE_CONNECT_CALLBACK_URL=https://yourdomain.com/api/accounts/connect/youtube/callback

YOUTUBE_DATA_API_KEY=your-youtube-api-key

TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
TWITTER_BEARER_TOKEN=your-twitter-bearer-token

FACEBOOK_GRAPH_API_TOKEN=optional-facebook-token
INSTAGRAM_GRAPH_API_TOKEN=optional-instagram-token

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
EMAIL_FROM="Zynovexa <noreply@yourdomain.com>"

TOKEN_ENCRYPTION_KEY=base64-encoded-32-byte-key
```

Generate secrets with:

```bash
openssl rand -base64 48
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 5: Configure Google OAuth properly

If you use Google login or YouTube connect, the Google Cloud Console must include these redirect URIs.

Required for login:

1. `https://yourdomain.com/api/auth/google/callback`

Required for YouTube connect:

1. `https://yourdomain.com/api/accounts/connect/youtube/callback`

Required for local development if you still test locally:

1. `http://localhost:4000/api/auth/google/callback`
2. `http://localhost:4000/api/accounts/connect/youtube/callback`

Without the YouTube callback, YouTube connect will fail with `redirect_uri_mismatch` even if Google login works.

## Step 6: Deploy on Hostinger

```bash
chmod +x deploy.sh scripts/hostinger-bootstrap.sh
./deploy.sh --domain=yourdomain.com --email=admin@yourdomain.com
```

If you want the certificate to include `www` too:

```bash
./deploy.sh --domain=yourdomain.com --email=admin@yourdomain.com --enable-www
```

If the certificate already exists and you only want to re-render config and deploy:

```bash
./deploy.sh --domain=yourdomain.com --email=admin@yourdomain.com --skip-ssl
```

## Step 7: Verify deployment

```bash
docker compose -f docker-compose.prod.yml ps
curl https://yourdomain.com/api/health
curl -I https://yourdomain.com
docker compose -f docker-compose.prod.yml logs -f
```

## Daily operations

Redeploy after pushing new code:

```bash
cd /var/www/zynovexa
git pull origin main
./deploy.sh --domain=yourdomain.com --email=admin@yourdomain.com --skip-ssl
```

View logs:

```bash
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f web
docker compose -f docker-compose.prod.yml logs -f nginx
```

Restart one service:

```bash
docker compose -f docker-compose.prod.yml restart api
```

Run migrations manually:

```bash
docker exec zynovexa-api npx prisma migrate deploy
```

## Optional GitHub Actions deploy

The workflow [deploy.yml](.github/workflows/deploy.yml) expects these repository secrets:

1. `HOST`
2. `USERNAME`
3. `PASSWORD`
4. `APP_DIR`
5. `DOMAIN`
6. `SSL_EMAIL`
7. `ENABLE_WWW`

If you do not want GitHub Actions deployment, you can ignore that workflow and deploy only through SSH.

## Important files

1. [deploy.sh](deploy.sh)
2. [docker-compose.prod.yml](docker-compose.prod.yml)
3. [nginx/nginx.conf.template](nginx/nginx.conf.template)
4. [scripts/hostinger-bootstrap.sh](scripts/hostinger-bootstrap.sh)
5. [apps/api/.env.example](apps/api/.env.example)
6. [.env.example](.env.example)

## Troubleshooting

`redirect_uri_mismatch` on YouTube connect:
Add the YouTube callback URI to Google Cloud Console.

`502 Bad Gateway` from Nginx:
Check `docker compose -f docker-compose.prod.yml ps` and `docker logs zynovexa-api`.

SSL certificate failure:
Make sure DNS is already pointing to the VPS before the first deploy.

API container unhealthy:
Check `apps/api/.env`, especially `DATABASE_URL`, `DIRECT_URL`, and `TOKEN_ENCRYPTION_KEY`.

Frontend cannot reach API:
Confirm `NEXT_PUBLIC_API_URL` builds as `https://yourdomain.com/api` through `.env` and `docker-compose.prod.yml`.
