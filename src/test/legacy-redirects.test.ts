import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import vercel from "../../vercel.json";

// The WordPress-era URLs (2014-2023) still carry links from directories, blogs and
// old bookings. They 404'd until 2026-09-24; these 301s hand their value to the
// nearest live page. Built from the Wayback CDX list - see the backlinks plan.
const routes = resolve(__dirname, "../../dist");
const isBuilt = existsSync(routes);

describe("legacy URL redirects", () => {
  const redirects = vercel.redirects as { source: string; destination: string; permanent?: boolean }[];

  it("keeps the SPA rewrite - dropping it 404'd every client route for 8 days", () => {
    expect(vercel.rewrites).toEqual([{ source: "/((?!api/).*)", destination: "/index.html" }]);
  });

  it("has no duplicate sources (the first match wins, a duplicate is dead config)", () => {
    const sources = redirects.map((r) => r.source);
    expect(sources.length).toBe(new Set(sources).size);
  });

  it("covers the legacy families that used to 404", () => {
    const sources = new Set(redirects.map((r) => r.source));
    for (const s of [
      "/PADI-courses/siam-scuba-center-PADI-course-open-water-diver.html",
      "/shop/padi-courses/padi-open-water-diver",
      "/shop/accommodation/siam-private-room",
      "/category/turtle",
      "/tag/koh-tao",
      "/latest-news",
      "/the-boats",
      "/terms-and-conditions",
      "/the-wreck-htms-sattukut",
    ]) {
      expect(sources, s).toContain(s);
    }
    expect(redirects.length).toBeGreaterThan(200);
  });

  it("every .html source also exists without the extension (cleanUrls strips it first)", () => {
    const sources = new Set(redirects.map((r) => r.source));
    for (const s of redirects.map((r) => r.source).filter((s) => s.endsWith(".html"))) {
      expect(sources, s).toContain(s.replace(/\.html$/, ""));
    }
  });

  it("no source redirects to itself and none is a live page", () => {
    for (const r of redirects) {
      expect(r.source, r.source).not.toBe(r.destination);
      if (!isBuilt || r.destination.startsWith("http")) continue;
      const file = r.source === "/" ? "index.html" : `${r.source.replace(/^\//, "")}.html`;
      expect(existsSync(resolve(routes, file)), `${r.source} is a real page - do not redirect it`).toBe(false);
    }
  });

  it.runIf(isBuilt)("every destination is a page that exists in the build", () => {
    for (const r of redirects) {
      if (r.destination.startsWith("http") || /\.(jpg|png|webp)$/.test(r.destination)) continue;
      const file = r.destination === "/" ? "index.html" : `${r.destination.replace(/^\//, "")}.html`;
      expect(existsSync(resolve(routes, file)), `${r.source} -> ${r.destination}`).toBe(true);
    }
  });

  it("all legacy redirects are permanent (301) so the link value transfers", () => {
    const temporary = redirects.filter((r) => !r.permanent && !r.destination.startsWith("http"));
    expect(temporary.map((r) => r.source)).toEqual([]);
  });
});
