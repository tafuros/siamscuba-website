import { Star } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Language } from "@/i18n/translations";
import { googleReviews } from "@/data/googleReviews";
import { REVIEW_STATS } from "@/data/reviewStats";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "March 2026" -> "מרץ 2026" / "marzo de 2026". Unknown shapes pass through. */
function localizeMonthYear(date: string, language: Language): string {
  const m = /^([A-Za-z]+) (\d{4})$/.exec(date);
  const month = m ? MONTHS.indexOf(m[1]) : -1;
  if (language === "en" || month < 0) return date;
  return new Intl.DateTimeFormat(language, { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(Number(m![2]), month, 15)),
  );
}

/**
 * Compact social proof for the trimmed homepage (Ben 2026-10-04, mockup D).
 *
 * Replaces the full TripAdvisor section, which sat at ~70% of the page where 7%
 * of mobile visitors ever arrived (Clarity, 30 days to 2026-10-02). Now it sits
 * right under the weekly board: two ratings and three short real reviews.
 */

const COPY: Record<Language, { title: string; reviews: string; read: string }> = {
  en: { title: "What divers say", reviews: "reviews", read: "Read the reviews" },
  he: { title: "מה צוללים אומרים", reviews: "ביקורות", read: "לכל הביקורות" },
  es: { title: "Lo que dicen los buceadores", reviews: "reseñas", read: "Leer las reseñas" },
  fr: { title: "Ce que disent les plongeurs", reviews: "avis", read: "Lire les avis" },
};

// Three short ones from the real Google reviews, chosen for the courses and
// fun dives they mention. English quotes read fine on every language.
const PICKS = ["Sipra K.", "Morganne V.", "Lea C."];

const Stars = () => (
  <span className="inline-flex gap-[2px] text-amber-400" aria-hidden="true">
    {[0, 1, 2, 3, 4].map((i) => (
      <Star key={i} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
    ))}
  </span>
);

const ReviewsStrip = () => {
  const { language, isRTL } = useLanguage();
  const copy = COPY[language] ?? COPY.en;
  const quotes = PICKS.map((n) => googleReviews.find((r) => r.name === n)).filter(Boolean);
  const nf = new Intl.NumberFormat(language === "he" ? "he-IL" : language);

  return (
    <section aria-label={copy.title} className="bg-ocean-surface px-4 py-10 md:py-14">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <h2 className={`${isRTL ? "font-bold" : "font-display font-bold"} me-2 text-2xl text-foreground`}>
            {copy.title}
          </h2>
          {(
            [
              ["Google", REVIEW_STATS.google],
              ["Tripadvisor", REVIEW_STATS.tripadvisor],
            ] as const
          ).map(([name, stat]) => (
            <a
              key={name}
              href={stat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm shadow-sm transition-colors hover:border-primary/40"
            >
              <Stars />
              <b className="tabular-nums text-foreground">{stat.rating.toFixed(1)}</b>
              <span className="text-muted-foreground">
                {name} · {nf.format(stat.count)} {copy.reviews}
              </span>
            </a>
          ))}
        </div>

        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {quotes.map((r) => (
            <li key={r!.name} className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm" dir="ltr">
              <Stars />
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">“{r!.text}”</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {r!.name} · {r!.country} · Google · {localizeMonthYear(r!.date, language)}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-center text-sm">
          <a
            href={REVIEW_STATS.tripadvisor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            {copy.read}
          </a>
        </p>
      </div>
    </section>
  );
};

export default ReviewsStrip;
