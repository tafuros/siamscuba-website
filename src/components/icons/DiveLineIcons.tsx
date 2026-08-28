/**
 * Siam Scuba line icons - drawn for us, not borrowed.
 *
 * These replace the platform emoji that used to sit above the "Why divers pick
 * us" cards. Emoji render as a different picture on every device (Apple's glossy
 * 3-D boat, Google's flat one, a hollow glyph on some Androids), which is the one
 * thing a brand mark must never do. These are inline SVG: identical everywhere,
 * they inherit `currentColor` and the surrounding font size, and they cost no
 * network request.
 *
 * House rules for this set, so later additions stay in family:
 * - 44x44 viewBox, stroke-only, 1.5 stroke, round caps and joins.
 * - No fills - the dark card shows through, which is what makes them read as
 *   drawn rather than pasted.
 * - Each one names a real object from the shop, never a generic pictogram.
 */

type IconProps = {
  /** Rendered size in px. Defaults to the 34px the emoji occupied. */
  size?: number;
  className?: string;
};

const base = {
  viewBox: "0 0 44 44",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
};

/**
 * Two dive boats - the near one full size, the far one smaller and set back, so
 * the "two" is carried by the drawing rather than by the caption under it.
 */
export function TwoBoatsIcon({ size = 34, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...base}>
      {/* far boat, set back and up */}
      <path d="M23 17.5h15l-2.5 4.5H25.5z" opacity=".55" />
      <path d="M27.5 17.5V13h4l2.5 4.5" opacity=".55" />
      {/* near boat */}
      <path d="M6 26.5h31l-4.5 7.5h-22z" />
      <path d="M15 26.5v-7.5h8.5l4.5 7.5" />
      <path d="M19.5 19v-4" />
      {/* water */}
      <path d="M4 37.5c2.4-2 4.8-2 7.2 0s4.8 2 7.2 0 4.8-2 7.2 0 4.8 2 7.2 0 4.8-2 7.2 0" opacity=".5" />
    </svg>
  );
}

/**
 * A dive mask - the single object every guest on the boat is wearing, and the
 * most recognisable silhouette we own.
 */
export function DiveMaskIcon({ size = 34, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...base}>
      {/* skirt - taller than a goggle, with the nose pocket dipping below it */}
      <path d="M12.5 12h19a6 6 0 0 1 6 6v6.5a7.5 7.5 0 0 1-7.5 7.5h-2.2a2.6 2.6 0 0 1-2.2-1.25l-1.5-2.5a2.9 2.9 0 0 0-5 0l-1.5 2.5A2.6 2.6 0 0 1 15.2 32H13a7.5 7.5 0 0 1-7.5-7.5V18a6 6 0 0 1 6-6z" />
      {/* lens */}
      <path d="M14.5 16.5h15a1.5 1.5 0 0 1 1.5 1.5v5.5a3.5 3.5 0 0 1-3.5 3.5h-11a3.5 3.5 0 0 1-3.5-3.5V18a1.5 1.5 0 0 1 1.5-1.5z" opacity=".6" />
      {/* strap */}
      <path d="M5.5 19h-4M37.5 19h4" />
    </svg>
  );
}

/**
 * A five-star award medal - PADI 5-Star plus 43 years, in one object. The ribbon
 * tails keep it from reading as a generic "rating" star.
 */
export function FiveStarMedalIcon({ size = 34, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...base}>
      {/* ribbon tails */}
      <path d="M16.5 17.5 12 5h7l3.5 8.5M27.5 17.5 32 5h-7" opacity=".55" />
      {/* medal */}
      <circle cx="22" cy="25" r="12.5" />
      <path d="M22.0 18.8 L23.59 22.82 L27.9 23.08 L24.57 25.83 L25.64 30.02 L22.0 27.7 L18.36 30.02 L19.43 25.83 L16.1 23.08 L20.41 22.82 Z" />
    </svg>
  );
}

/** Icon keys usable from the copy files - keeps translations free of markup. */
export const DIVE_LINE_ICONS = {
  boats: TwoBoatsIcon,
  mask: DiveMaskIcon,
  medal: FiveStarMedalIcon,
} as const;

export type DiveLineIconName = keyof typeof DIVE_LINE_ICONS;
