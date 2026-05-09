import { useParams, Link } from "react-router-dom";
import { Fragment, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedCourses from "@/components/RelatedCourses";
import RelatedPosts from "@/components/RelatedPosts";
import { blogPosts } from "@/data/blogPosts";
import { useLanguage } from "@/i18n/LanguageContext";

const categoryColors: Record<string, string> = {
  Diving: "bg-ocean-deep text-primary-foreground",
  Food: "bg-accent text-accent-foreground",
  Beaches: "bg-primary text-primary-foreground",
  Activities: "bg-ocean-deep text-primary-foreground",
  Nightlife: "bg-coral text-primary-foreground",
};

const slugifyHeading = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[֐-׿]+/g, (match) => match) // keep Hebrew chars
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);

const estimateReadingTime = (sections: { paragraphs: string[] }[]): number => {
  const words = sections.reduce(
    (sum, s) => sum + s.paragraphs.reduce((n, p) => n + p.split(/\s+/).length, 0),
    0,
  );
  return Math.max(1, Math.round(words / 200));
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);
  const { t, language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const categoryMap: Record<string, string> = {
    Diving: t("blog_cat_diving"),
    Food: t("blog_cat_food"),
    Beaches: t("blog_cat_beaches"),
    Activities: t("blog_cat_activities"),
    Nightlife: t("blog_cat_nightlife"),
  };

  const dateLocaleMap: Record<string, string> = {
    en: "en-US",
    he: "he-IL",
    es: "es-ES",
    fr: "fr-FR",
  };

  const readingTime = useMemo(() => {
    if (!post) return 0;
    return post.readingTime ?? estimateReadingTime(post.sections);
  }, [post]);

  const headingSections = useMemo(
    () =>
      (post?.sections ?? [])
        .map((s, i) => ({ heading: s.heading, index: i }))
        .filter((s): s is { heading: string; index: number } => Boolean(s.heading)),
    [post],
  );

  const showToc = headingSections.length >= 4;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Seo title="Article not found | Siam Scuba Blog" description="The blog post you are looking for could not be found." noindex />
        <Navbar />
        <div className="pt-36 pb-20 px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">{t("blog_article_not_found")}</h1>
          <Link to="/blog" className="text-primary mt-4 inline-block hover:underline">
            ← {t("blog_back_to_guide")}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isRTL = /[֐-׿]/.test(post.title);

  // Pick the inline CTA destination — first related course if present, else booking
  const inlineCtaHref =
    post.relatedCourses && post.relatedCourses.length > 0
      ? `/${post.relatedCourses[0]}`
      : "/fun-dive-booking";

  // Insert mid-article CTA between sections 3 and 4 (only if there are at least 5 sections)
  const midCtaIndex = post.sections.length >= 5 ? 3 : -1;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.startsWith("http") ? post.coverImage : `https://siamscuba.com${post.coverImage}`,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Siam Scuba" },
    publisher: {
      "@type": "Organization",
      name: "Siam Scuba",
      logo: { "@type": "ImageObject", url: "https://siamscuba.com/favicon.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://siamscuba.com/blog/${post.slug}` },
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${post.title} | Siam Scuba Blog`}
        description={post.excerpt.slice(0, 158)}
        ogType="article"
        ogImage={post.coverImage.startsWith("http") ? post.coverImage : `https://siamscuba.com${post.coverImage}`}
        publishedTime={post.date}
        author="Siam Scuba"
        jsonLd={articleSchema}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Koh Tao Guide", path: "/blog" },
          { name: post.title },
        ]}
      />
      <Navbar />

      <main>
      {/* Hero */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10 max-w-6xl pb-20">
        <div className={`grid gap-10 ${showToc ? "lg:grid-cols-[minmax(0,1fr)_240px]" : ""}`}>
          <article className="max-w-3xl mx-auto w-full" dir={isRTL ? "rtl" : "ltr"}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Link
                to="/blog"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("blog_back_to_guide")}
              </Link>

              <Badge className={`${categoryColors[post.category] || ""} mb-4`}>
                {categoryMap[post.category] || post.category}
              </Badge>

              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-tight">
                {post.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>
                  {new Date(post.date).toLocaleDateString(dateLocaleMap[language] || "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {t("blog_reading_time").replace("{n}", String(readingTime))}
                </span>
              </div>

              <div className="mt-10 space-y-8">
                {post.sections.map((section, i) => (
                  <Fragment key={i}>
                    <div>
                      {section.heading && (
                        <h2
                          id={slugifyHeading(section.heading)}
                          className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3 scroll-mt-24"
                        >
                          {section.heading}
                        </h2>
                      )}
                      {section.paragraphs.map((p, j) => (
                        <p key={j} className="text-foreground/80 leading-relaxed mb-3">
                          {p}
                        </p>
                      ))}
                      {section.mapLink && (
                        <a
                          href={section.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                          <MapPin className="h-4 w-4" />
                          {t("blog_view_on_maps")}
                        </a>
                      )}
                      {section.image && (
                        <img
                          src={section.image}
                          alt={section.heading || ""}
                          className="rounded-lg w-full mt-4"
                          loading="lazy"
                        />
                      )}
                    </div>

                    {/* Mid-article inline CTA */}
                    {i === midCtaIndex && (
                      <div className="my-10 p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <div>
                          <h3 className="font-display text-lg font-semibold text-foreground">
                            {t("blog_inline_cta_title")}
                          </h3>
                        </div>
                        <Button
                          asChild
                          size="default"
                          className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shrink-0"
                        >
                          <Link to={inlineCtaHref}>
                            <MessageCircle className="h-4 w-4" />
                            {t("blog_inline_cta_button")}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>

              {/* Related courses (cross-link blog → courses) */}
              {post.relatedCourses && post.relatedCourses.length > 0 && (
                <RelatedCourses slugs={post.relatedCourses} />
              )}

              {/* End-of-article CTA */}
              <div className="mt-16 p-8 rounded-2xl bg-ocean-deep text-center">
                <h3 className="font-display text-2xl font-bold text-primary-foreground">
                  {t("blog_cta_title")}
                </h3>
                <p className="mt-2 text-primary-foreground/70">
                  {t("blog_cta_subtitle")}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="mt-6 rounded-full px-10 bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                >
                  <Link to="/fun-dive-booking">
                    <MessageCircle className="h-5 w-5" />
                    {t("blog_cta_button")}
                  </Link>
                </Button>
              </div>

              {/* Related posts */}
              <RelatedPosts current={post} />
            </motion.div>
          </article>

          {/* Sticky ToC sidebar (desktop only, when ≥4 headings) */}
          {showToc && (
            <aside className="hidden lg:block">
              <nav
                aria-label={t("blog_toc_title")}
                className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto"
              >
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">
                  {t("blog_toc_title")}
                </p>
                <ul className="space-y-2 text-sm">
                  {headingSections.map((s) => (
                    <li key={s.index}>
                      <a
                        href={`#${slugifyHeading(s.heading)}`}
                        className="text-muted-foreground hover:text-primary transition-colors block leading-snug"
                      >
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}
        </div>
      </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
