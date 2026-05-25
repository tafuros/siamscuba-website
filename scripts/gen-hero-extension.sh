#!/usr/bin/env bash
# Generate a downward-extended version of the turtle hero photo via
# Gemini 2.5 Flash Image (Nano Banana). The extended image will be used
# as the mobile-only hero source so the natural water + sun rays continue
# past the turtle and fade to white, instead of cutting off at the
# section boundary.
#
# Usage: bash scripts/gen-hero-extension.sh [output_basename]
set -euo pipefail

cd "$(dirname "$0")/.."

# Load env
if [ ! -f .env.local ]; then echo "Missing .env.local" >&2; exit 1; fi
set -a; source .env.local; set +a
if [ -z "${GEMINI_API_KEY:-}" ]; then echo "GEMINI_API_KEY not set in .env.local" >&2; exit 1; fi

OUT_BASE="${1:-turtle-extended-mobile}"
MODEL="${GEMINI_MODEL:-gemini-2.5-flash-image-preview}"
SOURCE_IMG="public/hero/turtle-1920.jpg"
TS=$(date +%Y%m%d-%H%M%S)
WORK=".playwright-mcp/nano-banana-${TS}"
mkdir -p "$WORK"

echo "[gen] model = $MODEL"
echo "[gen] source = $SOURCE_IMG"
echo "[gen] work dir = $WORK"

# 1. Base64-encode source image (no line wrap)
IMG_B64=$(base64 -i "$SOURCE_IMG" | tr -d '\n')

# 2. Build the prompt and request payload via jq so we don't fight shell quoting
PROMPT='Extend this underwater turtle photograph downward to create a tall vertical portrait composition (aspect ratio 9:16).

CRITICAL: preserve the original photo exactly as-is in the upper portion of the new image. Do not alter, recompose, or restyle the turtle, the sun-lit surface, or anything in the source photo.

BELOW the original photo, generate a seamless extension showing:
- The same teal-blue tropical ocean water continuing downward
- The diagonal sun rays (god rays, light shafts) that come from the upper-right and travel toward the lower-left in the source image, continuing into the extension and gradually softening as they descend
- Water becoming progressively lighter and brighter as it moves toward the bottom
- The bottom 20% of the new image fades smoothly to pure white (#FFFFFF)

DO NOT add: any animals (fish, turtles, divers, sharks), bubbles (other than faint specks consistent with the source), plants, coral, sea floor, sun beams from a different angle, text, watermarks, or borders.

The seam between the original photo and the generated extension must be invisible - water colour, light direction, ray geometry, and clarity must match perfectly at the boundary.

Output: a single vertical portrait image, 9:16 ratio, with the original photo at the top and the new generated water + ray + white-fade extension filling the bottom.'

PAYLOAD_FILE="$WORK/request.json"
jq -n --arg prompt "$PROMPT" --arg img "$IMG_B64" '{
  contents: [{
    parts: [
      { text: $prompt },
      { inline_data: { mime_type: "image/jpeg", data: $img } }
    ]
  }],
  generationConfig: { responseModalities: ["IMAGE"] }
}' > "$PAYLOAD_FILE"

echo "[gen] request size = $(wc -c < "$PAYLOAD_FILE") bytes"

# 3. POST to Gemini
URL="https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}"
RESP_FILE="$WORK/response.json"
HTTP_CODE=$(curl -s -o "$RESP_FILE" -w "%{http_code}" \
  -H "Content-Type: application/json" \
  -X POST "$URL" \
  --data-binary "@$PAYLOAD_FILE")

echo "[gen] HTTP $HTTP_CODE  (resp = $(wc -c < "$RESP_FILE") bytes)"

if [ "$HTTP_CODE" != "200" ]; then
  echo "[gen] FAIL  body:"
  head -c 2000 "$RESP_FILE"
  echo
  exit 1
fi

# 4. Extract the first inline_data image part
B64_OUT=$(jq -r '.candidates[0].content.parts[] | select(.inlineData != null) | .inlineData.data' "$RESP_FILE" | head -1)
MIME=$(jq -r '.candidates[0].content.parts[] | select(.inlineData != null) | .inlineData.mimeType' "$RESP_FILE" | head -1)

if [ -z "$B64_OUT" ] || [ "$B64_OUT" = "null" ]; then
  echo "[gen] NO IMAGE IN RESPONSE  first 2KB of body:"
  head -c 2000 "$RESP_FILE"
  exit 1
fi

EXT="png"
case "$MIME" in
  "image/jpeg"|"image/jpg") EXT="jpg" ;;
  "image/webp") EXT="webp" ;;
  "image/png") EXT="png" ;;
esac

OUT_FILE="public/hero/${OUT_BASE}.${EXT}"
echo "$B64_OUT" | base64 -d > "$OUT_FILE"

echo "[gen] wrote $OUT_FILE ($(wc -c < "$OUT_FILE") bytes, $MIME)"
sips -g pixelWidth -g pixelHeight "$OUT_FILE" 2>/dev/null | tail -2 || true
echo "[gen] DONE"
