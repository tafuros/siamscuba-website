#!/usr/bin/env bash
# One-shot asset pipeline for the /hotel section.
#
# Takes the original hotel photos (Lotus Paradise Resort shoot) and emits
# SEO-named, web-sized WebP into public/hotel/. Duplicates, the watermarked
# non-property shot (lotus-1210) and the Siam Scuba dive photos that were mixed
# into the same folder (lotus-1227..1232) are deliberately NOT in the map below.
#
# Re-runnable: overwrites its own output, never touches the source folder.
set -euo pipefail

SRC="${1:-/Users/mainfolder/Pictures/תמונות של המלון}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/hotel"
mkdir -p "$OUT"

# source-basename : output-slug : role (hero = also gets a 2000w variant)
MAP=(
  "lotus-1211:siam-hotel-koh-tao-palm-sunset:hero"
  "lotus-1025:siam-hotel-koh-tao-pool:hero"
  "lotus-1018:siam-hotel-koh-tao-sairee-beach-palm:hero"
  "lotus-1214:siam-hotel-koh-tao-rooftop-terrace:hero"
  "lotus-1024:siam-hotel-koh-tao-pool-bar:std"
  "lotus-1022:siam-hotel-koh-tao-sunset-longtail-boats:std"
  "lotus-1023:siam-hotel-koh-tao-beach-bar-sunset:std"
  "lotus-1183:siam-hotel-koh-tao-beach-palm-silhouette:std"
  "lotus-1216:siam-hotel-koh-tao-beach-lounge:std"
  "lotus-1028:siam-hotel-koh-tao-beach-restaurant-view:std"
  "lotus-1030:siam-hotel-koh-tao-beachfront-restaurant:std"
  "lotus-974:siam-hotel-koh-tao-building:std"
  "lotus-1027:siam-hotel-koh-tao-thai-massage:std"
  "lotus-1026:siam-hotel-koh-tao-foot-massage:std"
  "lotus-975:siam-hotel-koh-tao-superior-double:std"
  "lotus-1213:siam-hotel-koh-tao-deluxe-double:std"
  "lotus-1031:siam-hotel-koh-tao-deluxe-double-2:std"
  "lotus-1032:siam-hotel-koh-tao-deluxe-twin:std"
  "lotus-1180:siam-hotel-koh-tao-deluxe-twin-2:std"
  "lotus-1034:siam-hotel-koh-tao-standard-twin:std"
)

for row in "${MAP[@]}"; do
  IFS=':' read -r base slug role <<< "$row"
  in="$SRC/$base.jpg"
  [ -f "$in" ] || { echo "MISSING: $in" >&2; continue; }

  # 1600w card/gallery size + 800w mobile size, both WebP.
  magick "$in" -auto-orient -resize '1600x>' -strip -quality 82 "$OUT/$slug.webp"
  magick "$in" -auto-orient -resize '800x>'  -strip -quality 80 "$OUT/$slug-800.webp"
  [ "$role" = "hero" ] && \
    magick "$in" -auto-orient -resize '2000x>' -strip -quality 80 "$OUT/$slug-2000.webp"
  echo "  $base -> $slug"
done

echo "done -> $OUT"
du -sh "$OUT"
