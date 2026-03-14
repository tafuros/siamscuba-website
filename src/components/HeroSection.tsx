import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroImg from "@/assets/hero-turtle.jpg";
import { useLanguage } from "@/i18n/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-end justify-center overflow-hidden pb-28 md:pb-32">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Sea turtle swimming in crystal clear waters of Koh Tao" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/60 via-ocean-deep/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-background via-background/85 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="mb-6">
          <span className="inline-block text-ocean-light/80 font-body text-[11px] md:text-xs uppercase tracking-[0.45em] border border-ocean-light/20 rounded-full px-5 py-1.5 backdrop-blur-sm bg-ocean-deep/20">
            {t("hero_badge")}
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] max-w-3xl mx-auto backdrop-blur-md bg-ocean-deep/30 rounded-2xl px-8 py-6 border border-primary-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]">
          {t("hero_title_1")}
          <br />
          <span className="text-ocean-light italic">{t("hero_title_2")}</span>
        </motion.h1>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="mx-auto mt-6 mb-6 h-px w-24 bg-gradient-to-r from-transparent via-ocean-light/60 to-transparent" />

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="text-base md:text-lg max-w-xl mx-auto font-body font-light leading-relaxed text-gradient-navy drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]">
          {t("hero_subtitle")}
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer" onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" })}>
        <span className="text-primary-foreground/40 font-body text-[10px] uppercase tracking-[0.3em]">
          {t("hero_explore")}
        </span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
          <ChevronDown className="h-5 w-5 text-primary-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
