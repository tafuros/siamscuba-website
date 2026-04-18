import { useState } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Star, Crown, Fish, Anchor, ArrowDown, Zap, Layers, ShieldCheck, Heart, Feather, Camera, Waves } from "lucide-react";
import padi from "@/assets/padi-logo.png";
import CourseDetailDialog from "./CourseDetailDialog";
import CourseCarouselRow from "./CourseCarouselRow";
import { useLanguage } from "@/i18n/LanguageContext";

const CoursesSection = ({ initialCourse }: { initialCourse?: string | null }) => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(initialCourse || null);
  const { t } = useLanguage();

  const categories = [
    {
      label: t("courses_basic"),
      description: t("courses_basic_desc"),
      courses: [
        { icon: Fish, title: t("course_dsd"), dialogKey: "Discover Scuba Diving", subtitle: "One Day Experience", price: "2,600", duration: t("dur_1_day"), highlights: [t("hl_no_exp"), t("hl_pool_ocean"), t("hl_padi_instructor")], hasDetails: true },
        { icon: BookOpen, title: t("course_ow"), dialogKey: "Open Water Diver", price: "11,000", duration: t("dur_2_5_days"), highlights: [t("hl_18m"), t("hl_lifetime"), t("hl_4_dives")], featured: true, hasDetails: true },
        { icon: Fish, title: t("course_bubble"), dialogKey: "Bubble Maker", price: "3,800", duration: t("dur_1_day"), highlights: [t("hl_children"), t("hl_fun_intro"), t("hl_safe")], hasDetails: true },
        { icon: Waves, title: t("course_review"), dialogKey: "Scuba Review", price: "2,500", duration: t("dur_1_day"), highlights: [t("hl_review_refresh"), t("hl_review_2dives"), t("hl_review_instructor")], hasDetails: true },
      ],
    },
    {
      label: t("courses_advanced"),
      description: t("courses_advanced_desc"),
      courses: [
        { icon: Star, title: t("course_aow"), dialogKey: "Advanced Open Water", price: "10,000", duration: t("dur_2_days"), highlights: [t("hl_30m"), t("hl_5_adventure"), t("hl_deep_nav")], featured: true, hasDetails: true },
        { icon: ShieldCheck, title: t("course_rescue"), dialogKey: "Rescue Diver", price: "10,000", duration: t("dur_3_days"), highlights: [t("hl_emergency"), t("hl_rescue_tech"), t("hl_stress")], hasDetails: true },
        { icon: Heart, title: t("course_efr"), dialogKey: "Emergency First Response (EFR)", price: "4,500", duration: t("dur_1_day"), highlights: [t("hl_cpr"), t("hl_intl_cert"), t("hl_life_saving")], hasDetails: true },
      ],
    },
    {
      label: t("courses_pro"),
      description: t("courses_pro_desc"),
      courses: [
        { icon: Crown, title: t("course_dm"), dialogKey: "Divemaster", price: "38,500", duration: t("dur_4_8_weeks"), highlights: [t("hl_lead"), t("hl_career"), t("hl_free_intern")], featured: true },
        { icon: Award, title: t("course_idc"), dialogKey: "IDC (Instructor Course)", price: null, duration: t("dur_varies"), highlights: [t("hl_become_instructor"), t("hl_full_training"), t("hl_free_intern")], hasDetails: true },
      ],
    },
    {
      label: t("courses_specialty"),
      description: t("courses_specialty_desc"),
      courses: [
        { icon: Feather, title: t("course_ppb"), dialogKey: "Peak Performance Buoyancy", price: "5,500", duration: t("dur_1_day"), highlights: [t("hl_ppb_buoyancy"), t("hl_ppb_air"), t("hl_ppb_glide")], hasDetails: true },
        { icon: Anchor, title: t("course_wreck"), dialogKey: "Wreck Diving", price: "8,500", duration: t("dur_2_days"), highlights: [t("hl_wrecks"), t("hl_penetration"), t("hl_specialty_cert")] },
        { icon: ArrowDown, title: t("course_deep"), dialogKey: "Deep Diving", price: "8,500", duration: t("dur_2_days"), highlights: [t("hl_beyond_18"), t("hl_gas"), t("hl_deep_plan")] },
        { icon: Zap, title: t("course_dpv"), dialogKey: "Underwater Scooter (DPV)", price: null, duration: t("dur_1_day"), highlights: [t("hl_dpv"), t("hl_cover_ground"), t("hl_unique")] },
        { icon: Layers, title: t("course_sidemount"), dialogKey: "Sidemount Diving", price: null, duration: t("dur_2_3_days"), highlights: [t("hl_streamline"), t("hl_independent_gas"), t("hl_advanced_config")] },
        { icon: Camera, title: t("course_uw_photo"), dialogKey: "UW Photography & Videography", price: "37,000", duration: t("dur_5_days"), highlights: [t("hl_uw_10dives"), t("hl_uw_1on1"), t("hl_uw_padi_cert")], hasDetails: true },
      ],
    },
  ];

  return (
    <>
      <section id="courses" className="section-padding bg-background">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src={padi} alt="PADI" className="h-28 w-auto" />
              <p className="text-primary font-body text-sm uppercase tracking-[0.2em]">{t("courses_label")}</p>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">{t("courses_title")}</h2>
          </motion.div>

          <div className="space-y-10">
            {categories.map((cat, catIdx) => (
              <motion.div key={cat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: catIdx * 0.1 }}>
                <div className="mb-4">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">{cat.label}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{cat.description}</p>
                </div>

                <CourseCarouselRow courses={cat.courses} t={t} setSelectedCourse={setSelectedCourse} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CourseDetailDialog courseTitle={selectedCourse || ""} open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)} />
    </>
  );
};

export default CoursesSection;
