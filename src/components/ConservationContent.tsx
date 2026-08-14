import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Plus } from "lucide-react";
import type { ConservationLearn } from "@/lib/conservationCopy";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackWhatsAppClick } from "@/utils/tracking";
import {
  buildWhatsAppLink,
  CONSERVATION_WHATSAPP_NUMBER,
  normalizeLang,
} from "@/utils/whatsapp";
import {
  CONSERVATION_COPY,
  CONSERVATION_IMAGES,
  SPECIALTY_IMAGE_KEYS,
  type ConservationLang,
} from "@/lib/conservationCopy";

// Body of /conservation and its he/es/fr twins. All copy comes from
// conservationCopy.ts; this file owns layout only.
//
// WhatsApp here goes to PAUL's direct line, not the shop inbox - he owns the
// conservation programme end to end (Ben, 2026-08-07). The prefill names the
// page on purpose: it lands on a personal phone, so he needs to know at a
// glance why a stranger is messaging him. That is the ONLY reason
// buildWhatsAppLink takes a `number` override - do not spread it around.
//
// Visual line: lighter turquoise than the blue dive landers, with owned photos
// fading into the cards rather than blocks of running text (Ben, 2026-08-07).

/**
 * The six "what you'll actually learn" cards.
 *
 * Ben found Clarity recordings of visitors tapping these. They were plain <li>
 * elements and did nothing, so the tap was answered with silence. The tap is
 * curiosity - "tell me more about buoyancy" - NOT booking intent, so routing it
 * to the booking form would misread it and annoy. The card answers instead, and
 * sells only by naming the specialty that covers the subject.
 *
 * A real <button> with aria-expanded/aria-controls, so the affordance those
 * visitors were responding to now genuinely exists: keyboard reachable, and it
 * announces its state instead of looking tappable and doing nothing.
 */
const LearnCard = ({
  item,
  moreLabel,
}: {
  item: ConservationLearn;
  moreLabel: string;
}) => {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="h-full">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={
          // Liquid glass: a translucent pane over the page's own photography,
          // with a diagonal sheen and a top highlight so it reads as a lit edge
          // rather than a flat grey box.
          "group relative h-full w-full overflow-hidden rounded-2xl border border-white/15 " +
          "bg-gradient-to-br from-white/[0.14] via-white/[0.07] to-white/[0.03] " +
          "p-5 text-start backdrop-blur-xl " +
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_8px_24px_-12px_rgba(0,0,0,0.55)] " +
          "transition-all duration-300 hover:border-teal-300/40 hover:from-white/[0.2] hover:via-white/[0.1] " +
          "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_14px_34px_-14px_rgba(0,0,0,0.65)] " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/70 " +
          "focus-visible:ring-offset-2 focus-visible:ring-offset-transparent " +
          "motion-safe:hover:-translate-y-0.5"
        }
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />
        <span className="flex items-start justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300">
            {item.short}
          </span>
          <span
            aria-hidden
            className={
              "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border " +
              "border-teal-300/30 bg-teal-300/10 text-teal-200 transition-all duration-300 " +
              "group-hover:border-teal-300/60 group-hover:bg-teal-300/20 " +
              (open ? "rotate-45" : "")
            }
          >
            <Plus className="h-3.5 w-3.5" />
          </span>
        </span>
        <span className="mt-2 block leading-relaxed text-white/80">{item.long}</span>
        <span className="mt-3 block text-[11px] font-medium text-teal-300/80 transition-opacity motion-safe:opacity-0 motion-safe:group-hover:opacity-100 motion-safe:group-focus-visible:opacity-100">
          {moreLabel}
        </span>
      </button>

      {/*
        The detail copy stays in the MARKUP and is only collapsed visually.
        A Radix Popover was the first attempt and it renders through a portal,
        which the prerenderer never captures - grepping the built
        dist/conservation.html found 0 of these strings, in all four languages.
        They are the richest keyword content on the page, so hiding them from
        Google to gain a floating bubble was the wrong trade.

        Collapsed with grid-template-rows 0fr -> 1fr rather than max-height, so
        the animation is exact at any text length instead of guessing a ceiling.
      */}
      <div
        id={panelId}
        className={
          "grid transition-all duration-300 ease-out motion-reduce:transition-none " +
          (open ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0")
        }
      >
        <div className="overflow-hidden">
          <div
            className={
              "relative rounded-2xl border border-white/20 bg-[#0f3c46]/85 p-4 " +
              "backdrop-blur-2xl " +
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_18px_44px_-16px_rgba(0,0,0,0.7)]"
            }
          >
            <span
              aria-hidden
              className="absolute -top-1.5 start-6 h-3 w-3 rotate-45 border-s border-t border-white/20 bg-[#0f3c46]/85"
            />
            <p className="text-sm leading-relaxed text-white/85">{item.detail}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ConservationContentProps {
  lang: ConservationLang;
}

const ConservationContent = ({ lang }: ConservationContentProps) => {
  const copy = CONSERVATION_COPY[lang];
  const isRtl = lang === "he";
  // Playfair carries no Hebrew glyphs, so RTL falls back to the body face at a
  // heavier weight rather than silently rendering in a substituted font.
  const display = isRtl ? "font-bold" : "font-display font-medium";
  const displaySemi = isRtl ? "font-bold" : "font-display font-semibold";

  const whatsappHref = buildWhatsAppLink({
    topic: "conservation",
    lang: normalizeLang(lang),
    number: CONSERVATION_WHATSAPP_NUMBER,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onWhatsApp = (location: string) => () =>
    trackWhatsAppClick({ location, url: whatsappHref });

  const eyebrow = (text: string) => (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-300">{text}</p>
  );

  return (
    <div className="min-h-screen bg-[#0a3a4a] text-white" dir={isRtl ? "rtl" : "ltr"} lang={lang}>
      <Navbar />

      {/* ---------------------------------------------------------------- Hero */}
      <header className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <img
          src={CONSERVATION_IMAGES.hero}
          alt={copy.alt.hero}
          width={1920}
          height={1248}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Two layers, deliberately. A LIGHT turquoise veil over the whole frame
            keeps the bubbles and the diver readable, and a soft radial scrim sits
            only behind the text column so the copy clears AA without flattening
            the photo. Darkening the whole image to fix contrast is what made the
            first pass look like an empty black box. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,58,74,0.62) 0%, rgba(10,58,74,0.28) 38%, rgba(10,58,74,0.48) 72%, rgba(10,58,74,0.92) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 58% at 50% 46%, rgba(5,35,46,0.78) 0%, rgba(5,35,46,0.45) 55%, rgba(5,35,46,0) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-100 [text-shadow:0_1px_10px_rgba(0,0,0,0.8)]"
          >
            {copy.heroEyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`${display} text-4xl leading-[1.08] text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.75)] sm:text-6xl`}
          >
            {copy.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/95 [text-shadow:0_1px_12px_rgba(0,0,0,0.85)] sm:text-lg"
          >
            {copy.heroLede}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className={`mt-8 text-xl text-teal-100 [text-shadow:0_1px_12px_rgba(0,0,0,0.85)] sm:text-2xl ${
              isRtl ? "font-semibold" : "font-display italic"
            }`}
          >
            {copy.motto}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWhatsApp("conservation_hero")}
              className="inline-flex items-center gap-2 rounded-full bg-teal-300 px-7 py-3.5 text-sm font-semibold text-[#062a36] shadow-[0_10px_30px_-10px_rgba(45,212,191,0.9)] transition hover:bg-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {copy.ctaAsk}
            </a>
            <a
              href="#specialties"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-teal-200/70 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200"
            >
              {copy.ctaSeeSpecialties}
              <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </header>

      <main>
        {/* ------------------------------------------------------ Why with us */}
        <section className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl">
            {eyebrow(copy.whyEyebrow)}
            <h2 className={`${display} mt-5 text-3xl leading-tight text-white sm:text-4xl`}>
              {copy.whyTitleA}
              <span className="block text-teal-300">{copy.whyTitleB}</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75">{copy.whyBody}</p>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {copy.learn.map((item) => (
                <li key={item.short}>
                  <LearnCard item={item} moreLabel={copy.learnMore} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --------------------------------------------------- Full-bleed band */}
        <section className="relative h-[38vh] min-h-[260px] overflow-hidden sm:h-[46vh]">
          <img
            src={CONSERVATION_IMAGES.turtle}
            alt={copy.alt.turtle}
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Fades the photo into the sections above and below it, so it reads as
              a break in the page rather than a pasted-in rectangle. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #0a3a4a 0%, rgba(10,58,74,0.72) 14%, rgba(10,58,74,0.18) 42%, rgba(10,58,74,0.30) 62%, rgba(13,69,87,0.80) 86%, #0d4557 100%)",
            }}
          />
          <p
            className={`absolute inset-x-0 bottom-8 px-6 text-center text-lg text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.85)] sm:text-2xl ${
              isRtl ? "font-semibold" : "font-display italic"
            }`}
          >
            {copy.bandQuote}
          </p>
        </section>

        {/* ----------------------------------------------------- Specialties */}
        <section id="specialties" className="scroll-mt-24 bg-[#0d4557] px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl">
            {eyebrow(copy.specEyebrow)}
            <h2 className={`${display} mt-5 max-w-3xl text-3xl leading-tight text-white sm:text-4xl`}>
              {copy.specTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75">
              {copy.specLede}
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {copy.specialties.map((s, i) => {
                const imgKey = SPECIALTY_IMAGE_KEYS[i];
                return (
                  <article
                    key={s.name}
                    className="group overflow-hidden rounded-2xl border border-teal-300/15 bg-white/[0.05] transition-colors hover:border-teal-300/40 hover:bg-white/[0.08]"
                  >
                    {/* The photo dissolves downward into the card body instead of
                        ending on a hard edge - the "fade" Ben asked for. */}
                    <div className="relative h-44 overflow-hidden sm:h-52">
                      <img
                        src={CONSERVATION_IMAGES[imgKey]}
                        alt={copy.alt[imgKey]}
                        width={900}
                        height={506}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(13,69,87,0.05) 0%, rgba(13,69,87,0.28) 52%, rgba(13,69,87,0.88) 86%, #0e4759 100%)",
                        }}
                      />
                    </div>

                    <div className="relative -mt-6 p-7 pt-0">
                      {/* PADI course names stay in English in every language -
                          it is what the certification card will say. */}
                      <h3
                        className={`${displaySemi} text-xl text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]`}
                        dir="ltr"
                        style={{ textAlign: isRtl ? "right" : "left" }}
                      >
                        {s.name}
                      </h3>
                      <p
                        className={`mt-1.5 text-sm font-medium text-teal-300 ${isRtl ? "" : "italic"}`}
                      >
                        {s.payoff}
                      </p>
                      <p className="mt-4 leading-relaxed text-white/80">{s.body}</p>
                      {s.note && (
                        <p
                          className={`mt-4 text-sm leading-relaxed text-white/65 ${
                            isRtl
                              ? "border-r-2 border-teal-300/50 pr-4"
                              : "border-l-2 border-teal-300/50 pl-4"
                          }`}
                        >
                          {s.note}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- Beyond the water */}
        <section className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl">
            {eyebrow(copy.landEyebrow)}
            <h2 className={`${display} mt-5 text-3xl leading-tight text-white sm:text-4xl`}>
              {copy.landTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75">
              {copy.landLede}
            </p>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {copy.land.map((block) => (
                <div
                  key={block.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-7"
                >
                  <h3 className={`${displaySemi} text-lg text-white`}>{block.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/75">{block.body}</p>
                  {block.list && (
                    <ul className="mt-4 space-y-2">
                      {block.list.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-white/75">
                          <span
                            aria-hidden="true"
                            className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-teal-300"
                          />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ Close */}
        <section className="relative overflow-hidden border-t border-white/10 px-6 py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(90% 120% at 50% 100%, rgba(45,212,191,0.22) 0%, rgba(10,58,74,0) 62%)",
            }}
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className={`${display} text-3xl leading-tight text-white sm:text-4xl`}>
              {copy.closeTitle}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80">
              {copy.closeBody}
            </p>
            <p
              className={`mt-8 text-xl text-teal-200 sm:text-2xl ${
                isRtl ? "font-semibold" : "font-display italic"
              }`}
            >
              {copy.closeMotto}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onWhatsApp("conservation_footer")}
                className="inline-flex items-center gap-2 rounded-full bg-teal-300 px-7 py-3.5 text-sm font-semibold text-[#062a36] shadow-[0_10px_30px_-10px_rgba(45,212,191,0.9)] transition hover:bg-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {copy.ctaWhatsApp}
              </a>
              {/* Only /he and /es exist as language homepages - "/" is the
                  multilingual homepage and doubles as the EN + FR destination.
                  Linking to "/fr" would ship a hard 404 on Vercel. */}
              <Link
                to={lang === "he" || lang === "es" ? `/${lang}` : "/"}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-teal-200/70 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-200"
              >
                {copy.ctaCourses}
                <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ConservationContent;
