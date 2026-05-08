import { motion } from "framer-motion";
import { Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import sailRockChimney from "@/assets/sail-rock-chimney.webp";
import { useLanguage } from "@/i18n/LanguageContext";

const SailRockBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-12 md:py-16">
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
    </section>
  );
};

export default SailRockBanner;
