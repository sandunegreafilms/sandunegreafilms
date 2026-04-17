#!/usr/bin/env bash
# Push this project to a new GitHub repo (uses GitHub CLI).
# Prereqs: Xcode license accepted OR `brew install git` + use that git in PATH.
#          brew install gh && gh auth login
#
# Usage:
#   chmod +x scripts/push-to-github.sh
#   ./scripts/push-to-github.sh                    # prompts for repo name
#   GITHUB_REPO_NAME=my-site ./scripts/push-to-github.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v git >/dev/null 2>&1; then
  echo "Install git first (e.g. brew install git)."
  exit 1
fi

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  git init
  git branch -M main
fi

git add -A
if git diff --cached --quiet; then
  echo "Nothing new to commit."
else
  git commit -m "Initial commit: Sandu site"
fi

if ! command -v gh >/dev/null 2>&1; then
  echo ""
  echo "Install GitHub CLI:  brew install gh"
  echo "Then authenticate:   gh auth login"
  echo "Re-run this script, or add remote manually:"
  echo "  gh repo create YOUR-REPO-NAME --public --source=. --remote=origin --push"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Run: gh auth login"
  exit 1
fi

REPO_NAME="${GITHUB_REPO_NAME:-}"
if [ -z "$REPO_NAME" ]; then
  read -r -p "New GitHub repo name (e.g. sandu-site): " REPO_NAME
fi
if [ -z "$REPO_NAME" ]; then
  echo "Repo name required."
  exit 1
fi

if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote 'origin' already exists. Pushing..."
  git push -u origin main
else
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
fi

echo ""
echo "Done. Repo: $(gh repo view --json url -q .url 2>/dev/null || echo "https://github.com/$(gh api user -q .login)/$REPO_NAME")"
echo "Next: import this repo in Vercel (vercel.com → Add Project), or run: ./scripts/link-vercel.sh"
