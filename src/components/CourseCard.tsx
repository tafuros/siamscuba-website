import type { ReactNode } from "react";
import { Award, Info, Share2, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/spotlight-card";
import { toast } from "sonner";
import BookingLink from "@/components/BookingLink";
import { COURSE_TO_SLUG } from "@/lib/courseSlugMap";
import Price from "@/components/Price";

/** Shape of a course entry as built in CoursesSection. */
export interface CourseCardData {
  icon: LucideIcon;
  title: string;
  dialogKey: string;
  subtitle?: string;
  /**
   * Price in Thai Baht, or null for the enquire-only courses (IDC, DPV,
   * Sidemount). A NUMBER since 2026-08-31 - it used to be the display string
   * "12,000", which could not be converted or locale-formatted.
   */
  price: number | null;
  duration: string;
  /**
   * Bullet lines. ReactNode, not string, since 2026-08-31: the Discover Scuba
   * bullet carries two prices and has to render them through <Price> so they
   * convert like the headline figure does. Everything else is still a string.
   */
  highlights: ReactNode[];
  featured?: boolean;
  hasDetails?: boolean;
}

const CourseCard = ({
  course,
  t,
  setSelectedCourse,
}: {
  course: CourseCardData;
  t: (key: string) => string;
  setSelectedCourse: (key: string) => void;
}) => {
  const handleShare = async () => {
    const slug = COURSE_TO_SLUG[course.dialogKey];
    const shareUrl = slug
      ? `${window.location.origin}/${slug}`
      : `${window.location.origin}/?course=${encodeURIComponent(course.dialogKey)}`;
    // Share the link only (no text blob) so messaging apps render a clickable
    // link with a rich preview instead of a wall of text.
    if (navigator.share) {
      try {
        await navigator.share({ title: `${course.title} - Siam Scuba`, url: shareUrl });
      } catch {
        // User dismissed the native share sheet - not an error.
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(t("share_copied"));
    }
  };

  return (
    <GlowCard glowColor="blue" customSize className="h-full !p-0 !gap-0 !grid-rows-[1fr] !shadow-none">
      <Card className={`relative overflow-hidden h-full border-0 shadow-none bg-transparent ${course.featured ? "ring-2 ring-primary" : ""}`}>
        {course.featured && (
          <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-bl-lg z-10">
            {t("courses_most_popular")}
          </div>
        )}
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-ocean-surface text-secondary-foreground shrink-0">
              <course.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-display text-base font-semibold text-foreground leading-tight truncate">{course.title}</h4>
              {course.subtitle && <p className="text-xs text-muted-foreground italic truncate">{course.subtitle}</p>}
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-0.5">
            {course.price ? (
              <>
                {/* course.price is a NUMBER of Baht (migrated from the old
                    "12,000" strings so it can be converted). Price renders the
                    Baht figure plus an indicative line when the visitor has
                    picked another currency - never instead of the Baht. */}
                <Price
                  thb={course.price}
                  className="text-xl font-bold text-foreground"
                  estimateClassName="block text-[11px] font-normal leading-tight text-muted-foreground"
                />
                <span className="text-xs text-muted-foreground self-start">THB</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-primary">{t("courses_get_price")}</span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mb-2">{course.duration}</p>
          <ul className="space-y-1 mb-3 sm:flex-1">
            {/* Index keys: the array is built fresh per render from a static
                literal and never reorders, and a ReactNode has no stable key of
                its own the way the old plain strings did. */}
            {course.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-foreground/80">
                <Award className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
          <div className="space-y-1.5 mt-auto">
            {course.hasDetails && (
              <Button variant="ghost" size="sm" className="rounded-full w-full text-primary hover:text-primary/80 h-8 text-xs" onClick={() => setSelectedCourse(course.dialogKey)}>
                <Info className="h-3.5 w-3.5 mr-1" />
                {t("courses_more_details")}
              </Button>
            )}
            <div className="flex gap-1.5">
              <Button asChild variant={course.featured ? "default" : "outline"} size="sm" className="rounded-full flex-1 h-8 text-xs">
                <BookingLink to="/fun-dive-booking">
                  {course.price ? t("courses_book_now") : t("courses_get_price")}
                </BookingLink>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full shrink-0 text-muted-foreground hover:text-primary h-8 w-8" onClick={handleShare} aria-label={t("share_button")}>
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </GlowCard>
  );
};

export default CourseCard;
