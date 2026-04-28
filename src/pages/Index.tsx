import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

const Index = ({ courseOverride }: { courseOverride?: string }) => {
  const [searchParams] = useSearchParams();
  const courseParam = courseOverride || searchParams.get("course");

  useEffect(() => {
    if (courseParam) {
      setTimeout(() => {
        document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [courseParam]);

  return (
    <div className="min-h-screen">
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
