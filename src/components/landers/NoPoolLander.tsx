import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  Fish,
  Heart,
  MapPin,
  MessageCircle,
  Sailboat,
  Scale,
  Users,
  Waves,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import BookNowLink from "@/components/BookNowLink";
import Footer from "@/components/Footer";
import LanderNav from "@/components/landers/LanderNav";
import TripAdvisorSection from "@/components/TripAdvisorSection";
import padiLogo from "@/assets/padi-logo.png";
import turtleHero from "@/assets/hero-turtle-original.jpeg";
import { NO_POOL_COPY, type NoPoolLang } from "@/lib/noPoolCopy";
import { withAttribution } from "@/utils/bookingUrl";
import { trackViewContent, trackWhatsAppClick } from "@/utils/tracking";
import { buildWhatsAppLink } from "@/utils/whatsapp";

interface NoPoolLanderProps {
  lang: NoPoolLang;
}

// Hero video slot. The editor agent is producing two 9:16 Reels (DSD + Open
// Water) built around this exact story; drop the encoded files under
// /public/no-pool/ and fill these in to light the player up. Until then the
// hero renders the still image alone - no broken player, no empty black box.
const HERO_VIDEO_WEBM: string | null = null;
const HERO_VIDEO_MP4: string | null = null;
const HERO_VIDEO_POSTER = "/hero/turtle-1280.webp";
const HAS_HERO_VIDEO = Boolean(HERO_VIDEO_MP4 || HERO_VIDEO_WEBM);

const BENEFIT_ICONS = { waves: Waves, scale: Scale, fish: Fish, heart: Heart };
const PROOF_ICONS = { award: Award, boat: Sailboat, users: Users, map: MapPin };

const NoPoolLander = ({ lang }: NoPoolLanderProps) => {
  const copy = NO_POOL_COPY[lang];
  const isRtl = lang === "he";
  const { search } = useLocation();

  useEffect(() => {
    trackViewContent({ offer: "owd", lang });
  }, [lang]);

  const whatsappHref = useMemo(
    () => buildWhatsAppLink({ offer: "owd", lang }),
    [lang],
  );

  const onWhatsApp = (location: string) => () =>
    trackWhatsAppClick({ location, url: whatsappHref });

  const primaryCta =
    "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm md:text-base font-semibold text-accent-foreground bg-accent hover:bg-accent/90 shadow-lg transition-all hover:-translate-y-0.5";
  const whatsappCta =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm md:text-base font-semibold text-white bg-[#25D366] hover:bg-[#1da851] shadow-lg transition-all hover:-translate-y-0.5";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      lang={lang}
      className="min-h-screen bg-background text-foreground"
    >
      {/* There is a Hebrew landing page at /he, but no /es index - Spanish
          visitors go to the English home rather than a 404. */}
      <LanderNav homePath={lang === "he" ? "/he" : "/"} />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <img
          src={turtleHero}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/90 via-ocean-deep/75 to-background" />

        <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge variant="secondary" className="mb-4 text-xs md:text-sm">
              {copy.heroEyebrow}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white drop-shadow-lg">
              {copy.heroH1}
            </h1>
            <p className="text-base md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {copy.heroSubhead}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <BookNowLink location="no_pool_hero" product="OWD" className={primaryCta}>
                {copy.ctaPrimary}
              </BookNowLink>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onWhatsApp("no_pool_hero_secondary")}
                className={whatsappCta}
              >
                <MessageCircle className="h-4 w-4" />
                {copy.ctaSecondary}
              </a>
            </div>
          </motion.div>

          {/* Hero video slot - 9:16 Reel, produced in parallel by the editor
              agent. Portrait aspect so it drops straight in without a re-cut.
              Renders NOTHING until a real file is wired up: a placeholder still
              plus a caption describing footage that does not exist reads as a
              broken player on a page carrying paid traffic. */}
          {HAS_HERO_VIDEO && (
            <div className="mt-10 md:mt-12 flex flex-col items-center">
              <div className="w-full max-w-[300px] md:max-w-[340px] aspect-[9/16] overflow-hidden rounded-2xl border border-white/20 bg-ocean-deep shadow-2xl">
                <video
                  className="h-full w-full object-cover"
                  poster={HERO_VIDEO_POSTER}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  {HERO_VIDEO_WEBM && <source src={HERO_VIDEO_WEBM} type="video/webm" />}
                  {HERO_VIDEO_MP4 && <source src={HERO_VIDEO_MP4} type="video/mp4" />}
                </video>
              </div>
              <p className="mt-3 text-xs md:text-sm text-white/70 max-w-xs">
                {copy.videoCaption}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Pool vs sea ──────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{copy.comparisonHeadline}</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              {copy.comparisonSubhead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {/* Pool column - deliberately muted. The ONLY place on this site
                where "pool" describes something we offer is nowhere; here it
                describes what everyone else does. */}
            <div className="rounded-2xl border border-border bg-background p-6 md:p-7">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                {copy.pool.label}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-muted-foreground">
                {copy.pool.title}
              </h3>
              <ul className="space-y-3">
                {copy.pool.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm text-muted-foreground">
                    <X className="h-4 w-4 shrink-0 mt-0.5 opacity-60" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sea column - the argument. */}
            <div className="rounded-2xl border-2 border-accent/60 bg-background p-6 md:p-7 shadow-md">
              <div className="text-[11px] uppercase tracking-wide text-accent mb-1">
                {copy.sea.label}
              </div>
              <h3 className="text-xl font-semibold mb-4">{copy.sea.title}</h3>
              <ul className="space-y-3">
                {copy.sea.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm">
                    <Waves className="h-4 w-4 shrink-0 mt-0.5 text-accent" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why it's better for you ──────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">{copy.benefitsHeadline}</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              {copy.benefitsSubhead}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {copy.benefits.map((benefit) => {
              const Icon = BENEFIT_ICONS[benefit.icon];
              return (
                <div
                  key={benefit.title}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <Icon className="h-7 w-7 mb-3 text-accent" aria-hidden="true" />
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Standards / objection handler ────────────────────────────── */}
      <section className="py-12 md:py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center">
            {copy.standardsHeadline}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6">
            {copy.standardsBody}
          </p>
          <blockquote
            className={`rounded-xl border border-border bg-background p-5 ${
              isRtl ? "border-r-4 border-r-accent" : "border-l-4 border-l-accent"
            }`}
          >
            <p className="text-sm md:text-base italic">{copy.standardsQuote}</p>
            <footer className="mt-2 text-xs text-muted-foreground not-italic">
              {copy.standardsQuoteAttribution}
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ─── Proof points ─────────────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
            {copy.proofHeadline}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {copy.proofPoints.map((point) => {
              const Icon = PROOF_ICONS[point.icon];
              return (
                <div
                  key={point.title}
                  className="flex gap-4 rounded-xl border border-border bg-card p-5"
                >
                  {point.icon === "award" ? (
                    <img
                      src={padiLogo}
                      alt="PADI 5 Star Dive Center"
                      className="h-10 w-auto shrink-0 object-contain"
                    />
                  ) : (
                    <Icon className="h-7 w-7 shrink-0 text-accent" aria-hidden="true" />
                  )}
                  <div>
                    <h3 className="font-semibold mb-1">{point.title}</h3>
                    <p className="text-sm text-muted-foreground">{point.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social proof. TripAdvisorSection renders a bare review wall, so it
          needs its own heading for context on this page. */}
      <section className="bg-card">
        <div className="container mx-auto px-4 pt-10 pb-2 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">
            {copy.socialProofHeadline}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            {copy.socialProofSubhead}
          </p>
        </div>
        <TripAdvisorSection />
      </section>

      {/* ─── Course routing ───────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">{copy.coursesHeadline}</h2>
            <p className="text-sm md:text-base text-muted-foreground">{copy.coursesSubhead}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {copy.courses.map((course) => (
              <div
                key={course.path}
                className="flex flex-col rounded-xl border border-border bg-background p-6 transition-all hover:border-accent/50 hover:shadow-md"
              >
                <h3 className="font-semibold text-lg mb-1">{course.name}</h3>
                <div className="text-2xl font-bold text-accent mb-3">{course.price}</div>
                <p className="text-sm text-muted-foreground mb-5 flex-1">{course.blurb}</p>
                <div className="flex flex-col gap-2">
                  <BookNowLink
                    location={`no_pool_course_${course.product.toLowerCase()}`}
                    product={course.product}
                    className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-accent-foreground bg-accent hover:bg-accent/90 transition-colors"
                  >
                    {copy.ctaPrimary}
                  </BookNowLink>
                  {/* Internal link keeps the utm params and gclid on the URL so
                      a new-tab open still lands attributed (sessionStorage is
                      per-tab and would start empty there). */}
                  <Link
                    to={withAttribution(course.path, search)}
                    className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium border border-border hover:border-accent/50 transition-colors"
                  >
                    {copy.coursesCta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
            {copy.faqHeadline}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {copy.faq.map((item, idx) => (
              <AccordionItem key={item.q} value={`faq-${idx}`}>
                <AccordionTrigger className={isRtl ? "text-right" : "text-left"}>
                  {item.q}
                </AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── Closing CTA ──────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{copy.closingHeadline}</h2>
          <p className="text-sm md:text-base mb-6 opacity-90">{copy.closingSubhead}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BookNowLink
              location="no_pool_closing"
              product="OWD"
              className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold bg-background text-foreground hover:bg-background/90 shadow-lg transition-all hover:-translate-y-0.5"
            >
              {copy.ctaPrimary}
            </BookNowLink>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWhatsApp("no_pool_closing")}
              className={whatsappCta}
            >
              <MessageCircle className="h-5 w-5" />
              {copy.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NoPoolLander;
