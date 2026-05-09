import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { useLanguage } from "@/i18n/LanguageContext";

interface BlogPreviewProps {
  courseSlug?: string;
}

const BlogPreview = ({ courseSlug }: BlogPreviewProps) => {
  const { t } = useLanguage();

  const courseFiltered = courseSlug
    ? blogPosts.filter((p) => p.relatedCourses?.includes(courseSlug))
    : [];

  // If course-specific filter has any matches, use them; else fall back to first 3
  const featured = courseFiltered.length > 0 ? courseFiltered.slice(0, 3) : blogPosts.slice(0, 3);
  const isCourseContext = courseSlug && courseFiltered.length > 0;

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            {isCourseContext ? t("blog_for_course_title") : t("blog_title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            {isCourseContext ? t("blog_for_course_subtitle") : t("blog_subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((post, i) => (
            <motion.div key={post.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" className="rounded-full px-8 gap-2">
            <Link to="/blog">
              {t("blog_view_all")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
