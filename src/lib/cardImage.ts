// Responsive sources for photos that appear as small cards on the landers.
//
// The dive-site and whale-shark photos are 1600px wide (~100-250KB) because the
// dive-site pages use them full-bleed. On the landers they are ~200-400px cards,
// and native lazy-loading does not save them on slow connections (Chrome starts
// "lazy" images up to ~2500px below the fold on 4G) - so on /fun-dives four of
// them (~650KB) competed with the page's own LCP image (Lighthouse on prod,
// 2026-09-21). Each listed photo has -640 and -960 siblings next to it in
// /public; add a photo here only after generating both.
const HAS_CARD_VARIANTS = new Set([
  "/dive-sites/chumphon-pinnacle.webp",
  "/dive-sites/sail-rock.webp",
  "/dive-sites/twins.webp",
  "/blog/whale-shark-koh-tao.webp",
]);

/** `srcSet` for a card photo, or undefined when the photo has no small variants. */
export function cardSrcSet(src: string): string | undefined {
  if (!HAS_CARD_VARIANTS.has(src)) return undefined;
  const base = src.replace(/\.webp$/, "");
  return `${base}-640.webp 640w, ${base}-960.webp 960w, ${src} 1600w`;
}
