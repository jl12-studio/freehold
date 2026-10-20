#!/usr/bin/env bash
# Deploy the built site to any plain web host over SSH. This is the no-lock-in escape hatch.
#
# The build output in dist/ is plain static files, so any host that serves files can serve it.
# Two of those files, _headers and _redirects, are Cloudflare Pages conventions and do nothing
# on other hosts. DEPLOY.md ("Escape hatch: any plain host") has the nginx equivalent of the
# security headers and the www redirect.
set -euo pipefail

if [ -z "${DEPLOY_TARGET:-}" ]; then
  cat >&2 <<'USAGE'
Usage: DEPLOY_TARGET=user@host:/var/www/freeholders.org/ ./scripts/deploy-static.sh

Builds the site (pnpm build) and syncs dist/ to DEPLOY_TARGET with rsync, deleting files
on the host that are no longer in the build.

DEPLOY_TARGET is required: any rsync destination, for example user@host:/var/www/freeholders.org/
USAGE
  exit 1
fi

cd "$(dirname "$0")/.."

pnpm build
rsync -az --delete dist/ "$DEPLOY_TARGET"
