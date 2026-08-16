import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { GO_PRO_COPY, IE_SCHEDULE, formatExamDate, goProPath, monthName } from "@/data/goPro";
import PadiStars from "./PadiStars";
import { useNextExam } from "./useNextExam";

/**
 * The homepage Go Pro card - sits between the hero and the courses section.
 *
 * It is a CONTAINED, rounded card rather than a full-bleed dark band (Ben,
 * 2026-08-16: the band "cut the page crudely"). Floating a black card on the
 * light background is also the better metaphor: it reads as the premium item
 * on the page instead of a structural divider slicing it in half.
 *
 * Palette sampled from the authorized PADI 5 Star IDC artwork - see gate.css.
 */
const GoProBanner = () => {
  const { language } = useLanguage();
  const copy = GO_PRO_COPY[language];
  const { status, exam: next } = useNextExam();
  const rtl = language === "he";
  // Only "resolved with nothing left" means the season is over. Pending is a
  // different state and must not print that message - see useNextExam.
  const seasonOver = status === "resolved" && next === null;

  // Four rows on desktop, two on mobile - a phone does not need the whole
  // season to believe the schedule is real, and a tall list here would push the
  // courses below the fold. Anchored on the next exam so it is never a list of
  // months already gone.
  const startIndex = next ? IE_SCHEDULE.findIndex((e) => e.month === next.entry.month) : 0;
  const from = Math.max(0, startIndex);
  const rows = IE_SCHEDULE.slice(from, from + 4);

  return (
    <section id="go-pro" dir={rtl ? "rtl" : "ltr"} className="bg-background px-4 py-10 sm:py-14">
      <div
        className="container mx-auto max-w-6xl overflow-hidden rounded-[26px] border border-[#419EBC]/25 bg-[#04090f] p-6 shadow-[0_30px_80px_-40px_rgba(4,20,45,0.75)] sm:rounded-[34px] sm:p-10 lg:p-12"
        style={{
          backgroundImage:
            "radial-gradient(680px 320px at 12% -10%, rgba(2,112,182,0.20), transparent 62%)",
        }}
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* ---------------------------------------------------------- copy */}
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <PadiStars />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#419EBC] sm:text-[11px] sm:tracking-[0.2em]">
                {copy.kicker}
              </span>
            </div>

            {/* Stable stem + an appended countdown once the client knows the
                date. The prerendered HTML carries no date, so it cannot go
                stale - see useNextExam. */}
            <h2 className="font-display text-[26px] leading-[1.15] text-white sm:text-4xl">
              {copy.nextIe}
              {next && <span className="text-[#A5C5D4]"> {copy.inDays(next.daysAway)}</span>}
            </h2>

            <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-white/60 sm:text-base">
              {copy.calendarSub}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                to={goProPath(language)}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#0270B6] px-7 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0286d8]"
              >
                {copy.ctaPrimary}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link
                to={goProPath(language)}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#419EBC]/40 px-7 text-sm font-semibold text-[#A5C5D4] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A5C5D4]/70"
              >
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>

          {/* ------------------------------------------------------ calendar */}
          <div className="overflow-hidden rounded-2xl border border-[#419EBC]/25 bg-black/40">
            <div className="flex items-center justify-between gap-3 border-b border-[#419EBC]/25 px-4 py-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#419EBC]">
                {copy.nextIe}
              </span>
              <span className="font-display text-base text-white sm:text-lg">
                {next ? formatExamDate(next.examDate, language) : "—"}
              </span>
            </div>

            {!seasonOver ? (
              <ul className="grid sm:grid-cols-2">
                {rows.map((e, i) => {
                  // No highlight until the client knows which one is next.
                  const isNext = next != null && e.month === next.entry.month;
                  return (
                    <li
                      key={e.month}
                      className={`flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-xs tabular-nums sm:py-2.5 ${
                        // Rows 3-4 are desktop-only: two is enough on a phone.
                        i > 1 ? "hidden sm:flex" : ""
                      } ${isNext ? "bg-[#0270B6]/16 text-[#A5C5D4]" : "text-white/55"}`}
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
