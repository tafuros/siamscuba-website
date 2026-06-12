import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { Star } from "lucide-react";
import { googleReviews } from "@/data/googleReviews";

/**
 * AmbientReviews - a decorative, faded layer of Google review cards that sits
 * behind a section's content and drifts gently as you scroll (parallax depth).
 *
 * - Renders behind content: parent <section> must be `relative overflow-hidden
 *   isolate`. The layer is `-z-10`, so it paints above the section's own
 *   background but below ALL normal content - no per-element z-index needed.
 * - Never blocks interaction (`pointer-events-none`) and is hidden from a11y
 *   (`aria-hidden`) - these are eye-candy, the real reviews live in
 *   TripAdvisorSection.
 * - Respects `prefers-reduced-motion` (no drift).
 */

// Google "G" mark
const GoogleG = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
    <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
  </svg>
);

type Placement = {
  /** absolute positioning + width utilities */
  pos: string;
  /** [from, to] vertical drift in px across the section's scroll */
  drift: [number, number];
  /** static rotation in degrees */
  rotate: number;
};

// Cards hug the OUTER side margins (left/right edges) so they never sit over the
// section heading or the central content/widget - they decorate the gutters, not
// the title. Pattern alternates left/right so any window stays balanced.
// Sections rotate through these via `startIndex` for variety. Hidden below lg
// (see container class) because narrow viewports have no side gutter to spare.
const PRESETS: Placement[] = [
  { pos: "top-16 left-[1%] w-44 xl:w-52", drift: [55, -45], rotate: -3 },
  { pos: "top-10 right-[1%] w-44 xl:w-52", drift: [85, -55], rotate: 3 },
  { pos: "bottom-12 left-[2%] w-44 xl:w-52", drift: [50, -60], rotate: -2 },
  { pos: "bottom-16 right-[2%] w-44 xl:w-52", drift: [70, -40], rotate: 4 },
  { pos: "top-1/2 left-[1%] w-40 xl:w-48", drift: [90, -50], rotate: 2 },
  { pos: "top-1/2 right-[1%] w-40 xl:w-48", drift: [60, -75], rotate: -4 },
  { pos: "bottom-20 left-[1%] w-44 xl:w-52", drift: [45, -55], rotate: 3 },
  { pos: "bottom-10 right-[2%] w-44 xl:w-52", drift: [85, -35], rotate: -3 },
];

const AmbientCard = ({
  placement,
  review,
  progress,
  reduce,
}: {
  placement: Placement;
  review: (typeof googleReviews)[number];
  progress: MotionValue<number>;
  reduce: boolean;
}) => {
  const y = useTransform(
    progress,
    [0, 1],
    reduce ? [0, 0] : placement.drift,
  );

  return (
    <motion.div
      style={{ y, rotate: placement.rotate }}
      className={`absolute ${placement.pos} select-none rounded-2xl border border-border/60 bg-background/80 p-4 opacity-40 shadow-sm backdrop-blur-[1px]`}
    >
      <div className="mb-2 flex items-center gap-2">
        <GoogleG />
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i <= review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="line-clamp-3 text-xs leading-relaxed text-foreground/80">
        "{review.text}"
      </p>
      <p className="mt-2 text-[11px] font-medium text-muted-foreground">
        {review.name} · {review.country}
      </p>
    </motion.div>
  );
};

const AmbientReviews = ({
  startIndex = 0,
  count = 3,
  className = "",
}: {
  startIndex?: number;
  count?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const placements = Array.from(
    { length: count },
    (_, i) => PRESETS[(startIndex + i) % PRESETS.length],
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block ${className}`}
    >
      {placements.map((placement, i) => (
        <AmbientCard
          key={i}
          placement={placement}
          review={googleReviews[(startIndex + i) % googleReviews.length]}
          progress={scrollYProgress}
          reduce={reduce}
        />
      ))}
    </div>
  );
};

export default AmbientReviews;
