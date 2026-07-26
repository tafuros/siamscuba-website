import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Route ordering is load-bearing in src/routes.tsx and easy to break silently:
 *
 *  - `path: "404"` must sit ABOVE `path: ":courseSlug"`. The course route is a
 *    single-segment catch-all, so if it comes first it swallows "404" and the
 *    build stops emitting dist/404.html - which is the file Vercel serves for
 *    every unmatched URL. The symptom is not a test failure but visitors
 *    getting Vercel's raw text error page again.
 *  - `path: "*"` must come last, or it shadows everything after it.
 */

const src = readFileSync(resolve(__dirname, "../routes.tsx"), "utf8");
const indexOfPath = (p: string) => src.indexOf(`path: "${p}"`);

describe("route ordering in routes.tsx", () => {
  it("declares the 404 route", () => {
    expect(
      indexOfPath("404"),
      'routes.tsx must declare `path: "404"` so the build emits dist/404.html',
    ).toBeGreaterThan(-1);
  });

  it('puts "404" above ":courseSlug" so it is not swallowed as a course slug', () => {
    const notFound = indexOfPath("404");
    const courseSlug = indexOfPath(":courseSlug");
    expect(courseSlug).toBeGreaterThan(-1);
    expect(
      notFound,
      '`path: "404"` must appear BEFORE `path: ":courseSlug"` in routes.tsx',
    ).toBeLessThan(courseSlug);
  });

  it('keeps the "*" catch-all last', () => {
    const star = indexOfPath("*");
    expect(star).toBeGreaterThan(-1);
    const others = [":courseSlug", "404", "blog", "dive-sites", "accessibility"]
      .map(indexOfPath)
      .filter((i) => i > -1);
    for (const i of others) expect(star).toBeGreaterThan(i);
  });
});
