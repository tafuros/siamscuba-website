// Generates dist/sitemap.xml from the route config + blog data + course slugs.
// Runs as a post-build step.

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE_URL = "https://siamscuba.com";
const SUPPORTED_LANGS = ["en", "he", "es", "fr"];

interface SitemapEntry {
  loc: string;
  lastmod?: string; // YYYY-MM-DD
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number; // 0.0-1.0
  /**
   * If set, only emit hreflang for these languages (single-language content like blog posts).
   * If undefined, the page is multi-language (i18n switcher) and gets all SUPPORTED_LANGS.
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
  const { SLUG_TO_COURSE } = await import("../src/lib/courseSlugMap");
  // Same object the three pages render into their <head>. Google merges the
  // sitemap and HTML annotations and errors out when they disagree, so the
  // cluster is defined once (src/lib/localeRoutes.ts) and consumed by both.
  const { HOME_HREFLANG_ALTERNATES, hreflangAlternatesFor } = await import("../src/lib/localeRoutes");
  // Same cluster the HTML emits - Google drops BOTH annotations when the
  // sitemap and the page disagree, so this must stay derived, not written out.
  const CONSERVATION_ALTERNATES = hreflangAlternatesFor("/conservation");
  const HOTEL_ALTERNATES = hreflangAlternatesFor("/hotel");

  const today = new Date().toISOString().slice(0, 10);

  const entries: SitemapEntry[] = [
    // "/" used to claim he/es/fr as alternates pointing at ITSELF, which
    // contradicted /he and /es once they became real pages.
    { loc: "/", changefreq: "weekly", priority: 1.0, lastmod: today, alternates: HOME_HREFLANG_ALTERNATES },
    { loc: "/blog", changefreq: "weekly", priority: 0.8, lastmod: today },
    { loc: "/dive-sites", changefreq: "monthly", priority: 0.8, lastmod: today },
    { loc: "/fun-dive-booking", changefreq: "monthly", priority: 0.9, lastmod: today },
    {
      loc: "/he",
      changefreq: "monthly",
      priority: 0.85,
      lastmod: today,
      alternates: HOME_HREFLANG_ALTERNATES,
    },
    {
      loc: "/es",
      changefreq: "monthly",
      priority: 0.85,
      lastmod: today,
      alternates: HOME_HREFLANG_ALTERNATES,
    },
    { loc: "/privacy", changefreq: "yearly", priority: 0.2, lastmod: today },
    { loc: "/terms", changefreq: "yearly", priority: 0.2, lastmod: today },
    { loc: "/data-deletion", changefreq: "yearly", priority: 0.2, lastmod: today },
    // Paid-campaign landers (restored 2026-05-25 for campaign launch).
    { loc: "/discover-scuba-diving", changefreq: "monthly", priority: 0.9, lastmod: today, hreflangs: ["en"] },
    { loc: "/es/discover-scuba-diving", changefreq: "monthly", priority: 0.9, lastmod: today, hreflangs: ["es"] },
    { loc: "/he/discover-scuba-diving", changefreq: "monthly", priority: 0.9, lastmod: today, hreflangs: ["he"] },
    { loc: "/open-water-course", changefreq: "monthly", priority: 0.9, lastmod: today, hreflangs: ["en"] },
    { loc: "/es/open-water-course", changefreq: "monthly", priority: 0.9, lastmod: today, hreflangs: ["es"] },
    { loc: "/he/open-water-course", changefreq: "monthly", priority: 0.9, lastmod: today, hreflangs: ["he"] },
    { loc: "/advanced-open-water-course", changefreq: "monthly", priority: 0.9, lastmod: today, hreflangs: ["en"] },
    { loc: "/es/advanced-open-water-course", changefreq: "monthly", priority: 0.9, lastmod: today, hreflangs: ["es"] },
    { loc: "/he/advanced-open-water-course", changefreq: "monthly", priority: 0.9, lastmod: today, hreflangs: ["he"] },
    { loc: "/fun-dives", changefreq: "monthly", priority: 0.9, lastmod: today, hreflangs: ["en"] },
    { loc: "/es/fun-dives", changefreq: "monthly", priority: 0.9, lastmod: today, hreflangs: ["es"] },
    { loc: "/he/fun-dives", changefreq: "monthly", priority: 0.9, lastmod: today, hreflangs: ["he"] },
    { loc: "/fr/fun-dives", changefreq: "monthly", priority: 0.9, lastmod: today, hreflangs: ["fr"] },
    // Conservation hub (entry-gate card 4), full 4-language cluster.
    { loc: "/conservation", changefreq: "monthly", priority: 0.8, lastmod: today, alternates: CONSERVATION_ALTERNATES },
    { loc: "/he/conservation", changefreq: "monthly", priority: 0.7, lastmod: today, alternates: CONSERVATION_ALTERNATES },
    { loc: "/es/conservation", changefreq: "monthly", priority: 0.7, lastmod: today, alternates: CONSERVATION_ALTERNATES },
    { loc: "/fr/conservation", changefreq: "monthly", priority: 0.7, lastmod: today, alternates: CONSERVATION_ALTERNATES },
    { loc: "/hotel", changefreq: "weekly", priority: 0.8, lastmod: today, alternates: HOTEL_ALTERNATES },
    { loc: "/he/hotel", changefreq: "weekly", priority: 0.7, lastmod: today, alternates: HOTEL_ALTERNATES },
    { loc: "/es/hotel", changefreq: "weekly", priority: 0.7, lastmod: today, alternates: HOTEL_ALTERNATES },
    { loc: "/fr/hotel", changefreq: "weekly", priority: 0.7, lastmod: today, alternates: HOTEL_ALTERNATES },
    // Entry-gate split pages (multilingual single URL - all langs on one URL).
    { loc: "/similan", changefreq: "weekly", priority: 0.9, lastmod: today },
    { loc: "/phuket-diving", changefreq: "weekly", priority: 0.9, lastmod: today },
    // /freediving retired 2026-07-13 (301 -> "/"): must NOT be in the sitemap,
    // or Google keeps re-crawling a redirect we told it to forget.
  ];

  for (const post of blogPosts) {
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
    entries.push({
      loc: `/dive-sites/${site.slug}`,
      lastmod: today,
      changefreq: "monthly",
      priority: 0.7,
    });
  }

  for (const slug of Object.keys(SLUG_TO_COURSE)) {
    entries.push({
      loc: `/${slug}`,
      lastmod: today,
      changefreq: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}

function buildXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((e) => {
      const loc = `${SITE_URL}${e.loc}`;
      const pairs: [string, string][] = e.alternates
        ? Object.entries(e.alternates)
        : (e.hreflangs ?? SUPPORTED_LANGS).map((lang) => [lang, loc]);
      const alternates = pairs
        .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`)
        .join("\n");
      // x-default is the language-agnostic entry point: the English URL when the
      // page belongs to a cluster, otherwise the page itself.
      const xDefault = e.alternates?.en ?? loc;
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority !== undefined ? `    <priority>${e.priority.toFixed(1)}</priority>` : null,
        alternates,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefault}" />`,
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
  const xml = buildXml(entries);
  const out = resolve(process.cwd(), "dist", "sitemap.xml");
  writeFileSync(out, xml, "utf8");
  console.log(`[sitemap] wrote ${entries.length} URLs to ${out}`);
}

main().catch((err) => {
  console.error("[sitemap] failed:", err);
  process.exit(1);
});
