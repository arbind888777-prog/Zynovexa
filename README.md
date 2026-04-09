# Zynovexa – AI Creator Automation Platform

## Project Overview
- **Name**: Zynovexa
- **Goal**: All-in-one AI-powered platform for content creators to manage social media, create content, schedule posts, analyze performance, and track monetization.
- **Stack**: NestJS (API) + Next.js (Web) + PostgreSQL (Supabase) + Prisma + Redis + TailwindCSS

## Live URLs
- **Web**: https://zynovexa.com
- **API**: https://zynovexa.com/api
- **Health**: https://zynovexa.com/api/health

## Architecture

```
Internet → Nginx (80/443)
  ├── /api/  → PM2 NestJS API (port 4000)
  ├── /ws/   → PM2 NestJS WebSocket (port 4000)
  └── /      → PM2 Next.js Web (port 3001)
```

## Project Structure

```
apps/
  api/     → NestJS backend (auth, posts, AI, commerce, analytics, etc.)
  web/     → Next.js frontend (React 19, TailwindCSS, Zustand)
nginx/     → Reverse proxy configs
scripts/   → Deployment & setup helpers
```

## Features

- Google OAuth + JWT authentication
- Post management & multi-platform scheduling
- AI content generation (GPT-4o, DALL-E 3, Gemini)
- Analytics & video analytics
- Monetization & brand deals
- Commerce (products, courses, checkout)
- SEO analysis
- Real-time notifications (WebSocket)
- Queue-based post publishing (Bull/Redis)
- Admin panel
- Gamification & growth coaching

## Development

```bash
# Install dependencies
npm install

# Start both API and Web in dev mode
npm run dev

# Or start individually
npm run dev:api
npm run dev:web

# Database
npm run db:migrate      # Dev migrations
npm run db:studio       # Prisma Studio
```

## Testing

```bash
npm run test:api        # API tests
npm run test:web        # Web tests
```

## Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for full VPS/PM2 deployment guide.

```bash
# Deploy via script
./deploy.sh

# Or via PM2
npm run pm2:start
npm run pm2:status
npm run pm2:logs
```

## Environment Setup

- **API**: `apps/api/.env` (see `apps/api/.env.example`)
- **Web**: `apps/web/.env` or `apps/web/.env.local`
- **Root**: `.env` (Docker/Compose vars)

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for Supabase configuration.
```

## Security Features
- JWT-based authentication with Web Crypto API
- Password hashing with SHA-256 + salt
- CORS middleware on all API routes
- Role-based access control (user/admin)
- Input validation on all endpoints
- SQL parameterized queries (no injection)
- HttpOnly session cookies

## Deployment
- **Platform**: Cloudflare Pages
- **Database**: Cloudflare D1 (SQLite)
- **CDN**: Tailwind CSS, Font Awesome, Chart.js via CDN
- **Status**: ✅ Active
- **Last Updated**: 2026-02-15
