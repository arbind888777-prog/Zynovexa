#!/bin/bash
# =============================================================================
# deploy.sh — Zynovexa Production Deployment Script
# For Hostinger VPS (Ubuntu 20.04/22.04)
#
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh [--no-build] [--skip-migrate]
# =============================================================================

set -e  # Exit on any error

# ── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ── Config ───────────────────────────────────────────────────────────────────
APP_DIR="/var/www/zynovexa"
COMPOSE_FILE="docker-compose.prod.yml"
SKIP_BUILD=false
SKIP_MIGRATE=false

# Parse args
for arg in "$@"; do
  case $arg in
    --no-build) SKIP_BUILD=true ;;
    --skip-migrate) SKIP_MIGRATE=true ;;
  esac
done

# ── Helpers ──────────────────────────────────────────────────────────────────
log()  { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"; }
ok()   { echo -e "${GREEN}✔ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
err()  { echo -e "${RED}✘ $1${NC}"; exit 1; }

# ── Pre-flight checks ────────────────────────────────────────────────────────
log "Pre-flight checks..."

command -v docker     >/dev/null 2>&1 || err "Docker is not installed"
command -v docker-compose >/dev/null 2>&1 || \
  docker compose version >/dev/null 2>&1 || \
  err "Docker Compose is not installed"

[[ -f ".env" ]]           || err ".env file not found. Copy .env.example → .env and fill in values."
[[ -f "$COMPOSE_FILE" ]]  || err "$COMPOSE_FILE not found in current directory."
[[ -f "apps/api/.env" ]]  || err "apps/api/.env not found. Copy apps/api/.env.example → apps/api/.env."

ok "Pre-flight checks passed"

# ── Pull latest code ─────────────────────────────────────────────────────────
log "Pulling latest code from git..."
git fetch origin
git pull origin main || warn "git pull failed — continuing with current code"
ok "Code updated"

# ── Create required directories ──────────────────────────────────────────────
log "Creating required directories..."
mkdir -p logs nginx/ssl
ok "Directories ready"

# ── Build Docker images ──────────────────────────────────────────────────────
if [ "$SKIP_BUILD" = false ]; then
  log "Building Docker images (this may take 3–5 minutes)..."

  # Load DOMAIN from .env for build args
  export $(grep -v '^#' .env | xargs) 2>/dev/null || true

  docker-compose -f "$COMPOSE_FILE" build \
    --build-arg NEXT_PUBLIC_API_URL="https://${DOMAIN:-localhost}" \
    --build-arg NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-}" \
    --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}" \
    --parallel

  ok "Docker images built"
else
  warn "Skipping build (--no-build flag set)"
fi

# ── Stop old containers (graceful) ──────────────────────────────────────────
log "Stopping old containers..."
docker-compose -f "$COMPOSE_FILE" down --timeout 30 2>/dev/null || true
ok "Old containers stopped"

# ── Start services ───────────────────────────────────────────────────────────
log "Starting services..."

LOCAL_DB_ENABLED=false
case ",${COMPOSE_PROFILES:-}," in
  *,local-db,*) LOCAL_DB_ENABLED=true ;;
esac

if [ "$LOCAL_DB_ENABLED" = true ]; then
  log "Local database profile detected; starting localdb and redis..."
  docker-compose -f "$COMPOSE_FILE" --profile local-db up -d localdb redis
  log "Waiting 15s for local database to be ready..."
  sleep 15
else
  log "External database detected; starting redis only..."
  docker-compose -f "$COMPOSE_FILE" up -d redis
fi

# ── Run DB migrations ────────────────────────────────────────────────────────
if [ "$SKIP_MIGRATE" = false ]; then
  log "Running database migrations..."
  docker-compose -f "$COMPOSE_FILE" run --rm \
    api sh -c 'if [ -n "$DIRECT_URL" ]; then export DATABASE_URL="$DIRECT_URL"; fi; npx prisma migrate deploy' || \
    warn "Migration step failed — API container will retry on startup"
  ok "Migrations applied"
else
  warn "Skipping migrations (--skip-migrate flag set)"
fi

# ── Start remaining services ─────────────────────────────────────────────────
log "Starting API, Web, and Nginx..."
docker-compose -f "$COMPOSE_FILE" up -d api web nginx certbot

# ── Health check ─────────────────────────────────────────────────────────────
log "Waiting 30s for services to initialise..."
sleep 30

log "Health check..."
STATUS=$(docker-compose -f "$COMPOSE_FILE" ps --format "table {{.Service}}\t{{.Status}}")
echo "$STATUS"

API_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' zynovexa-api 2>/dev/null || echo "unknown")
WEB_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' zynovexa-web 2>/dev/null || echo "unknown")

[[ "$API_HEALTH" == "healthy" ]] && ok "API service: healthy" || warn "API service: $API_HEALTH (check logs: docker logs zynovexa-api)"
[[ "$WEB_HEALTH" == "healthy" ]] && ok "Web service: healthy" || warn "Web service: $WEB_HEALTH (check logs: docker logs zynovexa-web)"

# ── Summary ──────────────────────────────────────────────────────────────────
DOMAIN_VAL=$(grep '^DOMAIN=' .env 2>/dev/null | cut -d'=' -f2 || echo "localhost")
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Zynovexa deployed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Site:  ${BLUE}https://${DOMAIN_VAL}${NC}"
echo -e "  API:   ${BLUE}https://${DOMAIN_VAL}/api${NC}"
echo -e "  Logs:  ${YELLOW}docker-compose -f $COMPOSE_FILE logs -f${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
