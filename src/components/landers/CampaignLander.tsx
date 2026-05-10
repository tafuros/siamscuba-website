import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Calendar, Heart, MessageCircle, Sailboat, Shield, Users } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import TripAdvisorSection from "@/components/TripAdvisorSection";
import LanderNav from "@/components/landers/LanderNav";
import { LANDER_COPY, type Lang, type Offer, type UspTile } from "@/lib/landerCopy";
import { trackViewContent, trackWhatsAppClick } from "@/utils/tracking";
import { buildWhatsAppLink } from "@/utils/whatsapp";

interface CampaignLanderProps {
  offer: Offer;
  lang: Lang;
}

const ICONS: Record<UspTile["icon"], typeof Shield> = {
  shield: Shield,
  users: Users,
  boat: Sailboat,
  calendar: Calendar,
  award: Award,
  heart: Heart,
};

const FUN_DIVE_BOOKING_PATH = "/fun-dive-booking";

const CampaignLander = ({ offer, lang }: CampaignLanderProps) => {
  const copy = LANDER_COPY[offer][lang];
  const isRtl = lang === "he";

  useEffect(() => {
    trackViewContent({ offer, lang });
  }, [offer, lang]);

  const whatsappHref = useMemo(
    () => buildWhatsAppLink({ offer, lang }),
    [offer, lang]
  );

  // For fun-dive landers the primary CTA goes to the existing iframe page.
  // For DSD / OWD there is no self-serve booking — both CTAs go to WhatsApp.
  const primaryHref =
    offer === "fun-dive"
      ? `${FUN_DIVE_BOOKING_PATH}?utm_passthrough=1`
      : whatsappHref;
  const primaryIsExternal = offer !== "fun-dive";

  const onWhatsApp = (location: string) => () =>
    trackWhatsAppClick({ location, url: whatsappHref });

  const dirAttr = isRtl ? ("rtl" as const) : ("ltr" as const);
  const langAttr = lang === "he" ? "he" : lang === "es" ? "es" : "en";

  return (
    <div dir={dirAttr} lang={langAttr} className="min-h-screen bg-background text-foreground">
      <LanderNav />

      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/80 via-ocean-deep/60 to-background" />
        <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge variant="secondary" className="mb-4 text-xs md:text-sm">
              {copy.heroBadge}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-white drop-shadow-lg">
              {copy.heroH1}
            </h1>
            <p className="text-base md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {copy.heroSubhead}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              {primaryIsExternal ? (
                <a
                  href={primaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onWhatsApp("lander_hero")}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm md:text-base font-semibold text-white bg-[#25D366] hover:bg-[#1da851] shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  {copy.ctaPrimary}
                </a>
              ) : (
                <Button asChild size="lg" className="rounded-full px-6 bg-accent hover:bg-accent/90">
                  <Link to={primaryHref}>{copy.ctaPrimary}</Link>
                </Button>
              )}
              {primaryIsExternal ? null : (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onWhatsApp("lander_hero_secondary")}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm md:text-base font-semibold text-white bg-[#25D366] hover:bg-[#1da851] shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  {copy.ctaSecondary}
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* USP tiles */}
      <section className="py-12 md:py-16 bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">{copy.uspHeadline}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {copy.uspTiles.map((tile) => {
              const Icon = ICONS[tile.icon];
              return (
                <div
                  key={tile.title}
                  className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-background"
                >
                  <Icon className="h-8 w-8 mb-3 text-accent" />
                  <h3 className="font-semibold mb-2">{tile.title}</h3>
                  <p className="text-sm text-muted-foreground">{tile.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">{copy.pricingHeadline}</h2>
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="text-4xl md:text-5xl font-bold text-accent">{copy.pricing.price}</div>
              <div className="text-sm text-muted-foreground mt-1">{copy.pricing.perWhat}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide">
                  {lang === "es" ? "Incluye" : lang === "he" ? "כלול" : "Includes"}
                </h3>
                <ul className="space-y-2 text-sm">
                  {copy.pricing.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-accent shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide">
                  {lang === "es" ? "No incluye" : lang === "he" ? "לא כלול" : "Not included"}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {copy.pricing.excludes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="shrink-0">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-card">
        <div className="container mx-auto px-4 pt-10 pb-2 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">{copy.socialProofHeadline}</h2>
          <p className="text-sm md:text-base text-muted-foreground">{copy.socialProofSubhead}</p>
        </div>
        <TripAdvisorSection />
      </section>

      {/* What you'll do */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">{copy.whatYouDoHeadline}</h2>
            <p className="text-sm md:text-base text-muted-foreground">{copy.whatYouDoSubhead}</p>
          </div>

          {copy.schedule && (
            <ol className="space-y-3">
              {copy.schedule.map((step) => (
                <li
                  key={`${step.time}-${step.label}`}
                  className="flex gap-4 items-start p-4 rounded-lg border border-border bg-card"
                >
                  <div className="font-mono text-sm text-accent w-24 shrink-0">{step.time}</div>
                  <div className="text-sm md:text-base">{step.label}</div>
                </li>
              ))}
            </ol>
          )}

          {copy.diveSites && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {copy.diveSites.map((site) => (
                <div key={site.name} className="p-4 rounded-lg border border-border bg-card">
                  <h3 className="font-semibold mb-1">{site.name}</h3>
                  <p className="text-sm text-muted-foreground">{site.blurb}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-12 md:py-16 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{copy.ctaStripHeadline}</h2>
          <p className="text-sm md:text-base mb-6 opacity-90">{copy.ctaStripSubhead}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {primaryIsExternal ? (
              <a
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onWhatsApp("lander_cta_strip")}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm md:text-base font-semibold text-white bg-[#25D366] hover:bg-[#1da851] shadow-lg"
              >
                <MessageCircle className="h-4 w-4" />
                {copy.ctaPrimary}
              </a>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="rounded-full px-6"
                >
                  <Link to={primaryHref}>{copy.ctaPrimary}</Link>
                </Button>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onWhatsApp("lander_cta_strip")}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm md:text-base font-semibold text-white bg-[#25D366] hover:bg-[#1da851] shadow-lg"
                >
                  <MessageCircle className="h-4 w-4" />
                  {copy.ctaSecondary}
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
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

      {/* Closing CTA */}
      <section className="py-12 md:py-16 bg-card">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{copy.closingCtaHeadline}</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6">{copy.closingCtaSubhead}</p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsApp("lander_closing")}
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-base font-semibold text-white bg-[#25D366] hover:bg-[#1da851] shadow-lg"
          >
            <MessageCircle className="h-5 w-5" />
            {copy.ctaPrimary}
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CampaignLander;
