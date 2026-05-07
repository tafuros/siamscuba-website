import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "@/components/Seo";
import { COURSE_SEO } from "@/lib/courseSeoData";
import { COURSE_TO_SLUG } from "@/lib/courseSlugMap";
import Navbar from "@/components/Navbar";
import UnderwaterHero from "@/components/UnderwaterHero";
import CoursesSection from "@/components/CoursesSection";

import FunDivingSection from "@/components/FunDivingSection";
import BoatsSection from "@/components/BoatsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TripAdvisorSection from "@/components/TripAdvisorSection";
import BlogPreview from "@/components/BlogPreview";
import BookingCTA from "@/components/BookingCTA";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import FloatingInstagram from "@/components/FloatingInstagram";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FloatingBookNow from "@/components/FloatingBookNow";
import ScrollHint from "@/components/ScrollHint";

const HOME_SEO = {
  title: "Siam Scuba | PADI 5 Star Dive Center in Koh Tao, Thailand",
  description:
    "PADI dive center on Koh Tao with two custom dive boats, max 4:1 student-to-instructor ratio, flexible schedules. Open Water, Advanced, Divemaster & specialty courses.",
};

const Index = ({ courseOverride }: { courseOverride?: string }) => {
  const [searchParams] = useSearchParams();
  const courseParam = courseOverride || searchParams.get("course");

  const courseSlug = courseOverride ? COURSE_TO_SLUG[courseOverride] : undefined;
  const seo = (courseSlug && COURSE_SEO[courseSlug]) || HOME_SEO;

  useEffect(() => {
    if (courseParam) {
      setTimeout(() => {
        document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [courseParam]);

  return (
    <div className="min-h-screen">
      <Seo title={seo.title} description={seo.description} />
      <Navbar />
      <UnderwaterHero />
      <CoursesSection initialCourse={courseParam} />
      <ScrollHint label="Fun Diving ↓" targetId="fun-diving" />
      <FunDivingSection />
      <ScrollHint label="Our Boats ↓" targetId="boats" />
      <BoatsSection />
      <WhyChooseUs />
      <TripAdvisorSection />
      <BlogPreview />
      <BookingCTA />
      <LocationSection />
      <Footer />
      <FloatingInstagram />
      <FloatingWhatsApp />
      <FloatingBookNow />
    </div>
  );
};

export default Index;
