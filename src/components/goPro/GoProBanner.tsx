import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  GO_PRO_COPY,
  IE_SCHEDULE,
  formatExamDate,
  goProPath,
  monthName,
} from "@/data/goPro";
import PadiStars from "./PadiStars";
import { useNextExam } from "./useNextExam";

/**
 * The homepage Go Pro band - the approved direction's second surface.
 *
 * Deliberately the darkest thing on the homepage: it sits between bright
 * turquoise sections, and the contrast is the point. Palette sampled from the
 * PADI 5 Star IDC artwork (see gate.css for the full note).
 */
const GoProBanner = () => {
  const { language } = useLanguage();
  const copy = GO_PRO_COPY[language];
  const { status, exam: next } = useNextExam();
  const rtl = language === "he";
  // Only "resolved with nothing left" means the season is over. Pending is a
  // different state and must not print that message - see useNextExam.
  const seasonOver = status === "resolved" && next === null;

  // Four rows is all the band shows; the full season lives on /go-pro. Anchor
  // the window on the next exam so it is never a list of months already gone.
  const startIndex = next ? IE_SCHEDULE.findIndex((e) => e.month === next.entry.month) : 0;
  const rows = IE_SCHEDULE.slice(Math.max(0, startIndex), Math.max(0, startIndex) + 4);

  return (
    <section
      id="go-pro"
      dir={rtl ? "rtl" : "ltr"}
      className="relative overflow-hidden border-y border-[#419EBC]/35 bg-[#04090f] py-14 sm:py-20"
      style={{
        backgroundImage:
          "radial-gradient(760px 260px at 14% 0%, rgba(2,112,182,0.18), transparent 64%)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <PadiStars />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#419EBC]">
                {copy.kicker}
              </span>
            </div>

            {/* Stable stem + an appended countdown once the client knows the
                date. The prerendered HTML carries no date, so it cannot go
                stale - see useNextExam. */}
            <h2 className="font-display text-3xl leading-tight text-white sm:text-4xl">
              {copy.nextIe}
              {next && <span className="text-[#A5C5D4]"> {copy.inDays(next.daysAway)}</span>}
            </h2>

            <p className="mt-3 max-w-[46ch] text-white/65">{copy.calendarSub}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={goProPath(language)}
                className="inline-flex items-center gap-2 rounded-full bg-[#0270B6] px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0286d8]"
              >
                {copy.ctaPrimary}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link
                to={goProPath(language)}
                className="rounded-full border border-[#419EBC]/40 px-7 py-3 text-sm font-semibold text-[#A5C5D4] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A5C5D4]/70"
              >
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>

          {/* Exam calendar */}
          <div className="overflow-hidden rounded-xl border border-[#419EBC]/35 bg-black/40">
            <div className="flex items-center justify-between gap-3 border-b border-[#419EBC]/35 px-4 py-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#419EBC]">
                {copy.nextIe}
              </span>
              <span className="font-display text-lg text-white">
                {next ? formatExamDate(next.examDate, language) : "—"}
              </span>
            </div>

            {!seasonOver ? (
              <ul className="grid sm:grid-cols-2">
                {rows.map((e) => {
                  // No highlight until the client knows which one is next.
                  const isNext = next != null && e.month === next.entry.month;
                  return (
                    <li
                      key={e.month}
                      className={`flex items-center justify-between gap-3 border-t border-white/10 px-4 py-2.5 text-xs tabular-nums ${
                        isNext ? "bg-[#0270B6]/16 text-[#A5C5D4]" : "text-white/55"
                      }`}
                    >
                      <span>{monthName(e.month, language)}</span>
                      <span className={isNext ? "font-semibold text-white" : "text-white/75"}>
                        {copy.colIdc} {e.idcDay} · {copy.colExam} {e.examDay}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              /* Only after the last exam of the season. Never an invented date
                 for next year - see nextInstructorExam. */
              <p className="px-4 py-5 text-sm text-white/55">{copy.seasonOver}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoProBanner;
