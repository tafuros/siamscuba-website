import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { blogPosts } from "@/data/blogPosts";
import { SLUG_TO_COURSE } from "@/lib/courseSlugMap";
import { diveSites } from "@/data/diveSites";

/**
 * Guards against shipping dead internal links in blog content.
 *
 * Why this exists: `/courses` was linked from a post and passed local review
 * because `vite preview` serves index.html for ANY path (SPA fallback), so a
 * non-existent route still returns 200. On Vercel the same URL 404s. Route
 * existence has to be asserted against the router, not against a dev server.
 */

// Static route paths declared in the router (excludes params and the catch-all).
function declaredRoutePaths(): Set<string> {
  const src = readFileSync(resolve(__dirname, "../routes.tsx"), "utf8");
  const paths = [...src.matchAll(/path:\s*"([^"]*)"/g)].map((m) => m[1]);
  const set = new Set<string>();
  for (const p of paths) {
    if (p === "*" || p.includes(":")) continue; // params handled separately
    set.add(p === "/" ? "/" : `/${p.replace(/^\//, "")}`);
  }
  return set;
}

/** Every path the app can actually serve. */
function resolvableRoutes(): Set<string> {
  const routes = declaredRoutePaths();
  // `:courseSlug` catch-all -> the course slug map
  for (const slug of Object.keys(SLUG_TO_COURSE)) routes.add(`/${slug}`);
  // `blog/:slug` and `es/blog/:slug`
  for (const post of blogPosts) {
    routes.add(post.language === "es" ? `/es/blog/${post.slug}` : `/blog/${post.slug}`);
  }
  // `dive-sites/:siteSlug`
  for (const site of diveSites as { slug?: string }[]) {
    if (site.slug) routes.add(`/dive-sites/${site.slug}`);
  }
  return routes;
}

/** Read every .tsx/.ts file under a directory, recursively. */
function collectSources(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "test" || entry.name === "node_modules") continue;
      out.push(...collectSources(path));
    } else if (/\.tsx?$/.test(entry.name)) {
      out.push(readFileSync(path, "utf8"));
    }
  }
  return out;
}

/** Collect internal link targets from markdown paragraphs + section.links. */
function internalLinks(): { post: string; url: string }[] {
  const found: { post: string; url: string }[] = [];
  const MD_LINK = /\[[^\]\n]+\]\((\/[^)\s]*)\)/g;

  for (const post of blogPosts) {
    for (const section of post.sections) {
      for (const p of section.paragraphs) {
        for (const m of p.matchAll(MD_LINK)) found.push({ post: post.slug, url: m[1] });
      }
      for (const cell of section.table?.rows?.flat() ?? []) {
        for (const m of cell.matchAll(MD_LINK)) found.push({ post: post.slug, url: m[1] });
      }
      for (const link of section.links ?? []) {
        if (link.url.startsWith("/")) found.push({ post: post.slug, url: link.url });
      }
      if (section.mapLink?.startsWith("/")) {
        found.push({ post: post.slug, url: section.mapLink });
      }
    }
  }
  return found;
}

describe("blog internal links", () => {
  const routes = resolvableRoutes();

  it("resolves every internal link to a real route", () => {
    const dead = internalLinks().filter(({ url }) => {
      // Strip hash + query before matching; "/#courses" -> "/"
      const path = url.split(/[#?]/)[0] || "/";
      return !routes.has(path);
    });

    expect(
      dead,
      `Dead internal link(s) in blog content:\n${dead
        .map((d) => `  ${d.post}: ${d.url}`)
        .join("\n")}\n\nKnown routes:\n  ${[...routes].sort().join("\n  ")}`,
    ).toEqual([]);
  });

  it("points every hash link at an id that exists in the source", () => {
    const sources = collectSources(resolve(__dirname, ".."));
    const hashLinks = internalLinks().filter(({ url }) => url.includes("#"));

    const missing = hashLinks.filter(({ url }) => {
      const id = url.split("#")[1];
      if (!id) return false;
      return !sources.some((s) => s.includes(`id="${id}"`));
    });

    expect(
      missing,
      `Hash link(s) pointing at a non-existent id:\n${missing
        .map((d) => `  ${d.post}: ${d.url}`)
        .join("\n")}`,
    ).toEqual([]);
  });

  it("catches a deliberately bad path (self-test)", () => {
    expect(routes.has("/definitely-not-a-route")).toBe(false);
    expect(routes.has("/blog/koh-tao-taxi-app")).toBe(true);
    expect(routes.has("/open-water")).toBe(true);
    expect(routes.has("/fun-dive-booking")).toBe(true);
  });
});
