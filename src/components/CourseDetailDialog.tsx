import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, Gift, AlertCircle, MessageCircle, Fish, Anchor, XCircle, Backpack, CreditCard, GraduationCap, type LucideIcon } from "lucide-react";
import BookingLink from "@/components/BookingLink";
import { useLanguage } from "@/i18n/LanguageContext";
import { languageFlags, languageNames, type Language } from "@/i18n/translations";
import { courseDetails } from "@/i18n/courseDetails";
import IdcLinkText from "@/components/IdcLinkText";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

const IDC_KEY = "IDC (Instructor Course)";

const switcherLangs: Language[] = ["en", "he", "es", "fr"];

interface CourseDetailDialogProps {
  courseTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Swap the dialog to another course in place (used by the IDC links). */
  onSwitchCourse?: (courseTitle: string) => void;
}

const CourseDetailDialog = ({ courseTitle, open, onOpenChange, onSwitchCourse }: CourseDetailDialogProps) => {
  const { language, setLanguage, t } = useLanguage();

  // Fall back to English if a course hasn't been translated into the active language.
  const detail = courseDetails[language]?.[courseTitle] || courseDetails.en[courseTitle];
  if (!detail) return null;

  // Every "IDC" in the copy becomes a highlighted button that swaps this
  // dialog to the IDC detail. Not inside the IDC dialog itself.
  const rich = (text: string): ReactNode =>
    !onSwitchCourse || courseTitle === IDC_KEY ? (
      text
    ) : (
      <IdcLinkText
        text={text}
        renderLink={(label, key) => (
          <button
            key={key}
            type="button"
            onClick={() => onSwitchCourse(IDC_KEY)}
            className="font-bold text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            {label}
          </button>
        )}
      />
    );

  // Price line: "11,000 THB (or 16,000 THB including EFR)" -> big "฿11,000"
  // plus a small note. Non-numeric prices ("Contact us") render as-is.
  const priceMatch = detail.price.match(/^([\d,]+)\s*THB\s*(.*)$/);
  const priceMain = priceMatch ? `฿${priceMatch[1]}` : detail.price;
  const priceNote = priceMatch ? priceMatch[2].replace(/^\((.*)\)$/, "$1").trim() : "";

  const dot = (tone = "bg-primary") => (
    <span className={`mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full ${tone}`} aria-hidden="true" />
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={[
          "w-[calc(100%-1.5rem)] max-w-lg max-h-[90dvh] gap-0 overflow-hidden rounded-[28px] border-0 p-0 shadow-2xl sm:rounded-[28px]",
          // The shadcn close X becomes a round frosted button over the hero.
          "[&>button:last-child]:right-3.5 [&>button:last-child]:top-3.5 [&>button:last-child]:flex [&>button:last-child]:h-9 [&>button:last-child]:w-9 [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-full [&>button:last-child]:bg-white/15 [&>button:last-child]:text-white [&>button:last-child]:opacity-100 [&>button:last-child]:backdrop-blur-md [&>button:last-child:hover]:bg-white/25",
        ].join(" ")}
      >
        {/* Native scroll container (not Radix ScrollArea): on iOS Safari the
            custom ScrollArea viewport fights text-selection auto-scroll and the
            dialog gets shoved off-screen and stuck. dvh keeps the height within
            the *visible* viewport (vh ignores the iOS toolbar), and
            overscroll-contain stops the scroll from chaining to the page. */}
        <div className="max-h-[90dvh] overflow-y-auto overscroll-contain">
          {/* ── Hero ── */}
          <div className="relative overflow-hidden bg-gradient-to-br from-ocean-deep via-ocean-deep to-primary px-6 pb-7 pt-4 text-white">
            <div className="pointer-events-none absolute -end-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -start-10 h-48 w-48 rounded-full bg-primary/40 blur-3xl" aria-hidden="true" />

            {/* In-modal language toggle. pr-12 (physical) keeps it clear of the
                close button, which sits top-right in every language. */}
            <div className="relative pr-12">
              <div className="inline-flex rounded-full bg-white/10 p-1 backdrop-blur-md">
                {switcherLangs.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    aria-label={languageNames[lang]}
                    title={languageNames[lang]}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide transition-colors ${
                      lang === language ? "bg-white text-ocean-deep shadow-sm" : "text-white/75 hover:text-white"
                    }`}
                  >
                    <span>{languageFlags[lang]}</span>
                    <span>{lang}</span>
                  </button>
                ))}
              </div>
            </div>

            <DialogHeader className="relative mt-6 space-y-0 text-start sm:text-start">
              <DialogTitle className="font-display text-2xl leading-tight text-white md:text-[28px]">
                {detail.header}
              </DialogTitle>
              <DialogDescription className="mt-2.5 text-sm leading-relaxed text-white/80">
                {rich(detail.intro)}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* ── Body ── */}
          <div className="relative -mt-3 space-y-3 rounded-t-[24px] bg-background p-4 sm:p-5">
            {/* Meet your instructor (IDC: Bob) - photo floats beside the bio so the
                text wraps around it; float-start keeps it RTL-aware. */}
            {detail.instructor && (
              <Section icon={GraduationCap} title={detail.instructor.title}>
                <div className="text-sm leading-relaxed text-foreground/80">
                  <img
                    src={detail.instructor.photo}
                    alt={detail.instructor.photoAlt}
                    width={608}
                    height={1080}
                    loading="lazy"
                    className="float-start me-4 mb-1.5 aspect-[3/4] w-28 rounded-2xl object-cover sm:w-32"
                  />
                  <p className="font-semibold text-foreground">
                    {detail.instructor.name}
                    <span className="block text-[11px] font-semibold uppercase tracking-wide text-primary">
                      {detail.instructor.role}
                    </span>
                  </p>
                  {detail.instructor.paragraphs.map((p) => (
                    <p key={p} className="mt-2.5">{p}</p>
                  ))}
                  <div className="clear-both" />
                </div>
              </Section>
            )}

            {/* Photo strip - horizontal snap scroll, bleeds to the dialog edges */}
            {detail.gallery && (
              <div className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain px-4 pb-1 sm:-mx-5 sm:px-5">
                {detail.gallery.map((photo) => (
                  <img
                    key={photo.src}
                    src={photo.src}
                    alt={photo.alt}
                    width={608}
                    height={1080}
                    loading="lazy"
                    className="h-52 w-auto shrink-0 snap-start rounded-2xl object-cover"
                  />
                ))}
              </div>
            )}

            {/* Top Highlights (Sail Rock) */}
            {detail.highlights && (
              <Section icon={Anchor} title={t("cd_top_highlights")}>
                <div className="space-y-2.5">
                  {detail.highlights.map((h) => (
                    <div key={h.name} className="text-sm">
                      <span className="font-semibold text-foreground">{h.name}</span>
                      <span className="block text-foreground/75">{h.description}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Trip Details (Sail Rock) */}
            {detail.tripDetails && (
              <Section icon={Clock} title={t("cd_trip_details")}>
                <ul className="space-y-1.5">
                  {detail.tripDetails.map((tripItem) => (
                    <li key={tripItem} className="flex items-start gap-2 text-sm text-foreground/80">
                      {dot()} {tripItem}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Schedule */}
            {detail.schedule && (
              <Section icon={Clock} title={t("cd_your_day")}>
                <div className="space-y-2">
                  {detail.schedule.map((s) => (
                    <div key={s.time} className="flex gap-3 text-sm">
                      <span className="min-w-[56px] shrink-0 rounded-full bg-background px-2 py-0.5 text-center text-xs font-bold text-primary shadow-sm">{s.time}</span>
                      <span className="text-foreground/80">{rich(s.description)}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Itinerary */}
            {detail.itinerary && (
              <Section icon={Clock} title={t("cd_course_plan")}>
                <div className="space-y-2">
                  {detail.itinerary.map((d) => (
                    <div key={d.day} className="flex gap-3 text-sm">
                      <span className="min-w-[56px] shrink-0 rounded-full bg-background px-2 py-0.5 text-center text-xs font-bold text-primary shadow-sm">{d.day}</span>
                      <span className="text-foreground/80">{d.description}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Adventure Dives */}
            {detail.dives && (
              <Section icon={Fish} title={t("cd_specialty_dives")}>
                <div className="space-y-2.5">
                  {detail.dives.map((d) => (
                    <div key={d.name} className="text-sm">
                      <span className="font-semibold text-foreground">{d.name}</span>
                      <span className="block text-foreground/75">{d.description}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* What You'll Learn */}
            {detail.learns && (
              <Section icon={CheckCircle2} title={t("cd_skills")}>
                <ul className="space-y-1.5">
                  {detail.learns.map((l) => (
                    <li key={l} className="flex items-start gap-2 text-sm text-foreground/80">
                      {dot()} {rich(l)}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Numbered list with its own heading (Rescue's 10 exercises) */}
            {detail.exercises && (
              <Section icon={CheckCircle2} title={detail.exercises.title}>
                <ol className="space-y-2">
                  {detail.exercises.items.map((item, i) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold tabular-nums text-primary-foreground" aria-hidden="true">
                        {i + 1}
                      </span>
                      {rich(item)}
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {/* Course Structure */}
            {detail.structure && (
              <Section icon={Clock} title={t("cd_structure")}>
                <ul className="space-y-1.5">
                  {detail.structure.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-foreground/80">
                      {dot()} {rich(s)}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* What's Included */}
            {detail.included && (
              <Section icon={CheckCircle2} title={t("cd_included")}>
                <ul className="space-y-1.5">
                  {detail.included.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                      {dot()} {rich(item)}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Not Included */}
            {detail.notIncluded && (
              <Section icon={XCircle} title={t("cd_not_included")} iconClass="text-destructive">
                <ul className="space-y-1.5">
                  {detail.notIncluded.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                      {dot("bg-destructive")} {rich(item)}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* What to Bring */}
            {detail.whatToBring && (
              <Section icon={Backpack} title={t("cd_what_to_bring")}>
                <ul className="space-y-1.5">
                  {detail.whatToBring.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                      {dot()} {rich(item)}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Prerequisites - short items read best as chips */}
            {detail.prerequisites && (
              <Section icon={AlertCircle} title={t("cd_requirements")} iconClass="text-accent">
                <ul className="flex flex-wrap gap-2">
                  {detail.prerequisites.map((p) => (
                    <li key={p} className="rounded-2xl bg-background px-3 py-1.5 text-[13px] font-medium leading-snug text-foreground/85 shadow-sm">
                      {rich(p)}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Perks */}
            {detail.perks && (
              <div className="flex flex-wrap gap-2">
                {detail.perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-2 text-sm">
                    <Gift className="h-4 w-4 shrink-0 text-accent" />
                    <span className="font-semibold text-foreground">{perk}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Payment & Terms */}
            {detail.payment && (
              <Section icon={CreditCard} title={t("cd_payment")}>
                <ul className="space-y-1.5">
                  {detail.payment.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                      {dot()} {rich(item)}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Extras */}
            {detail.extras?.map((e) => (
              <p key={e} className="px-1 text-sm font-semibold italic text-accent">{rich(e)}</p>
            ))}

            {/* Special Offer */}
            {detail.specialOffer && (
              <div className="rounded-2xl bg-accent/10 p-4 text-sm font-medium text-foreground">
                🎉 {detail.specialOffer}
              </div>
            )}

            {/* Next Step */}
            {detail.nextStep && (
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-sm font-medium leading-relaxed text-foreground">
                {rich(detail.nextStep)}
              </div>
            )}

            {/* The course's own landing page, when it has one (Divemaster) */}
            {detail.pageLink && (
              <Button asChild variant="outline" className="w-full rounded-full" size="lg">
                <Link to={detail.pageLink.href}>{detail.pageLink.label}</Link>
              </Button>
            )}
          </div>

          {/* ── Sticky price + CTA: always one tap from booking ── */}
          <div className="sticky bottom-0 z-10 flex items-center gap-3 border-t border-border/60 bg-background/90 px-4 py-3 backdrop-blur-md sm:px-5">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{t("cd_price")}</p>
              <p className={`font-bold leading-tight text-foreground ${priceMatch ? "text-lg" : "text-sm"}`}>{priceMain}</p>
              {priceNote && <p className="text-[11px] leading-snug text-muted-foreground">{priceNote}</p>}
            </div>
            <Button asChild className="shrink-0 rounded-full px-6" size="lg">
              <BookingLink to="/fun-dive-booking" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {t("nav_book_now")}
              </BookingLink>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/** One soft rounded tile per section: icon chip + title, then content. */
const Section = ({
  icon: Icon,
  title,
  iconClass = "text-primary",
  children,
}: {
  icon: LucideIcon;
  title: ReactNode;
  iconClass?: string;
  children: ReactNode;
}) => (
  <section className="rounded-2xl bg-secondary/40 p-4">
    <h4 className="mb-3 flex items-center gap-2.5 font-display text-[15px] font-semibold text-foreground">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background shadow-sm">
        <Icon className={`h-4 w-4 ${iconClass}`} />
      </span>
      {title}
    </h4>
    {children}
  </section>
);

export default CourseDetailDialog;
