import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { COURSE_SEO } from "@/lib/courseSeoData";
import { SLUG_TO_COURSE } from "@/lib/courseSlugMap";
import { useLanguage } from "@/i18n/LanguageContext";

interface RelatedCoursesProps {
  slugs: string[];
  heading?: string;
}

const RelatedCourses = ({ slugs, heading }: RelatedCoursesProps) => {
  const { t } = useLanguage();

  const valid = slugs
    .filter((s) => COURSE_SEO[s] && SLUG_TO_COURSE[s])
    .slice(0, 3);

  if (valid.length === 0) return null;

  return (
    <section aria-labelledby="related-courses-heading" className="mt-16">
      <h2
        id="related-courses-heading"
        className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2"
      >
        {heading ?? t("blog_related_courses_title")}
      </h2>
      <p className="text-muted-foreground mb-6">
        {t("blog_related_courses_subtitle")}
      </p>
      <div className={`grid gap-4 ${valid.length === 1 ? "grid-cols-1" : valid.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
        {valid.map((slug) => {
          const course = COURSE_SEO[slug];
          const name = SLUG_TO_COURSE[slug];
          return (
            <Link key={slug} to={`/${slug}`} className="group">
              <Card className="h-full border bg-card hover:border-primary/40 transition-colors">
                <CardContent className="p-5 flex flex-col h-full">
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
                    {course.description}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary">
                    {t("blog_related_courses_cta")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedCourses;
