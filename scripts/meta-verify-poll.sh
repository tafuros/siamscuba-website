#!/bin/zsh
# meta-verify-poll.sh
# Polls Gmail (via `claude -p` + Gmail MCP) for the verification-decision draft
# created by the remote routine `meta-verification-watcher` (trig_018SG4oCP5kUS56C7Zy9rEba).
# On detection: fires a macOS notification + writes a state file + self-unloads.
# Stays silent otherwise.
#
# See [[project-meta-verification-watcher]] memory for context.

set -u

STATE_FILE="/tmp/meta-verify-notified"
PLIST_LABEL="com.siamscuba.meta-verify-poll"
PLIST_PATH="$HOME/Library/LaunchAgents/${PLIST_LABEL}.plist"
LOG="/tmp/meta-verify-poll.log"
CLAUDE_BIN="/Users/mainfolder/.npm-global/bin/claude"

# If we've already notified, self-disable and exit.
if [[ -f "$STATE_FILE" ]]; then
  launchctl bootout "gui/$(id -u)" "$PLIST_PATH" 2>/dev/null || true
  exit 0
fi

# Ask Claude (with Gmail MCP) whether the decision draft exists yet.
# Output contract: a single line. We grep loosely for VERIFIED / REJECTED.
PROMPT='Use the Gmail MCP tool mcp__claude_ai_Gmail__list_drafts to list current drafts in the account. Look for a draft whose subject begins with "[META VERIFIED" or "[META REJECTED" (created within the last 3 days). Reply with exactly one word on a single line and nothing else: VERIFIED if such a draft exists with [META VERIFIED, REJECTED if it exists with [META REJECTED, or NONE otherwise. No prose, no markdown, no quotes.'

cd /Users/mainfolder/Projects/website || exit 1

RESULT=$("$CLAUDE_BIN" -p --output-format text "$PROMPT" 2>>"$LOG" | tr -d '[:space:]')

echo "$(date -u +%FT%TZ) result=${RESULT}" >> "$LOG"

case "$RESULT" in
  *VERIFIED*)
    osascript -e 'display notification "Meta verified Siam Scuba portfolio ✅ — open Gmail draft for next step" with title "Meta Business Verification" subtitle "APPROVED" sound name "Hero"'
    echo "VERIFIED $(date -u +%FT%TZ)" > "$STATE_FILE"
    launchctl bootout "gui/$(id -u)" "$PLIST_PATH" 2>/dev/null || true
    ;;
  *REJECTED*)
    osascript -e 'display notification "Meta rejected Siam Scuba verification ❌ — open Gmail draft for re-entry plan" with title "Meta Business Verification" subtitle "REJECTED" sound name "Sosumi"'
    echo "REJECTED $(date -u +%FT%TZ)" > "$STATE_FILE"
    launchctl bootout "gui/$(id -u)" "$PLIST_PATH" 2>/dev/null || true
    ;;
  *)
    : # NONE / parse-failure → silent, will retry next interval
    ;;
esac
