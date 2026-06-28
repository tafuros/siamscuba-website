import "./seascape.css";

// Sunlit seascape backdrop for the entry gate: a soft sun + shimmering rays
// emitted from the TOP-RIGHT, a glowing horizon at the lower-third line, and a
// perspective sea that fills the bottom third and undulates via an SVG
// turbulence displacement filter. Pure CSS/SVG - no canvas. Replaces the old
// underwater GodRays + bubble field on the gate (those still serve
// SiamSimilansPage unchanged).

interface SeascapeProps {
  reducedMotion?: boolean;
}

// Rays fan down-and-left from the top-right source. Varied widths/timings so
// they shimmer out of sync.
const RAYS = [
  { w: 30, r: -10, d: 5.5, delay: 0 },
  { w: 46, r: -20, d: 7, delay: 1.3 },
  { w: 34, r: -30, d: 4.6, delay: 0.6 },
  { w: 50, r: -41, d: 6.4, delay: 2.1 },
  { w: 30, r: -52, d: 5, delay: 1.5 },
];

const Seascape = ({ reducedMotion = false }: SeascapeProps) => (
  <div className="seascape" aria-hidden="true">
    {/* Organic water warp: turbulence displaces the sea's ripple bands into
        natural waves; the noise animates so the surface keeps moving. */}
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <filter id="gateWater" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.009 0.052" numOctaves={3} seed={7} result="noise">
          {!reducedMotion && (
            <animate
              attributeName="baseFrequency"
              dur="14s"
              values="0.009 0.052;0.013 0.064;0.009 0.052"
              repeatCount="indefinite"
            />
          )}
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="13" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>

    <div className="sc-rays">
      <span className="sc-sun" />
      {RAYS.map((r, i) => (
        <span
          key={i}
          className="sc-beam"
          style={{
            ["--w" as string]: `${r.w}px`,
            ["--r" as string]: `${r.r}deg`,
            ["--d" as string]: reducedMotion ? "0s" : `${r.d}s`,
            ["--delay" as string]: reducedMotion ? "0s" : `${r.delay}s`,
          }}
        />
      ))}
    </div>

    <div className="sc-horizon" />
    <div className="sc-sea" />
  </div>
);

export default Seascape;
