import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Seo from "@/components/Seo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import GateBubbles from "@/components/EntryGate/GateBubbles";
import GodRays from "@/components/EntryGate/GodRays";
import "@/components/EntryGate/gate.css";
import { useLanguage } from "@/i18n/LanguageContext";
import { similanCopy, SIMILAN_TRIPS, SIMILAN_BOATS, SIMILAN_SITES } from "@/components/similan/similanContent";
import SimilanBookingForm from "@/components/similan/SimilanBookingForm";

const OCEAN_BG =
  "radial-gradient(120% 90% at 50% 0%, #0a3a66 0%, #08315a 36%, #051f3a 70%, #03152a 100%)";

// Card image fade: full opacity at the top, dissolving to 0 at the bottom.
const CARD_IMG_FADE = "linear-gradient(to bottom, #000 0%, #000 35%, transparent 100%)";

const SiamSimilansPage = () => {
  const { language, isRTL } = useLanguage();
  const copy = similanCopy[language];
  const tripText = copy.trips.items;
  const [searchParams] = useSearchParams();

  // ?type/?trip may carry a specific trip id; otherwise default to the
  // recommended one. (Smile Dolphin is liveaboard-only, so the gate's "day"
  // branch simply lands on the recommended safari.)
  const initialId = useMemo(() => {
    const t = searchParams.get("trip") ?? searchParams.get("type");
    if (t && SIMILAN_TRIPS.some((x) => x.id === t)) return t;
    return SIMILAN_TRIPS.find((x) => x.recommended)?.id ?? SIMILAN_TRIPS[0].id;
  }, [searchParams]);

  const [selectedId, setSelectedId] = useState(initialId);
  const bookingRef = useRef<HTMLDivElement>(null);
  const tripsRef = useRef<HTMLDivElement>(null);
  const sitesRef = useRef<HTMLDivElement>(null);

  const reserve = (id: string) => {
    setSelectedId(id);
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="relative min-h-screen overflow-hidden text-white" style={{ background: OCEAN_BG }}>
      <Seo
        title="Siam Similans - Similan Islands Liveaboards & Day Trips | Siam Scuba"
        description="Hand-picked Similan Islands liveaboard safaris and day trips - Koh Bon, Koh Tachai & Richelieu Rock. Book now, pay later with Siam Scuba."
        canonical="https://siamscuba.com/similan"
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-7 flex max-w-lg items-center justify-center gap-2.5 rounded-2xl border border-amber-300/45 bg-amber-300/15 px-5 py-3.5 text-sm font-semibold text-amber-50 shadow-[0_0_34px_-8px_rgba(252,211,77,0.55)] sm:text-base"
        >
          <span aria-hidden="true" className="text-lg">🗓️</span>
          <span>{copy.hero.season}</span>
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => tripsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="rounded-xl bg-gradient-to-r from-ocean-mid to-ocean-light px-7 py-3 font-semibold text-ocean-deep shadow-lg transition-transform hover:scale-[1.03]"
          >
            {copy.hero.cta}
          </button>
          <button
            onClick={() => sitesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="rounded-xl border border-white/25 bg-white/5 px-7 py-3 font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/12"
          >
            {copy.hero.sitesCta}
          </button>
        </div>
      </section>

      {/* Trips */}
      <section ref={tripsRef} className="relative z-[1] mx-auto max-w-6xl px-5 py-12 scroll-mt-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">{copy.trips.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ocean-surface/70">{copy.trips.subtitle}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SIMILAN_TRIPS.map((trip, i) => {
            const text = tripText[trip.id];
            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className={`group relative flex min-h-[21rem] flex-col overflow-hidden rounded-3xl border p-6 ${
                  trip.recommended
                    ? "border-ocean-light/60 shadow-[0_0_40px_-12px_rgba(125,211,252,0.5)]"
                    : "border-white/12"
                }`}
              >
                {/* Image background, fading from full opacity at the top to 0 at the bottom */}
                <div className="pointer-events-none absolute inset-0 bg-ocean-deep">
                  <img
                    src={trip.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ WebkitMaskImage: CARD_IMG_FADE, maskImage: CARD_IMG_FADE }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/35 via-ocean-deep/55 to-ocean-deep/90" />
                </div>

                <div className="relative z-[1] flex flex-1 flex-col">
                  {text?.badge && (
                    <span
                      className={`mb-3 w-fit rounded-full px-3 py-1 text-[11px] font-semibold ${
                        trip.recommended ? "bg-ocean-light text-ocean-deep" : "bg-white/20 text-white backdrop-blur-sm"
                      }`}
                    >
                      {text.badge}
                    </span>
                  )}
                  <h3 className="font-display text-2xl font-semibold drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">{text?.name}</h3>
                  <p className="mt-1 text-sm font-medium text-ocean-light drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">{text?.meta}</p>
                  <p className="mt-3 flex-1 text-sm text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">{text?.route}</p>
                  <div className="mt-5">
                    <div className="text-xs text-white/60">{copy.trips.from}</div>
                    <div className="font-display text-2xl font-bold drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
                      {trip.fromPrice.toLocaleString()} <span className="text-base font-medium">THB</span>
                    </div>
                    <div className="text-xs text-white/55">{copy.trips.perDiver}</div>
                  </div>
                  <button
                    onClick={() => reserve(trip.id)}
                    className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] ${
                      trip.recommended
                        ? "bg-gradient-to-r from-ocean-mid to-ocean-light text-ocean-deep shadow-lg"
                        : "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                    }`}
                  >
                    {copy.trips.reserve}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Fleet */}
      <section className="relative z-[1] mx-auto max-w-6xl px-5 py-12">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">{copy.boats.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ocean-surface/70">{copy.boats.subtitle}</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SIMILAN_BOATS.map((boat, i) => {
            const text = copy.boats.items[boat.id];
            return (
              <motion.div
                key={boat.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="overflow-hidden rounded-3xl border border-white/12 bg-white/[0.05] backdrop-blur-md"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={boat.image}
                    alt={text?.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold">{text?.name}</h3>
                  <p className="mt-1 text-sm text-ocean-surface/75">{text?.tagline}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs text-white/40">
          Boats operated by Smile Dolphin Diving · photos courtesy of the operator
        </p>
      </section>

      {/* Dive sites - visual cards */}
      <section ref={sitesRef} className="relative z-[1] mx-auto max-w-6xl px-5 py-12 scroll-mt-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">{copy.sites.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ocean-surface/70">{copy.sites.subtitle}</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SIMILAN_SITES.map((site, i) => {
            const text = copy.sites.items[site.key];
            // Feature the first card (manta) larger on desktop.
            const featured = i === 0;
            return (
              <motion.div
                key={site.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 ${
                  featured ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <img
                  src={site.image}
                  alt={text?.name}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    featured ? "h-64 lg:h-full lg:min-h-[20rem]" : "h-56"
                  }`}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ocean-deep/95 via-ocean-deep/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5" dir={isRTL ? "rtl" : "ltr"}>
                  <h3 className={`font-display font-semibold text-white ${featured ? "text-2xl sm:text-3xl" : "text-xl"}`}>
                    {text?.name}
                  </h3>
                  <p className="mt-1 text-sm text-ocean-surface/90">{text?.desc}</p>
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
        <SimilanBookingForm
          copy={copy}
          trips={SIMILAN_TRIPS}
          tripText={tripText}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </section>

      <div className="relative z-[1] pb-10 text-center text-xs text-white/40">Siam Similans · Siam Scuba</div>
    </div>
  );
};

export default SiamSimilansPage;
