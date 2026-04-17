#!/usr/bin/env bash
# Link folder to Vercel and deploy (CLI). Requires a Vercel account.
#
# Prereqs: npm/npx available
# One-time: npx vercel login   (opens browser)
#
# Usage:
#   chmod +x scripts/link-vercel.sh
#   ./scripts/link-vercel.sh
#
# Non-interactive CI token (optional):
#   export VERCEL_TOKEN=...   # from Vercel → Settings → Tokens
#   npx vercel deploy --prod --token "$VERCEL_TOKEN" --yes

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v npx >/dev/null 2>&1; then
  echo "Install Node.js (includes npx): https://nodejs.org or brew install node"
  exit 1
fi

echo "Deploying with Vercel CLI (static site, no build step)..."
if [ -n "${VERCEL_TOKEN:-}" ]; then
  npx --yes vercel@latest deploy --prod --yes --token "$VERCEL_TOKEN"
else
  npx --yes vercel@latest deploy --prod
fi

echo ""
echo "In Vercel dashboard: Project → Settings → Domains → add your Namecheap domain."
echo "Then at Namecheap → Domain → Advanced DNS, add the exact records Vercel shows."
