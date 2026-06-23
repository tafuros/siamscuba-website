import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import padi5StarBadge from "@/assets/padi-5star-badge.png";

interface UnderwaterHeroProps {
  /** When set (course landing pages), the H1 becomes "<courseHeading> in Koh Tao"
   *  instead of the generic homepage headline, so each course page has a unique H1. */
  courseHeading?: string;
}

const UnderwaterHero = ({ courseHeading }: UnderwaterHeroProps) => {
  const { t } = useLanguage();

  return (
    <section className="relative w-full h-screen overflow-hidden bg-ocean-deep">
      {/* Background photo with slow Ken Burns zoom */}
      <motion.div
        className="absolute inset-0 motion-reduce:!transform-none"
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 26, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <picture>
          {/* Mobile-only composite: ORIGINAL turtle photo on top (pixel-perfect,
              preserved unchanged) + AI-generated water + sun-ray + white-fade
              continuation below, blended at the seam with a 140px alpha fade.
              The turtle is "our constant"; only the depth/light/fade below
              comes from Gemini 2.5 Flash Image. */}
          <source
            media="(max-width: 767px)"
            srcSet="/hero/turtle-mobile-composite.jpg"
          />
          <source
            type="image/avif"
            srcSet="/hero/turtle-1280.avif 1280w, /hero/turtle-1920.avif 1920w"
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet="/hero/turtle-1280.webp 1280w, /hero/turtle-1920.webp 1920w"
            sizes="100vw"
          />
          <img
            src="/hero/turtle-1920.jpg"
            alt="Green sea turtle gliding near the surface in clear tropical water at Koh Tao"
            className="absolute inset-0 w-full h-full object-cover object-top md:[object-position:35%_center]"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            width={1920}
            height={1126}
          />
        </picture>
      </motion.div>

      {/* Desktop-only: AI-generated water + sun rays + fade-to-white strip layered
          at the bottom of the hero. mask-image fade at the top lets it blend
          into the turtle photo above. On mobile this isn't needed because the
          mobile <source> already serves a pre-composited image. */}
      <img
        src="/hero/desktop-extension.jpg"
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute bottom-0 left-0 right-0 w-full h-[40%] object-cover z-[1] pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_40%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_40%)]"
      />

      {/* Subtle dark vignette for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/30 via-transparent to-ocean-deep/40 pointer-events-none z-[1]" />

      {/* Bottom fade. On mobile the AI-extended image already fades to white
          at its bottom, so we just need a short final blend into the page bg.
          Desktop still uses the broader 30% fade for the full-bleed photo. */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none h-[12%] md:h-[30%]"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, hsl(var(--background)) 100%)",
        }}
      />

      {/* Floating bubbles (CSS-only, GPU-driven) */}
      <div aria-hidden className="hero-bubbles absolute inset-0 z-[3] pointer-events-none motion-reduce:hidden">
        <span className="bubble" style={{ left: "8%", animationDuration: "9s", animationDelay: "0s", width: "8px", height: "8px" }} />
        <span className="bubble" style={{ left: "22%", animationDuration: "12s", animationDelay: "2s", width: "5px", height: "5px" }} />
        <span className="bubble" style={{ left: "38%", animationDuration: "10s", animationDelay: "4s", width: "10px", height: "10px" }} />
        <span className="bubble" style={{ left: "55%", animationDuration: "14s", animationDelay: "1s", width: "6px", height: "6px" }} />
        <span className="bubble" style={{ left: "72%", animationDuration: "11s", animationDelay: "3s", width: "9px", height: "9px" }} />
        <span className="bubble" style={{ left: "88%", animationDuration: "13s", animationDelay: "5s", width: "7px", height: "7px" }} />
      </div>

      {/* Text overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-block text-ocean-light font-body text-[11px] md:text-xs uppercase tracking-[0.45em] border border-ocean-light/40 rounded-full px-5 py-1.5 backdrop-blur-md bg-ocean-deep/40">
            {t("hero_badge")}
          </span>
        </motion.div>

        {/* LCP element: must paint the instant React mounts, so it is NEVER
            started at opacity:0 (that would gate Largest Contentful Paint on
            the JS bundle + animation finishing). We animate only a transform
            (y) - a translated element still counts as painted - so the
            entrance feel is preserved without delaying LCP. */}
        <motion.h1
          initial={{ y: 16 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-display text-[2rem] sm:text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] max-w-3xl mx-auto text-center px-4 [text-shadow:_0_4px_24px_rgba(0,20,45,0.85),_0_2px_6px_rgba(0,0,0,0.65)]"
        >
          {courseHeading ? (
            <>
              {courseHeading}
              <br />
              <span className="text-ocean-light italic">in Koh Tao</span>
            </>
          ) : (
            <>
              {t("hero_title_1")}
              <br />
              <span className="text-ocean-light italic">{t("hero_title_2")}</span>
            </>
          )}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mx-auto mt-4 mb-4 md:mt-6 md:mb-6 h-px w-24 bg-gradient-to-r from-transparent via-ocean-light/70 to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-sm md:text-lg max-w-xl mx-auto font-body font-light leading-relaxed text-primary-foreground text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
        >
          {t("hero_subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="mt-4 md:mt-6 flex flex-col items-center gap-1.5 md:gap-2"
        >
          <img
            src={padi5StarBadge}
            alt="PADI 5 Star IDC Dive Center"
            className="h-16 sm:h-20 md:h-32 w-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
            loading="lazy"
            decoding="async"
          />
          <span className="text-primary-foreground font-display text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
            5 Star IDC Dive Center
          </span>
        </motion.div>

        {/* Explore scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="hidden sm:flex absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-primary-foreground/70 font-body text-[10px] uppercase tracking-[0.3em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
            {t("hero_explore")}
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <svg className="h-5 w-5 text-primary-foreground/70 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default UnderwaterHero;
