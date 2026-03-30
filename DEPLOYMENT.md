# Zynovexa Hostinger VPS Deployment Guide

This repository is prepared for PM2-based deployment on a Hostinger VPS.

For a ready-to-use reverse proxy file, use [nginx/hostinger-pm2-zynovexa.conf](nginx/hostinger-pm2-zynovexa.conf).

Recommended flow:

1. Clone the repo on the VPS.
2. Create `apps/api/.env` and `apps/web/.env`.
3. Run `./deploy.sh`.

The deployment script now:

1. Optionally pulls the latest code.
2. Installs workspace dependencies.
3. Runs Prisma generate and migrations.
4. Builds the API and web apps.
5. Starts or reloads PM2 using `ecosystem.config.cjs`.
6. Runs local health checks for the API and web app.

## Architecture

```text
Internet -> Nginx (80/443) -> PM2 Next.js web (3001)
                         -> PM2 NestJS API (4000)
                         -> Redis
                         -> Supabase Postgres
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
apt-get install -y ca-certificates curl git nginx redis-server
npm install -g pm2
systemctl enable nginx
systemctl enable redis-server
systemctl start nginx
systemctl start redis-server
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

## Step 3: Create `apps/api/.env`

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

## Step 4: Create `apps/web/.env`

```bash
cat > apps/web/.env <<'EOF'
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
EOF
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
chmod +x deploy.sh
./deploy.sh
```

## Step 6A: Configure Nginx reverse proxy

Copy the ready config:

```bash
sudo cp nginx/hostinger-pm2-zynovexa.conf /etc/nginx/sites-available/zynovexa.conf
sudo ln -sf /etc/nginx/sites-available/zynovexa.conf /etc/nginx/sites-enabled/zynovexa.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Issue SSL if not already present:

```bash
sudo certbot --nginx -d zynovexa.com -d www.zynovexa.com
```

This proxy routes:

1. `https://zynovexa.com/` -> `127.0.0.1:3001`
2. `https://zynovexa.com/api/` -> `127.0.0.1:4000/api/`
3. `https://zynovexa.com/ws/` -> `127.0.0.1:4000/ws/`

## Step 6B: Make PM2 survive reboot

Use the helper script:

```bash
sudo bash scripts/setup-pm2-startup.sh
```

Or manually:

```bash
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
pm2 save
```

Useful flags:

```bash
./deploy.sh --skip-pull
./deploy.sh --skip-migrate
./deploy.sh --skip-build
./deploy.sh --branch=main
```

## Step 7: Verify deployment

```bash
pm2 status
pm2 logs zynovexa-api
pm2 logs zynovexa-web
curl http://127.0.0.1:4000/api/health
curl -I http://127.0.0.1:3001
```

## Daily operations

Redeploy after pushing new code:

```bash
cd /var/www/zynovexa
git pull origin main
./deploy.sh --skip-pull
```

View logs:

```bash
pm2 logs zynovexa-api
pm2 logs zynovexa-web
```

Restart one service:

```bash
pm2 restart zynovexa-api
pm2 restart zynovexa-web
```

Run migrations manually:

```bash
cd /var/www/zynovexa/apps/api
npx prisma migrate deploy
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
2. [ecosystem.config.cjs](ecosystem.config.cjs)
3. [nginx/hostinger-pm2-zynovexa.conf](nginx/hostinger-pm2-zynovexa.conf)
4. [scripts/hostinger-bootstrap.sh](scripts/hostinger-bootstrap.sh)
5. [scripts/setup-pm2-startup.sh](scripts/setup-pm2-startup.sh)
6. [apps/api/.env](apps/api/.env)
7. [apps/web/.env](apps/web/.env)

## Troubleshooting

`redirect_uri_mismatch` on YouTube connect:
Add the YouTube callback URI to Google Cloud Console.

`502 Bad Gateway` from Nginx:
Check `pm2 status`, `pm2 logs zynovexa-api`, and `pm2 logs zynovexa-web`.

PM2 app not starting after reboot:
Run [scripts/setup-pm2-startup.sh](scripts/setup-pm2-startup.sh) again and confirm `systemctl status pm2-$USER`.

SSL certificate failure:
Make sure DNS is already pointing to the VPS before the first deploy.

API process unhealthy:
Check `apps/api/.env`, especially `DATABASE_URL`, `DIRECT_URL`, and `TOKEN_ENCRYPTION_KEY`.

Frontend cannot reach API:
Confirm `NEXT_PUBLIC_API_URL` builds as `https://yourdomain.com/api` through [apps/web/.env](apps/web/.env) and rebuild with [deploy.sh](deploy.sh).
