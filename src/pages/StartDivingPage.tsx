import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import Seo from "@/components/Seo";
import Footer from "@/components/Footer";
import LanderNav from "@/components/landers/LanderNav";
import BookingLink from "@/components/BookingLink";
import { START_DIVING_COPY, START_DIVING_PATH, type StartLang } from "@/lib/startDivingCopy";
import { trackViewContent, trackWhatsAppClick } from "@/utils/tracking";
import { WHATSAPP_NUMBER } from "@/utils/whatsapp";

/**
 * "Try diving or Open Water?" (Ben 2026-10-04, mockup C). Renders the ROUTE's
 * language (like the campaign landers), so /he/... is Hebrew whatever the
 * visitor's stored preference.
 */

const SITE = "https://siamscuba.com";
const BOOK_OW = "/fun-dive-booking?product=OW&utm_passthrough=1";
const BOOK_DSD = "/fun-dive-booking?product=DSD&utm_passthrough=1";

/**
 * The hero visual: both dives drawn to scale on one depth gauge, so "12 m vs
 * 18 m" is something you see rather than read. 300px of height = 18 m.
 */
function DepthGauge({ copy }: { copy: (typeof START_DIVING_COPY)[StartLang] }) {
  const top = 24;
  const px = 300 / 18; // per metre
  const y = (m: number) => top + m * px;
  const ticks = [0, 3, 6, 9, 12, 15, 18];
  return (
    <figure className="mx-auto w-full max-w-[420px]">
      <svg viewBox="0 0 360 360" className="h-auto w-full" role="img" aria-label={`${copy.gaugeDsd} 12 m, ${copy.gaugeOw} 18 m`}>
        <defs>
          <linearGradient id="sea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#5fc4ef" stopOpacity="0.35" />
            <stop offset="1" stopColor="#0a3a66" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <rect x="56" y={top} width="290" height={300} rx="14" fill="url(#sea)" />
        {/* 12-18 m: the water only Open Water divers reach */}
        <rect x="56" y={y(12)} width="290" height={y(18) - y(12)} fill="#fbbf24" fillOpacity="0.14" />
        <text x="200" y={y(15) + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fcd34d">
          {copy.gaugeBand}
        </text>
        {ticks.map((m) => (
          <g key={m}>
            <line x1="48" x2="56" y1={y(m)} y2={y(m)} stroke="#ffffff" strokeOpacity="0.5" />
            <text x="42" y={y(m) + 4} textAnchor="end" fontSize="11" fill="#ffffff" fillOpacity="0.7" direction="ltr">
              {m} m
            </text>
          </g>
        ))}
        {/* Try dive: down to 12 m */}
        <line x1="130" x2="130" y1={y(0) + 8} y2={y(12)} stroke="#e0f2fe" strokeWidth="6" strokeLinecap="round" />
        <circle cx="130" cy={y(12)} r="9" fill="#e0f2fe" />
        <text x="130" y={y(0) + 2} dy="-6" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ffffff">
          {copy.gaugeDsd}
        </text>
        <text x="144" y={y(12) + 6} textAnchor="start" fontSize="18" fontWeight="800" fill="#ffffff" direction="ltr">
          12 m
        </text>
        {/* Open Water: down to 18 m */}
        <line x1="270" x2="270" y1={y(0) + 8} y2={y(18)} stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
        <circle cx="270" cy={y(18)} r="10" fill="#38bdf8" />
        <text x="270" y={y(0) + 2} dy="-6" textAnchor="middle" fontSize="13" fontWeight="700" fill="#7dd3fc">
          {copy.gaugeOw}
        </text>
        <text x="284" y={y(18) - 6} textAnchor="start" fontSize="18" fontWeight="800" fill="#7dd3fc" direction="ltr">
          18 m
        </text>
      </svg>
      <figcaption className="mt-2 grid grid-cols-2 gap-3 text-center text-[13px] text-white/75" dir="ltr">
        <span>{copy.gaugeCaptionDsd}</span>
        <span className="text-sky-200">{copy.gaugeCaptionOw}</span>
      </figcaption>
    </figure>
  );
}

const StartDivingPage = ({ lang }: { lang: StartLang }) => {
  const copy = START_DIVING_COPY[lang];
  const rtl = lang === "he";
  const display = rtl ? "font-bold" : "font-display font-bold";
  const Arrow = rtl ? ArrowLeft : ArrowRight;
  const waHref = useMemo(
    () => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(copy.waMessage)}`,
    [copy.waMessage],
  );

  useEffect(() => {
    trackViewContent({ offer: "start-diving", lang });
  }, [lang]);

  const alternates = Object.fromEntries(
    (Object.keys(START_DIVING_PATH) as StartLang[]).map((l) => [l, `${SITE}${START_DIVING_PATH[l]}`]),
  );

  const bookBtn =
    "inline-flex flex-col items-center justify-center rounded-full font-bold text-[#062033] bg-gradient-to-b from-sky-300 to-sky-400 shadow-[0_8px_32px_rgba(56,189,248,.40)] transition-transform hover:-translate-y-0.5";

  return (
    <div dir={rtl ? "rtl" : "ltr"} lang={lang} className="min-h-screen bg-[#03152a] text-white">
      <Seo
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonical={`${SITE}${START_DIVING_PATH[lang]}`}
        hreflangAlternates={alternates}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: copy.h1 }]}
      />
      <LanderNav />
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick({ location: "start_nav", url: waHref })}
        className="absolute top-7 z-50 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[.06] px-4 py-2 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/15 end-4 md:end-8"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </a>

      {/* ── Hero: the question + the depth gauge ── */}
      <section
        className="px-5 pb-10 pt-28 text-center"
        style={{ background: "radial-gradient(120% 80% at 50% 0%, rgba(10,58,102,.75) 0%, rgba(3,21,42,1) 70%)" }}
      >
        <p className="text-[12px] font-semibold uppercase tracking-[.12em] text-sky-300">{copy.kicker}</p>
        <h1 className={`${display} mx-auto mt-2 max-w-2xl text-[clamp(30px,5.6vw,50px)] leading-[1.1]`}>{copy.h1}</h1>
        <p className="mx-auto mt-3 max-w-xl text-[16px] text-white/80">{copy.sub}</p>
        <div className="mt-8">
          <DepthGauge copy={copy} />
        </div>
      </section>

      <main className="mx-auto max-w-[920px] px-5 pb-24">
        {/* ── The comparison ── */}
        <section>
          <h2 className={`${display} mb-4 text-center text-2xl`}>{copy.tableTitle}</h2>
          <div className="overflow-hidden rounded-[20px] border border-white/[.12]">
            <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[0.8fr_1fr_1fr]">
              <div className="hidden md:block" />
              <div className="border-b border-white/10 p-4 text-center">
                <p className="text-[16px] font-bold">{copy.colDsd}</p>
                <p className="text-[12px] text-white/55">{copy.colDsdSub}</p>
              </div>
              <div className="border-b border-sky-300/30 bg-sky-400/[.10] p-4 text-center">
                <p className="text-[16px] font-bold text-sky-200">{copy.colOw}</p>
                <p className="text-[12px] text-white/55">{copy.colOwSub}</p>
                <span className="mt-1 inline-block rounded-full bg-amber-400 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-stone-900">
                  {copy.recommended}
                </span>
              </div>
              {copy.rows.map((r) => (
                <div key={r.label} className="contents">
                  <div className="col-span-2 border-t border-white/[.08] bg-white/[.03] px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[.1em] text-white/50 md:col-span-1 md:flex md:items-center md:bg-transparent md:py-3 md:text-[13px] md:normal-case md:tracking-normal md:text-white/70">
                    {r.label}
                  </div>
                  <div className="px-4 py-3 text-center md:border-t md:border-white/[.08]">
                    <p className="text-[15px] font-semibold">{r.dsd}</p>
                    {r.dsdSub && <p className="text-[12px] leading-snug text-white/55">{r.dsdSub}</p>}
                  </div>
                  <div className="bg-sky-400/[.06] px-4 py-3 text-center md:border-t md:border-white/[.08]">
                    <p className="text-[15px] font-semibold text-sky-100">{r.ow}</p>
                    {r.owSub && <p className="text-[12px] leading-snug text-white/60">{r.owSub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What Open Water opens up ── */}
        <section className="mt-10">
          <h2 className={`${display} mb-4 text-2xl`}>{copy.opensTitle}</h2>
          <ul className="grid gap-3 md:grid-cols-3">
            {copy.opens.map((o) => (
              <li key={o.title} className="rounded-2xl border border-white/[.10] bg-white/[.04] p-5">
                <p className="text-[16px] font-bold">{o.title}</p>
                <p className="mt-1 text-[13.5px] text-white/70">{o.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── The recommendation + the two buttons ── */}
        <section className="mt-10 rounded-[22px] border border-sky-300/30 bg-sky-400/[.08] p-6 md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-sky-300">{copy.recoKicker}</p>
          <h2 className={`${display} mt-1 text-[clamp(24px,4vw,32px)]`}>{copy.recoTitle}</h2>
          <ul className="mt-4 space-y-2">
            {copy.recoPoints.map((p) => (
              <li key={p} className="flex gap-2.5 text-[15px] text-white/85">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14px] text-white/65">{copy.recoShort}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <BookingLink to={BOOK_OW} className={`${bookBtn} px-6 py-3.5`}>
              <span className="inline-flex items-center gap-2 text-[16px]">
                {copy.ctaOw} <Arrow className="h-4 w-4" />
              </span>
              <span className="text-[12px] font-semibold opacity-75">{copy.ctaOwSub}</span>
            </BookingLink>
            <BookingLink
              to={BOOK_DSD}
              className="inline-flex flex-col items-center justify-center rounded-full border border-white/30 px-6 py-3.5 font-bold hover:bg-white/10"
            >
              <span className="text-[16px]">{copy.ctaDsd}</span>
              <span className="text-[12px] font-semibold text-white/65">{copy.ctaDsdSub}</span>
            </BookingLink>
          </div>
          <div className="mt-5 flex flex-col items-center gap-3 text-sm sm:flex-row sm:justify-between">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ location: "start_reco", url: waHref })}
              className="inline-flex items-center gap-2 font-semibold text-white/85 hover:text-white"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366]">
                <MessageCircle className="h-3 w-3" />
              </span>
              {copy.ctaWa}
            </a>
            <span className="flex gap-4 text-white/60">
              <Link to="/open-water" className="underline underline-offset-4 hover:text-white">{copy.detailsOw}</Link>
              <Link to="/discover-scuba" className="underline underline-offset-4 hover:text-white">{copy.detailsDsd}</Link>
            </span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StartDivingPage;
