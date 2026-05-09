import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { useLanguage } from "@/i18n/LanguageContext";

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { t } = useLanguage();

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
    return [...blogPosts].sort((a, b) => {
      const fa = a.featured ? 1 : 0;
      const fb = b.featured ? 1 : 0;
      if (fa !== fb) return fb - fa;
      return b.date.localeCompare(a.date);
    });
  }, []);

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
        description="Honest guides to diving, food, beaches, and nightlife in Koh Tao. PADI tips, dive site reviews, and what to expect on your trip to Thailand's tropical paradise."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Koh Tao Guide" },
        ]}
      />
      <Navbar />
      <main className="pt-36 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground">
              {t("blog_page_title")}
            </h1>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("blog_page_subtitle")}
            </p>
          </motion.div>

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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
