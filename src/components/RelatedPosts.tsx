import BlogCard from "@/components/BlogCard";
import { blogPosts, type BlogPost } from "@/data/blogPosts";
import { useLanguage } from "@/i18n/LanguageContext";

interface RelatedPostsProps {
  current: BlogPost;
  count?: number;
}

const RelatedPosts = ({ current, count = 3 }: RelatedPostsProps) => {
  const { t } = useLanguage();

  const explicit = (current.relatedBlogSlugs ?? [])
    .map((slug) => blogPosts.find((p) => p.slug === slug))
    .filter((p): p is BlogPost => Boolean(p));

  const explicitSlugs = new Set(explicit.map((p) => p.slug));
  const fallback = blogPosts
    .filter(
      (p) =>
        p.slug !== current.slug &&
        !explicitSlugs.has(p.slug) &&
        p.category === current.category,
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const picks = [...explicit, ...fallback].slice(0, count);

  if (picks.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-heading" className="mt-16">
      <h2
        id="related-posts-heading"
        className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6"
      >
        {t("blog_related_posts_title")}
      </h2>
      <div className={`grid gap-6 ${picks.length === 1 ? "grid-cols-1" : picks.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
        {picks.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
