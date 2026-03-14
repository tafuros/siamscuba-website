import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Star, Crown, Fish, Anchor, ArrowDown, Zap, Layers, MessageCircle, ShieldCheck, Info, Heart, Feather, ChevronLeft, ChevronRight, Share2, Camera, Waves } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/spotlight-card";
import padi from "@/assets/padi-logo.png";
import CourseDetailDialog from "./CourseDetailDialog";
import { useLanguage } from "@/i18n/LanguageContext";
import useEmblaCarousel from "embla-carousel-react";
import { toast } from "sonner";

const WHATSAPP_URL = "https://wa.me/972528641581?text=Hi%20Siam%20Scuba!%20I'm%20interested%20in%20";

const CourseCard = ({ course, t, setSelectedCourse }: { course: any; t: (key: any) => string; setSelectedCourse: (key: string) => void }) => {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/?course=${encodeURIComponent(course.dialogKey)}`;
    const text = `${course.title}${course.price ? ` — ฿${course.price} THB` : ""}\n${course.duration}\n${course.highlights.join("\n")}\n\nSiam Scuba — Koh Tao`;
    if (navigator.share) {
      try {
        await navigator.share({ title: course.title, text, url: shareUrl });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      toast.success(t("share_copied"));
    }
  };

  return (
  <GlowCard glowColor="blue" customSize className="h-full !p-0 !gap-0 !grid-rows-[1fr] !shadow-none">
    <Card className={`relative overflow-hidden h-full border-0 shadow-none bg-transparent ${course.featured ? "ring-2 ring-primary" : ""}`}>
      {course.featured && (
        <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
          {t("courses_most_popular")}
        </div>
      )}
      <CardContent className="p-6 flex flex-col h-full">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-ocean-surface text-secondary-foreground">
          <course.icon className="h-6 w-6" />
        </div>
        <h4 className="font-display text-lg font-semibold text-foreground mb-0.5">{course.title}</h4>
        {course.subtitle && <p className="text-sm text-muted-foreground italic mb-2">{course.subtitle}</p>}
        {!course.subtitle && <div className="mb-2" />}
        <div className="flex items-baseline gap-1 mb-1">
          {course.price ? (
            <>
              <span className="text-2xl font-bold text-foreground">฿{course.price}</span>
              <span className="text-sm text-muted-foreground">THB</span>
            </>
          ) : (
            <span className="text-lg font-semibold text-primary">{t("courses_get_price")}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-4">{course.duration}</p>
        <ul className="space-y-2 mb-6 flex-1">
          {course.highlights.map((h: string) => (
            <li key={h} className="flex items-start gap-2 text-sm text-foreground/80">
              <Award className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              {h}
            </li>
          ))}
        </ul>
        <div className="space-y-2">
          {course.hasDetails && (
            <Button variant="ghost" className="rounded-full w-full text-primary hover:text-primary/80" onClick={() => setSelectedCourse(course.dialogKey)}>
              <Info className="h-4 w-4 mr-1" />
              {t("courses_more_details")}
            </Button>
          )}
          <div className="flex gap-2">
            <Button asChild variant={course.featured ? "default" : "outline"} className="rounded-full flex-1">
              <a href={`${WHATSAPP_URL}${encodeURIComponent(course.dialogKey)}`} target="_blank" rel="noopener noreferrer">
                {course.price ? t("courses_book_now") : t("courses_get_price")}
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full shrink-0 text-muted-foreground hover:text-primary" onClick={handleShare} aria-label={t("share_button")}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </GlowCard>
  );
};

const CoursesSection = ({ initialCourse }: { initialCourse?: string | null }) => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(initialCourse || null);
  const { t } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false, slidesToScroll: 1 });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const categories = [
    {
      label: t("courses_basic"),
      description: t("courses_basic_desc"),
      courses: [
        {
          icon: Fish,
          title: t("course_dsd"),
          dialogKey: "Discover Scuba Diving",
          subtitle: "One Day Experience",
          price: "2,600",
          duration: t("dur_1_day"),
          highlights: [t("hl_no_exp"), t("hl_pool_ocean"), t("hl_padi_instructor")],
          hasDetails: true,
        },
        {
          icon: BookOpen,
          title: t("course_ow"),
          dialogKey: "Open Water Diver",
          price: "11,000",
          duration: t("dur_2_5_days"),
          highlights: [t("hl_18m"), t("hl_lifetime"), t("hl_4_dives")],
          featured: true,
          hasDetails: true,
        },
        {
          icon: Fish,
          title: t("course_bubble"),
          dialogKey: "Bubble Maker",
          price: "3,800",
          duration: t("dur_1_day"),
          highlights: [t("hl_children"), t("hl_fun_intro"), t("hl_safe")],
          hasDetails: true,
        },
        {
          icon: Waves,
          title: t("course_review"),
          dialogKey: "Scuba Review",
          price: "2,500",
          duration: t("dur_1_day"),
          highlights: [t("hl_review_refresh"), t("hl_review_2dives"), t("hl_review_instructor")],
          hasDetails: true,
        },
      ],
    },
    {
      label: t("courses_advanced"),
      description: t("courses_advanced_desc"),
      courses: [
        {
          icon: Star,
          title: t("course_aow"),
          dialogKey: "Advanced Open Water",
          price: "10,000",
          duration: t("dur_2_days"),
          highlights: [t("hl_30m"), t("hl_5_adventure"), t("hl_deep_nav")],
          featured: true,
          hasDetails: true,
        },
        {
          icon: ShieldCheck,
          title: t("course_rescue"),
          dialogKey: "Rescue Diver",
          price: "10,000",
          duration: t("dur_3_4_days"),
          highlights: [t("hl_emergency"), t("hl_rescue_tech"), t("hl_stress")],
          hasDetails: true,
        },
        {
          icon: Heart,
          title: t("course_efr"),
          dialogKey: "Emergency First Response (EFR)",
          price: "4,500",
          duration: t("dur_1_day"),
          highlights: [t("hl_cpr"), t("hl_intl_cert"), t("hl_life_saving")],
          hasDetails: true,
        },
      ],
    },
    {
      label: t("courses_pro"),
      description: t("courses_pro_desc"),
      courses: [
        {
          icon: Crown,
          title: t("course_dm"),
          dialogKey: "Divemaster",
          price: "38,500",
          duration: t("dur_4_8_weeks"),
          highlights: [t("hl_lead"), t("hl_career"), t("hl_free_intern")],
          featured: true,
        },
        {
          icon: Award,
          title: t("course_idc"),
          dialogKey: "IDC (Instructor Course)",
          price: null,
          duration: t("dur_varies"),
          highlights: [t("hl_become_instructor"), t("hl_full_training"), t("hl_free_intern")],
        },
      ],
    },
    {
      label: t("courses_specialty"),
      description: t("courses_specialty_desc"),
      isCarousel: true,
      courses: [
        {
          icon: Feather,
          title: t("course_ppb"),
          dialogKey: "Peak Performance Buoyancy",
          price: "5,500",
          duration: t("dur_1_day"),
          highlights: [t("hl_ppb_buoyancy"), t("hl_ppb_air"), t("hl_ppb_glide")],
          hasDetails: true,
        },
        {
          icon: Anchor,
          title: t("course_wreck"),
          dialogKey: "Wreck Diving",
          price: "8,500",
          duration: t("dur_2_days"),
          highlights: [t("hl_wrecks"), t("hl_penetration"), t("hl_specialty_cert")],
        },
        {
          icon: ArrowDown,
          title: t("course_deep"),
          dialogKey: "Deep Diving",
          price: "8,500",
          duration: t("dur_2_days"),
          highlights: [t("hl_beyond_18"), t("hl_gas"), t("hl_deep_plan")],
        },
        {
          icon: Zap,
          title: t("course_dpv"),
          dialogKey: "Underwater Scooter (DPV)",
          price: null,
          duration: t("dur_1_day"),
          highlights: [t("hl_dpv"), t("hl_cover_ground"), t("hl_unique")],
        },
        {
          icon: Layers,
          title: t("course_sidemount"),
          dialogKey: "Sidemount Diving",
          price: null,
          duration: t("dur_2_3_days"),
          highlights: [t("hl_streamline"), t("hl_independent_gas"), t("hl_advanced_config")],
        },
        {
          icon: Camera,
          title: t("course_uw_photo"),
          dialogKey: "UW Photography & Videography",
          price: "37,000",
          duration: t("dur_5_days"),
          highlights: [t("hl_uw_10dives"), t("hl_uw_1on1"), t("hl_uw_padi_cert")],
          hasDetails: true,
        },
      ],
    },
  ];

  return (
    <>
      <section id="courses" className="section-padding bg-background">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src={padi} alt="PADI" className="h-32 w-auto" />
              <p className="text-primary font-body text-sm uppercase tracking-[0.2em]">{t("courses_label")}</p>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">{t("courses_title")}</h2>
          </motion.div>

          <div className="space-y-16">
            {categories.map((cat, catIdx) => (
              <motion.div key={cat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: catIdx * 0.1 }}>
                <div className="mb-6">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">{cat.label}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{cat.description}</p>
                </div>

                {cat.isCarousel ? (
                  <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                      <div className="flex -ml-4">
                        {cat.courses.map((course, i) => (
                          <div key={course.dialogKey} className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 pl-4">
                            <CourseCard course={course} t={t} setSelectedCourse={setSelectedCourse} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={scrollPrev}
                      className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={scrollNext}
                      className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                      aria-label="Next"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className={`grid grid-cols-1 sm:grid-cols-2 ${cat.courses.length > 2 ? "lg:grid-cols-4" : cat.courses.length === 1 ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-6`}>
                    {cat.courses.map((course, i) => (
                      <motion.div key={course.dialogKey} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.08 }}>
                        <CourseCard course={course} t={t} setSelectedCourse={setSelectedCourse} />
                      </motion.div>
                    ))}
                  </div>
                )}
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
