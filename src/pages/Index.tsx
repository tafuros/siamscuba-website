import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { pathLanguage } from "@/i18n/LanguageContext";
import Seo from "@/components/Seo";
import { COURSE_SEO } from "@/lib/courseSeoData";
import { COURSE_TO_SLUG } from "@/lib/courseSlugMap";
import { HOME_HREFLANG_ALTERNATES } from "@/lib/localeRoutes";
import { buildScheduleJsonLd } from "@/data/diveScheduleBoard";
import Navbar from "@/components/Navbar";
import UnderwaterHero from "@/components/UnderwaterHero";
import CoursesSection from "@/components/CoursesSection";
import GoProBanner from "@/components/goPro/GoProBanner";

import FunDivingSection from "@/components/FunDivingSection";
import ReviewsStrip from "@/components/ReviewsStrip";
import Footer from "@/components/Footer";
import FloatingBookNow from "@/components/FloatingBookNow";

const HOME_SEO = {
  title: "Siam Scuba | PADI 5 Star Dive Center in Koh Tao, Thailand",
  description:
    "PADI 5-Star dive center on Koh Tao. Two custom dive boats, max 4:1 student-to-instructor ratio, flexible schedules. Open Water to Divemaster courses.",
};

/**
 * /he and /es render this same homepage (2026-10-06). Their <title> and
 * description follow the URL, not the visitor's stored preference: "/" must
 * keep its English head even for a returning Hebrew reader, or the canonical
 * English page would ship a Hebrew title.
 */
const HOME_SEO_BY_LANG = {
  he: {
    title: "סיאם סקובה | מרכז צלילה PADI 5 כוכבים בקוטאו, תאילנד",
    description:
      "מרכז צלילה PADI 5 כוכבים בקוטאו. שתי סירות צלילה פרטיות, עד 4 תלמידים למדריך, צלילות כיף (מודרכות) כל יום וקורסים מצלילת היכרות ועד Divemaster.",
  },
  es: {
    title: "Siam Scuba | Centro de buceo PADI 5 estrellas en Koh Tao, Tailandia",
    description:
      "Centro de buceo PADI 5 estrellas en Koh Tao. Dos barcos de buceo propios, máximo 4 alumnos por instructor, fun dives cada día y cursos desde el bautismo hasta Divemaster.",
  },
} as const;

const Index = ({ courseOverride }: { courseOverride?: string }) => {
  const [searchParams] = useSearchParams();
  const courseParam = courseOverride || searchParams.get("course");

  const courseSlug = courseOverride ? COURSE_TO_SLUG[courseOverride] : undefined;
  const courseSeo = courseSlug ? COURSE_SEO[courseSlug] : undefined;
  const { pathname } = useLocation();
  const routeLang = pathLanguage(pathname);
  const homeSeo = routeLang === "he" || routeLang === "es" ? HOME_SEO_BY_LANG[routeLang] : HOME_SEO;
  const seo = courseSeo || homeSeo;

  useEffect(() => {
    if (courseParam) {
      setTimeout(() => {
        document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [courseParam]);

  return (
    <div className="min-h-screen">
      <Seo
        title={seo.title}
        description={seo.description}
        // Only the bare homepage is the English member of the "/" + /he + /es
        // cluster. CoursePage renders this same component for /:courseSlug, and
        // those URLs have no locale twins - declaring the cluster there would
        // point hreflang at pages that never point back, which is exactly the
        // non-reciprocal annotation Google throws away.
        hreflangAlternates={courseOverride ? undefined : HOME_HREFLANG_ALTERNATES}
        // Trip offers only on the bare homepage. /:courseSlug renders this same
        // component, and repeating the board's ItemList on every course URL
        // would duplicate the same six offers across a dozen pages.
        jsonLd={courseOverride ? undefined : buildScheduleJsonLd()}
        breadcrumbs={
          courseOverride
            ? [
                { name: "Home", path: "/" },
                { name: "Courses", path: "/#courses" },
                { name: courseOverride },
              ]
            : undefined
        }
      />
      <Navbar />
      <UnderwaterHero courseHeading={courseSeo?.h1} />
      {/* Go Pro sits between the hero and the courses (Ben, 2026-08-16): the
          hero fades into the light background, and a rounded black card landing
          there is the first thing after it - the premium item on the page,
          before the course list rather than an afterthought below it. */}
      <GoProBanner />
      <CoursesSection initialCourse={courseParam} />
      <FunDivingSection />
      {/* Trimmed 2026-10-04 (Ben, mockup D). Clarity, 30 days to 2026-10-02:
          the page was 19 phone screens and 9.5% of mobile visitors got past
          half of it. Dive sites, Boats, Why us, the big TripAdvisor block, the
          blog preview, "Ready to dive" and Location sat below that line with
          0-5 taps each, so they left the homepage. Their links live on in the
          footer (dive sites, guides, map) and on their own pages. */}
      <ReviewsStrip />
      <Footer />
      <FloatingBookNow />
    </div>
  );
};

export default Index;
