#!/bin/bash

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_DIR="${APP_DIR:-$(cd "$(dirname "$0")" && pwd)}"
BRANCH="${BRANCH:-main}"
SKIP_PULL=false
SKIP_INSTALL=false
SKIP_GENERATE=false
SKIP_MIGRATE=false
SKIP_BUILD=false

for arg in "$@"; do
  case "$arg" in
    --skip-pull)      SKIP_PULL=true ;;
    --skip-install)   SKIP_INSTALL=true ;;
    --skip-generate)  SKIP_GENERATE=true ;;
    --skip-migrate)   SKIP_MIGRATE=true ;;
    --skip-build)     SKIP_BUILD=true ;;
    --branch=*)       BRANCH="${arg#*=}" ;;
    --domain=*)       ;; # accepted but not used (PM2 deployment)
    --email=*)        ;; # accepted but not used (PM2 deployment)
    --enable-www)     ;; # accepted but not used (PM2 deployment)
    *) echo "Unknown argument: $arg"; exit 1 ;;
  esac
done

log()  { echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"; }
ok()   { echo -e "${GREEN}✔ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
err()  { echo -e "${RED}✘ $1${NC}"; exit 1; }

require_command() {
  command -v "$1" >/dev/null 2>&1 || err "$1 is required but not installed"
}

run_step() {
  local label=$1
  shift
  log "$label"
  "$@"
}

pm2_delete_if_exists() {
  local app_name=$1
  if pm2 describe "$app_name" >/dev/null 2>&1; then
    log "Removing stale PM2 app registration: $app_name"
    pm2 delete "$app_name" >/dev/null 2>&1 || warn "Failed to delete PM2 app $app_name, continuing with fresh start"
  fi
}

health_check() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsS http://127.0.0.1:4000/api/health >/dev/null && ok "API health check passed" || warn "API health check failed"
    curl -fsS http://127.0.0.1:3001 >/dev/null && ok "Web health check passed" || warn "Web health check failed"
  else
    warn "curl not found, skipping HTTP health checks"
  fi
}

log "==============================================="
log "Zynovexa PM2 deployment starting"
log "==============================================="

cd "$APP_DIR" || err "Directory $APP_DIR not found"

require_command git
require_command node
require_command npm
require_command pm2

[[ -f "package.json" ]] || err "package.json not found in $APP_DIR"
[[ -f "apps/api/.env" ]] || err "apps/api/.env not found"
[[ -f "apps/web/.env" || -f "apps/web/.env.local" ]] || err "apps/web/.env or apps/web/.env.local not found"
[[ -f "ecosystem.config.cjs" ]] || err "ecosystem.config.cjs not found"

mkdir -p logs

if [[ "$SKIP_PULL" == "false" ]]; then
  run_step "Fetching latest code from $BRANCH" git fetch origin "$BRANCH"
  if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
    run_step "Pulling latest commit" git pull --ff-only origin "$BRANCH"
  else
    run_step "Checking out deployment branch" git checkout -B "$BRANCH" "origin/$BRANCH"
  fi
  ok "Repository updated"
else
  warn "Skipping git pull"
fi

export NPM_CONFIG_PRODUCTION=false

if [[ "$SKIP_INSTALL" == "false" ]]; then
  run_step "Installing workspace dependencies" npm install
  ok "Dependencies installed"
else
  warn "Skipping npm install"
fi

if [[ "$SKIP_GENERATE" == "false" ]]; then
  run_step "Generating Prisma client" npm run db:generate --workspace=@zynovexa/api
  ok "Prisma client generated"
else
  warn "Skipping Prisma generate"
fi

if [[ "$SKIP_MIGRATE" == "false" ]]; then
  run_step "Applying production Prisma migrations" npm run db:migrate:prod --workspace=@zynovexa/api
  ok "Prisma migrations applied"
else
  warn "Skipping Prisma migrations"
fi

if [[ "$SKIP_BUILD" == "false" ]]; then
  run_step "Building NestJS API" npm run build --workspace=@zynovexa/api
  run_step "Building Next.js web" npm run build --workspace=@zynovexa/web
  ok "Application builds completed"
else
  warn "Skipping application builds"
fi

pm2_delete_if_exists zynovexa-web
pm2_delete_if_exists zynovexa-api
pm2_delete_if_exists zynovexa-worker
run_step "Starting PM2 processes from ecosystem config" pm2 start ecosystem.config.cjs --env production

run_step "Saving PM2 process list" pm2 save
run_step "Current PM2 status" pm2 status

health_check

log "==============================================="
ok "Deployment finished"
log "App directory: $APP_DIR"
log "API: https://zynovexa.com/api"
log "Web: https://zynovexa.com"
log "Logs: pm2 logs zynovexa-api | pm2 logs zynovexa-web"
log "==============================================="
