import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Sun, Sunset, Moon } from "lucide-react";
import { startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, format, isToday, isTomorrow, startOfDay, isBefore } from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import FunDiveBookingForm from "@/components/FunDiveBookingForm";

type SlotType = "morning" | "afternoon" | "night";

interface SelectedSlot {
  date: string;
  slot: SlotType;
}

const SLOTS: { type: SlotType; label: string; time: string; icon: typeof Sun }[] = [
  { type: "morning", label: "Morning", time: "6:20", icon: Sun },
  { type: "afternoon", label: "Afternoon", time: "11:00", icon: Sunset },
  { type: "night", label: "Night", time: "17:30", icon: Moon },
];

const FunDiveCalendar = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState<SelectedSlot | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const today = useMemo(() => new Date(), []);

  const currentWeekStart = useMemo(
    () => startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 }),
    [today, weekOffset]
  );

  const days = useMemo(
    () => eachDayOfInterval({ start: currentWeekStart, end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }) }),
    [currentWeekStart]
  );

  const isAfterCutoff = today.getHours() >= 16;

  const isDayDisabled = (day: Date) => {
    if (isBefore(startOfDay(day), startOfDay(today))) return true;
    if (isToday(day)) return true;
    if (isTomorrow(day) && isAfterCutoff) return true;
    return false;
  };

  const canGoPrev = weekOffset > 0;

  const handleSelect = (dateStr: string, slot: SlotType) => {
    setSelected({ date: dateStr, slot });
    setDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setDialogOpen(false);
    setSelected(null);
  };

  const selectedSlotInfo = selected ? SLOTS.find((s) => s.type === selected.slot) : null;

  return (
    <div className="w-full">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setWeekOffset((o) => o - 1)}
          disabled={!canGoPrev}
          className="rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="font-display text-lg md:text-xl font-semibold text-foreground">
          {format(days[0], "MMM d")} – {format(days[6], "MMM d, yyyy")}
        </h3>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setWeekOffset((o) => o + 1)}
          className="rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Desktop: 7-column grid */}
      <div className="hidden md:grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const disabled = isDayDisabled(day);

          return (
            <div key={dateStr} className="flex flex-col gap-2">
              <div className={cn(
                "text-center py-2 rounded-lg font-display font-semibold text-sm",
                isToday(day) ? "bg-primary/10 text-primary" : "text-foreground"
              )}>
                <div className="text-xs text-muted-foreground font-body">{format(day, "EEE")}</div>
                <div>{format(day, "d")}</div>
              </div>

              {SLOTS.map(({ type, label, time, icon: Icon }) => {
                const isSelected = selected?.date === dateStr && selected?.slot === type;
                return (
                  <button
                    key={type}
                    disabled={disabled}
                    onClick={() => handleSelect(dateStr, type)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all text-xs",
                      disabled
                        ? "opacity-30 cursor-not-allowed bg-muted border-border"
                        : isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                          : "bg-card border-border hover:border-primary/50 hover:shadow-sm cursor-pointer"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-semibold">{label}</span>
                    <span className={cn("text-[10px]", isSelected ? "text-primary-foreground/80" : "text-muted-foreground")}>{time}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical stack */}
      <div className="md:hidden flex flex-col gap-3">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const disabled = isDayDisabled(day);

          return (
            <div key={dateStr} className={cn(
              "rounded-xl border p-3",
              disabled ? "opacity-40 bg-muted" : "bg-card"
            )}>
              <div className={cn(
                "font-display font-semibold text-sm mb-2",
                isToday(day) ? "text-primary" : "text-foreground"
              )}>
                {format(day, "EEEE, MMM d")}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SLOTS.map(({ type, label, time, icon: Icon }) => {
                  const isSelected = selected?.date === dateStr && selected?.slot === type;
                  return (
                    <button
                      key={type}
                      disabled={disabled}
                      onClick={() => handleSelect(dateStr, type)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-lg border transition-all text-xs",
                        disabled
                          ? "cursor-not-allowed"
                          : isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                            : "border-border hover:border-primary/50 cursor-pointer"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-semibold">{label}</span>
                      <span className={cn("text-[10px]", isSelected ? "text-primary-foreground/80" : "text-muted-foreground")}>{time}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setSelected(null); }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden p-6">
          {selected && selectedSlotInfo && (
            <FunDiveBookingForm
              date={selected.date}
              slotLabel={selectedSlotInfo.label}
              slotTime={selectedSlotInfo.time}
              onSuccess={handleFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FunDiveCalendar;
