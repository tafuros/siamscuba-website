import { useMemo } from "react";

// Realistic deep-sea bubble field for the gate background (styles in gate.css,
// imported by EntryGate). Pure CSS - no Three.js cost on this overlay.

interface GateBubblesProps {
  /** Fewer, still bubbles when the user prefers reduced motion. */
  reducedMotion?: boolean;
}

const GateBubbles = ({ reducedMotion = false }: GateBubblesProps) => {
  const count = reducedMotion ? 12 : 34;

  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Pseudo-random but stable spread (varied size => sense of depth).
        const left = (i * 47 + 7) % 100;
        const depth = (i * 53) % 100; // 0 = near (big/sharp), 100 = far (small/soft)
        const size = 4 + (depth / 100) * 22 + ((i * 11) % 7); // ~4-33px
        const duration = 9 + ((i * 7) % 11) + (depth / 100) * 4; // slower = calmer
        const delay = (i * 0.7) % 9;
        // Far bubbles are blurrier and dimmer for atmosphere.
        const blur = depth < 40 ? 0 : (depth - 40) / 60; // 0 - 1px
        const maxOpacity = 0.35 + (1 - depth / 100) * 0.5;
        return { left, size, duration, delay, blur, maxOpacity };
      }),
    [count]
  );

  return (
    <div className="gate-bubbles" aria-hidden="true">
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="gate-bubble"
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            filter: b.blur ? `blur(${b.blur.toFixed(2)}px)` : undefined,
            animationDuration: reducedMotion ? undefined : `${b.duration}s`,
            animationDelay: reducedMotion ? undefined : `${b.delay}s`,
            // Cap brightness per-bubble for depth (the keyframe scales within this).
            ["--bubble-max" as string]: b.maxOpacity,
          }}
        />
      ))}
    </div>
  );
};

export default GateBubbles;
