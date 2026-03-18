# Zynovexa — Hostinger VPS Deployment Guide

## Architecture Overview

```
Internet → Nginx (80/443) → Next.js Web  (port 3001)
                          → NestJS API   (port 3000)
                          → PostgreSQL   (internal)
                          → Redis        (internal)
```

All services run in Docker containers on the VPS. Nginx acts as a reverse proxy and handles SSL termination.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Ubuntu / Debian VPS | 20.04 LTS or 22.04 LTS |
| Docker Engine | 24+ |
| Docker Compose | v2+ |
| Domain Name | Pointed to VPS IP (A record) |
| Open Ports | 22 (SSH), 80 (HTTP), 443 (HTTPS) |

---

## Step 1 — VPS Initial Setup

```bash
# SSH into Hostinger VPS
ssh root@YOUR_VPS_IP

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker && systemctl start docker

# Install Docker Compose plugin
apt install -y docker-compose-plugin

# (Optional) Create non-root user
adduser zynovexa
usermod -aG docker zynovexa
su - zynovexa
```

---

## Step 2 — Clone the Project

```bash
cd /var/www   # or your preferred directory
git clone https://github.com/YOUR_USERNAME/zynovexa.git
cd zynovexa
```

---

## Step 3 — Configure Environment Variables

### Root `.env` (Docker Compose variables)

```bash
cp .env.example .env
nano .env
```

Minimum required values:

```env
DOMAIN=yourdomain.com
POSTGRES_PASSWORD=change_this_to_strong_password
```

### API `.env` (NestJS configuration)

```bash
cp apps/api/.env.example apps/api/.env   # if .env.example exists
nano apps/api/.env
```

Fill in all required values (see `.env.example` at root for reference):

```env
NODE_ENV=production
PORT=3000

DATABASE_URL=postgresql://zynovexa:POSTGRES_PASSWORD@postgres:5432/zynovexa
REDIS_URL=redis://redis:6379

JWT_ACCESS_SECRET=generate_a_64_char_random_string_here
JWT_REFRESH_SECRET=generate_another_64_char_random_string_here

OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="Zynovexa <noreply@yourdomain.com>"

FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
```

> **Tip:** Generate secure secrets with: `openssl rand -base64 48`

---

## Step 4 — Configure Nginx Domain

Edit `nginx/nginx.conf` and replace **all** instances of `YOURDOMAIN` with your actual domain:

```bash
sed -i 's/YOURDOMAIN/yourdomain.com/g' nginx/nginx.conf
```

---

## Step 5 — Obtain SSL Certificate (Let's Encrypt)

First, start only Nginx on port 80 (before SSL is configured) to get the certificate:

```bash
# Temporarily use HTTP-only nginx config to pass ACME challenge
docker-compose -f docker-compose.prod.yml up -d nginx

# Get SSL certificate
docker run --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v $(pwd)/nginx/certbot-webroot:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly \
  --webroot -w /var/www/certbot \
  -d yourdomain.com -d www.yourdomain.com \
  --email admin@yourdomain.com \
  --agree-tos --no-eff-email
```

> **Note:** Your domain's DNS A record must point to the VPS IP **before** running certbot.

---

## Step 6 — Deploy

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

The script will:
1. Pull latest code from git
2. Build Docker images for API and Web
3. Start PostgreSQL and Redis
4. Run Prisma database migrations
5. Start API, Web, and Nginx services
6. Perform health checks

---

## Step 7 — Verify Deployment

```bash
# Check all containers are running
docker-compose -f docker-compose.prod.yml ps

# Check API health
curl https://yourdomain.com/api/health

# Check Web
curl -I https://yourdomain.com

# Follow live logs
npm run docker:prod:logs
```

---

## Daily Operations

### View logs
```bash
npm run docker:prod:logs
# or specific service:
docker logs zynovexa-api -f
docker logs zynovexa-web -f
docker logs zynovexa-nginx -f
```

### Redeploy after code change
```bash
git pull origin main
./deploy.sh
```

### Redeploy without rebuilding images
```bash
./deploy.sh --no-build
```

### Restart specific service
```bash
docker-compose -f docker-compose.prod.yml restart api
```

### Database management
```bash
# Run migrations manually
npm run db:migrate:prod

# Open Prisma Studio (runs on localhost — use SSH tunnel)
# ssh -L 5555:localhost:5555 user@YOUR_VPS_IP
# then on VPS:
docker exec -it zynovexa-api npx prisma studio
```

### Backup database
```bash
docker exec zynovexa-postgres pg_dump -U zynovexa zynovexa > backup_$(date +%Y%m%d).sql
```

### Stop all services
```bash
npm run docker:prod:down
```

---

## Alternative: PM2 Deployment (without Docker)

If you prefer running apps directly with PM2 (Node.js only, no Docker for app code):

### Prerequisites
- Node.js 20 LTS installed
- PostgreSQL 15 and Redis 7 installed on system
- PM2 installed globally: `npm install -g pm2`

### Steps

```bash
# Install dependencies
npm ci --workspaces

# Build apps
npm run build

# Run DB migrations
cd apps/api && npx prisma migrate deploy && cd ../..

# Create logs directory
mkdir -p logs

# Start with PM2
npm run pm2:start

# Save PM2 process list (auto-start on reboot)
pm2 save
pm2 startup systemd -u $USER --hp $HOME
```

### PM2 commands
```bash
npm run pm2:status    # List processes
npm run pm2:logs      # Follow logs
npm run pm2:restart   # Restart all
npm run pm2:stop      # Stop all
```

---

## Project Structure (Deployment Relevant Files)

```
zynovexa/
├── apps/
│   ├── api/                  ← NestJS API (port 3000)
│   │   ├── Dockerfile        ← Multi-stage Docker build
│   │   ├── .env              ← API secrets (create from .env.example)
│   │   └── prisma/           ← Database schema & migrations
│   └── web/                  ← Next.js Web App (port 3001)
│       └── Dockerfile        ← Multi-stage Docker build
├── nginx/
│   └── nginx.conf            ← Reverse proxy config (edit YOURDOMAIN)
├── docker-compose.yml        ← Development only
├── docker-compose.prod.yml   ← PRODUCTION deployment ← USE THIS
├── ecosystem.config.cjs      ← PM2 config (alternative to Docker)
├── deploy.sh                 ← Automated deployment script
├── .env                      ← Root env (DOMAIN, POSTGRES_PASSWORD)
└── .env.example              ← Template for environment variables
```

---

## Firewall Configuration (UFW)

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Container won't start | `docker logs zynovexa-api` or `docker logs zynovexa-web` |
| SSL cert error | Verify DNS points to VPS, rerun certbot step |
| Database connection refused | Check `apps/api/.env` DATABASE_URL, ensure postgres container is healthy |
| Port 80/443 in use | `ss -tlnp \| grep :80` — stop conflicting service |
| API 502 from Nginx | API container not healthy yet — wait 60s and check `docker ps` |
| Next.js build fails | Ensure `NEXT_PUBLIC_API_URL` is set in `docker-compose.prod.yml` |
