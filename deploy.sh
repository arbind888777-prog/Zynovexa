#!/bin/bash
# =============================================================================
# deploy.sh — Zynovexa VPS Deployment Script
# Kills ports 3001 & 4000, rebuilds, runs migrations
#
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh                  # Full deploy
#   ./deploy.sh --skip-migrate   # Skip Prisma migrations
#   ./deploy.sh --no-build       # Skip Docker build
# =============================================================================

set -e

# ── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ── Config ───────────────────────────────────────────────────────────────────
APP_DIR="${APP_DIR:-$(cd "$(dirname "$0")" && pwd)}"
COMPOSE_FILE="docker-compose.prod.yml"
SKIP_BUILD=false
SKIP_MIGRATE=false
SKIP_SSL=false

DOMAIN=""
LETSENCRYPT_EMAIL=""
ENABLE_WWW=false
CLI_DOMAIN=""
CLI_EMAIL=""

for arg in "$@"; do
  case $arg in
    --no-build)     SKIP_BUILD=true ;;
    --skip-migrate) SKIP_MIGRATE=true ;;
    --skip-ssl)     SKIP_SSL=true ;;
    --enable-www)   ENABLE_WWW=true ;;
    --domain=*)     CLI_DOMAIN="${arg#*=}"; DOMAIN="$CLI_DOMAIN" ;;
    --email=*)      CLI_EMAIL="${arg#*=}"; LETSENCRYPT_EMAIL="$CLI_EMAIL" ;;
  esac
done

# ── Helpers ──────────────────────────────────────────────────────────────────
log()  { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"; }
ok()   { echo -e "${GREEN}✔ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
err()  { echo -e "${RED}✘ $1${NC}"; exit 1; }

require_env_var() {
  local NAME=$1
  local VALUE=$2
  [[ -n "$VALUE" ]] || err "$NAME is required"
}

render_nginx_config() {
  local domain=$1
  local cert_domain=$2
  local aliases=$3
  local server_names=$domain

  if [[ -n "$aliases" ]]; then
    server_names="$server_names $aliases"
  fi

  export ZYNOVEXA_DOMAIN="$domain"
  export ZYNOVEXA_SERVER_NAMES="$server_names"
  export ZYNOVEXA_CERT_DOMAIN="$cert_domain"

  envsubst '${ZYNOVEXA_DOMAIN} ${ZYNOVEXA_SERVER_NAMES} ${ZYNOVEXA_CERT_DOMAIN}' \
    < nginx/nginx.conf.template \
    > nginx/nginx.conf
}

render_http_only_nginx_config() {
  local domain=$1
  local aliases=$2
  local server_names=$domain

  if [[ -n "$aliases" ]]; then
    server_names="$server_names $aliases"
  fi

  export ZYNOVEXA_SERVER_NAMES="$server_names"

  envsubst '${ZYNOVEXA_SERVER_NAMES}' \
    < nginx/nginx.http-only.conf.template \
    > nginx/nginx.conf
}

ensure_ssl_certificate() {
  local domain=$1
  local email=$2
  local www_flag=$3
  local cert_domain=$domain
  local aliases=""

  if [[ "$www_flag" == "true" ]]; then
    aliases="www.$domain"
  fi

  if [[ -f "/etc/letsencrypt/live/$cert_domain/fullchain.pem" && -f "/etc/letsencrypt/live/$cert_domain/privkey.pem" ]]; then
    ok "SSL certificate already exists for $cert_domain"
    render_nginx_config "$domain" "$cert_domain" "$aliases"
    return
  fi

  require_env_var "LETSENCRYPT_EMAIL" "$email"

  render_http_only_nginx_config "$domain" "$aliases"
  log "Starting nginx temporarily for ACME challenge..."
  docker compose -f "$COMPOSE_FILE" up -d --no-deps nginx

  local certbot_args=(certbot certonly --webroot -w /var/www/certbot -d "$domain" --email "$email" --agree-tos --no-eff-email)
  if [[ "$www_flag" == "true" ]]; then
    certbot_args+=( -d "www.$domain" )
  fi

  log "Requesting Let's Encrypt certificate for $domain..."
  docker run --rm \
    -v /etc/letsencrypt:/etc/letsencrypt \
    -v "$APP_DIR/nginx/certbot-webroot:/var/www/certbot" \
    certbot/certbot "${certbot_args[@]}"

  ok "SSL certificate created"
  docker compose -f "$COMPOSE_FILE" stop nginx >/dev/null 2>&1 || true
  render_nginx_config "$domain" "$cert_domain" "$aliases"
}

# ── Kill processes on a given port ───────────────────────────────────────────
kill_port() {
  local PORT=$1
  local PID
  PID=$(lsof -ti :$PORT 2>/dev/null || true)
  if [ -n "$PID" ]; then
    log "Killing process(es) on port $PORT (PID: $PID)..."
    echo "$PID" | xargs kill -9 2>/dev/null || true
    sleep 1
    ok "Port $PORT freed"
  else
    ok "Port $PORT is already free"
  fi
}

log "═══════════════════════════════════════════════════"
log "  Zynovexa Deployment — Starting"
log "═══════════════════════════════════════════════════"

# ── Step 1: Free up ports ────────────────────────────────────────────────────
log "Step 1: Freeing ports 3001 and 4000..."
kill_port 3001
kill_port 4000

# ── Step 2: Pre-flight checks ───────────────────────────────────────────────
log "Step 2: Pre-flight checks..."
cd "$APP_DIR" || err "Directory $APP_DIR not found"

command -v docker >/dev/null 2>&1 || err "Docker is not installed"
docker compose version >/dev/null 2>&1 || err "Docker Compose (v2) is not installed"
command -v envsubst >/dev/null 2>&1 || err "envsubst is not installed (package: gettext-base)"

[[ -f ".env" ]]            || err ".env file not found at $APP_DIR/.env"
[[ -f "$COMPOSE_FILE" ]]   || err "$COMPOSE_FILE not found"
[[ -f "apps/api/.env" ]]   || err "apps/api/.env not found"
[[ -f "nginx/nginx.conf.template" ]] || err "nginx/nginx.conf.template not found"
[[ -f "nginx/nginx.http-only.conf.template" ]] || err "nginx/nginx.http-only.conf.template not found"

export $(grep -v '^#' .env | xargs) 2>/dev/null || true

ROOT_DOMAIN="${DOMAIN:-}"

if [[ -z "$DOMAIN" ]]; then
  DOMAIN="$ROOT_DOMAIN"
fi
if [[ -z "$LETSENCRYPT_EMAIL" ]]; then
  LETSENCRYPT_EMAIL="${SSL_EMAIL:-}"
fi

if [[ -n "$CLI_DOMAIN" ]]; then
  DOMAIN="$CLI_DOMAIN"
fi
if [[ -n "$CLI_EMAIL" ]]; then
  LETSENCRYPT_EMAIL="$CLI_EMAIL"
fi

require_env_var "DOMAIN" "$DOMAIN"

if [[ -z "$ENABLE_WWW" || "$ENABLE_WWW" == "false" ]]; then
  if [[ "${ENABLE_WWW_DOMAIN:-false}" == "true" ]]; then
    ENABLE_WWW=true
  fi
fi

mkdir -p nginx/certbot-webroot

if [[ "$SKIP_SSL" == "false" ]]; then
  ensure_ssl_certificate "$DOMAIN" "$LETSENCRYPT_EMAIL" "$ENABLE_WWW"
else
  render_nginx_config "$DOMAIN" "$DOMAIN" "$([[ "$ENABLE_WWW" == "true" ]] && echo "www.$DOMAIN")"
fi

ok "Pre-flight checks passed"

# ── Step 3: Pull latest code ────────────────────────────────────────────────
log "Step 3: Pulling latest code..."
git fetch origin
git pull origin main || warn "git pull failed — continuing with current code"
ok "Code updated"

# ── Step 4: Stop old containers ─────────────────────────────────────────────
log "Step 4: Stopping old containers..."
docker compose -f "$COMPOSE_FILE" down --timeout 30 2>/dev/null || true
ok "Old containers stopped"

# ── Step 5: Build and start ─────────────────────────────────────────────────
if [ "$SKIP_BUILD" = false ]; then
  log "Step 5: Building and starting containers..."
  docker compose -f "$COMPOSE_FILE" up -d --build
  ok "Containers built and started"
else
  log "Step 5: Starting containers (no build)..."
  docker compose -f "$COMPOSE_FILE" up -d
  ok "Containers started"
fi

# ── Step 6: Run Prisma migrations ───────────────────────────────────────────
if [ "$SKIP_MIGRATE" = false ]; then
  log "Step 6: Waiting 15s for API container to initialize..."
  sleep 15
  log "Running Prisma migrations inside zynovexa-api..."
  docker exec zynovexa-api npx prisma migrate deploy || \
    warn "Migration failed — check: docker logs zynovexa-api"
  ok "Migrations applied"
else
  warn "Step 6: Skipping migrations (--skip-migrate flag)"
fi

# ── Step 7: Health check ────────────────────────────────────────────────────
log "Step 7: Waiting 20s for services to stabilize..."
sleep 20

log "Health check..."
docker compose -f "$COMPOSE_FILE" ps

API_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' zynovexa-api 2>/dev/null || echo "unknown")
WEB_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' zynovexa-web 2>/dev/null || echo "unknown")

[[ "$API_HEALTH" == "healthy" ]] && ok "API: healthy" || warn "API: $API_HEALTH (check: docker logs zynovexa-api)"
[[ "$WEB_HEALTH" == "healthy" ]] && ok "Web: healthy" || warn "Web: $WEB_HEALTH (check: docker logs zynovexa-web)"

# ── Summary ──────────────────────────────────────────────────────────────────
DOMAIN_VAL=$(grep '^DOMAIN=' .env 2>/dev/null | cut -d'=' -f2 || echo "localhost")
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Zynovexa deployed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Site:  ${BLUE}https://${DOMAIN_VAL}${NC}"
echo -e "  API:   ${BLUE}https://${DOMAIN_VAL}/api${NC}"
echo -e "  Logs:  ${YELLOW}docker compose -f $COMPOSE_FILE logs -f${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
