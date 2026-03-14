import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CoursesSection from "@/components/CoursesSection";

import FunDivingSection from "@/components/FunDivingSection";
import BoatsSection from "@/components/BoatsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import BlogPreview from "@/components/BlogPreview";
import BookingCTA from "@/components/BookingCTA";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import FloatingInstagram from "@/components/FloatingInstagram";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index = () => {
  const [searchParams] = useSearchParams();
  const courseParam = searchParams.get("course");

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
      <HeroSection />
      <CoursesSection initialCourse={courseParam} />
      
      <FunDivingSection />
      <BoatsSection />
      <WhyChooseUs />
      <BlogPreview />
      <BookingCTA />
      <LocationSection />
      <Footer />
      <FloatingInstagram />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
