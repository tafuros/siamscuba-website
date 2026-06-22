import { useEffect, useRef } from "react";

// Shimmering sun rays / light shafts (styles in gate.css). Pure CSS, no canvas.
// All rays fan out from ONE light source FIXED near the top-centre of the
// surface. The rays sway continuously on their own (real sunbeams are never
// still). On desktop the whole fan tilts a few degrees toward the cursor by
// PIVOTING around the fixed source (the sun stays put - only the angle changes),
// which reads far more naturally than sliding the source. Disabled on
// touch / reduced-motion.

interface GodRaysProps {
  reducedMotion?: boolean;
}

// Thin rays fanning out from the source by angle (deg). Varied widths/timings
// so they shimmer out of sync.
const RAYS = [
  { angle: -32, width: 26, dur: 5.5, delay: 0 },
  { angle: -22, width: 40, dur: 7, delay: 1.3 },
  { angle: -13, width: 30, dur: 4.6, delay: 0.6 },
  { angle: -5, width: 46, dur: 6.4, delay: 2.1 },
  { angle: 4, width: 28, dur: 5, delay: 1.5 },
  { angle: 12, width: 42, dur: 7.4, delay: 0.3 },
  { angle: 21, width: 30, dur: 5.8, delay: 2.4 },
  { angle: 31, width: 24, dur: 6.2, delay: 1 },
];

const GodRays = ({ reducedMotion = false }: GodRaysProps) => {
  const sourceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;

    // Tilt the whole fan toward the cursor by rotating around the fixed source
    // (CSS transition on .god-ray-source eases it). No permanent rAF loop.
    let queued = false;
    const onMove = (e: MouseEvent) => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const pct = (e.clientX / window.innerWidth) * 100;
        // Gentle: at most ~7deg of tilt either side of vertical.
        const tilt = (pct - 50) * 0.14;
        if (sourceRef.current) sourceRef.current.style.transform = `rotate(${tilt}deg)`;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion]);

  return (
    <div className="god-rays" aria-hidden="true">
      <div ref={sourceRef} className="god-ray-source" style={{ left: "50%" }}>
        {/* Soft glow at the source itself */}
        <span className="god-ray-sun" />
        {RAYS.map((r, i) => (
          <span
            key={i}
            className="god-ray"
            style={{
              ["--ray-rot" as string]: `${r.angle}deg`,
              ["--ray-width" as string]: `${r.width}px`,
              ["--ray-dur" as string]: reducedMotion ? "0s" : `${r.dur}s`,
              ["--ray-delay" as string]: reducedMotion ? "0s" : `${r.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GodRays;
