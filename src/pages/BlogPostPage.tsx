import { useParams, Link } from "react-router-dom";
import { coursePath } from "@/lib/courseSlugMap";
import BookingLink from "@/components/BookingLink";
import { Fragment, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Camera, Clock, MapPin, MessageCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelatedCourses from "@/components/RelatedCourses";
import RelatedPosts from "@/components/RelatedPosts";
import DiveSiteCard from "@/components/DiveSiteCard";
import { renderInline, SectionLinks, SectionTable } from "@/components/BlogRichText";
import { blogPosts, blogPostPath } from "@/data/blogPosts";
import { findDiveSite } from "@/data/diveSites";
import { useLanguage } from "@/i18n/LanguageContext";
import { ORG_LOGO } from "@/lib/brand";

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
  // Click-to-enlarge for in-article photos.
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; credit?: string } | null>(null);
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

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
            <ArrowLeft className="h-[1.05em] w-[1.05em] rtl:rotate-180" aria-hidden="true" />{" "}
            {t("blog_back_to_guide")}
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
      ? coursePath(post.relatedCourses[0])
      : "/fun-dive-booking";

  // Insert mid-article CTA between sections 3 and 4 (only if there are at least 5 sections)
  const midCtaIndex = post.sections.length >= 5 ? 3 : -1;

  // Approximate word count from sections (used by Article schema for richer signals)
  const wordCount = post.sections.reduce(
    (sum, s) => sum + s.paragraphs.reduce((n, p) => n + p.split(/\s+/).filter(Boolean).length, 0),
    0,
  );

  const langCode = post.language ?? "en";
  const articleUrl = `https://siamscuba.com${blogPostPath(post)}`;

  // ISO 8601 with Koh Tao timezone (ICT, no DST). Schema requires a full
  // datetime with timezone for datePublished / dateModified - bare YYYY-MM-DD
  // gets flagged as a non-critical issue by Google's Rich Results Test.
  const datePublishedIso = `${post.date}T00:00:00+07:00`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription ?? post.excerpt,
    image: post.coverImage.startsWith("http") ? post.coverImage : `https://siamscuba.com${post.coverImage}`,
    datePublished: datePublishedIso,
    dateModified: datePublishedIso,
    inLanguage: langCode,
    wordCount,
    articleSection: post.category,
    keywords: post.tags?.join(", "),
    author: {
      "@type": "Organization",
      "@id": "https://siamscuba.com/#organization",
      name: "Siam Scuba",
      url: "https://siamscuba.com",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://siamscuba.com/#organization",
      name: "Siam Scuba",
      url: "https://siamscuba.com",
      logo: ORG_LOGO,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    url: articleUrl,
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${post.seoTitle ?? post.title} | Siam Scuba`}
        description={(() => { const d = post.seoDescription ?? post.excerpt; return d.length > 155 ? `${d.slice(0, 152).trimEnd()}...` : d; })()}
        ogType="article"
        noindex={post.noindex}
        ogImage={post.coverImage.startsWith("http") ? post.coverImage : `https://siamscuba.com${post.coverImage}`}
        publishedTime={datePublishedIso}
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
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background/80 to-transparent" />
        {post.coverImageCredit && (
          <span dir="ltr" className="absolute bottom-28 left-3 inline-flex items-center gap-1 rounded bg-black/45 px-2 py-0.5 text-[11px] leading-4 text-white/90 backdrop-blur-sm">
            <Camera className="h-3 w-3" aria-hidden="true" />
            {post.coverImageCredit}
          </span>
        )}
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10 max-w-6xl pb-20">
        <div className={`grid gap-10 ${showToc ? "lg:grid-cols-[minmax(0,1fr)_240px]" : ""}`}>
          <article className="max-w-[680px] mx-auto w-full" dir={isRTL ? "rtl" : "ltr"}>
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }}>
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
                  {/* timeZone UTC: post.date parses as UTC midnight - local
                      formatting shifted it a day back for negative-UTC-offset
                      viewers, mismatching the SSG HTML (hydration error). */}
                  {new Date(post.date).toLocaleDateString(dateLocaleMap[language] || "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
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
                        <p key={j} className="text-foreground/80 text-[17px] leading-[1.75] mb-4">
                          {renderInline(p)}
                        </p>
                      ))}
                      {section.table && <SectionTable {...section.table} />}
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
                        <figure className="mt-6">
                          {/* wrapper shrinks to the photo so the credit sits on the photo's own corner */}
                          <div className="relative w-full sm:w-fit mx-auto">
                            <button
                              type="button"
                              onClick={() =>
                                setLightbox({
                                  src: section.image!,
                                  alt: section.imageAlt || section.heading || "",
                                  credit: section.imageCredit,
                                })
                              }
                              className="block w-full cursor-zoom-in rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              aria-label={section.imageAlt || section.heading || "Open photo"}
                            >
                              <img
                                src={section.image}
                                alt={section.imageAlt || section.heading || ""}
                                className="block rounded-lg w-full sm:w-auto sm:max-h-[600px]"
                                loading="lazy"
                                decoding="async"
                              />
                            </button>
                            {section.imageCredit && (
                              <span
                                dir="ltr"
                                className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded bg-black/45 px-2 py-0.5 text-[11px] leading-4 text-white/90 backdrop-blur-sm"
                              >
                                <Camera className="h-3 w-3" aria-hidden="true" />
                                {section.imageCredit}
                              </span>
                            )}
                          </div>
                          {section.imageCaption && (
                            <figcaption className="mt-2 text-xs text-muted-foreground text-center">
                              {section.imageCaption}
                            </figcaption>
                          )}
                        </figure>
                      )}
                      {/* CTAs go last so they never interrupt copy -> media flow */}
                      {section.links && section.links.length > 0 && (
                        <SectionLinks links={section.links} />
                      )}
                    </div>

                    {/* Mid-article inline CTA */}
                    {i === midCtaIndex && (
                      <div className="relative my-10 overflow-hidden rounded-2xl bg-[#03152a] text-white">
                        <img
                          src="/blog/divers-heart-sign-underwater-koh-tao.webp"
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(3,21,42,.05) 0%, rgba(3,21,42,.45) 50%, rgba(3,21,42,.9) 100%)",
                          }}
                        />
                        <div className="relative flex min-h-[260px] flex-col justify-end gap-4 px-6 pb-11 pt-24 sm:min-h-[300px] sm:flex-row sm:items-end sm:justify-between">
                          <h3 className="font-display text-2xl font-semibold leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,.5)]">
                            {t("blog_inline_cta_title")}
                          </h3>
                          <Button
                            asChild
                            size="default"
                            className="h-11 rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shrink-0 self-start sm:self-auto"
                          >
                            <BookingLink trackLocation="blog_inline" to={inlineCtaHref}>
                              <MessageCircle className="h-4 w-4" />
                              {t("blog_inline_cta_button")}
                            </BookingLink>
                          </Button>
                        </div>
                        <span
                          dir="ltr"
                          className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded bg-black/45 px-2 py-0.5 text-[11px] leading-4 text-white/90 backdrop-blur-sm"
                        >
                          <Camera className="h-3 w-3" aria-hidden="true" />
                          @fishgirl71 for @kohtaoprovideo
                        </span>
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>

              {/* Related courses (cross-link blog → courses) */}
              {post.relatedCourses && post.relatedCourses.length > 0 && (
                <RelatedCourses slugs={post.relatedCourses} />
              )}

              {/* Related dive sites (cross-link blog → dive-site pages) */}
              {(() => {
                const sites = (post.relatedDiveSites ?? [])
                  .map((slug) => findDiveSite(slug))
                  .filter((s): s is NonNullable<typeof s> => Boolean(s))
                  .slice(0, 3);
                if (sites.length === 0) return null;
                return (
                  <section aria-labelledby="related-dive-sites" className="mt-16">
                    <h2
                      id="related-dive-sites"
                      className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6"
                    >
                      {t("blog_related_dive_sites_title")}
                    </h2>
                    <div className={`grid gap-6 ${sites.length === 1 ? "grid-cols-1" : sites.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
                      {sites.map((s) => (
                        <DiveSiteCard key={s.slug} site={s} />
                      ))}
                    </div>
                  </section>
                );
              })()}

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
                  <BookingLink trackLocation="blog_bottom" to="/fun-dive-booking">
                    <MessageCircle className="h-5 w-5" />
                    {t("blog_cta_button")}
                  </BookingLink>
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

      {/* Photo lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              style={{ marginTop: "env(safe-area-inset-top, 0px)" }}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              className="relative"
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 460, damping: 40 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="block max-h-[88vh] max-w-[94vw] rounded-lg object-contain"
              />
              {lightbox.credit && (
                <span
                  dir="ltr"
                  className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded bg-black/45 px-2 py-0.5 text-[11px] leading-4 text-white/90 backdrop-blur-sm"
                >
                  <Camera className="h-3 w-3" aria-hidden="true" />
                  {lightbox.credit}
                </span>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
