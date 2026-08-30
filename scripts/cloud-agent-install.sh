#!/usr/bin/env bash
# Idempotent bootstrap for the Clinera www Cloud Agent environment.
# Runs after the repository is checked out. Safe to run repeatedly.
set -euo pipefail

cd "$(dirname "$0")/.."

# Prefer the pnpm version pinned by the repo lockfile via corepack when present.
if command -v corepack >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || true
fi

echo "==> Installing Node dependencies (pnpm, frozen lockfile)"
pnpm install --frozen-lockfile

# Playwright drives the e2e suite (pnpm test:e2e). Install the Chromium build and
# its OS libraries so the tests can run headless without extra setup.
echo "==> Installing Playwright Chromium + system libraries"
pnpm exec playwright install --with-deps chromium

echo "==> Install complete"
