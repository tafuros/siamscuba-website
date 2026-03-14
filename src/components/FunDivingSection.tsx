import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Clock, Users, Waves, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import diveAction from "@/assets/dive-action.jpg";
import diveCoralGroup from "@/assets/dive-coral-group.jpg";
import diveReef from "@/assets/dive-reef.jpg";
import diveExplorer from "@/assets/dive-explorer.jpg";
import sailRockChimney from "@/assets/sail-rock-chimney.png";
import sailRockSilhouette from "@/assets/sail-rock-silhouette.png";
import sailRockCoral from "@/assets/sail-rock-coral.png";
import CourseDetailDialog from "./CourseDetailDialog";
import { useLanguage } from "@/i18n/LanguageContext";

const WHATSAPP_URL = "https://wa.me/972528641581?text=Hi%20Siam%20Scuba!%20I'd%20like%20to%20book%20fun%20dives.";

const FunDivingSection = () => {
  const [showSailRock, setShowSailRock] = useState(false);
  const { t } = useLanguage();

  const features = [
    { icon: Compass, label: t("fun_sites"), desc: t("fun_sites_desc") },
    { icon: Clock, label: t("fun_schedule"), desc: t("fun_schedule_desc") },
    { icon: Users, label: t("fun_personal"), desc: t("fun_personal_desc") },
  ];

  return (
    <>
      <section id="fun-diving" className="section-padding bg-ocean-surface">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-2">{t("fun_label")}</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">{t("fun_title")}</h2>
            <p className="mt-4 text-muted-foreground">{t("fun_subtitle")}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <Card className="border-0 shadow-lg bg-card overflow-hidden">
              <div className="grid grid-cols-3 h-40 md:h-48">
                <img src={sailRockChimney} alt="Divers at Sail Rock Chimney" className="w-full h-full object-cover" />
                <img src={sailRockSilhouette} alt="Diver silhouette at Sail Rock" className="w-full h-full object-cover" />
                <img src={sailRockCoral} alt="Sail Rock coral and fish" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Waves className="h-5 w-5 text-primary" />
                    <span className="text-primary text-xs font-semibold uppercase tracking-widest">{t("fun_sail_crown")}</span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">{t("fun_sail_title")}</h3>
                  <p className="text-muted-foreground mt-2 text-sm">{t("fun_sail_desc")}</p>
                  <p className="text-foreground font-bold text-lg mt-2">{t("fun_sail_price")} <span className="text-sm font-normal text-muted-foreground">/ full-day trip</span></p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button variant="ghost" className="rounded-full text-primary hover:text-primary/80" onClick={() => setShowSailRock(true)}>
                    <Info className="h-4 w-4 mr-1" />
                    {t("courses_more_details")}
                  </Button>
                  <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-6">
                    <Link to="/fun-dive-booking">{t("fun_sail_book")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 rounded-2xl overflow-hidden">
            <img src={diveAction} alt="Diver jumping into the ocean" className="w-full h-48 md:h-64 object-cover rounded-xl" />
            <img src={diveCoralGroup} alt="Divers exploring coral reef" className="w-full h-48 md:h-64 object-cover rounded-xl" />
            <img src={diveReef} alt="Divers swimming near coral" className="w-full h-48 md:h-64 object-cover rounded-xl" />
            <img src={diveExplorer} alt="Diver exploring underwater rocks" className="w-full h-48 md:h-64 object-cover rounded-xl" />
          </motion.div>

          <div className="max-w-3xl mx-auto text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {features.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{item.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 bg-card rounded-2xl p-8 shadow-md inline-block">
              <p className="text-muted-foreground text-sm mb-1">{t("fun_starting")}</p>
              <p className="text-4xl font-bold text-foreground font-display">฿1,800 <span className="text-lg font-normal text-muted-foreground">{t("fun_per_dive")}</span></p>
              <Button asChild className="rounded-full mt-6 px-8 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/fun-dive-booking">{t("fun_book")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CourseDetailDialog courseTitle="Sail Rock" open={showSailRock} onOpenChange={setShowSailRock} />

      {/* Sail Rock Banner */}
      <div className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0">
          <img src={sailRockChimney} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-ocean-deep/80" />
        </div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Waves className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">{t("sail_banner_title")}</h3>
              <p className="text-primary-foreground/70 text-sm mt-1">{t("sail_banner_desc")}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Button asChild size="lg" className="rounded-full bg-accent/80 backdrop-blur-md hover:bg-accent/95 text-accent-foreground px-8 font-semibold border border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.35)]">
              <Link to="/fun-dive-booking">{t("sail_banner_cta")}</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FunDivingSection;
