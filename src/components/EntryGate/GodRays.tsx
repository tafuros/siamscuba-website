// Shimmering sun rays / light shafts (styles in gate.css). Pure CSS, no canvas -
// safe to drop into any dark ocean section (the gate + the Siam Similans page).

interface GodRaysProps {
  reducedMotion?: boolean;
}

// Hand-placed beams fanning out from the surface, varied so they don't pulse in
// unison. left %, width px, rotation deg, duration s, delay s.
const RAYS = [
  { left: 8, width: 90, rot: -14, dur: 11, delay: 0 },
  { left: 24, width: 140, rot: -7, dur: 9, delay: 1.5 },
  { left: 42, width: 110, rot: 4, dur: 12, delay: 0.6 },
  { left: 58, width: 170, rot: -3, dur: 8.5, delay: 2.2 },
  { left: 74, width: 120, rot: 9, dur: 10.5, delay: 1.1 },
  { left: 90, width: 95, rot: 15, dur: 9.5, delay: 3 },
];

const GodRays = ({ reducedMotion = false }: GodRaysProps) => (
  <div className="god-rays" aria-hidden="true">
    {RAYS.map((r, i) => (
      <span
        key={i}
        className="god-ray"
        style={{
          ["--ray-left" as string]: `${r.left}%`,
          ["--ray-width" as string]: `${r.width}px`,
          ["--ray-rot" as string]: `${r.rot}deg`,
          ["--ray-dur" as string]: reducedMotion ? "0s" : `${r.dur}s`,
          ["--ray-delay" as string]: reducedMotion ? "0s" : `${r.delay}s`,
        }}
      />
    ))}
  </div>
);

export default GodRays;
