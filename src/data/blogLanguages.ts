// Slugs of blog posts written in Hebrew, served at /blog/<slug> (no /he prefix).
// Kept separate from blogPosts.ts so the language provider can read it without
// pulling the whole blog into the main bundle. A test keeps it in sync.
export const HEBREW_BLOG_SLUGS: readonly string[] = ["kokhav-rishon-koh-tao"];
