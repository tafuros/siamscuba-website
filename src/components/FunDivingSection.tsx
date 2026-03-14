import { motion } from "framer-motion";
import { Compass, Clock, Users } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import DiveSchedule from "./DiveSchedule";

const FunDivingSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Compass, label: t("fun_sites"), desc: t("fun_sites_desc") },
    { icon: Clock, label: t("fun_schedule"), desc: t("fun_schedule_desc") },
    { icon: Users, label: t("fun_personal"), desc: t("fun_personal_desc") },
  ];

  return (
    <section id="fun-diving" className="section-padding bg-ocean-surface">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-2">{t("fun_label")}</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">{t("fun_title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("fun_subtitle")}</p>
        </motion.div>

        {/* Features row */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{item.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dive Schedule Timetable */}
        <DiveSchedule />

        <p className="text-center text-xs text-muted-foreground mt-6">
          ✳️ For certified divers only · Schedules may vary depending on weather conditions
        </p>
      </div>
    </section>
  );
};

export default FunDivingSection;
