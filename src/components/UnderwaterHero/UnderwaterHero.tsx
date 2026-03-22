import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import UnderwaterScene from "./UnderwaterScene";

const UnderwaterHero = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Track scroll progress for 3D scene
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setScrollProgress(v);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  // IntersectionObserver to disable render when off-screen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <div ref={containerRef} className="relative w-full h-[200vh]">
      {/* Sticky canvas */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {isVisible && <UnderwaterScene scrollProgress={scrollProgress} />}

        {/* Loading overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
          <div className="w-8 h-8 border-2 border-ocean-light/30 border-t-ocean-light rounded-full animate-spin" />
        </div>

        {/* Text overlay */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-6"
          >
            <span className="inline-block text-ocean-light/80 font-body text-[11px] md:text-xs uppercase tracking-[0.45em] border border-ocean-light/20 rounded-full px-5 py-1.5 backdrop-blur-sm bg-ocean-deep/20">
              {t("hero_badge")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] max-w-3xl mx-auto text-center backdrop-blur-md bg-ocean-deep/30 rounded-2xl px-8 py-6 border border-primary-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]"
          >
            {t("hero_title_1")}
            <br />
            <span className="text-ocean-light italic">{t("hero_title_2")}</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mx-auto mt-6 mb-6 h-px w-24 bg-gradient-to-r from-transparent via-ocean-light/60 to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-base md:text-lg max-w-xl mx-auto font-body font-light leading-relaxed text-primary-foreground/90 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            {t("hero_subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-12 flex flex-col items-center gap-1"
          >
            <span className="text-primary-foreground/40 font-body text-[10px] uppercase tracking-[0.3em]">
              {t("hero_explore")}
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <svg className="h-5 w-5 text-primary-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnderwaterHero;
