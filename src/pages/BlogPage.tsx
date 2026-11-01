import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { listedBlogPosts, type BlogPost } from "@/data/blogPosts";
import { useLanguage } from "@/i18n/LanguageContext";

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { t, language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categoryMap: Record<string, string> = {
    All: t("blog_cat_all"),
    Diving: t("blog_cat_diving"),
    Food: t("blog_cat_food"),
    Beaches: t("blog_cat_beaches"),
    Activities: t("blog_cat_activities"),
    Nightlife: t("blog_cat_nightlife"),
  };

  const categories = ["All", "Diving", "Food", "Beaches", "Activities", "Nightlife"];

  const sorted = useMemo(() => {
    // The main list is English only; Hebrew/Spanish posts get their own block
    // (top of the page when the visitor reads in that language, bottom otherwise).
    return listedBlogPosts
      .filter((p) => !p.language || p.language === "en")
      .slice()
      .sort((a, b) => {
        const fa = a.featured ? 1 : 0;
        const fb = b.featured ? 1 : 0;
        if (fa !== fb) return fb - fa;
        return b.date.localeCompare(a.date);
      });
  }, []);

  // Other-language posts, grouped by language, newest first.
  const otherLangGroups = useMemo(() => {
    const groups: { lang: "he" | "es"; label: string; posts: BlogPost[] }[] = [
      { lang: "he", label: "בעברית", posts: [] },
      { lang: "es", label: "En español", posts: [] },
    ];
    for (const p of listedBlogPosts) {
      const g = groups.find((x) => x.lang === p.language);
      if (g) g.posts.push(p);
    }
    for (const g of groups) g.posts.sort((a, b) => b.date.localeCompare(a.date));
    return groups.filter((g) => g.posts.length > 0);
  }, []);
  const ownLangGroup = otherLangGroups.find((g) => g.lang === language);
  const restLangGroups = otherLangGroups.filter((g) => g !== ownLangGroup);

  const renderLangGroup = (g: (typeof otherLangGroups)[number]) => (
    <div key={g.lang} dir={g.lang === "he" ? "rtl" : "ltr"} lang={g.lang} className="mb-8 last:mb-0">
      <h3 className="mb-4 text-lg font-semibold text-foreground">{g.label}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {g.posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );

  const filtered = activeCategory === "All"
    ? sorted
    : sorted.filter((p) => p.category === activeCategory);

  const showFeaturedStrip = activeCategory === "All";
  const featured = showFeaturedStrip ? filtered.filter((p) => p.featured).slice(0, 3) : [];
  const rest = showFeaturedStrip ? filtered.filter((p) => !featured.includes(p)) : filtered;

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Koh Tao Diving & Travel Blog | Siam Scuba"
        description="Honest guides to diving, food, beaches and nightlife in Koh Tao - PADI tips, dive site reviews and what to expect on your trip to Thailand's island."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Koh Tao Guide" },
        ]}
      />
      <Navbar />
      <main className="pt-24 md:pt-28 pb-20 px-4">
        <div className="container mx-auto">
          {/* Hero: a real photo from one of our trips, sitting BELOW the fixed navbar
              (the navbar uses dark text on a transparent bar, so it can't overlay a photo). */}
          <section className="relative mb-10 overflow-hidden rounded-[28px] bg-[#03152a] text-white">
            <img
              src="/blog/blog-hero-whale-shark-koh-tao.webp"
              srcSet="/blog/blog-hero-whale-shark-koh-tao-900.webp 900w, /blog/blog-hero-whale-shark-koh-tao.webp 2000w"
              sizes="(max-width: 900px) 100vw, 1300px"
              alt="Whale shark above a school of yellow snapper off Koh Tao"
              width={2000}
              height={1333}
              // @ts-expect-error - fetchpriority is valid HTML, React types lag
              fetchpriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(3,21,42,.15) 0%, rgba(3,21,42,.35) 45%, rgba(3,21,42,.88) 100%)",
              }}
            />
            <motion.div
              initial={{ y: 16 }}
              animate={{ y: 0 }}
              className="relative z-10 mx-auto flex min-h-[360px] max-w-3xl flex-col items-center justify-end px-5 pb-12 pt-24 text-center md:min-h-[440px] md:pb-14"
            >
              <p className="mb-4 inline-flex rounded-full border border-sky-400/35 bg-sky-400/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[.08em] text-sky-100 backdrop-blur-sm">
                {t("blog_hero_eyebrow")}
              </p>
              <h1 className="font-display text-[clamp(36px,6vw,64px)] font-bold leading-[1.05] drop-shadow-[0_4px_30px_rgba(0,0,0,.45)]">
                {t("blog_page_title")}
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-[clamp(15px,2.1vw,18px)] leading-relaxed text-white/85">
                {t("blog_page_subtitle")}
              </p>
            </motion.div>
            <span
              dir="ltr"
              className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 rounded bg-black/45 px-2 py-0.5 text-[11px] leading-4 text-white/90 backdrop-blur-sm"
            >
              <Camera className="h-3 w-3" aria-hidden="true" />
              @fishgirl71 for @kohtaoprovideo
            </span>
          </section>

          {/* Visitor reads in Hebrew/Spanish: their posts come first. */}
          {ownLangGroup && (
            <section aria-label={ownLangGroup.label} className="mb-12">
              {renderLangGroup(ownLangGroup)}
            </section>
          )}

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {categoryMap[cat]}
              </button>
            ))}
          </div>

          {/* Featured strip — 1 large + 2 small, only on All view */}
          {featured.length > 0 && (
            <section aria-labelledby="featured-heading" className="mb-12">
              <h2
                id="featured-heading"
                className="font-display text-2xl font-semibold text-foreground mb-5"
              >
                {t("blog_featured")}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-2 lg:row-span-2"
                >
                  <BlogCard post={featured[0]} variant="hero" />
                </motion.div>
                {featured.slice(1, 3).map((post, i) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i + 1) * 0.05 }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>

          {/* Posts in other languages - kept out of the English list */}
          {restLangGroups.length > 0 && (
            <section aria-labelledby="other-languages-heading" className="mt-16 border-t border-border/60 pt-10">
              <h2
                id="other-languages-heading"
                className="font-display text-2xl font-semibold text-foreground mb-6"
              >
                {t("blog_other_languages")}
              </h2>
              {restLangGroups.map(renderLangGroup)}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
