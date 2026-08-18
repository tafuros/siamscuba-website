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
# Room slugs from the retired invented inventory (standard-twin, deluxe-twin,
# deluxe-double, superior-double) were dropped 2026-08-17 when Ben's real
# 12-room inventory arrived - see ROOM_MAP below.
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
)

# Real room photos (Ben's per-room folders, 2026-08-17). Entries are
# "<path relative to SRC>|<output-slug>" - pipe-delimited because the folder
# names contain spaces. Order within a room = display order on the card;
# near-duplicates and junk frames (corridor, rooftop water tanks) were left out.
# "Bungalow garden" + "Bungalow garden 2" are the SAME units across two shoots,
# merged into the one garden-bungalow set.
ROOM_MAP=(
  # Garden Bungalow (best 6 of 13 across both folders)
  "Bungalow garden 2/IMG_0802.JPG|siam-hotel-koh-tao-garden-bungalow"
  "Bungalow garden/IMG_0800.JPG|siam-hotel-koh-tao-garden-bungalow-2"
  "Bungalow garden/9de105ee7adb43574af2c80feb362da2.jpg|siam-hotel-koh-tao-garden-bungalow-3"
  "Bungalow garden 2/IMG_0803.JPG|siam-hotel-koh-tao-garden-bungalow-4"
  "Bungalow garden/IMG_0801.JPG|siam-hotel-koh-tao-garden-bungalow-5"
  "Bungalow garden/IMG_0797.JPG|siam-hotel-koh-tao-garden-bungalow-6"
  # Bungalow Suite
  "Bungalow suit/IMG_0816.JPG|siam-hotel-koh-tao-bungalow-suite"
  "Bungalow suit/IMG_0817.JPG|siam-hotel-koh-tao-bungalow-suite-2"
  "Bungalow suit/IMG_0818.JPG|siam-hotel-koh-tao-bungalow-suite-3"
  "Bungalow suit/IMG_0814.JPG|siam-hotel-koh-tao-bungalow-suite-4"
  "Bungalow suit/IMG_0819.JPG|siam-hotel-koh-tao-bungalow-suite-5"
  "Bungalow suit/IMG_0815.JPG|siam-hotel-koh-tao-bungalow-suite-6"
  "Bungalow suit/IMG_0820.JPG|siam-hotel-koh-tao-bungalow-suite-7"
  "Bungalow suit/IMG_0821.JPG|siam-hotel-koh-tao-bungalow-suite-8"
  # Sea Front Bungalow
  "Sea Front Bungalow/IMG_0857.JPG|siam-hotel-koh-tao-sea-front-bungalow"
  "Sea Front Bungalow/IMG_0858.JPG|siam-hotel-koh-tao-sea-front-bungalow-2"
  "Sea Front Bungalow/IMG_0865.JPG|siam-hotel-koh-tao-sea-front-bungalow-3"
  "Sea Front Bungalow/IMG_0859.JPG|siam-hotel-koh-tao-sea-front-bungalow-4"
  "Sea Front Bungalow/IMG_0860.JPG|siam-hotel-koh-tao-sea-front-bungalow-5"
  "Sea Front Bungalow/IMG_0864.JPG|siam-hotel-koh-tao-sea-front-bungalow-6"
  "Sea Front Bungalow/IMG_0863.JPG|siam-hotel-koh-tao-sea-front-bungalow-7"
  "Sea Front Bungalow/IMG_0861.JPG|siam-hotel-koh-tao-sea-front-bungalow-8"
  # Deluxe Room (dropped near-dup 0827 + plain sink 0807)
  "deluxe room/IMG_0824.JPG|siam-hotel-koh-tao-deluxe-room"
  "deluxe room/IMG_0825.JPG|siam-hotel-koh-tao-deluxe-room-2"
  "deluxe room/IMG_0826.JPG|siam-hotel-koh-tao-deluxe-room-3"
  "deluxe room/IMG_0828.JPG|siam-hotel-koh-tao-deluxe-room-4"
  "deluxe room/IMG_0823.JPG|siam-hotel-koh-tao-deluxe-room-5"
  "deluxe room/IMG_0822.JPG|siam-hotel-koh-tao-deluxe-room-6"
  # Superior Room
  "Superior Room/IMG_0877.JPG|siam-hotel-koh-tao-superior-room"
  "Superior Room/IMG_0874.JPG|siam-hotel-koh-tao-superior-room-2"
  "Superior Room/IMG_0878.JPG|siam-hotel-koh-tao-superior-room-3"
  "Superior Room/IMG_0876.JPG|siam-hotel-koh-tao-superior-room-4"
  "Superior Room/IMG_0875.JPG|siam-hotel-koh-tao-superior-room-5"
  # Premium Room (dropped rooftop/water-tank frame 0853)
  "Premium Room/IMG_0851.JPG|siam-hotel-koh-tao-premium-room"
  "Premium Room/IMG_0855.JPG|siam-hotel-koh-tao-premium-room-2"
  "Premium Room/IMG_0856.JPG|siam-hotel-koh-tao-premium-room-3"
  "Premium Room/IMG_0849.JPG|siam-hotel-koh-tao-premium-room-4"
  "Premium Room/IMG_0848.JPG|siam-hotel-koh-tao-premium-room-5"
  "Premium Room/IMG_0854.JPG|siam-hotel-koh-tao-premium-room-6"
  "Premium Room/IMG_0852.JPG|siam-hotel-koh-tao-premium-room-7"
  "Premium Room/IMG_0850.JPG|siam-hotel-koh-tao-premium-room-8"
  # Suite Sea View Room (dropped near-dup 0873)
  "Suite Sea View Room/IMG_0872.JPG|siam-hotel-koh-tao-suite-sea-view"
  "Suite Sea View Room/IMG_0870.JPG|siam-hotel-koh-tao-suite-sea-view-2"
  "Suite Sea View Room/IMG_0871.JPG|siam-hotel-koh-tao-suite-sea-view-3"
  "Suite Sea View Room/IMG_0866.JPG|siam-hotel-koh-tao-suite-sea-view-4"
  "Suite Sea View Room/IMG_0869.JPG|siam-hotel-koh-tao-suite-sea-view-5"
  "Suite Sea View Room/IMG_0867.JPG|siam-hotel-koh-tao-suite-sea-view-6"
  "Suite Sea View Room/IMG_0868.JPG|siam-hotel-koh-tao-suite-sea-view-7"
  # Family Room
  "Family Room/IMG_0836.JPG|siam-hotel-koh-tao-family-room"
  "Family Room/IMG_0839.JPG|siam-hotel-koh-tao-family-room-2"
  "Family Room/IMG_0834.JPG|siam-hotel-koh-tao-family-room-3"
  "Family Room/IMG_0837.JPG|siam-hotel-koh-tao-family-room-4"
  "Family Room/IMG_0838.JPG|siam-hotel-koh-tao-family-room-5"
  "Family Room/IMG_0833.JPG|siam-hotel-koh-tao-family-room-6"
  "Family Room/IMG_0835.JPG|siam-hotel-koh-tao-family-room-7"
  "Family Room/IMG_0840.JPG|siam-hotel-koh-tao-family-room-8"
  # Triple Room (dropped near-dup 0880 + bed-runner close-up 0885)
  "Triple Room/IMG_0879.JPG|siam-hotel-koh-tao-triple-room"
  "Triple Room/IMG_0883.JPG|siam-hotel-koh-tao-triple-room-2"
  "Triple Room/IMG_0884.JPG|siam-hotel-koh-tao-triple-room-3"
  "Triple Room/IMG_0882.JPG|siam-hotel-koh-tao-triple-room-4"
  "Triple Room/IMG_0881.JPG|siam-hotel-koh-tao-triple-room-5"
  # Mermaid Room (dropped bare-corridor frame 0841)
  "Mermaid/IMG_0842.JPG|siam-hotel-koh-tao-mermaid-room"
  "Mermaid/IMG_0846.JPG|siam-hotel-koh-tao-mermaid-room-2"
  "Mermaid/IMG_0844.JPG|siam-hotel-koh-tao-mermaid-room-3"
  "Mermaid/IMG_0843.JPG|siam-hotel-koh-tao-mermaid-room-4"
  "Mermaid/IMG_0847.JPG|siam-hotel-koh-tao-mermaid-room-5"
  "Mermaid/IMG_0845.JPG|siam-hotel-koh-tao-mermaid-room-6"
  # Divers Dorm
  "Divers dormroom/B29D13C8-7F65-420E-80AD-849C6E458456.JPG|siam-hotel-koh-tao-divers-dorm"
  "Divers dormroom/8920EB28-328D-4B3E-B4DF-16736432B6C5.JPG|siam-hotel-koh-tao-divers-dorm-2"
  "Divers dormroom/FC2DB4FF-FE31-4A65-8CBA-DD878BFD9309.JPG|siam-hotel-koh-tao-divers-dorm-3"
  "Divers dormroom/B9DDA009-E799-4F4C-AD8D-B9645B1BBA81.JPG|siam-hotel-koh-tao-divers-dorm-4"
  # Divers Private (18MB originals - the resize below handles them)
  "Divers private/IMG_3441.jpg|siam-hotel-koh-tao-divers-private"
  "Divers private/IMG_3440.jpg|siam-hotel-koh-tao-divers-private-2"
  "Divers private/IMG_3439.jpg|siam-hotel-koh-tao-divers-private-3"
  "Divers private/IMG_3442.jpg|siam-hotel-koh-tao-divers-private-4"
  "Divers private/IMG_3443.jpg|siam-hotel-koh-tao-divers-private-5"
)

emit() { # $1 = input file, $2 = slug, $3 = role
  # 1600w card/gallery size + 800w mobile size, both WebP.
  magick "$1" -auto-orient -resize '1600x>' -strip -quality 82 "$OUT/$2.webp"
  magick "$1" -auto-orient -resize '800x>'  -strip -quality 80 "$OUT/$2-800.webp"
  [ "$3" = "hero" ] && \
    magick "$1" -auto-orient -resize '2000x>' -strip -quality 80 "$OUT/$2-2000.webp"
  return 0
}

for row in "${MAP[@]}"; do
  IFS=':' read -r base slug role <<< "$row"
  in="$SRC/$base.jpg"
  [ -f "$in" ] || { echo "MISSING: $in" >&2; continue; }
  emit "$in" "$slug" "$role"
  echo "  $base -> $slug"
done

for row in "${ROOM_MAP[@]}"; do
  rel="${row%%|*}"; slug="${row##*|}"
  in="$SRC/$rel"
  [ -f "$in" ] || { echo "MISSING: $in" >&2; continue; }
  emit "$in" "$slug" "std"
  echo "  $rel -> $slug"
done

echo "done -> $OUT"
du -sh "$OUT"
