import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Clock, Users } from "lucide-react";
import type { Language } from "@/i18n/translations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trackWhatsAppClick } from "@/utils/tracking";
import { buildWhatsAppLink, normalizeLang } from "@/utils/whatsapp";
import {
  GO_PRO_COPY,
  GO_PRO_TRACKS,
  IE_SCHEDULE,
  formatExamDate,
  monthName,
  type TrackKey,
} from "@/data/goPro";
import PadiStars from "./PadiStars";
import { useNextExam } from "./useNextExam";
import { courseDetails } from "@/i18n/courseDetails";

/**
 * /go-pro - the destination for the gate's black card and the homepage band.
 *
 * Ben, 2026-08-16: Divemaster and the IDC are SEPARATE certifications with
 * separate prerequisites, but a candidate can book them back to back. So this
 * page shows two tracks plus a combined option rather than one merged product -
 * anything else would misrepresent what someone is actually signing up for.
 *
 * No prices anywhere: enquire-only, by decision. Course fees depend on the route
 * and on what the candidate already holds.
 */

const WA_TOPIC: Record<TrackKey, "dm" | "idc"> = {
  divemaster: "dm",
  idc: "idc",
  combined: "idc",
};

interface GoProContentProps {
  lang: Language;
}

const GoProContent = ({ lang }: GoProContentProps) => {
  const copy = GO_PRO_COPY[lang];
  const { status, exam: next } = useNextExam();
  const seasonOver = status === "resolved" && next === null;
  const rtl = lang === "he";
  const waLang = normalizeLang(lang);
  const heroWa = buildWhatsAppLink({ topic: "idc", lang: waLang });

  // Bob's bio + the IDC photo set live on the IDC course entry (translated
  // en/he/es/fr) - reuse them here so there is a single source of truth.
  const idcDetail =
    courseDetails[lang]?.["IDC (Instructor Course)"] ?? courseDetails.en["IDC (Instructor Course)"];
  const bob = idcDetail?.instructor;
  const gallery = idcDetail?.gallery;

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-[#04090f] text-white">
      <Navbar />

      {/* ------------------------------------------------------------- hero */}
      <section
        className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40"
        style={{
          backgroundImage:
            "radial-gradient(900px 420px at 18% 0%, rgba(2,112,182,0.22), transparent 62%), radial-gradient(700px 340px at 92% 18%, rgba(65,158,188,0.14), transparent 60%)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <PadiStars className="h-3 w-3" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#419EBC]">
                  {copy.kicker}
                </span>
              </div>

              <h1 className="font-display text-4xl leading-[1.06] text-white sm:text-6xl">
                {copy.heroTitle}
              </h1>
              <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-white/70">
                {copy.heroSub}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={heroWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ location: "go-pro-hero", url: heroWa })}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0270B6] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0286d8]"
                >
                  <MessageCircle className="h-4 w-4" />
                  {copy.ctaPrimary}
                </a>
                <a
                  href="#exam-dates"
                  className="rounded-full border border-[#419EBC]/40 px-7 py-3.5 text-sm font-semibold text-[#A5C5D4] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A5C5D4]/70"
                >
                  {copy.ctaSecondary}
                </a>
              </div>
            </div>

            {/* The credential. Used exactly as PADI supplies it (artwork 64192) -
                never recoloured, cropped or stretched. */}
            <figure className="mx-auto w-full max-w-[300px] lg:mx-0 lg:ms-auto">
              <img
                src="/go-pro/padi-5star-idc.webp"
                alt="Authorized PADI 5 Star Instructor Development Center"
                width={520}
                height={751}
                className="w-full rounded-xl border border-white/10"
              />
              <figcaption className="mt-3 text-center text-xs leading-relaxed text-white/45 lg:text-start">
                {copy.credentialSub}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- tracks */}
      <section className="border-t border-white/10 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <header className="mb-10 max-w-[62ch]">
            <h2 className="font-display text-3xl text-white sm:text-4xl">{copy.tracksTitle}</h2>
            <p className="mt-3 text-white/60">{copy.tracksSub}</p>
          </header>

          <div className="grid gap-5 lg:grid-cols-3">
            {GO_PRO_TRACKS.map((track) => {
              const wa = buildWhatsAppLink({ topic: WA_TOPIC[track.key], lang: waLang });
              const combined = track.key === "combined";
              return (
                <article
                  key={track.key}
                  className={`flex flex-col rounded-2xl border p-6 ${
                    combined
                      ? "border-[#419EBC]/40 bg-[#0270B6]/10"
                      : "border-white/12 bg-white/[0.03]"
                  }`}
                >
                  <h3 className="font-display text-xl leading-tight text-white">{track.name[lang]}</h3>

                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex gap-2 text-white/60">
                      <dt className="sr-only">{copy.forWhoLabel}</dt>
                      <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#419EBC]" />
                      <dd>{track.forWho[lang]}</dd>
                    </div>
                    <div className="flex gap-2 text-white/60">
                      <dt className="sr-only">{copy.durationLabel}</dt>
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#419EBC]" />
                      <dd>{track.duration[lang]}</dd>
                    </div>
                  </dl>

                  <ul className="mt-5 space-y-2 border-t border-white/10 pt-5 text-sm text-white/70">
                    {track.points[lang].map((point) => (
                      <li key={point} className="flex gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#419EBC]"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackWhatsAppClick({ location: `go-pro-${track.key}`, url: wa })
                      }
                      className="rounded-full bg-[#0270B6] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0286d8]"
                    >
                      {copy.trackCta}
                    </a>
                    {/* The deep detail already exists, translated, in the course
                        dialog - link to it rather than duplicating it here. */}
                    {track.courseSlug && (
                      <Link
                        to={`/${track.courseSlug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#A5C5D4] hover:underline"
                      >
                        {copy.detailCta}
                        <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-6 text-sm text-white/45">{copy.priceNote}</p>
        </div>
      </section>

      {/* --------------------------------------------- your course director */}
      {bob && (
        <section className="border-t border-white/10 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
              <figure className="relative mx-auto w-full max-w-[340px] lg:mx-0">
                <img
                  src={bob.photo}
                  alt={bob.photoAlt}
                  width={608}
                  height={1080}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-2xl border border-white/10 object-cover"
                />
                <figcaption className="mt-3 text-center text-xs text-white/45 lg:text-start">
                  {bob.name} · {bob.role}
                </figcaption>
              </figure>

              <div>
                <div className="mb-4 flex items-center gap-2.5">
                  <PadiStars className="h-3 w-3" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#419EBC]">
                    {bob.title}
                  </span>
                </div>
                <h2 className="font-display text-3xl text-white sm:text-4xl">{bob.name}</h2>
                <p className="mt-1.5 text-sm font-semibold text-[#A5C5D4]">{bob.role}</p>
                {bob.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 max-w-[58ch] leading-relaxed text-white/65">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {gallery && (
              <div className="mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
                {gallery.map((photo) => (
                  <img
                    key={photo.src}
                    src={photo.src}
                    alt={photo.alt}
                    width={608}
                    height={1080}
                    loading="lazy"
                    className="h-64 w-auto shrink-0 snap-start rounded-xl border border-white/10 object-cover sm:h-72"
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------ exam dates */}
      <section
        id="exam-dates"
        className="scroll-mt-24 border-t border-white/10 bg-black/30 py-16 sm:py-20"
      >
        <div className="container mx-auto px-4">
          <header className="mb-8 max-w-[62ch]">
            <h2 className="font-display text-3xl text-white sm:text-4xl">{copy.calendarTitle}</h2>
            <p className="mt-3 text-white/60">{copy.calendarSub}</p>
          </header>

          {next && (
            <p className="mb-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-[#419EBC]/40 bg-[#0270B6]/12 px-5 py-2.5">
              <PadiStars />
              <span className="text-sm text-[#A5C5D4]">
                {copy.nextIe}:{" "}
                <strong className="font-semibold text-white">
                  {formatExamDate(next.examDate, lang)}
                </strong>{" "}
                {copy.inDays(next.daysAway)}
              </span>
            </p>
          )}
          {seasonOver && <p className="mb-6 text-sm text-white/55">{copy.seasonOver}</p>}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm tabular-nums">
              <thead>
                <tr className="border-b border-white/15 text-start text-[11px] uppercase tracking-[0.14em] text-[#419EBC]">
                  <th className="py-3 text-start font-semibold">{copy.colMonth}</th>
                  <th className="py-3 text-start font-semibold">{copy.colIdc}</th>
                  <th className="py-3 text-start font-semibold">{copy.colExam}</th>
                </tr>
              </thead>
              <tbody>
                {IE_SCHEDULE.map((e) => {
                  const isNext = next != null && e.month === next.entry.month;
                  return (
                    <tr
                      key={e.month}
                      className={`border-b border-white/8 ${
                        isNext ? "bg-[#0270B6]/14 text-white" : "text-white/60"
                      }`}
                    >
                      <td className="py-3 font-medium">{monthName(e.month, lang, "long")}</td>
                      <td className="py-3">
                        {e.idcDay}
                        {e.prepMonthOffset ? ` (${monthName(e.month - 1, lang)})` : ""}
                      </td>
                      <td className={`py-3 ${isNext ? "font-semibold" : ""}`}>{e.examDay}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- closing */}
      <section className="border-t border-white/10 py-16 sm:py-20">
        <div className="container mx-auto max-w-[62ch] px-4 text-center">
          <h2 className="font-display text-3xl text-white sm:text-4xl">{copy.closingTitle}</h2>
          <p className="mt-4 text-white/65">{copy.closingBody}</p>
          <a
            href={heroWa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ location: "go-pro-closing", url: heroWa })}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0270B6] px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0286d8]"
          >
            <MessageCircle className="h-4 w-4" />
            {copy.ctaPrimary}
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GoProContent;
