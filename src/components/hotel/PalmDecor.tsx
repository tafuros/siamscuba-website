/**
 * Coconut-palm page furniture for /hotel.
 *
 * The silhouette is not clip-art: it is our own Sairee Beach sunset photo
 * (lotus-1211) thresholded to a 1-bit alpha mask by scripts/build-hotel-images
 * notes. It is applied as a CSS mask so the frond can be tinted to whatever the
 * section behind it needs - a flat PNG would lock us to one colour.
 *
 * Purely decorative: aria-hidden, pointer-events-none, and it never affects
 * layout (absolutely positioned inside a relative section).
 */

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface PalmDecorProps {
  corner?: Corner;
  /** Any CSS colour. Defaults to a soft brand blue. */
  color?: string;
  opacity?: number;
  /** Width in px at the lg breakpoint; scales down on small screens. */
  size?: number;
  className?: string;
}

const CORNER_CLASSES: Record<Corner, string> = {
  "top-left": "top-0 left-0 -translate-x-1/4 -translate-y-1/4 -scale-x-100",
  "top-right": "top-0 right-0 translate-x-1/4 -translate-y-1/4",
  "bottom-left": "bottom-0 left-0 -translate-x-1/4 translate-y-1/4 -scale-100",
  "bottom-right": "bottom-0 right-0 translate-x-1/4 translate-y-1/4 -scale-y-100",
};

const PalmDecor = ({
  corner = "top-right",
  color = "#0b4a8f",
  opacity = 0.07,
  size = 520,
  className = "",
}: PalmDecorProps) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute z-0 select-none ${CORNER_CLASSES[corner]} ${className}`}
    style={{
      width: `min(${size}px, 70vw)`,
      aspectRatio: "600 / 380",
      opacity,
      backgroundColor: color,
      WebkitMaskImage: "url(/hotel/palm-mask.png)",
      maskImage: "url(/hotel/palm-mask.png)",
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
    }}
  />
);

export default PalmDecor;
