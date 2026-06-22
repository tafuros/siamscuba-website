import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Seo from "@/components/Seo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import GateBubbles from "@/components/EntryGate/GateBubbles";
import GodRays from "@/components/EntryGate/GodRays";
import "@/components/EntryGate/gate.css";
import { useLanguage } from "@/i18n/LanguageContext";
import { freedivingCopy, FREEDIVING_COURSES } from "@/components/freediving/freedivingContent";
import FreedivingBookingForm from "@/components/freediving/FreedivingBookingForm";

const OCEAN_BG =
  "radial-gradient(120% 90% at 50% 0%, #0a3a66 0%, #08315a 36%, #051f3a 70%, #03152a 100%)";

// Card image fade: full opacity at the top, dissolving to 0 at the bottom.
const CARD_IMG_FADE = "linear-gradient(to bottom, #000 0%, #000 35%, transparent 100%)";

const SiamFreedivingPage = () => {
  const { language, isRTL } = useLanguage();
  const copy = freedivingCopy[language];
  const courseText = copy.courses.items;
  const [searchParams] = useSearchParams();

  const initialId = useMemo(() => {
    const c = searchParams.get("course");
    if (c && FREEDIVING_COURSES.some((x) => x.id === c)) return c;
    return FREEDIVING_COURSES.find((x) => x.recommended)?.id ?? FREEDIVING_COURSES[0].id;
  }, [searchParams]);

  const [selectedId, setSelectedId] = useState(initialId);
  const bookingRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);

  const reserve = (id: string) => {
    setSelectedId(id);
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="relative min-h-screen overflow-hidden text-white" style={{ background: OCEAN_BG }}>
      <Seo
        title="Siam Freediving - Freediving Courses on Koh Tao | Siam Scuba"
        description="Freediving on Koh Tao - PADI & AIDA courses from Discover Freediving to instructor. Small groups, record-holding instructors. Book with Siam Scuba."
        canonical="https://siamscuba.com/freediving"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh]">
        <GodRays />
      </div>
      <GateBubbles />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link to="/" className="text-sm text-white/70 transition-colors hover:text-white">
          <span aria-hidden="true">{isRTL ? "→" : "←"}</span> {copy.back}
        </Link>
        <LanguageSwitcher />
      </header>

      {/* Hero */}
      <section className="relative z-[1] mx-auto max-w-3xl px-6 pb-10 pt-10 text-center sm:pt-16">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs font-medium uppercase tracking-[0.35em] text-ocean-light/80"
        >
          {copy.hero.kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-3 font-display text-4xl font-bold leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] sm:text-6xl"
        >
          {copy.hero.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-5 max-w-xl text-base text-ocean-surface/85 sm:text-lg"
        >
          {copy.hero.subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-4 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-ocean-light/90 sm:text-sm"
        >
          <span aria-hidden="true">🐬</span>
          <span>{copy.hero.note}</span>
        </motion.p>

        <button
          onClick={() => coursesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="mt-8 rounded-xl bg-gradient-to-r from-ocean-mid to-ocean-light px-7 py-3 font-semibold text-ocean-deep shadow-lg transition-transform hover:scale-[1.03]"
        >
          {copy.hero.cta}
        </button>
      </section>

      {/* Courses */}
      <section ref={coursesRef} className="relative z-[1] mx-auto max-w-6xl px-5 py-12 scroll-mt-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">{copy.courses.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ocean-surface/70">{copy.courses.subtitle}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FREEDIVING_COURSES.map((course, i) => {
            const text = courseText[course.id];
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className={`group relative flex min-h-[23rem] flex-col overflow-hidden rounded-3xl border p-6 ${
                  course.recommended
                    ? "border-ocean-light/60 shadow-[0_0_40px_-12px_rgba(125,211,252,0.5)]"
                    : "border-white/12"
                }`}
              >
                <div className="pointer-events-none absolute inset-0 bg-ocean-deep">
                  <img
                    src={course.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ WebkitMaskImage: CARD_IMG_FADE, maskImage: CARD_IMG_FADE }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/30 via-ocean-deep/60 to-ocean-deep/92" />
                </div>

                <div className="relative z-[1] flex flex-1 flex-col">
                  {text?.badge && (
                    <span
                      className={`mb-3 w-fit rounded-full px-3 py-1 text-[11px] font-semibold ${
                        course.recommended ? "bg-ocean-light text-ocean-deep" : "bg-white/20 text-white backdrop-blur-sm"
                      }`}
                    >
                      {text.badge}
                    </span>
                  )}
                  <h3 className="font-display text-xl font-semibold drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">{text?.name}</h3>
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-ocean-light drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">{text?.who}</p>
                  <p className="mt-2 text-sm text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">{text?.meta}</p>

                  <ul className="mt-4 flex-1 space-y-1.5">
                    {text?.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-white/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
                        <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-ocean-light" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5">
                    <div className="text-xs text-white/60">{copy.courses.from}</div>
                    <div className="font-display text-2xl font-bold drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
                      {course.price.toLocaleString()} <span className="text-base font-medium">THB</span>
                    </div>
                    <div className="text-xs text-white/55">{copy.courses.perPerson}</div>
                  </div>
                  <button
                    onClick={() => reserve(course.id)}
                    className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] ${
                      course.recommended
                        ? "bg-gradient-to-r from-ocean-mid to-ocean-light text-ocean-deep shadow-lg"
                        : "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                    }`}
                  >
                    {copy.courses.reserve}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Included + good to know */}
      <section className="relative z-[1] mx-auto max-w-4xl px-5 py-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[copy.included, copy.know].map((block, idx) => (
            <div key={idx} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="font-display text-xl font-semibold">{block.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-ocean-surface/80">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ocean-light" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section ref={bookingRef} className="relative z-[1] mx-auto max-w-6xl px-5 py-12 scroll-mt-6">
        <FreedivingBookingForm
          copy={copy}
          courses={FREEDIVING_COURSES}
          courseText={courseText}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </section>

      <div className="relative z-[1] pb-10 text-center text-xs text-white/40">Siam Freediving · Siam Scuba</div>
    </div>
  );
};

export default SiamFreedivingPage;
