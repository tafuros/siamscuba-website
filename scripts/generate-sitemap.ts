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
}

async function loadRoutes(): Promise<SitemapEntry[]> {
  // Dynamically import data sources so this script picks up edits without rebuilding the bundle.
  const { blogPosts } = await import("../src/data/blogPosts");
  const { SLUG_TO_COURSE } = await import("../src/lib/courseSlugMap");

  const today = new Date().toISOString().slice(0, 10);

  const entries: SitemapEntry[] = [
    { loc: "/", changefreq: "weekly", priority: 1.0, lastmod: today },
    { loc: "/blog", changefreq: "weekly", priority: 0.8, lastmod: today },
    { loc: "/fun-dive-booking", changefreq: "monthly", priority: 0.9, lastmod: today },
    {
      loc: "/he",
      changefreq: "monthly",
      priority: 0.85,
      lastmod: today,
      hreflangs: ["he"],
    },
    { loc: "/privacy-policy", changefreq: "yearly", priority: 0.2, lastmod: today },
    { loc: "/privacy", changefreq: "yearly", priority: 0.2, lastmod: today },
    { loc: "/terms", changefreq: "yearly", priority: 0.2, lastmod: today },
    { loc: "/data-deletion", changefreq: "yearly", priority: 0.2, lastmod: today },
    // Paid-campaign landers intentionally excluded from sitemap — they
    // ship with <meta name="robots" content="noindex,nofollow"> so Google
    // shouldn't discover them organically. Restore here on campaign launch.
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
      const langs = e.hreflangs ?? SUPPORTED_LANGS;
      const alternates = langs
        .map((lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${loc}" />`)
        .join("\n");
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority !== undefined ? `    <priority>${e.priority.toFixed(1)}</priority>` : null,
        alternates,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`,
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
