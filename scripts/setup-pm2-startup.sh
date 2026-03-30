#!/usr/bin/env bash

set -euo pipefail

APP_USER="${APP_USER:-${SUDO_USER:-$USER}}"
APP_HOME="${APP_HOME:-$(eval echo "~$APP_USER")}" 

log() {
  printf '\033[0;34m[%s]\033[0m %s\n' "$(date '+%H:%M:%S')" "$1"
}

err() {
  printf '\033[0;31m[error]\033[0m %s\n' "$1" >&2
  exit 1
}

command -v pm2 >/dev/null 2>&1 || err "pm2 is not installed"
command -v systemctl >/dev/null 2>&1 || err "systemctl is not available"

log "Saving current PM2 process list"
pm2 save

STARTUP_CMD=$(pm2 startup systemd -u "$APP_USER" --hp "$APP_HOME" | tail -n 1)

if [[ $EUID -ne 0 ]]; then
  log "Run the following command as root to enable PM2 on boot:"
  echo "$STARTUP_CMD"
else
  log "Enabling PM2 startup for user $APP_USER"
  eval "$STARTUP_CMD"
  pm2 save
fi

log "PM2 startup setup complete"