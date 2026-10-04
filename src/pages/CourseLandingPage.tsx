import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Star, X } from "lucide-react";
import Seo from "@/components/Seo";
import Footer from "@/components/Footer";
import LanderNav from "@/components/landers/LanderNav";
import BookingLink from "@/components/BookingLink";
import { useLanguage } from "@/i18n/LanguageContext";
import { courseDetails } from "@/i18n/courseDetails";
import { COURSE_SEO } from "@/lib/courseSeoData";
import { COURSE_PAGES, COURSE_PAGE_UI, type CoursePageSlug } from "@/data/coursePages";
import { REVIEW_STATS } from "@/data/reviewStats";
import { googleReviews } from "@/data/googleReviews";
import { trackViewContent, trackWhatsAppClick } from "@/utils/tracking";
import { WHATSAPP_NUMBER } from "@/utils/whatsapp";

/**
 * A real course page (Ben 2026-10-04, mockup A) - replaces "the homepage with
 * the course popup auto-opened" on /open-water, /discover-scuba, /scuba-review.
 *
 * Dark-premium lander look (FunDiveLander / Similan line). The long lists come
 * from courseDetails in the visitor's language, the headline numbers and the
 * three answers from data/coursePages.ts. Everything renders into the static
 * HTML (no portals), so the prerender carries the whole course for Google.
 */

// Strip the emoji the popup copy uses as decoration; on this page the icons do
// that job and the emoji would render differently on every device.
const EMOJI = /\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]|\u{FE0F}|\u{200D}/gu;
const clean = (s: string) => s.replace(EMOJI, "").replace(/\s{2,}/g, " ").trim();

const thb = (n: number) => `฿${n.toLocaleString("en-US")}`;

// Same review picks idea as the homepage strip, matched to the course.
const QUOTES: Record<CoursePageSlug, string[]> = {
  "open-water": ["Sipra K.", "Lea C."],
  "discover-scuba": ["Alon S.", "Sophie L."],
  "scuba-review": ["Morganne V.", "Mariana R."],
};

const HERO_OVERLAY: React.CSSProperties = {
  background:
    "radial-gradient(120% 90% at 50% 0%, rgba(10,58,102,.50) 0%, rgba(8,49,90,.62) 36%, rgba(5,31,58,.82) 70%, rgba(3,21,42,.96) 100%)",
};

const Stars = () => (
  <span className="inline-flex gap-[2px] align-[-.12em] text-amber-400" aria-hidden="true">
    {[0, 1, 2, 3, 4].map((i) => (
      <Star key={i} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
    ))}
  </span>
);

const CourseLandingPage = ({ slug }: { slug: CoursePageSlug }) => {
  const { language, isRTL } = useLanguage();
  const page = COURSE_PAGES[slug];
  const ui = COURSE_PAGE_UI[language] ?? COURSE_PAGE_UI.en;
  const detail = courseDetails[language]?.[page.dialogKey] ?? courseDetails.en[page.dialogKey];
  const seo = COURSE_SEO[slug];
  // Playfair has no Hebrew glyphs - Hebrew headings use the body stack.
  const display = isRTL ? "font-bold" : "font-display font-bold";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const h1 = language === "en" ? seo.h1 : clean(detail.header).replace(/\s+-\s+.*$/, "");
  const bookHref = `/fun-dive-booking?product=${encodeURIComponent(page.product)}&utm_passthrough=1`;
  const waHref = useMemo(
    () => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(ui.waMessage(seo.h1))}`,
    [ui, seo.h1],
  );
  const onWa = (location: string) => () => trackWhatsAppClick({ location, url: waHref });

  useEffect(() => {
    trackViewContent({ offer: `course-${slug}`, lang: language, value: page.priceThb });
  }, [slug, language, page.priceThb]);

  const plan = detail.itinerary?.map((d) => ({ when: d.day, what: clean(d.description) })) ??
    detail.schedule?.map((d) => ({ when: d.time, what: clean(d.description) })) ?? [];
  const quotes = QUOTES[slug].map((n) => googleReviews.find((r) => r.name === n)).filter(Boolean);

  const bookBtn =
    "inline-flex items-center justify-center gap-2 rounded-full font-bold text-[#062033] " +
    "bg-gradient-to-b from-sky-300 to-sky-400 shadow-[0_8px_32px_rgba(56,189,248,.40)] transition-transform hover:-translate-y-0.5";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: seo.h1,
      description: seo.description,
      provider: { "@type": "Organization", name: "Siam Scuba", sameAs: "https://siamscuba.com" },
      offers: { "@type": "Offer", price: page.priceThb, priceCurrency: "THB", category: "Paid", url: `https://siamscuba.com/${slug}` },
      hasCourseInstance: { "@type": "CourseInstance", courseMode: "Onsite", location: "Koh Tao, Thailand" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: COURSE_PAGES[slug].faq.en.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#03152a] text-white">
      <Seo
        title={seo.title}
        description={seo.description}
        jsonLd={jsonLd}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Courses", path: "/#courses" }, { name: seo.h1 }]}
      />
      <LanderNav />
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onWa("course_nav")}
        className="absolute top-7 z-50 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[.06] px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/15 end-4 md:end-8"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </a>

      {/* ── Hero: name, promise, price, the four numbers, two buttons ── */}
      <section className="relative overflow-hidden">
        <img
          src={page.heroImage}
          alt=""
          aria-hidden="true"
          // @ts-expect-error - fetchpriority is valid HTML, React types lag
          fetchpriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={HERO_OVERLAY} />
        <div className="relative z-10 mx-auto max-w-3xl px-5 pb-10 pt-28 text-center md:pb-14">
          <p className="mb-4 inline-flex rounded-full border border-sky-400/35 bg-sky-400/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[.08em] text-sky-100">
            {ui.badge}
          </p>
          <h1 className={`${display} text-[clamp(32px,6vw,54px)] leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,.45)]`}>
            {h1}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[clamp(15px,2.1vw,18px)] leading-relaxed text-white/85">
            {page.tagline[language] ?? page.tagline.en}
          </p>

          <div className="mx-auto mt-6 inline-flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 rounded-2xl border border-white/20 bg-white/[.08] px-6 py-3 backdrop-blur-md">
            <span className={`${display} text-[34px] tabular-nums text-amber-400`}>{thb(page.priceThb)}</span>
            <span className="text-start text-sm text-white/80">
              {ui.deposit(thb(page.depositThb))}
              {page.balanceThb != null && (
                <>
                  <br />
                  {ui.onArrival(thb(page.balanceThb))}
                </>
              )}
            </span>
          </div>
          {page.priceNote && (
            <p className="mt-2 text-[13px] text-white/65">{page.priceNote[language] ?? page.priceNote.en}</p>
          )}

          <dl className="mx-auto mt-6 grid max-w-xl grid-cols-2 overflow-hidden rounded-[18px] border border-white/[.14] bg-white/[.06] backdrop-blur-xl sm:grid-cols-4">
            {(page.facts[language] ?? page.facts.en).map(([value, label], i) => (
              <div
                key={label}
                className={`px-3 py-4 ${i % 2 === 1 ? "border-s border-white/[.09]" : ""} ${i >= 2 ? "border-t border-white/[.09] sm:border-t-0 sm:border-s" : ""}`}
              >
                <dt className="sr-only">{label}</dt>
                <dd className="text-[17px] font-bold">{value}</dd>
                <dd className="mt-0.5 text-[12px] text-white/60">{label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-col items-center gap-3">
            <BookingLink to={bookHref} className={`${bookBtn} px-10 py-4 text-[17px]`}>
              {ui.book} <Arrow className="h-[1.05em] w-[1.05em]" />
            </BookingLink>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onWa("course_hero")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 hover:text-white"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366]">
                <MessageCircle className="h-3 w-3" />
              </span>
              {ui.whatsapp}
            </a>
          </div>

          <p className="mt-6 text-sm text-white/75">
            <Stars /> <b className="text-white">{REVIEW_STATS.google.rating.toFixed(1)}</b> Google ·{" "}
            <b className="text-white">{REVIEW_STATS.tripadvisor.rating.toFixed(1)}</b> Tripadvisor
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-[920px] px-5 pb-32">
        {/* ── What's included + the plan ── */}
        <div className="grid gap-5 pt-10 md:grid-cols-2">
          <section className="rounded-[20px] border border-white/[.12] bg-white/[.05] p-6">
            <h2 className={`${display} mb-4 text-2xl`}>{ui.included}</h2>
            <ul className="space-y-2.5">
              {(detail.included ?? []).map((item) => (
                <li key={item} className="flex gap-2.5 text-[14.5px] leading-snug text-white/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
                  <span>{clean(item)}</span>
                </li>
              ))}
            </ul>
            {detail.notIncluded && detail.notIncluded.length > 0 && (
              <p className="mt-4 flex gap-2.5 border-t border-white/10 pt-3 text-[13px] text-white/60">
                <X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {ui.notIncluded}: {detail.notIncluded.map(clean).join(" · ")}
                </span>
              </p>
            )}
          </section>

          {plan.length > 0 && (
            <section className="rounded-[20px] border border-white/[.12] bg-white/[.05] p-6">
              <h2 className={`${display} mb-4 text-2xl`}>{ui.plan}</h2>
              <ol className="space-y-3">
                {plan.map((step) => (
                  <li key={step.when + step.what} className="grid grid-cols-[5.5rem_1fr] gap-3 text-[14px] leading-snug">
                    <span className="font-semibold tabular-nums text-sky-300">{step.when}</span>
                    <span className="text-white/80">{step.what}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {/* ── Free stay (Open Water) ── */}
        {page.freeStay && (
          <section className="mt-5 grid overflow-hidden rounded-[20px] border border-amber-300/25 bg-amber-300/[.06] md:grid-cols-[1fr_1.3fr]">
            <img
              src="/hotel/siam-hotel-koh-tao-palm-sunset-800.webp"
              alt="Siam Hotel & Hostel, Sairee Beach, Koh Tao"
              loading="lazy"
              className="h-44 w-full object-cover md:h-full"
            />
            <div className="p-6">
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-amber-300">FREE</p>
              <h2 className={`${display} mt-1 text-2xl`}>{(page.freeStay[language] ?? page.freeStay.en).title}</h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/80">
                {(page.freeStay[language] ?? page.freeStay.en).body}
              </p>
            </div>
          </section>
        )}

        {/* ── Good to know + payment terms (verbatim from the course data) ── */}
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <section className="rounded-[20px] border border-white/[.12] bg-white/[.05] p-6">
            <h2 className={`${display} mb-4 text-2xl`}>{ui.goodToKnow}</h2>
            <dl className="space-y-4">
              {(page.faq[language] ?? page.faq.en).map((f) => (
                <div key={f.q}>
                  <dt className="text-[15px] font-semibold">{f.q}</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-white/75">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
          {detail.payment && detail.payment.length > 0 && (
            <section className="rounded-[20px] border border-white/[.12] bg-white/[.05] p-6">
              <h2 className={`${display} mb-4 text-2xl`}>{ui.payment}</h2>
              <ul className="space-y-2 text-[14px] leading-snug text-white/80">
                {detail.payment.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" aria-hidden="true" />
                    <span>{clean(line)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* ── Divers say ── */}
        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className={`${display} text-2xl`}>{ui.diversSay}</h2>
            <a href={REVIEW_STATS.google.url} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white">
              <Stars /> {REVIEW_STATS.google.rating.toFixed(1)} Google · {REVIEW_STATS.google.count} {ui.reviews}
            </a>
          </div>
          <ul className="grid gap-3 md:grid-cols-2">
            {quotes.map((r) => (
              <li key={r!.name} dir="ltr" className="rounded-2xl border border-white/[.10] bg-white/[.04] p-5">
                <Stars />
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/85">“{r!.text}”</p>
                <p className="mt-2 text-xs text-white/50">
                  {r!.name} · {r!.country} · Google · {r!.date}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Next step ── */}
        <section className="mt-10 flex flex-col gap-4 rounded-[20px] border border-sky-300/25 bg-sky-300/[.07] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-sky-300">{ui.nextStep}</p>
            <h2 className={`${display} mt-1 text-2xl`}>{page.next.title[language] ?? page.next.title.en}</h2>
            <p className="mt-1 text-[14px] text-white/75">{page.next.body[language] ?? page.next.body.en}</p>
          </div>
          <Link
            to={page.next.href}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold hover:bg-white/10"
          >
            {page.next.cta[language] ?? page.next.cta.en} <Arrow className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <Footer />

      {/* ── Sticky booking bar ── */}
      <div data-sticky-cta className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#03152a]/92 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pt-2.5 backdrop-blur-md">
        {/* pl-[68px]: the accessibility button is fixed bottom-LEFT (physical,
            in every language) and would otherwise sit on top of the price. */}
        <div className="mx-auto flex max-w-[920px] items-center justify-between gap-3 pl-[68px] md:pl-0">
          <p className="text-sm leading-tight">
            <b className="text-[17px] tabular-nums text-amber-400">{thb(page.priceThb)}</b>
            <span className="block text-[12px] text-white/65">{ui.stickyToday(thb(page.depositThb))}</span>
          </p>
          <BookingLink to={bookHref} className={`${bookBtn} px-7 py-3 text-[15px] shadow-none`}>
            {ui.book}
          </BookingLink>
        </div>
      </div>
    </div>
  );
};

export default CourseLandingPage;
