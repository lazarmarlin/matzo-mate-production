#!/bin/sh
set -eu
cd /workspace/matzomate
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/api/health; then
  exit 0
fi
# Preview must be this gunicorn app, not the old node server.
for p in /proc/[0-9]*; do
  tr "\0" " " 2>/dev/null < "$p/cmdline" | grep -q "[v]ite dev" && kill "$(basename "$p")" 2>/dev/null || true
  tr "\0" " " 2>/dev/null < "$p/cmdline" | grep -q "[g]unicorn server:app" && kill "$(basename "$p")" 2>/dev/null || true
done
gunicorn server:app --worker-class gthread --workers 1 --threads 4 --timeout 180 --bind 0.0.0.0:8080 >>/tmp/app-startup.log 2>&1 &
