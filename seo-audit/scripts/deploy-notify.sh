#!/bin/bash
# One-shot: wait for Vercel build of a given commit, verify the live site no
# longer contains a marker string, then notify via macOS + Resend email.
# Usage: deploy-notify.sh <sha> <marker-string> <human-label>
set -u
SHA="${1:?sha required}"
MARKER="${2:?marker required}"
LABEL="${3:-deploy}"
REPO="tafuros/siamscuba-website"
URL="https://siamscuba.com/"
CONF="$(dirname "$0")/notify.conf"
EMAIL_TO="benmosheavivi@gmail.com"

[ -f "$CONF" ] && . "$CONF"

notify_mac() { osascript -e "display notification \"$2\" with title \"$1\" sound name \"Glass\"" 2>/dev/null; }
send_email() {
  [ -z "${RESEND_API_KEY:-}" ] && return 0
  curl -s -m 20 -X POST https://api.resend.com/emails \
    -H "Authorization: Bearer ${RESEND_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"from\":\"${RESEND_FROM}\",\"to\":[\"${EMAIL_TO}\"],\"reply_to\":\"${EMAIL_TO}\",\"subject\":\"$1\",\"text\":\"$2\",\"html\":\"<p>$2</p>\"}" \
    >/dev/null 2>&1
}

RESULT="timeout"
for i in $(seq 1 40); do
  sleep 25
  ST=$(gh api "repos/$REPO/commits/$SHA/status" --jq '.state' 2>/dev/null)
  echo "poll $i: build=$ST"
  if [ "$ST" = "success" ]; then
    sleep 8
    CNT=$(curl -s -m 15 "$URL" | grep -c "$MARKER")
    echo "  live marker count = $CNT"
    if [ "$CNT" = "0" ]; then RESULT="live"; else RESULT="deployed-but-stale"; fi
    break
  fi
  if [ "$ST" = "failure" ] || [ "$ST" = "error" ]; then RESULT="build-failed"; break; fi
done

case "$RESULT" in
  live)
    notify_mac "✅ Deploy live: $LABEL" "siamscuba.com updated — $SHA verified clean."
    send_email "✅ Deploy live: $LABEL" "siamscuba.com deploy of commit $SHA is live and verified (marker '$MARKER' gone). https://siamscuba.com/"
    ;;
  deployed-but-stale)
    notify_mac "⚠️ Deploy built, edge stale: $LABEL" "Build $SHA succeeded but CDN still serving old HTML."
    send_email "⚠️ Deploy built but edge cache stale: $LABEL" "Vercel build $SHA succeeded but siamscuba.com edge still serves the old HTML (marker '$MARKER' still present). May need a cache purge."
    ;;
  build-failed)
    notify_mac "❌ Build failed: $LABEL" "Vercel build for $SHA failed."
    send_email "❌ Vercel build failed: $LABEL" "Vercel build for commit $SHA failed. Check the Vercel dashboard."
    ;;
  timeout)
    notify_mac "⏱️ Deploy not confirmed: $LABEL" "Gave up waiting on $SHA after ~17 min."
    send_email "⏱️ Deploy not confirmed: $LABEL" "Stopped waiting on Vercel build $SHA after ~17 min; status never reached success."
    ;;
esac
echo "FINAL_RESULT=$RESULT"
