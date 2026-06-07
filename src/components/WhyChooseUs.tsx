import { motion } from "framer-motion";
import { ShieldCheck, GraduationCap, MapPin, Heart } from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";
import { useLanguage } from "@/i18n/LanguageContext";
import AmbientReviews from "@/components/AmbientReviews";

const WhyChooseUs = () => {
  const { t } = useLanguage();

  const reasons = [
    { icon: ShieldCheck, title: t("why_safety"), desc: t("why_safety_desc") },
    { icon: GraduationCap, title: t("why_instructors"), desc: t("why_instructors_desc") },
    { icon: MapPin, title: t("why_location"), desc: t("why_location_desc") },
    { icon: Heart, title: t("why_personal"), desc: t("why_personal_desc") },
  ];

  return (
    <section id="about" className="section-padding bg-ocean-surface relative overflow-hidden isolate">
      <AmbientReviews startIndex={1} count={4} />
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-2">{t("why_label")}</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">{t("why_title")}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((r, i) => (
            <motion.div key={r.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <GlowCard glowColor="blue" customSize className="h-full !grid-rows-[1fr] !shadow-none !p-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <r.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{r.title}</h3>
                  <p className="text-sm text-muted-foreground">{r.desc}</p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
