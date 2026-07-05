import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/Footer";
import LanderNav from "@/components/landers/LanderNav";
import { FUN_DIVE_COPY, type FunLang } from "@/lib/funDiveCopy";
import { trackViewContent, trackWhatsAppClick } from "@/utils/tracking";
import { WHATSAPP_NUMBER } from "@/utils/whatsapp";

interface FunDiveLanderProps {
  lang: FunLang;
}

const BOOKING_HREF = "/fun-dive-booking?utm_passthrough=1";
const TRIPADVISOR_URL =
  "https://www.tripadvisor.com/Attraction_Review-g303910-d2385121-Reviews-Siam_Scuba-Koh_Tao_Surat_Thani_Province.html";
const HERO_IMAGE = "/blog/whale-shark-divers-koh-tao.webp";

// Dark-premium design line (Similan canonical): deep-ocean radial gradient,
// god rays, frosted cards. Colors are intentionally literal (not theme tokens)
// so the lander renders identically regardless of theme/a11y remaps.
const HERO_OVERLAY: React.CSSProperties = {
  background:
    "radial-gradient(120% 90% at 50% 0%, rgba(10,58,102,.55) 0%, rgba(8,49,90,.65) 36%, rgba(5,31,58,.82) 70%, rgba(3,21,42,.95) 100%)",
};
const GOD_RAYS: React.CSSProperties = {
  background: [
    "linear-gradient(112deg, transparent 44%, rgba(160,220,255,.14) 47%, transparent 52%)",
    "linear-gradient(100deg, transparent 60%, rgba(160,220,255,.10) 64%, transparent 69%)",
    "linear-gradient(124deg, transparent 28%, rgba(160,220,255,.08) 32%, transparent 38%)",
  ].join(", "),
};

const Stars = ({ className = "" }: { className?: string }) => (
  <span className={`text-amber-400 tracking-[.12em] ${className}`} aria-hidden="true">
    ★★★★★
  </span>
);

const FunDiveLander = ({ lang }: FunDiveLanderProps) => {
  const copy = FUN_DIVE_COPY[lang];
  const isRtl = lang === "he";
  // Playfair has no Hebrew glyphs - Hebrew headings use the default (Heebo) stack.
  const display = isRtl ? "font-bold" : "font-display font-bold";

  useEffect(() => {
    trackViewContent({ offer: "fun-dive", lang });
  }, [lang]);

  const whatsappHref = useMemo(
    () => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(copy.waMessage)}`,
    [copy.waMessage]
  );
  const onWhatsApp = (location: string) => () =>
    trackWhatsAppClick({ location, url: whatsappHref });

  const bookBtn =
    "inline-flex items-center justify-center gap-2 rounded-full font-bold text-[#062033] " +
    "bg-gradient-to-b from-sky-300 to-sky-400 shadow-[0_8px_32px_rgba(56,189,248,.45)] " +
    "transition-transform hover:-translate-y-0.5";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      lang={lang}
      className="min-h-screen bg-[#03152a] text-white"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <LanderNav />
      {/* WhatsApp mini button aligned with the nav logo */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onWhatsApp("lander_nav")}
        className="absolute top-7 z-50 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[.06] px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/15 ltr:right-4 rtl:left-4 md:ltr:right-8 md:rtl:left-8"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </a>

      {/* ── Hero: the whole pitch in one screen ── */}
      <section className="relative flex min-h-[92svh] items-center justify-center overflow-hidden text-center">
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          // @ts-expect-error - fetchpriority is valid HTML, React types lag
          fetchpriority="high"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        <div className="absolute inset-0" style={HERO_OVERLAY} />
        <div
          className="pointer-events-none absolute inset-x-0 -top-[20%] bottom-0 opacity-35"
          style={GOD_RAYS}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 max-w-3xl px-6 pb-20 pt-28"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/35 bg-sky-400/10 px-4 py-1.5 text-[12.5px] font-semibold uppercase tracking-[.08em] text-sky-100 backdrop-blur-sm">
            {copy.badge}
          </div>
          <h1
            className={`${display} mb-4 text-[clamp(38px,6.5vw,64px)] leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,.45)]`}
          >
            {copy.h1a}
            <br />
            <em className="not-italic text-sky-300">{copy.h1b}</em>
          </h1>
          <p className="mx-auto mb-7 max-w-xl text-[clamp(15px,2.2vw,19px)] leading-relaxed text-white/85">
            {copy.sub}
          </p>

          <div className="mb-8 inline-flex items-baseline gap-3 rounded-2xl border border-white/20 bg-white/[.08] px-6 py-3 backdrop-blur-md">
            <span className={`${display} text-[34px] text-amber-400`}>{copy.priceNum}</span>
            <span className="text-start text-sm font-medium text-white/80">
              {copy.priceLine1}
              <br />
              {copy.priceLine2}
            </span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Link to={BOOKING_HREF} className={`${bookBtn} px-11 py-4 text-[17px]`}>
              {copy.ctaBook} {isRtl ? "←" : "→"}
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWhatsApp("lander_hero_secondary")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 hover:text-white"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-[11px]">
                <MessageCircle className="h-3 w-3" />
              </span>
              {copy.ctaWa}
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[15px] font-medium text-white/80">
            <a
              href={TRIPADVISOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-white/95 hover:text-white"
            >
              <Stars /> <b className="text-xl text-white">5.0</b> · {copy.trustTaReviews}
            </a>
            <span>{copy.trustDivers}</span>
            <span>{copy.trustBoats}</span>
          </div>
        </motion.div>
      </section>

      {/* ── Quick facts: the 4 questions, answered in 3 seconds ── */}
      <div className="relative z-20 mx-auto -mt-12 max-w-[900px] px-5">
        <div className="grid grid-cols-2 overflow-hidden rounded-[20px] border border-white/[.14] bg-white/[.06] shadow-[0_20px_60px_rgba(0,0,0,.4)] backdrop-blur-xl md:grid-cols-4">
          {copy.facts.map((fact, i) => (
            <div
              key={fact.k}
              className={`px-3.5 py-5 text-center ${i >= 2 ? "border-t border-white/[.09] md:border-t-0" : ""} ${
                i % 2 === 1 ? "border-s border-white/[.09]" : ""
              } ${i >= 2 ? "md:border-s" : ""}`}
            >
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[.1em] text-white/55">
                {fact.k}
              </div>
              <div className="text-base font-bold">{fact.v}</div>
              <div className="mt-0.5 text-xs font-medium text-white/65">{fact.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dive sites: photo-first ── */}
      <section className="mx-auto max-w-[1060px] px-5 py-16 md:py-20">
        <h2 className={`${display} mb-2 text-center text-[clamp(26px,4vw,38px)]`}>
          {copy.sitesHeadline}
        </h2>
        <p className="mb-9 text-center text-[15px] text-white/65">{copy.sitesSub}</p>
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
          {copy.sites.map((site) => (
            <div
              key={site.name}
              className="group relative aspect-[3/4] overflow-hidden rounded-[18px] border border-white/[.12]"
            >
              <img
                src={site.image}
                alt={site.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03152a]/95 via-[#03152a]/25 to-transparent" />
              {site.tag && (
                <span className="absolute top-3 rounded-full bg-amber-400/95 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[.06em] text-stone-900 ltr:left-3 rtl:right-3">
                  {site.tag}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className={`${display} mb-1 text-[19px]`}>{site.name}</div>
                <div className="text-[12.5px] leading-snug text-white/80">{site.blurb}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-[13px] text-white/50">{copy.sitesNote}</p>
      </section>

      {/* ── Why us: 3 frosted cards ── */}
      <section className="mx-auto max-w-[1060px] px-5 pb-16 md:pb-20">
        <h2 className={`${display} mb-2 text-center text-[clamp(26px,4vw,38px)]`}>
          {copy.whyHeadline}
        </h2>
        <p className="mb-9 text-center text-[15px] text-white/65">{copy.whySub}</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {copy.why.map((card) => (
            <div
              key={card.title}
              className="rounded-[20px] border border-white/[.12] bg-white/[.05] p-7 text-center backdrop-blur-md"
            >
              <div className="mb-3 text-[34px] leading-none" aria-hidden="true">
                {card.emoji}
              </div>
              <h3 className="mb-2 text-[17px] font-bold">{card.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social proof strip ── */}
      <a
        href={TRIPADVISOR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block border-y border-white/[.08] bg-white/[.04] px-5 py-12 text-center transition-colors hover:bg-white/[.07]"
      >
        <Stars className="text-[26px] tracking-[.18em]" />
        <div className={`${display} mt-2 text-2xl`}>{copy.reviewQuote}</div>
        <div className="mt-1.5 text-[13.5px] text-white/60">{copy.reviewSrc}</div>
      </a>

      {/* ── FAQ: only the 3 real blockers ── */}
      <section className="mx-auto max-w-2xl px-5 py-16 md:py-20">
        <h2 className={`${display} mb-8 text-center text-[clamp(26px,4vw,38px)]`}>
          {copy.faqHeadline}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {copy.faq.map((item, idx) => (
            <AccordionItem
              key={item.q}
              value={`faq-${idx}`}
              className="border-white/10"
            >
              <AccordionTrigger className="text-start text-[15px] font-semibold text-white hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-white/70">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── Closing CTA ── */}
      <section className="px-5 pb-28 pt-2 text-center md:pb-24">
        <h2 className={`${display} mb-2 text-[clamp(26px,4vw,38px)] leading-tight`}>
          {copy.closingA}
          <br />
          <em className="not-italic text-sky-300">{copy.closingB}</em>
        </h2>
        <p className="mb-7 text-[15px] text-white/65">{copy.closingSub}</p>
        <Link to={BOOKING_HREF} className={`${bookBtn} px-11 py-4 text-[17px]`}>
          {copy.ctaBook} {isRtl ? "←" : "→"}
        </Link>
      </section>

      <Footer />

      {/* ── Sticky mobile CTA: always one tap from booking ── */}
      <div
        className="fixed inset-x-0 bottom-0 z-[60] flex items-stretch gap-2.5 border-t border-white/[.12] bg-[#03152a]/90 px-3.5 pt-3 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
      >
        <div className="flex flex-col justify-center pe-1">
          <b className="text-[17px] leading-tight text-amber-400">{copy.priceNum}</b>
          <span className="text-[10.5px] text-white/60">{copy.stickyPriceLabel}</span>
        </div>
        <Link to={BOOKING_HREF} className={`${bookBtn} flex-1 px-3 py-3 text-[15px] shadow-none`}>
          {copy.stickyCta}
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onWhatsApp("lander_sticky")}
          aria-label="WhatsApp"
          className="inline-flex w-12 items-center justify-center rounded-full bg-[#25D366] text-white"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
};

export default FunDiveLander;
