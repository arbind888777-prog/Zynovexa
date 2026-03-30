#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/zynovexa}"
APP_USER="${APP_USER:-$USER}"
INSTALL_NODE="${INSTALL_NODE:-false}"

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
apt-get install -y ca-certificates curl git ufw gettext-base apt-transport-https software-properties-common

if ! command -v docker >/dev/null 2>&1; then
  log "Installing Docker"
  curl -fsSL https://get.docker.com | sh
fi

log "Enabling Docker"
systemctl enable docker
systemctl start docker

if ! docker compose version >/dev/null 2>&1; then
  log "Installing Docker Compose plugin"
  apt-get install -y docker-compose-plugin
fi

if [[ "$INSTALL_NODE" == "true" ]] && ! command -v node >/dev/null 2>&1; then
  log "Installing Node.js 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

if id "$APP_USER" >/dev/null 2>&1; then
  usermod -aG docker "$APP_USER" || true
fi

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
log "2. cp .env.example .env"
log "3. cp apps/api/.env.example apps/api/.env"
log "4. ./deploy.sh --domain=yourdomain.com --email=admin@yourdomain.com"
