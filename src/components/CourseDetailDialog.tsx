import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, Gift, Tag, AlertCircle, MessageCircle, Fish, Anchor, XCircle, Backpack, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { languageFlags, languageNames, type Language } from "@/i18n/translations";
import { courseDetails } from "@/i18n/courseDetails";

const switcherLangs: Language[] = ["en", "he", "es", "fr"];

interface CourseDetailDialogProps {
  courseTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CourseDetailDialog = ({ courseTitle, open, onOpenChange }: CourseDetailDialogProps) => {
  const { language, setLanguage, t } = useLanguage();

  // Fall back to English if a course hasn't been translated into the active language.
  const detail = courseDetails[language]?.[courseTitle] || courseDetails.en[courseTitle];
  if (!detail) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90dvh] p-0 overflow-hidden">
        {/* Native scroll container (not Radix ScrollArea): on iOS Safari the
            custom ScrollArea viewport fights text-selection auto-scroll and the
            dialog gets shoved off-screen and stuck. dvh keeps the height within
            the *visible* viewport (vh ignores the iOS toolbar), and
            overscroll-contain stops the scroll from chaining to the page. */}
        <div className="max-h-[90dvh] overflow-y-auto overscroll-contain">
          <div className="p-6 space-y-6">
            {/* In-modal language toggle */}
            <div className="flex flex-wrap gap-1.5">
              {switcherLangs.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  aria-label={languageNames[lang]}
                  title={languageNames[lang]}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                    lang === language
                      ? "bg-primary/10 border-primary/40 text-foreground"
                      : "bg-secondary/40 border-transparent text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <span>{languageFlags[lang]}</span>
                  <span>{languageNames[lang]}</span>
                </button>
              ))}
            </div>

            <DialogHeader>
              <DialogTitle className="font-display text-xl md:text-2xl text-foreground leading-tight">
                {detail.header}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {detail.intro}
              </DialogDescription>
            </DialogHeader>

            {/* Top Highlights (Sail Rock) */}
            {detail.highlights && (
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <Anchor className="h-4 w-4 text-primary" /> {t("cd_top_highlights")}
                </h4>
                <div className="space-y-2">
                  {detail.highlights.map((h) => (
                    <div key={h.name} className="text-sm">
                      <span className="font-semibold text-foreground">{h.name}:</span>{" "}
                      <span className="text-foreground/80">{h.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trip Details (Sail Rock) */}
            {detail.tripDetails && (
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> {t("cd_trip_details")}
                </h4>
                <ul className="space-y-1.5">
                  {detail.tripDetails.map((tripItem) => (
                    <li key={tripItem} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-primary mt-1">•</span> {tripItem}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Schedule */}
            {detail.schedule && (
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> {t("cd_your_day")}
                </h4>
                <div className="space-y-2">
                  {detail.schedule.map((s) => (
                    <div key={s.time} className="flex gap-3 text-sm">
                      <span className="font-semibold text-primary min-w-[50px]">{s.time}</span>
                      <span className="text-foreground/80">{s.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {detail.itinerary && (
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> {t("cd_course_plan")}
                </h4>
                <div className="space-y-2">
                  {detail.itinerary.map((d) => (
                    <div key={d.day} className="flex gap-3 text-sm">
                      <span className="font-semibold text-primary min-w-[50px]">{d.day}</span>
                      <span className="text-foreground/80">{d.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Adventure Dives */}
            {detail.dives && (
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <Fish className="h-4 w-4 text-primary" /> {t("cd_specialty_dives")}
                </h4>
                <div className="space-y-2">
                  {detail.dives.map((d) => (
                    <div key={d.name} className="text-sm">
                      <span className="font-semibold text-foreground">{d.name}:</span>{" "}
                      <span className="text-foreground/80">{d.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What You'll Learn */}
            {detail.learns && (
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {t("cd_skills")}
                </h4>
                <ul className="space-y-1.5">
                  {detail.learns.map((l) => (
                    <li key={l} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-primary mt-1">•</span> {l}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Structure */}
            {detail.structure && (
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> {t("cd_structure")}
                </h4>
                <ul className="space-y-1.5">
                  {detail.structure.map((s) => (
                    <li key={s} className="text-sm text-foreground/80">{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* What's Included */}
            {detail.included && (
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {t("cd_included")}
                </h4>
                <ul className="space-y-1.5">
                  {detail.included.map((item) => (
                    <li key={item} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-primary mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Not Included */}
            {detail.notIncluded && (
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" /> {t("cd_not_included")}
                </h4>
                <ul className="space-y-1.5">
                  {detail.notIncluded.map((item) => (
                    <li key={item} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What to Bring */}
            {detail.whatToBring && (
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <Backpack className="h-4 w-4 text-primary" /> {t("cd_what_to_bring")}
                </h4>
                <ul className="space-y-1.5">
                  {detail.whatToBring.map((item) => (
                    <li key={item} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-primary mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prerequisites */}
            {detail.prerequisites && (
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-accent" /> {t("cd_requirements")}
                </h4>
                <ul className="space-y-1.5">
                  {detail.prerequisites.map((p) => (
                    <li key={p} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-accent mt-1">•</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Perks */}
            {detail.perks && (
              <div className="space-y-2">
                {detail.perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-2 bg-secondary/50 rounded-lg p-3 text-sm">
                    <Gift className="h-4 w-4 text-accent shrink-0" />
                    <span className="font-semibold text-foreground">{perk}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Payment & Terms */}
            {detail.payment && (
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" /> {t("cd_payment")}
                </h4>
                <ul className="space-y-1.5">
                  {detail.payment.map((item) => (
                    <li key={item} className="text-sm text-foreground/80 flex items-start gap-2">
                      <span className="text-primary mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price */}
            <div className="bg-primary/5 rounded-lg p-4 flex items-center gap-3">
              <Tag className="h-5 w-5 text-primary shrink-0" />
              {detail.price.match(/^\d/) ? (
                <>
                  <span className="text-lg font-bold text-foreground">{t("cd_price")}: ฿{detail.price.replace(" THB", "")}</span>
                  <span className="text-sm text-muted-foreground">THB</span>
                </>
              ) : (
                <span className="text-lg font-bold text-foreground">{detail.price}</span>
              )}
            </div>

            {/* Extras */}
            {detail.extras?.map((e) => (
              <p key={e} className="text-sm text-accent font-semibold italic">{e}</p>
            ))}

            {/* Special Offer */}
            {detail.specialOffer && (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-sm text-foreground font-medium">
                🎉 {detail.specialOffer}
              </div>
            )}

            {/* Next Step */}
            {detail.nextStep && (
              <div className="bg-secondary/30 border border-secondary rounded-lg p-3 text-sm text-foreground font-medium">
                ➕ {detail.nextStep}
              </div>
            )}

            {/* CTA */}
            <Button asChild className="w-full rounded-full" size="lg">
              <Link to="/fun-dive-booking" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {t("nav_book_now")}
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailDialog;
