#!/usr/bin/env bash
# Set commit author for THIS repo only (does not change global / other workspaces).
#
# Usage:
#   export SANDU_GIT_NAME="Sandu Negrea"
#   export SANDU_GIT_EMAIL="commits@example.com"   # email verified on Sandu's GitHub
#   ./scripts/configure-sandu-repo-git.sh
#
# Or run interactively (will prompt if vars unset).

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Not a git repository. Run: git init"
  exit 1
fi

NAME="${SANDU_GIT_NAME:-}"
EMAIL="${SANDU_GIT_EMAIL:-}"

if [ -z "$NAME" ]; then
  read -r -p "Sandu commit author name: " NAME
fi
if [ -z "$EMAIL" ]; then
  read -r -p "Sandu commit email (verified on Sandu's GitHub): " EMAIL
fi

if [ -z "$NAME" ] || [ -z "$EMAIL" ]; then
  echo "Name and email are required."
  exit 1
fi

git config user.name "$NAME"
git config user.email "$EMAIL"

echo ""
echo "Local identity for this repo only:"
git config --list --local | grep -E '^user\.(name|email)=' || true
echo ""
echo "Other repos still use: git config --global --get user.email"
