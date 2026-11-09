// Generates dist/sitemap.xml from the route config + blog data + course slugs.
// Runs as a post-build step.

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE_URL = "https://siamscuba.com";

interface SitemapEntry {
  loc: string;
  lastmod?: string; // YYYY-MM-DD
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number; // 0.0-1.0
  /**
   * If set, only emit hreflang for these languages (single-language content like blog posts).
   * Legacy marker for single-language content; hreflang is now derived from
   * the locale cluster (or omitted), so this is informational only.
   */
  hreflangs?: string[];
  /**
   * Absolute per-language URLs, for pages whose translations live at DIFFERENT
   * URLs rather than on this one. Takes precedence over `hreflangs`, which can
   * only ever point a language back at `loc` itself.
   */
  alternates?: Record<string, string>;
}

async function loadRoutes(): Promise<SitemapEntry[]> {
  // Dynamically import data sources so this script picks up edits without rebuilding the bundle.
  const { blogPosts } = await import("../src/data/blogPosts");
  const { diveSites } = await import("../src/data/diveSites");
  const { SLUG_TO_COURSE, REDIRECTED_COURSE_SLUGS } = await import("../src/lib/courseSlugMap");
  // Same object the three pages render into their <head>. Google merges the
  // sitemap and HTML annotations and errors out when they disagree, so the
  // cluster is defined once (src/lib/localeRoutes.ts) and consumed by both.
  const { HOME_HREFLANG_ALTERNATES, hreflangAlternatesFor } = await import("../src/lib/localeRoutes");
  // Same cluster the HTML emits - Google drops BOTH annotations when the
  // sitemap and the page disagree, so this must stay derived, not written out.
  const CONSERVATION_ALTERNATES = hreflangAlternatesFor("/conservation");
  const HOTEL_ALTERNATES = hreflangAlternatesFor("/hotel");
  const GO_PRO_ALTERNATES = hreflangAlternatesFor("/go-pro");
  const DM_ALTERNATES = hreflangAlternatesFor("/divemaster-course");
  const FAQ_ALTERNATES = hreflangAlternatesFor("/faq");
  const START_ALTERNATES = hreflangAlternatesFor("/discover-scuba-vs-open-water");

  // No build-date lastmod (2026-11-03): stamping every URL with the deploy date
  // teaches Google to ignore lastmod. Only blog posts carry a real date.

  const entries: SitemapEntry[] = [
    // "/" used to claim he/es/fr as alternates pointing at ITSELF, which
    // contradicted /he and /es once they became real pages.
    { loc: "/", changefreq: "weekly", priority: 1.0, alternates: HOME_HREFLANG_ALTERNATES },
    { loc: "/blog", changefreq: "weekly", priority: 0.8 },
    { loc: "/dive-sites", changefreq: "monthly", priority: 0.8 },
    // /fun-dive-booking is noindex (a booking form) - /fun-dives ranks instead.
    // /he and /es are the homepage in Hebrew / Spanish since 2026-10-06.
    { loc: "/he", changefreq: "weekly", priority: 0.95, alternates: HOME_HREFLANG_ALTERNATES },
    { loc: "/es", changefreq: "weekly", priority: 0.95, alternates: HOME_HREFLANG_ALTERNATES },
    // The long-form guides that used to live on /he and /es.
    { loc: "/he/koh-tao-diving-guide", changefreq: "monthly", priority: 0.8, hreflangs: ["he"] },
    { loc: "/es/koh-tao-diving-guide", changefreq: "monthly", priority: 0.8, hreflangs: ["es"] },
    { loc: "/privacy", changefreq: "yearly", priority: 0.2 },
    { loc: "/terms", changefreq: "yearly", priority: 0.2 },
    { loc: "/data-deletion", changefreq: "yearly", priority: 0.2 },
    // Paid-campaign landers (restored 2026-05-25 for campaign launch).
    { loc: "/advanced-open-water-course", changefreq: "monthly", priority: 0.9, hreflangs: ["en"] },
    { loc: "/es/advanced-open-water-course", changefreq: "monthly", priority: 0.9, hreflangs: ["es"] },
    { loc: "/he/advanced-open-water-course", changefreq: "monthly", priority: 0.9, hreflangs: ["he"] },
    // Sail Rock day-trip lander - was missing from the sitemap entirely (2026-11-03).
    { loc: "/sail-rock-diving", changefreq: "monthly", priority: 0.8 },
    { loc: "/he/sail-rock-diving", changefreq: "monthly", priority: 0.7 },
    { loc: "/es/sail-rock-diving", changefreq: "monthly", priority: 0.7 },
    { loc: "/he/koh-tao-stay", changefreq: "monthly", priority: 0.6, hreflangs: ["he"] },
    { loc: "/fun-dives", changefreq: "monthly", priority: 0.9, hreflangs: ["en"] },
    { loc: "/es/fun-dives", changefreq: "monthly", priority: 0.9, hreflangs: ["es"] },
    { loc: "/he/fun-dives", changefreq: "monthly", priority: 0.9, hreflangs: ["he"] },
    { loc: "/fr/fun-dives", changefreq: "monthly", priority: 0.9, hreflangs: ["fr"] },
    // Conservation hub (entry-gate card 4), full 4-language cluster.
    { loc: "/conservation", changefreq: "monthly", priority: 0.8, alternates: CONSERVATION_ALTERNATES },
    { loc: "/he/conservation", changefreq: "monthly", priority: 0.7, alternates: CONSERVATION_ALTERNATES },
    { loc: "/es/conservation", changefreq: "monthly", priority: 0.7, alternates: CONSERVATION_ALTERNATES },
    { loc: "/fr/conservation", changefreq: "monthly", priority: 0.7, alternates: CONSERVATION_ALTERNATES },
    { loc: "/hotel", changefreq: "weekly", priority: 0.8, alternates: HOTEL_ALTERNATES },
    { loc: "/he/hotel", changefreq: "weekly", priority: 0.7, alternates: HOTEL_ALTERNATES },
    { loc: "/es/hotel", changefreq: "weekly", priority: 0.7, alternates: HOTEL_ALTERNATES },
    { loc: "/fr/hotel", changefreq: "weekly", priority: 0.7, alternates: HOTEL_ALTERNATES },
    { loc: "/discover-scuba-vs-open-water", changefreq: "monthly", priority: 0.8, alternates: START_ALTERNATES },
    { loc: "/he/discover-scuba-vs-open-water", changefreq: "monthly", priority: 0.7, alternates: START_ALTERNATES },
    { loc: "/es/discover-scuba-vs-open-water", changefreq: "monthly", priority: 0.7, alternates: START_ALTERNATES },
    { loc: "/fr/discover-scuba-vs-open-water", changefreq: "monthly", priority: 0.7, alternates: START_ALTERNATES },
    { loc: "/go-pro", changefreq: "monthly", priority: 0.9, alternates: GO_PRO_ALTERNATES },
    { loc: "/he/go-pro", changefreq: "monthly", priority: 0.7, alternates: GO_PRO_ALTERNATES },
    { loc: "/es/go-pro", changefreq: "monthly", priority: 0.7, alternates: GO_PRO_ALTERNATES },
    { loc: "/fr/go-pro", changefreq: "monthly", priority: 0.7, alternates: GO_PRO_ALTERNATES },
    { loc: "/divemaster-course", changefreq: "monthly", priority: 0.9, alternates: DM_ALTERNATES },
    { loc: "/he/divemaster-course", changefreq: "monthly", priority: 0.7, alternates: DM_ALTERNATES },
    { loc: "/es/divemaster-course", changefreq: "monthly", priority: 0.7, alternates: DM_ALTERNATES },
    { loc: "/fr/divemaster-course", changefreq: "monthly", priority: 0.7, alternates: DM_ALTERNATES },
    { loc: "/faq", changefreq: "monthly", priority: 0.8, alternates: FAQ_ALTERNATES },
    { loc: "/he/faq", changefreq: "monthly", priority: 0.7, alternates: FAQ_ALTERNATES },
    { loc: "/es/faq", changefreq: "monthly", priority: 0.7, alternates: FAQ_ALTERNATES },
    { loc: "/fr/faq", changefreq: "monthly", priority: 0.7, alternates: FAQ_ALTERNATES },
    // Entry-gate split pages (multilingual single URL - all langs on one URL).
    { loc: "/similan", changefreq: "weekly", priority: 0.9 },
    { loc: "/phuket-diving", changefreq: "weekly", priority: 0.9 },
    // /freediving retired 2026-07-13 (301 -> "/"): must NOT be in the sitemap,
    // or Google keeps re-crawling a redirect we told it to forget.
  ];

  for (const post of blogPosts) {
    if (post.noindex) continue; // retired posts stay reachable but must not be submitted
    const prefix = post.language === "es" ? "/es" : "";
    const lang = post.language || "en";
    entries.push({
      loc: `${prefix}/blog/${post.slug}`,
      lastmod: post.date,
      changefreq: "monthly",
      priority: 0.7,
      hreflangs: [lang],
    });
  }

  for (const site of diveSites) {
    // Sites with a Hebrew edition get a reciprocal en/he hreflang pair.
    const alternates = site.he
      ? {
          en: `https://siamscuba.com/dive-sites/${site.slug}`,
          he: `https://siamscuba.com/he/dive-sites/${site.slug}`,
        }
      : undefined;
    entries.push({
      loc: `/dive-sites/${site.slug}`,
     
      changefreq: "monthly",
      priority: 0.7,
      ...(alternates ? { alternates } : {}),
    });
    if (site.he) {
      entries.push({
        loc: `/he/dive-sites/${site.slug}`,
       
        changefreq: "monthly",
        priority: 0.6,
        alternates,
      });
    }
  }

  for (const slug of Object.keys(SLUG_TO_COURSE)) {
    // Slugs that 301 to a lander (/divemaster, /advanced-open-water) -
    // a redirect must never be submitted.
    if (REDIRECTED_COURSE_SLUGS.includes(slug)) continue;
    // Course pages with Hebrew / Spanish twins (2026-10-23) carry the cluster.
    const alternates = hreflangAlternatesFor(`/${slug}`);
    entries.push({
      loc: `/${slug}`,
     
      changefreq: "monthly",
      priority: 0.8,
      ...(alternates ? { alternates } : {}),
    });
    if (alternates) {
      for (const lang of ["he", "es"] as const) {
        if (!alternates[lang]) continue;
        entries.push({ loc: `/${lang}/${slug}`, changefreq: "monthly", priority: 0.8, alternates });
      }
    }
  }

  return entries;
}

function buildXml(
  entries: SitemapEntry[],
  hreflangAlternatesFor: (p: string) => Partial<Record<string, string>> | undefined,
): string {
  const urls = entries
    .map((e) => {
      const loc = `${SITE_URL}${e.loc}`;
      // hreflang ONLY for pages in a locale cluster, and always the exact cluster
      // the page's own HTML emits (hreflangAlternatesFor - same source as Seo).
      // A single-URL page gets none, matching its HTML; it used to claim it was
      // also the he/es/fr version of itself (2026-11-03 audit).
      const cluster = e.alternates ?? hreflangAlternatesFor(e.loc);
      const alternates = cluster
        ? Object.entries(cluster)
            .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`)
            .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${cluster.en ?? loc}" />`)
            .join("\n")
        : null;
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority !== undefined ? `    <priority>${e.priority.toFixed(1)}</priority>` : null,
        alternates,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

async function main() {
  const entries = await loadRoutes();
  const { hreflangAlternatesFor } = await import("../src/lib/localeRoutes");
  const xml = buildXml(entries, hreflangAlternatesFor);
  const out = resolve(process.cwd(), "dist", "sitemap.xml");
  writeFileSync(out, xml, "utf8");
  console.log(`[sitemap] wrote ${entries.length} URLs to ${out}`);
}

main().catch((err) => {
  console.error("[sitemap] failed:", err);
  process.exit(1);
});
