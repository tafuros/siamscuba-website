// Diver illustrations for the Koh Tao branch options. The silhouettes are
// inlined directly (fill="currentColor"), so the parent's text colour
// (ocean-light) tints them. Inlining avoids CSS-mask rasterisation quirks and
// any caching of the asset URL - the markup is bundled into the JS.
import freediverSvg from "./art/freediver.svg?raw";
import scubaSvg from "./art/scuba.svg?raw";

export type DiverArtType = "freediver" | "scuba";

const ART: Record<DiverArtType, { svg: string; box: string }> = {
  // Freediver is a vertical head-down descent (portrait); scuba is horizontal.
  freediver: { svg: freediverSvg, box: "h-24 w-14" },
  scuba: { svg: scubaSvg, box: "h-20 w-40" },
};

const DiverArt = ({ type, className = "" }: { type: DiverArtType; className?: string }) => {
  const { svg, box } = ART[type];
  return (
    <span
      aria-hidden="true"
      className={`block ${box} ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default DiverArt;
