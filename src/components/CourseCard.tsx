import { Award, Info, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/spotlight-card";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const CourseCard = ({ course, t, setSelectedCourse }: { course: any; t: (key: any) => string; setSelectedCourse: (key: string) => void }) => {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/?course=${encodeURIComponent(course.dialogKey)}`;
    const text = `${course.title}${course.price ? ` — ฿${course.price} THB` : ""}\n${course.duration}\n${course.highlights.join("\n")}\n\nSiam Scuba — Koh Tao`;
    if (navigator.share) {
      try {
        await navigator.share({ title: course.title, text, url: shareUrl });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
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
                <span className="text-xl font-bold text-foreground">฿{course.price}</span>
                <span className="text-xs text-muted-foreground">THB</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-primary">{t("courses_get_price")}</span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mb-2">{course.duration}</p>
          <ul className="space-y-1 mb-3 flex-1">
            {course.highlights.map((h: string) => (
              <li key={h} className="flex items-start gap-1.5 text-xs text-foreground/80">
                <Award className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
          <div className="space-y-1.5">
            {course.hasDetails && (
              <Button variant="ghost" size="sm" className="rounded-full w-full text-primary hover:text-primary/80 h-8 text-xs" onClick={() => setSelectedCourse(course.dialogKey)}>
                <Info className="h-3.5 w-3.5 mr-1" />
                {t("courses_more_details")}
              </Button>
            )}
            <div className="flex gap-1.5">
              <Button asChild variant={course.featured ? "default" : "outline"} size="sm" className="rounded-full flex-1 h-8 text-xs">
                <Link to="/fun-dive-booking">
                  {course.price ? t("courses_book_now") : t("courses_get_price")}
                </Link>
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
