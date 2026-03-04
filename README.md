# CreatorOS – AI Creator Automation Platform

## Project Overview
- **Name**: CreatorOS
- **Goal**: All-in-one AI-powered platform for content creators to manage social media, create content, schedule posts, analyze performance, and track monetization.
- **Stack**: Hono + TypeScript + Cloudflare Pages + D1 SQLite + TailwindCSS (CDN)

## Live URLs
- **App**: [Public URL after deployment]
- **Landing Page**: `/`
- **Login / Signup**: `/login`, `/signup`
- **Dashboard**: `/app`
- **Admin Panel**: `/admin`

## Demo Accounts

### Creator Account
- **Email**: `creator@demo.com`
- **Password**: `demo123`
- Pre-loaded with sample posts, analytics, brand deals, and connected accounts.

### Admin Account
- **Email**: `admin@creatoros.ai`
- **Password**: `admin123`
- Full admin panel access at `/admin`.

## Features Implemented

### Public Pages
| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing page with hero, features, pricing, testimonials, CTA |
| Login | `/login` | Email/password + Google OAuth (placeholder) |
| Signup | `/signup` | Account creation with validation |
| Onboarding | `/onboarding` | 4-step wizard: niche, accounts, goals, plan |

### Dashboard Pages (Authenticated)
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/app` | Stats cards, growth chart, upcoming posts, AI recommendations |
| Create Post | `/app/create` | Caption editor, AI generate, hashtag gen, viral score, live preview, platform selector, scheduler |
| Scheduled Posts | `/app/scheduled` | Filterable table of all posts with status, actions, viral scores |
| Accounts | `/app/accounts` | Connect/disconnect social accounts (Instagram, YouTube, TikTok, Twitter, LinkedIn, Facebook) |
| Analytics | `/app/analytics` | Engagement charts, follower growth, heatmap, top posts |
| AI Assistant | `/app/ai` | Chat interface with quick actions for ideas, captions, scripts, hashtags, growth strategies |
| Monetization | `/app/monetization` | Earnings tracker, brand deal CRUD, rate calculator, media kit generator |
| Billing | `/app/billing` | Plan display, upgrade flow, payment history |
| Settings | `/app/settings` | Profile editing, timezone, niche selection, danger zone |

### Admin Panel (`/admin`)
| Page | Description |
|------|-------------|
| Overview | System-wide stats, subscription distribution chart |
| Users | User management with search, role/plan editing |
| Subscriptions | Plan breakdown across all users |
| Posts Monitor | All posts across the platform |
| API Logs | Activity audit trail |
| Revenue | Monthly revenue chart and analytics |

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login with credentials |
| GET | `/api/auth/me` | Get current session |
| POST | `/api/auth/onboard` | Complete onboarding |
| POST | `/api/auth/logout` | End session |

### Posts (`/api/posts`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List posts (filterable by status) |
| GET | `/api/posts/:id` | Get single post |
| POST | `/api/posts` | Create post (draft/scheduled) |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/publish` | Publish immediately |

### Analytics (`/api/analytics`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard stats + recommendations |
| GET | `/api/analytics/growth` | Follower growth time series |
| GET | `/api/analytics/engagement` | Engagement breakdown by platform |
| GET | `/api/analytics/top-posts` | Best performing posts |
| GET | `/api/analytics/heatmap` | Best posting times |

### Accounts (`/api/accounts`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/accounts` | List connected accounts |
| POST | `/api/accounts/connect` | Connect platform |
| DELETE | `/api/accounts/:id` | Disconnect |
| POST | `/api/accounts/:id/reconnect` | Refresh token |

### AI (`/api/ai`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate` | Generate content (caption/ideas/script/hashtags/growth/viral_score) |
| GET | `/api/ai/history` | AI usage history |
| POST | `/api/ai/chat` | Conversational assistant |

### Monetization (`/api/monetization`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/monetization/overview` | Earnings + rate estimates |
| POST | `/api/monetization/deals` | Create brand deal |
| PUT | `/api/monetization/deals/:id` | Update deal |
| DELETE | `/api/monetization/deals/:id` | Delete deal |
| GET | `/api/monetization/media-kit` | Generate media kit data |

### Billing (`/api/billing`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/billing` | Subscription + payment info |
| POST | `/api/billing/upgrade` | Change plan |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all read |

### Admin (`/api/admin`) — Admin role required
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/overview` | System-wide stats |
| GET | `/api/admin/users` | List users (searchable) |
| GET | `/api/admin/users/:id` | User details |
| PUT | `/api/admin/users/:id` | Edit user role/plan |
| GET | `/api/admin/posts` | All posts |
| GET | `/api/admin/activity` | Activity logs |
| GET | `/api/admin/revenue` | Revenue analytics |

## Database Schema (D1 SQLite)

### Tables
| Table | Purpose |
|-------|---------|
| `users` | User identity, auth, profile, plan |
| `accounts` | Connected social platform accounts |
| `posts` | All content with scheduling and publishing |
| `analytics` | Per-post and per-account metrics |
| `scheduled_jobs` | Publishing queue entries |
| `ai_requests` | AI usage tracking |
| `subscriptions` | Plan management |
| `payments` | Transaction history |
| `brand_deals` | Monetization tracking |
| `notifications` | User alerts |
| `activity_logs` | Audit trail |
| `media_library` | Reusable media assets |

## Architecture

```
┌─────────────────────────────────────────────┐
│              Cloudflare Pages                │
│  ┌────────────────────────────────────────┐  │
│  │           Hono Application             │  │
│  │  ┌──────────┐  ┌───────────────────┐   │  │
│  │  │  Pages   │  │   API Routes      │   │  │
│  │  │ (HTML)   │  │ auth|posts|ai|... │   │  │
│  │  └──────────┘  └───────────────────┘   │  │
│  │          │              │              │  │
│  │  ┌───────┴──────────────┴──────────┐   │  │
│  │  │      Middleware Layer            │   │  │
│  │  │  CORS | Auth | Rate Limit       │   │  │
│  │  └────────────────┬────────────────┘   │  │
│  │                   │                    │  │
│  │  ┌────────────────┴────────────────┐   │  │
│  │  │        D1 Database              │   │  │
│  │  │  (SQLite at the edge)           │   │  │
│  │  └─────────────────────────────────┘   │  │
│  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run locally with D1
npm run dev:sandbox

# Apply migrations
npm run db:migrate:local

# Seed demo data
curl -X POST http://localhost:3000/api/init-demo

# Deploy to Cloudflare
npm run deploy:prod
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
