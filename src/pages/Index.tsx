import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "@/components/Seo";
import { COURSE_SEO } from "@/lib/courseSeoData";
import { COURSE_TO_SLUG } from "@/lib/courseSlugMap";
import { HOME_HREFLANG_ALTERNATES } from "@/lib/localeRoutes";
import Navbar from "@/components/Navbar";
import UnderwaterHero from "@/components/UnderwaterHero";
import CoursesSection from "@/components/CoursesSection";
import GoProBanner from "@/components/goPro/GoProBanner";

import FunDivingSection from "@/components/FunDivingSection";
import DiveSitesSection from "@/components/DiveSitesSection";
import BoatsSection from "@/components/BoatsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TripAdvisorSection from "@/components/TripAdvisorSection";
import BlogPreview from "@/components/BlogPreview";
import BookingCTA from "@/components/BookingCTA";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import FloatingInstagram from "@/components/FloatingInstagram";
import FloatingBookNow from "@/components/FloatingBookNow";
import ScrollHint from "@/components/ScrollHint";

const HOME_SEO = {
  title: "Siam Scuba | PADI 5 Star Dive Center in Koh Tao, Thailand",
  description:
    "PADI 5-Star dive center on Koh Tao. Two custom dive boats, max 4:1 student-to-instructor ratio, flexible schedules. Open Water, Advanced & Divemaster courses.",
};

const Index = ({ courseOverride }: { courseOverride?: string }) => {
  const [searchParams] = useSearchParams();
  const courseParam = courseOverride || searchParams.get("course");

  const courseSlug = courseOverride ? COURSE_TO_SLUG[courseOverride] : undefined;
  const courseSeo = courseSlug ? COURSE_SEO[courseSlug] : undefined;
  const seo = courseSeo || HOME_SEO;

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
      <CoursesSection initialCourse={courseParam} />
      {/* Go Pro sits directly under the course list on purpose: it is the rung
          above everything in that carousel, so it reads as "and then what?"
          rather than as another course competing inside it. */}
      <GoProBanner />
      <ScrollHint label="Fun Diving ↓" targetId="fun-diving" />
      <FunDivingSection />
      <DiveSitesSection />
      <ScrollHint label="Our Boats ↓" targetId="boats" />
      <BoatsSection />
      <WhyChooseUs />
      <TripAdvisorSection />
      <BlogPreview courseSlug={courseSlug} />
      <BookingCTA />
      <LocationSection />
      <Footer />
      <FloatingInstagram />
      <FloatingBookNow />
    </div>
  );
};

export default Index;
