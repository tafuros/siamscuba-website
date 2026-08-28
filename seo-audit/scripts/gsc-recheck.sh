#!/bin/zsh
# One-shot GSC re-check: did /fun-dive-booking and /blog recover from the
# "Redirect error" after the 2026-05-18 non-www->www host fix?
# Runs headless `claude -p` (local gsc MCP + cached OAuth), then notifies via
# macOS notification + email (Resend) + WhatsApp (Nemo webhook, if configured).
# Self-unloads its launchd agent after running (one-shot).
set -u

PROJ="/Users/mainfolder/Projects/website"
OUTDIR="$PROJ/seo-audit/_data/gsc-2026-05-20"
LOG="$OUTDIR/recheck.log"
JSON="$OUTDIR/recheck.json"
CONF="$PROJ/seo-audit/scripts/notify.conf"
LABEL="com.siamscuba.gsc-recheck"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
CLAUDE_BIN="$(command -v claude || echo /opt/homebrew/bin/claude)"

mkdir -p "$OUTDIR"
echo "=== GSC re-check run: $(date '+%Y-%m-%d %H:%M:%S') ===" >> "$LOG"

# Config (gitignored): RESEND_API_KEY, RESEND_FROM, NEMO_WEBHOOK_URL, WHATSAPP_TO
RESEND_API_KEY=""; RESEND_FROM=""; NEMO_WEBHOOK_URL=""; WHATSAPP_TO=""
[ -f "$CONF" ] && . "$CONF"
[ -z "$RESEND_FROM" ] && RESEND_FROM="Siam Scuba GSC Bot <orders@siamscuba.com>"

# --- 1. Inspect the 2 URLs via gsc MCP (headless claude) ---------------------
cd "$PROJ" || { echo "cd failed" >> "$LOG"; exit 1; }
PROMPT='Call mcp__gsc__batch_url_inspection with site_url "sc-domain:siamscuba.com" and urls (one per line): https://siamscuba.com/fun-dive-booking and https://siamscuba.com/blog . Then write the raw tool result JSON (the exact string the tool returned) to the file seo-audit/_data/gsc-2026-05-20/recheck.json using the Write tool. Output nothing else.'
"$CLAUDE_BIN" -p "$PROMPT" \
  --allowedTools "mcp__gsc__batch_url_inspection" "Write" \
  --output-format text >> "$LOG" 2>&1
CLAUDE_EXIT=$?
echo "claude exit=$CLAUDE_EXIT" >> "$LOG"

# --- 2. Parse result --------------------------------------------------------
SUMMARY=$(/usr/bin/python3 - "$JSON" <<'PY' 2>>"$LOG"
import json, sys
try:
    raw = open(sys.argv[1]).read()
    outer = json.loads(raw)
    inner = json.loads(outer["result"]) if isinstance(outer.get("result"), str) else outer
    states = {r["url"]: r.get("coverage_state", "?") for r in inner.get("results", [])}
    fd = states.get("https://siamscuba.com/fun-dive-booking", "?")
    bl = states.get("https://siamscuba.com/blog", "?")
    bad = lambda s: ("redirect error" in s.lower()) or s == "?"
    if not bad(fd) and not bad(bl):
        status = "RESOLVED"
    elif bad(fd) and bad(bl):
        status = "STILL_PENDING"
    else:
        status = "PARTIAL"
    print(f"{status}||fun-dive-booking: {fd}||blog: {bl}")
except Exception as e:
    print(f"ERROR||could not parse result: {e}||")
PY
)
[ -z "$SUMMARY" ] && SUMMARY="ERROR||claude/gsc step produced no parseable output||"
STATUS="${SUMMARY%%||*}"
REST="${SUMMARY#*||}"
LINE_FD="${REST%%||*}"
LINE_BL="${REST##*||}"
echo "parsed: $SUMMARY" >> "$LOG"

RAN=$(date '+%Y-%m-%d %H:%M')
WHAT="Re-inspected /fun-dive-booking and /blog in GSC vs the 2026-05-18 non-www->www host fix."
case "$STATUS" in
  RESOLVED)
    NSUB="OK - both pages indexed"
    NEXT="Fix is holding. No action needed - this check can stop." ;;
  STILL_PENDING)
    NSUB="Pending - Google has not recrawled"
    NEXT="In Search Console, Request Indexing for both URLs again, then re-run seo-audit/scripts/gsc-recheck.sh." ;;
  PARTIAL)
    NSUB="Partial - one page still pending"
    NEXT="In Search Console, Request Indexing for the page not yet 'Submitted and indexed'." ;;
  *)
    NSUB="Error - check did not complete"
    NEXT="Open the log below and run seo-audit/scripts/gsc-recheck.sh manually." ;;
esac
NTITLE="Siam Scuba SEO - GSC re-check"
NBODY="$LINE_FD | $LINE_BL -- $NEXT"

# --- 3a. macOS notification (title / status subtitle / result + next step) ---
# Clicking opens GSC for the property (the "where to continue" hub).
GSC_URL="https://search.google.com/search-console?resource_id=sc-domain:siamscuba.com"
TN="/opt/homebrew/bin/terminal-notifier"
if [ -x "$TN" ]; then
  "$TN" -title "$NTITLE" -subtitle "$NSUB" -message "$NBODY" \
    -open "$GSC_URL" -sound Glass -group "siamscuba-gsc-recheck" >> "$LOG" 2>&1 \
    && echo "macOS notification: sent (clickable -> GSC)" >> "$LOG" \
    || echo "macOS notification: terminal-notifier FAILED" >> "$LOG"
else
  /usr/bin/osascript -e "display notification \"$NBODY\" with title \"$NTITLE\" subtitle \"$NSUB\" sound name \"Glass\"" >> "$LOG" 2>&1 \
    && echo "macOS notification: sent (osascript, not clickable)" >> "$LOG" \
    || echo "macOS notification: FAILED" >> "$LOG"
fi

# --- 3b. Email via Resend ---------------------------------------------------
if [ -n "$RESEND_API_KEY" ]; then
  # Plain subject + structured text/plain + html + reply-to => fewer spam signals
  EMAIL_SUBJECT="Siam Scuba GSC re-check - $NSUB"
  EMAIL_TEXT="Siam Scuba - GSC 2-day re-check

STATUS
  $NSUB

WHAT WE CHECKED
  $WHAT

RESULT
  - $LINE_FD
  - $LINE_BL

NEXT STEP
  $NEXT

WHERE TO LOOK
  - Result JSON: $JSON
  - Run log:     $LOG
  - Script:      seo-audit/scripts/gsc-recheck.sh

Ran: $RAN"
  EMAIL_HTML="<div style=\"font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;color:#222\">
<h2 style=\"margin:0 0 4px\">Siam Scuba - GSC 2-day re-check</h2>
<p style=\"margin:0 0 16px;font-weight:600\">Status: $NSUB</p>
<p style=\"margin:0 0 4px;font-weight:600\">What we checked</p>
<p style=\"margin:0 0 16px\">$WHAT</p>
<p style=\"margin:0 0 4px;font-weight:600\">Result</p>
<ul style=\"margin:0 0 16px\"><li>$LINE_FD</li><li>$LINE_BL</li></ul>
<p style=\"margin:0 0 4px;font-weight:600\">Next step</p>
<p style=\"margin:0 0 16px\">$NEXT</p>
<p style=\"margin:0 0 4px;font-weight:600\">Where to look</p>
<ul style=\"margin:0 0 16px;color:#666\"><li>Result JSON: $JSON</li><li>Run log: $LOG</li><li>Script: seo-audit/scripts/gsc-recheck.sh</li></ul>
<p style=\"color:#999;margin:0\">Ran: $RAN</p></div>"
  HTTP=$(/usr/bin/curl -s -o "$OUTDIR/resend-resp.json" -w "%{http_code}" \
    -X POST "https://api.resend.com/emails" \
    -H "Authorization: Bearer $RESEND_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$(/usr/bin/python3 -c 'import json,sys; print(json.dumps({"from":sys.argv[3],"to":["benmosheavivi@gmail.com"],"reply_to":"benmosheavivi@gmail.com","subject":sys.argv[1],"text":sys.argv[4],"html":sys.argv[2]}))' "$EMAIL_SUBJECT" "$EMAIL_HTML" "$RESEND_FROM" "$EMAIL_TEXT")")
  echo "email (Resend): HTTP $HTTP" >> "$LOG"
else
  echo "email: skipped (RESEND_API_KEY not in notify.conf)" >> "$LOG"
fi

# --- 3c. WhatsApp via Nemo webhook (only if configured) ---------------------
if [ -n "$NEMO_WEBHOOK_URL" ] && [ -n "$WHATSAPP_TO" ]; then
  WA_MSG="$NTITLE - $NSUB"$'\n'"$LINE_FD | $LINE_BL"$'\n'"Next: $NEXT"
  HTTP=$(/usr/bin/curl -s -o "$OUTDIR/nemo-resp.json" -w "%{http_code}" \
    -X POST "$NEMO_WEBHOOK_URL" -H "Content-Type: application/json" \
    -d "$(/usr/bin/python3 -c 'import json,sys; print(json.dumps({"to":sys.argv[1],"message":sys.argv[2]}))' "$WHATSAPP_TO" "$WA_MSG")")
  echo "whatsapp (Nemo): HTTP $HTTP" >> "$LOG"
else
  echo "whatsapp: skipped (notify.conf not configured)" >> "$LOG"
fi

# --- 4. Self-unload (one-shot) — ONLY when launchd ran us (arg "scheduled").
# Manual test runs (no arg) skip this so they don't disarm the 05-20 job.
if [ "${1:-}" = "scheduled" ]; then
  echo "scheduled run -> unloading launchd agent $LABEL" >> "$LOG"
  /bin/launchctl bootout "gui/$(id -u)/$LABEL" >> "$LOG" 2>&1
  [ -f "$PLIST" ] && /bin/mv "$PLIST" "$PLIST.done"
else
  echo "manual run -> launchd agent left armed (no self-unload)" >> "$LOG"
fi
echo "=== done: $(date '+%Y-%m-%d %H:%M:%S') status=$STATUS ===" >> "$LOG"
exit 0
