import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Check } from "lucide-react";
import type { Language } from "@/i18n/translations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IdcLinkText from "@/components/IdcLinkText";
import PadiKicker from "@/components/goPro/PadiKicker";
import { trackViewContent, trackWhatsAppClick } from "@/utils/tracking";
import { buildWhatsAppLink, normalizeLang } from "@/utils/whatsapp";
import { goProPath } from "@/data/goPro";
import { DM_COPY, DM_PRICE } from "@/data/divemaster";

/**
 * /divemaster-course (en/he/es/fr) - the Divemaster lander.
 *
 * Design brief (Ben, 2026-09-25): "the atmosphere of the diving profession".
 * It sits in the Go Pro family (same deep-water ground and blues as /go-pro)
 * and borrows the working tools of the trade for its structure:
 *   - a dive-computer readout for the key numbers,
 *   - a depth gauge down the hero photo,
 *   - the entry requirements written on a dive slate (lanyard hole included),
 *   - the typical day drawn as a dive profile.
 *
 * Every "IDC" in the copy links to the Go Pro page, where the IDC lives.
 */

const INK = "#04090f";

interface DivemasterContentProps {
  lang: Language;
}

const DivemasterContent = ({ lang }: DivemasterContentProps) => {
  const c = DM_COPY[lang];
  const rtl = lang === "he";
  const wa = buildWhatsAppLink({ topic: "dm", lang: normalizeLang(lang) });
  const idcHref = goProPath(lang);

  useEffect(() => {
    trackViewContent({ offer: "divemaster", lang, value: DM_PRICE });
  }, [lang]);

  const idcText = (text: string) => (
    <IdcLinkText
      text={text}
      renderLink={(label, key) => (
        <Link
          key={key}
          to={idcHref}
          className="font-bold text-[#7cc6e0] underline decoration-[#419EBC]/50 underline-offset-4 hover:decoration-[#7cc6e0]"
        >
          {label}
        </Link>
      )}
    />
  );

  const price = DM_PRICE.toLocaleString(lang === "fr" ? "fr-FR" : lang === "es" ? "es-ES" : "en-US");

  const readout = [
    { label: c.readout.price, value: `฿${price}`, note: "THB" },
    { label: c.readout.length, value: "16-35", note: c.readout.lengthNote },
    { label: c.readout.dives, value: "40+", note: "" },
    { label: c.readout.age, value: "18+", note: "" },
  ];

  const ladder = [
    { key: "ow", label: c.ladder.ow, href: "/open-water" },
    { key: "aow", label: c.ladder.aow, href: "/advanced-open-water" },
    { key: "rescue", label: c.ladder.rescue, href: "/rescue-diver" },
    { key: "dm", label: c.ladder.dm, href: null },
    { key: "idc", label: c.ladder.idc, href: idcHref },
  ];

  const waButton = (location: string, extra = "") => (
    <a
      href={wa}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick({ location, url: wa })}
      className={`inline-flex items-center gap-2 rounded-full bg-[#0270B6] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0286d8] ${extra}`}
    >
      <MessageCircle className="h-4 w-4" />
      {c.ctaPrimary}
    </a>
  );

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="min-h-screen text-white" style={{ background: INK }}>
      <Navbar />

      {/* ------------------------------------------------------------- hero */}
      <section
        className="relative overflow-hidden pb-14 pt-32 sm:pb-20 sm:pt-40"
        style={{
          backgroundImage:
            "radial-gradient(900px 440px at 12% 0%, rgba(2,112,182,0.24), transparent 62%), radial-gradient(640px 360px at 95% 30%, rgba(65,158,188,0.12), transparent 60%)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              {/* The PADI line is part of the h1 on purpose: "PADI Divemaster ·
                  Koh Tao" leads the page's main heading for search. */}
              <h1 className="font-display text-4xl leading-[1.06] text-white [text-wrap:balance] sm:text-6xl">
                <PadiKicker inline className="mb-5">{c.kicker}</PadiKicker>
                <span className="block">{c.heroTitle}</span>
              </h1>
              <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-white/70">{c.heroSub}</p>
              <p className="mt-4 max-w-[56ch] border-s-2 border-[#419EBC]/60 ps-4 leading-relaxed text-[#A5C5D4]">
                {c.internship}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                {waButton("dm-hero")}
                <a
                  href="#requirements"
                  className="rounded-full border border-[#419EBC]/40 px-7 py-3.5 text-sm font-semibold text-[#A5C5D4] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A5C5D4]/70"
                >
                  {c.ctaSecondary}
                </a>
              </div>
            </div>

            {/* Photo with a depth gauge running down its edge */}
            <figure className="relative mx-auto w-full max-w-[340px] lg:mx-0 lg:ms-auto">
              <img
                src="/idc/idc-confined-water-teaching-koh-tao.webp"
                alt={
                  lang === "he"
                    ? "הדגמת מיומנות צלילה במים רדודים בקו טאו"
                    : lang === "es"
                      ? "Demostración de una habilidad de buceo en aguas confinadas en Koh Tao"
                      : lang === "fr"
                        ? "Démonstration d'une compétence de plongée en milieu protégé à Koh Tao"
                        : "Demonstrating a dive skill in confined water on Koh Tao"
                }
                width={608}
                height={1080}
                fetchPriority="high"
                className="aspect-[4/5] w-full rounded-2xl border border-white/10 object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-y-4 end-3 flex flex-col justify-between rounded-full bg-black/45 px-1.5 py-2 text-[10px] font-semibold tabular-nums text-[#A5C5D4] backdrop-blur-sm"
                dir="ltr"
              >
                {[0, 5, 10, 15, 18].map((m) => (
                  <span key={m} className="flex items-center gap-1">
                    <span className="h-px w-2 bg-[#419EBC]" />
                    {m}m
                  </span>
                ))}
              </div>
            </figure>
          </div>

          {/* Dive-computer readout */}
          <dl className="mt-14 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#419EBC]/30 bg-[#06131d] sm:grid-cols-4">
            {readout.map((r, i) => (
              <div
                key={r.label}
                className={`px-5 py-5 ${i % 2 === 1 ? "border-s border-[#419EBC]/20" : ""} ${
                  i >= 2 ? "border-t border-[#419EBC]/20 sm:border-t-0" : ""
                } ${i === 2 ? "sm:border-s" : ""}`}
              >
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#419EBC]">
                  {r.label}
                </dt>
                <dd className="mt-1.5">
                  <span
                    dir="ltr"
                    className="block text-3xl font-semibold tabular-nums text-white [text-shadow:0_0_18px_rgba(65,158,188,0.45)] sm:text-4xl"
                  >
                    {r.value}
                  </span>
                  {r.note && <span className="mt-1 block text-xs text-white/50">{r.note}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ----------------------------------------------------------- ladder */}
      <section className="border-t border-white/10 py-14 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#419EBC]">
            {c.ladderTitle}
          </h2>
          <ol className="relative grid grid-cols-5 gap-1 sm:gap-3">
            <span aria-hidden="true" className="absolute inset-x-[10%] top-[11px] h-px bg-white/15" />
            {ladder.map((step) => {
              const here = step.key === "dm";
              const idc = step.key === "idc";
              const dot = (
                <span
                  className={`relative z-10 mx-auto block h-[23px] w-[23px] rounded-full border-2 ${
                    here
                      ? "border-[#419EBC] bg-[#0270B6] shadow-[0_0_0_6px_rgba(2,112,182,0.25)]"
                      : idc
                        ? "border-[#7cc6e0] bg-[#04090f]"
                        : "border-white/30 bg-[#04090f]"
                  }`}
                />
              );
              const label = (
                <span
                  className={`mt-3 block text-center text-[11px] leading-tight sm:text-sm ${
                    here ? "font-semibold text-white" : idc ? "font-bold text-[#7cc6e0] underline underline-offset-4" : "text-white/55"
                  }`}
                >
                  {step.label}
                  {here && (
                    <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#419EBC]">
                      {c.youAreHere}
                    </span>
                  )}
                </span>
              );
              return (
                <li key={step.key}>
                  {step.href ? (
                    <Link to={step.href} className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#419EBC]">
                      {dot}
                      {label}
                    </Link>
                  ) : (
                    <div>
                      {dot}
                      {label}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------- price + stay */}
      <section className="border-t border-white/10 py-14 sm:py-20">
        <div className="container mx-auto grid gap-5 px-4 lg:grid-cols-[1.3fr_1fr]">
          <article className="rounded-2xl border border-[#419EBC]/40 bg-[#0270B6]/10 p-6 sm:p-8">
            <h2 className="font-display text-2xl text-white sm:text-3xl">{c.priceTitle}</h2>
            <p className="mt-2 text-4xl font-semibold tabular-nums text-white" dir="ltr">
              ฿{price} <span className="text-base font-normal text-white/50">THB</span>
            </p>
            <p className="mt-4 leading-relaxed text-white/70">{c.priceBody}</p>
            <p className="mt-3 text-sm text-[#A5C5D4]">{c.priceCompare}</p>
          </article>
          <article className="rounded-2xl border border-white/12 bg-white/[0.03] p-6 sm:p-8">
            <h2 className="font-display text-2xl text-white sm:text-3xl">{c.stayTitle}</h2>
            <p className="mt-4 leading-relaxed text-white/70">{c.stayBody}</p>
          </article>
        </div>
      </section>

      {/* ------------------------------------------- requirements (slate) */}
      <section id="requirements" className="scroll-mt-24 border-t border-white/10 py-14 sm:py-20">
        <div className="container mx-auto grid items-start gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-[460px] -rotate-1 rounded-[20px] bg-[#e6ecee] p-7 pt-10 text-[#0b1b26] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] sm:p-9 sm:pt-12">
            {/* lanyard hole */}
            <span aria-hidden="true" className="absolute left-1/2 top-3 h-4 w-4 -translate-x-1/2 rounded-full bg-[#04090f] ring-2 ring-[#c9d3d7]" />
            <h2 className="font-display text-2xl sm:text-3xl">{c.reqTitle}</h2>
            <ul className="mt-6 space-y-4">
              {c.reqs.map((r) => (
                <li key={r} className="flex items-start gap-3 border-b border-[#0b1b26]/15 pb-3 text-[15px] leading-snug">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border-2 border-[#0b1b26]/70">
                    <Check className="h-3.5 w-3.5 text-[#0270B6]" strokeWidth={3} />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:pt-6">
            <p className="max-w-[52ch] text-lg leading-relaxed text-white/75">{c.reqNote}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/rescue-diver"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/85 hover:border-[#A5C5D4]/60"
              >
                Rescue Diver · ฿11,000
              </Link>
              <Link
                to="/efr"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/85 hover:border-[#A5C5D4]/60"
              >
                EFR · ฿5,000
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ what you learn */}
      <section className="border-t border-white/10 py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl text-white sm:text-4xl">{c.learnTitle}</h2>
          <div className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {c.learns.map((l) => (
              <div key={l.title} className="border-t border-white/15 pt-4">
                <h3 className="font-semibold text-white">{l.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">{l.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-[#419EBC]/30 bg-[#06131d] p-5 sm:p-7">
            <p className="text-sm text-[#A5C5D4]">{c.waterTestsNote}</p>
            <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {c.waterTests.map((w) => (
                <div key={w.label}>
                  <span className="block text-3xl font-semibold tabular-nums text-white [text-shadow:0_0_18px_rgba(65,158,188,0.45)]">
                    {w.value}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-white/55">{w.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- typical day (profile) */}
      <section className="border-t border-white/10 bg-black/30 py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl text-white sm:text-4xl">{c.dayTitle}</h2>
          {/* A dive profile: descend, bottom time, ascend - one leg per part of the day */}
          <svg
            aria-hidden="true"
            viewBox="0 0 900 90"
            preserveAspectRatio="none"
            className={`mt-8 hidden h-20 w-full sm:block ${rtl ? "-scale-x-100" : ""}`}
          >
            <path
              d="M0 8 H40 L110 70 H230 L300 8 H340 L400 52 H520 L580 8 H620 L660 30 H800 L860 8 H900"
              fill="none"
              stroke="#419EBC"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            <line x1="0" y1="8" x2="900" y2="8" stroke="rgba(255,255,255,0.15)" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
          </svg>
          <ol className="mt-6 grid gap-6 sm:mt-2 sm:grid-cols-3">
            {c.day.map((d) => (
              <li key={d.time} className="border-s-2 border-[#419EBC]/50 ps-4 sm:border-s-0 sm:ps-0">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#419EBC]">{d.time}</span>
                <p className="mt-2 max-w-[36ch] leading-relaxed text-white/75">{d.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
            {[
              "/idc/idc-rescue-skills-practice-koh-tao.webp",
              "/idc/idc-theory-session-koh-tao.webp",
              "/idc/idc-confined-water-teaching-koh-tao.webp",
            ].map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                width={608}
                height={1080}
                loading="lazy"
                className="h-64 w-auto shrink-0 snap-start rounded-xl border border-white/10 object-cover sm:h-72"
              />
            ))}
            <img
              src="/conservation/divers-ascending-koh-tao.webp"
              alt=""
              width={900}
              height={675}
              loading="lazy"
              className="h-64 w-auto shrink-0 snap-start rounded-xl border border-white/10 object-cover sm:h-72"
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ what's next */}
      <section className="border-t border-white/10 py-14 sm:py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">{c.nextTitle}</h2>
            <p className="mt-4 max-w-[56ch] text-lg leading-relaxed text-white/75">{idcText(c.nextBody)}</p>
            <Link
              to={idcHref}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#7cc6e0] hover:underline"
            >
              {c.idcLinkLabel}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </div>
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#419EBC]">{c.workTitle}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.workPlaces.map((p) => (
                <li key={p} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- closing */}
      <section className="border-t border-white/10 py-16 sm:py-20">
        <div className="container mx-auto max-w-[62ch] px-4 text-center">
          <h2 className="font-display text-3xl text-white [text-wrap:balance] sm:text-4xl">{c.closingTitle}</h2>
          <p className="mt-4 text-white/65">{c.closingBody}</p>
          {waButton("dm-closing", "mt-8")}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DivemasterContent;
