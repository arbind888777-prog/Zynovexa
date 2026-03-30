#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/zynovexa}"
APP_USER="${APP_USER:-$USER}"
INSTALL_NODE="${INSTALL_NODE:-true}"

log() {
  printf '\033[0;34m[%s]\033[0m %s\n' "$(date '+%H:%M:%S')" "$1"
}

err() {
  printf '\033[0;31m[error]\033[0m %s\n' "$1" >&2
  exit 1
}

if [[ $EUID -ne 0 ]]; then
  err "Run this script as root on the VPS"
fi

export DEBIAN_FRONTEND=noninteractive

log "Updating apt packages"
apt-get update -y
apt-get upgrade -y

log "Installing base packages"
apt-get install -y ca-certificates curl git ufw nginx redis-server certbot python3-certbot-nginx

if [[ "$INSTALL_NODE" == "true" ]] && ! command -v node >/dev/null 2>&1; then
  log "Installing Node.js 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  log "Installing PM2"
  npm install -g pm2
fi

systemctl enable nginx
systemctl enable redis-server
systemctl start nginx
systemctl start redis-server

log "Creating app directories"
mkdir -p "$APP_DIR"
mkdir -p /etc/letsencrypt
mkdir -p "$APP_DIR/nginx/certbot-webroot"

log "Configuring firewall"
ufw allow OpenSSH || true
ufw allow 80/tcp || true
ufw allow 443/tcp || true
ufw --force enable || true

log "Bootstrap complete"
log "Next steps:"
log "1. git clone <repo> $APP_DIR"
log "2. create apps/api/.env and apps/web/.env"
log "3. sudo cp nginx/hostinger-pm2-zynovexa.conf /etc/nginx/sites-available/zynovexa.conf"
log "4. sudo ln -sf /etc/nginx/sites-available/zynovexa.conf /etc/nginx/sites-enabled/zynovexa.conf"
log "5. sudo nginx -t && sudo systemctl reload nginx"
log "6. ./deploy.sh"
log "7. sudo bash scripts/setup-pm2-startup.sh"
