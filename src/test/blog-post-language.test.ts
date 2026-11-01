// A blog post page speaks the post's own language (UI chrome included).
import { describe, it, expect } from "vitest";
import { blogPostLanguage } from "../i18n/LanguageContext";
import { blogPosts } from "../data/blogPosts";
import { HEBREW_BLOG_SLUGS } from "../data/blogLanguages";

describe("blogPostLanguage", () => {
  it("keeps HEBREW_BLOG_SLUGS in sync with the blog data", () => {
    const he = blogPosts.filter((p) => p.language === "he").map((p) => p.slug).sort();
    expect([...HEBREW_BLOG_SLUGS].sort()).toEqual(he);
  });

  it("Hebrew posts -> he, other unprefixed posts -> en", () => {
    expect(blogPostLanguage("/blog/kokhav-rishon-koh-tao")).toBe("he");
    expect(blogPostLanguage("/blog/koh-tao-diving-cost-guide")).toBe("en");
    expect(blogPostLanguage("/blog/koh-tao-diving-cost-guide/")).toBe("en");
  });

  it("leaves the index and other pages alone", () => {
    expect(blogPostLanguage("/blog")).toBeNull();
    expect(blogPostLanguage("/")).toBeNull();
    expect(blogPostLanguage("/es/blog/curso-buceo-koh-tao")).toBeNull();
  });
});
