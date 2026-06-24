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
import TripAdvisorSection from "@/components/TripAdvisorSection";
import LanderNav from "@/components/landers/LanderNav";
import SailRockLeadForm from "@/components/landers/SailRockLeadForm";
import { LANDER_COPY, type Lang } from "@/lib/landerCopy";
import { getUpcomingSailRockDates, toIsoDate } from "@/lib/sailRockDates";
import { trackViewContent, trackWhatsAppClick } from "@/utils/tracking";
import { buildWhatsAppLink } from "@/utils/whatsapp";
import sailRockHero from "@/assets/sail-rock-chimney.webp";

const OFFER = "sail-rock" as const;
const FUN_DIVE_BOOKING_PATH = "/fun-dive-booking";
const PRODUCT = "SAILROCK";

// The hero photo. The mockup uses the Sail Rock site shot; we reuse the
// chimney asset (a real Sail Rock pinnacle photo) as the hero background.
const HERO_IMAGE = sailRockHero;

interface SailRockLanderProps {
  lang: Lang;
}

/**
 * Build the deep-link to the booking iframe page for a given departure date.
 * Carries product=SAILROCK + the chosen date so the DiveOS wizard can
 * pre-select the trip, plus utm_passthrough=1 so the iframe forwards the
 * lander's stored UTMs (and any incoming utm_* / gclid) into the wizard.
 */
function bookingHref(isoDate?: string): string {
  const params = new URLSearchParams({ product: PRODUCT, utm_passthrough: "1" });
  if (isoDate) params.set("date", isoDate);
  return `${FUN_DIVE_BOOKING_PATH}?${params.toString()}`;
}

const SailRockLander = ({ lang }: SailRockLanderProps) => {
  const copy = LANDER_COPY[OFFER][lang];
  const isRtl = lang === "he";
  const dirAttr = isRtl ? ("rtl" as const) : ("ltr" as const);
  const langAttr = lang;
  const locale = lang === "es" ? "es-ES" : lang === "he" ? "he-IL" : "en-US";

  useEffect(() => {
    trackViewContent({ offer: OFFER, lang, value: 4000 });
  }, [lang]);

  const departures = useMemo(() => getUpcomingSailRockDates(4), []);
  const nextDate = departures[0];
  const nextIso = nextDate ? toIsoDate(nextDate) : undefined;

  const whatsappHref = useMemo(
    () => buildWhatsAppLink({ offer: "fun-dive", lang }),
    [lang]
  );

  const onWhatsApp = (location: string) => () =>
    trackWhatsAppClick({ location, url: whatsappHref });

  const fmtLong = (d: Date) =>
    new Intl.DateTimeFormat(locale, { weekday: "short", month: "short", day: "numeric" }).format(d);
  const fmtDay = (d: Date) =>
    new Intl.DateTimeFormat(locale, { day: "2-digit" }).format(d);
  const fmtMonth = (d: Date) =>
    new Intl.DateTimeFormat(locale, { month: "short" }).format(d);

  const heroCtaHref = bookingHref(nextIso);

  return (
    <div dir={dirAttr} lang={langAttr} className="min-h-screen bg-background text-foreground">
      <LanderNav />

      {/* ── HERO ── */}
      <section className="relative min-h-[560px] flex items-end overflow-hidden pt-16">
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/20 via-ocean-deep/55 to-ocean-deep/90" />
        <div className="container mx-auto px-4 relative z-10 max-w-5xl pb-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {copy.heroEyebrow && (
              <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs md:text-sm font-bold uppercase tracking-wide text-accent-foreground">
                {copy.heroEyebrow}
              </span>
            )}
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-[1.05] text-white drop-shadow-lg">
              {copy.heroH1}
            </h1>
            <p className="mt-3 max-w-2xl text-base md:text-xl text-white/90 drop-shadow">
              {copy.heroSubhead}
            </p>
            {copy.ratingsLine && (
              <p className="mt-4 text-sm md:text-base font-semibold text-white/95">{copy.ratingsLine}</p>
            )}
            <div className="mt-6">
              <Link
                to={heroCtaHref}
                className="inline-flex flex-col items-center justify-center rounded-xl bg-accent px-7 py-4 text-base md:text-lg font-extrabold text-accent-foreground shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <span>{copy.ctaPrimary}</span>
                {nextDate && (
                  <span className="text-xs font-semibold opacity-80">
                    {copy.nextBoatPrefix}: {fmtLong(nextDate)}
                  </span>
                )}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── UPCOMING DEPARTURES STRIP ── */}
      <section className="bg-ocean-deep text-white">
        <div className="container mx-auto px-4 max-w-5xl py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs uppercase tracking-widest text-white/80">
            {copy.departuresLabel}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {departures.map((d, i) => {
              const iso = toIsoDate(d);
              const isNext = i === 0;
              return (
                <Link
                  key={iso}
                  to={bookingHref(iso)}
                  aria-label={`${copy.reserveCta} - ${fmtLong(d)}`}
                  className={`min-w-[78px] rounded-lg px-3.5 py-2 text-center transition-transform hover:-translate-y-0.5 ${
                    isNext
                      ? "bg-accent text-accent-foreground"
                      : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {isNext && (
                    <span className="block text-[10px] font-extrabold tracking-wide">
                      {copy.nextBoatLabel}
                    </span>
                  )}
                  <span className="block text-xl font-extrabold leading-none">{fmtDay(d)}</span>
                  <span className="block text-[11px] uppercase opacity-80">{fmtMonth(d)}</span>
                </Link>
              );
            })}
          </div>
          <Link
            to={heroCtaHref}
            className="inline-flex items-center justify-center rounded-xl bg-[#1aa179] px-6 py-3 text-sm md:text-base font-extrabold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-[#178c69]"
          >
            {copy.reserveCta}
          </Link>
        </div>
      </section>

      {/* ── WHY (photo-fade feature cards) ── */}
      <section className="container mx-auto px-4 max-w-5xl py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{copy.whatYouDoHeadline}</h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mb-7">
          {copy.whatYouDoSubhead}
        </p>
        <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {copy.featureCards?.map((card) => (
            <div
              key={card.title}
              className="relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl bg-ocean-deep shadow-lg"
            >
              {/* photo: fills from top, masked to transparent downward */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-top"
                style={{
                  backgroundImage: `url('${card.image}')`,
                  WebkitMaskImage:
                    "linear-gradient(to bottom,#000 0%,#000 30%,rgba(0,0,0,.55) 62%,rgba(0,0,0,0) 88%)",
                  maskImage:
                    "linear-gradient(to bottom,#000 0%,#000 30%,rgba(0,0,0,.55) 62%,rgba(0,0,0,0) 88%)",
                }}
              />
              {/* dark scrim for text contrast */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-transparent via-ocean-deep/55 to-ocean-deep/95"
              />
              <div className="relative z-10 p-5 text-white">
                <h3 className="text-lg font-extrabold drop-shadow">{card.title}</h3>
                <p className="mt-1.5 text-sm text-white/85 drop-shadow">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICE ── */}
      <section className="container mx-auto px-4 max-w-5xl py-6 md:py-8">
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-2xl bg-gradient-to-br from-ocean-surface to-ocean-deep p-7 md:p-9 text-white shadow-lg">
          <div>
            <div className="text-5xl md:text-6xl font-extrabold leading-none">{copy.pricing.price}</div>
            <div className="mt-1 opacity-90">{copy.pricing.perWhat}</div>
            {copy.pricingAddon && (
              <div className="mt-2 text-sm opacity-90">{copy.pricingAddon}</div>
            )}
            <Link
              to={heroCtaHref}
              className="mt-5 inline-flex flex-col items-start rounded-xl bg-accent px-7 py-4 text-base md:text-lg font-extrabold text-accent-foreground shadow-md transition-transform hover:-translate-y-0.5"
            >
              <span>{copy.ctaPrimary}</span>
              {nextDate && (
                <span className="text-xs font-semibold opacity-80">
                  {copy.securePrefix} {fmtLong(nextDate)}
                </span>
              )}
            </Link>
          </div>
          <ul className="grid gap-2">
            {copy.pricing.includes.map((item) => (
              <li key={item} className="relative pl-7 text-sm md:text-base">
                <span className="absolute left-0 font-extrabold text-accent">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── LEAD CAPTURE (name + phone → DiveOS) ── */}
      {copy.leadForm && (
        <section className="container mx-auto px-4 max-w-5xl py-6 md:py-8">
          <SailRockLeadForm
            copy={copy.leadForm}
            lang={lang}
            course={OFFER}
            nextIso={nextIso}
          />
        </section>
      )}

      {/* ── DAY ON THE BOAT ── */}
      {copy.dayTimeline && (
        <section className="container mx-auto px-4 max-w-3xl py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{copy.dayTimelineHeadline}</h2>
          <div className="flex flex-col">
            {copy.dayTimeline.map((step) => (
              <div
                key={`${step.time}-${step.label}`}
                className="grid grid-cols-[72px_1fr] gap-4 border-b border-dashed border-border py-3.5 last:border-b-0"
              >
                <div className="font-extrabold text-accent">{step.time}</div>
                <div className="text-sm md:text-base">{step.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SOCIAL PROOF ── */}
      <section className="bg-card">
        <div className="container mx-auto px-4 pt-10 pb-2 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">{copy.socialProofHeadline}</h2>
          <p className="text-sm md:text-base text-muted-foreground">{copy.socialProofSubhead}</p>
        </div>
        <TripAdvisorSection />
      </section>

      {/* ── CTA STRIP ── */}
      <section className="py-12 md:py-16 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{copy.ctaStripHeadline}</h2>
          <p className="text-sm md:text-base mb-6 opacity-90">{copy.ctaStripSubhead}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={heroCtaHref}
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm md:text-base font-semibold text-ocean-deep shadow-md transition-transform hover:-translate-y-0.5"
            >
              {copy.ctaPrimary}
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWhatsApp("lander_cta_strip")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm md:text-base font-semibold text-white shadow-md hover:bg-[#1da851]"
            >
              <MessageCircle className="h-4 w-4" />
              {copy.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">{copy.faqHeadline}</h2>
          <Accordion type="single" collapsible className="w-full">
            {copy.faqItems.map((item, idx) => (
              <AccordionItem key={item.q} value={`faq-${idx}`}>
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CLOSING ── */}
      <section className="bg-ocean-surface/10 py-14 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {nextDate && copy.closingDateHeadline
              ? copy.closingDateHeadline.replace("{date}", fmtLong(nextDate))
              : copy.closingCtaHeadline}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6">{copy.closingCtaSubhead}</p>
          <Link
            to={heroCtaHref}
            className="inline-flex items-center justify-center rounded-xl bg-accent px-8 py-4 text-base font-extrabold text-accent-foreground shadow-lg transition-transform hover:-translate-y-0.5"
          >
            {copy.ctaPrimary}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SailRockLander;
