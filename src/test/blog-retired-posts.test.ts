import { describe, expect, it } from "vitest";
import { blogPosts, listedBlogPosts } from "@/data/blogPosts";

// Retired posts (`noindex: true`) stay prerendered for old links but must never be
// listed, related-linked or submitted. Everything that lists posts reads
// `listedBlogPosts`; this pins the contract so a new listing cannot quietly revive one.
describe("retired blog posts", () => {
  const retired = blogPosts.filter((p) => p.noindex);

  it("the Koh Tao taxi-app post is retired", () => {
    expect(retired.map((p) => p.slug)).toContain("koh-tao-taxi-app");
  });

  it("retired posts are excluded from listedBlogPosts", () => {
    for (const p of retired) expect(listedBlogPosts).not.toContain(p);
    expect(listedBlogPosts.length).toBe(blogPosts.length - retired.length);
  });

  it("no listed post points its related links at a retired post", () => {
    const retiredSlugs = new Set(retired.map((p) => p.slug));
    const offenders = listedBlogPosts.filter((p) => (p.relatedBlogSlugs ?? []).some((s) => retiredSlugs.has(s)));
    expect(offenders.map((p) => p.slug)).toEqual([]);
  });

  it("the retired taxi post no longer links to the dead welovekohtao.com domain", () => {
    const post = blogPosts.find((p) => p.slug === "koh-tao-taxi-app")!;
    expect(JSON.stringify(post)).not.toContain("https://welovekohtao.com");
  });
});
