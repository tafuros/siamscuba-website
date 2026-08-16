#!/usr/bin/env bash
# Verify a Vercel PREVIEW deployment unattended.
#
# Preview deployments sit behind Vercel Deployment Protection (SSO), so a plain
# curl gets a 302 to vercel.com/sso-api and can verify nothing. This script uses
# the project's Protection Bypass for Automation secret to reach the preview
# directly.
#
#   Usage:
#     bun run check:preview                    # resolve preview for current branch
#     bun run check:preview <preview-url>      # check a specific deployment
#     PROD=1 bun run check:preview             # check production instead (no secret needed)
#
# SECRET HANDLING - do not "improve" this:
#   The bypass secret lives in the macOS Keychain under
#     account "tafuros", service "VERCEL_AUTOMATION_BYPASS_SECRET"
#   It is piped straight into a curl config on stdin, so it never appears in
#   argv (visible via `ps`), never in a shell variable that could be echoed,
#   and never in this repo. Never add an echo/printf of the value.
#
#   To set it up, see AGENTS.md -> "Checking previews unattended".

set -euo pipefail

KEYCHAIN_ACCOUNT="tafuros"
KEYCHAIN_SERVICE="VERCEL_AUTOMATION_BYPASS_SECRET"
REPO="tafuros/siamscuba-website"

die() { printf '\033[31m%s\033[0m\n' "$*" >&2; exit 1; }
info() { printf '\033[36m%s\033[0m\n' "$*"; }

# ── resolve the base URL ────────────────────────────────────────────────────
if [[ "${PROD:-}" == "1" ]]; then
  BASE="https://siamscuba.com"
  USE_BYPASS=0
elif [[ $# -ge 1 && -n "${1:-}" ]]; then
  BASE="${1%/}"
  USE_BYPASS=1
else
  branch="$(git rev-parse --abbrev-ref HEAD)"
  [[ "$branch" == "main" ]] && die "On main - preview URLs are per-branch. Use PROD=1 to check production."
  command -v gh >/dev/null || die "gh CLI not found and no URL given."
  # NOTE: Vercel registers GitHub deployments keyed by COMMIT SHA, not branch
  # name - querying ?ref=<branch> always returns 0 results.
  sha="$(git rev-parse HEAD)"
  info "Resolving preview for $branch @ ${sha:0:8}"
  BASE=""
  for attempt in $(seq 1 "${PREVIEW_WAIT_TRIES:-10}"); do
    dep="$(gh api "repos/$REPO/deployments?ref=$sha&per_page=1" -q '.[0].id' 2>/dev/null || true)"
    if [[ -n "$dep" && "$dep" != "null" ]]; then
      BASE="$(gh api "repos/$REPO/deployments/$dep/statuses?per_page=20" \
        -q '[.[] | select(.environment_url != null and .environment_url != "")][0].environment_url' 2>/dev/null || true)"
      [[ -n "$BASE" && "$BASE" != "null" ]] && break
    fi
    [[ "$attempt" == "1" ]] && info "Waiting for Vercel to publish a preview URL..."
    sleep 15
    BASE=""
  done
  [[ -n "$BASE" ]] || die "No preview URL for ${sha:0:8} after waiting. Is the branch pushed and has Vercel finished building?"
  BASE="${BASE%/}"
  USE_BYPASS=1
fi

info "Target: $BASE"

# ── curl wrapper: injects the bypass header via stdin config, never argv ────
# $1 = path, $2 = output file ("" to discard). Echoes the HTTP status.
fetch() {
  local path="$1" out="${2:-/dev/null}"
  if [[ "$USE_BYPASS" == "1" ]]; then
    {
      printf 'header = "x-vercel-protection-bypass: '
      security find-generic-password -a "$KEYCHAIN_ACCOUNT" -s "$KEYCHAIN_SERVICE" -w | tr -d '\n\r'
      printf '"\n'
    } | curl -sS -K - -o "$out" -w '%{http_code}' --max-time 25 "$BASE$path"
  else
    curl -sS -o "$out" -w '%{http_code}' --max-time 25 "$BASE$path"
  fi
}

if [[ "$USE_BYPASS" == "1" ]]; then
  security find-generic-password -a "$KEYCHAIN_ACCOUNT" -s "$KEYCHAIN_SERVICE" >/dev/null 2>&1 \
    || die "Keychain item missing: account=$KEYCHAIN_ACCOUNT service=$KEYCHAIN_SERVICE
See AGENTS.md -> 'Checking previews unattended' for the one-time setup."
fi

fails=0
tmp="$(mktemp -t previewcheck)"
trap 'rm -f "$tmp"' EXIT

# ── expect <path> <expected-status> [must-contain] ─────────────────────────
expect() {
  local path="$1" want="$2" needle="${3:-}"
  local got; got="$(fetch "$path" "$tmp")"
  local ok=1
  [[ "$got" == "$want" ]] || ok=0
  if [[ -n "$needle" ]] && ! grep -qF "$needle" "$tmp"; then ok=0; fi
  if [[ "$ok" == "1" ]]; then
    printf '  \033[32mPASS\033[0m  %-44s %s\n' "$path" "$got"
  else
    printf '  \033[31mFAIL\033[0m  %-44s %s (expected %s%s)\n' \
      "$path" "$got" "$want" "${needle:+, containing \"$needle\"}"
    fails=$((fails + 1))
  fi
}

echo
info "Routing + status"
expect "/"                                          200
expect "/blog"                                      200
expect "/dive-sites"                                200
expect "/fun-dive-booking"                          200
expect "/open-water"                                200

info "Unmatched URLs must hard-404 with the branded page"
expect "/totally-made-up-path-check"                404 "drifted off the map"
expect "/courses"                                   404

info "Language-namespaced blog posts"
expect "/es/blog/curso-buceo-koh-tao"               200
expect "/es/blog/divemaster-koh-tao-padi-espanol"   200

info "Hotel mini-site - all four locales must resolve"
expect "/hotel"                                     200 "Siam Hotel"
expect "/he/hotel"                                  200
expect "/es/hotel"                                  200
expect "/fr/hotel"                                  200

info "Go Pro - all four locales must resolve"
expect "/go-pro"                                    200 "PADI Instructor"
expect "/he/go-pro"                                 200
expect "/es/go-pro"                                 200
expect "/fr/go-pro"                                 200

info "Critical analytics tags must survive the build"
expect "/"                                          200 "GTM-TN3SM66Q"
expect "/"                                          200 "AW-18357382437"

info "Sitemap"
expect "/sitemap.xml"                               200 "<loc>"

echo
if [[ "$fails" -gt 0 ]]; then
  die "$fails check(s) failed against $BASE"
fi
printf '\033[32mAll preview checks passed.\033[0m\n'
