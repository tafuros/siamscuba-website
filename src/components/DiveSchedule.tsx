import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sun, Sunset, Anchor, Clock, Ship, Camera, CheckCircle2, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format, addDays, startOfDay, isBefore } from "date-fns";

/* ── Sail Rock date generator ── */
const SAIL_ROCK_FIRST = new Date("2025-03-15"); // first departure

function getUpcomingSailRockDates(count: number): Date[] {
  const today = startOfDay(new Date());
  const dates: Date[] = [];
  // find the next occurrence on or after today
  let d = new Date(SAIL_ROCK_FIRST);
  while (isBefore(d, today)) {
    d = addDays(d, 3);
  }
  for (let i = 0; i < count; i++) {
    dates.push(new Date(d));
    d = addDays(d, 3);
  }
  return dates;
}

/* ── Schedule row component ── */
interface TimelineStep {
  time: string;
  label: string;
}

const TimelineRow = ({ steps }: { steps: TimelineStep[] }) => (
  <div className="relative flex flex-col gap-0">
    {steps.map((step, i) => (
      <div key={i} className="flex items-start gap-3 pb-3 last:pb-0">
        {/* dot + line */}
        <div className="flex flex-col items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0" />
          {i < steps.length - 1 && (
            <div className="w-px flex-1 bg-border min-h-[18px]" />
          )}
        </div>
        <div className="flex items-baseline gap-2 text-sm leading-snug">
          <span className="font-semibold text-foreground whitespace-nowrap w-14">{step.time}</span>
          <span className="text-muted-foreground">{step.label}</span>
        </div>
      </div>
    ))}
  </div>
);

/* ── Included items ── */
const IncludedItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
    <span>{text}</span>
  </div>
);

/* ── Main component ── */
const DiveSchedule = () => {
  const sailRockDates = useMemo(() => getUpcomingSailRockDates(4), []);

  const morningSchedule: TimelineStep[] = [
    { time: "06:20", label: "Meet at the dive center" },
    { time: "07:30", label: "1st dive – deep site (Chumphon / SW Pinnacle)" },
    { time: "09:00", label: "Sail to 2nd dive site" },
    { time: "09:30", label: "2nd dive – reef around Koh Tao" },
    { time: "11:30", label: "Return to dive center" },
  ];

  const afternoonSchedule: TimelineStep[] = [
    { time: "11:30", label: "Meet at the dive center" },
    { time: "12:30", label: "1st dive – reef site" },
    { time: "14:00", label: "Sail to 2nd dive site" },
    { time: "14:30", label: "2nd dive – reef around Koh Tao" },
    { time: "16:00", label: "Return to dive center" },
  ];

  const sailRockSchedule: TimelineStep[] = [
    { time: "07:30", label: "Meet at dive center, prep gear" },
    { time: "08:30", label: "Breakfast on the boat" },
    { time: "09:30", label: "1st dive – Sail Rock" },
    { time: "10:30", label: "Surface interval" },
    { time: "11:00", label: "2nd dive – Sail Rock" },
    { time: "12:00", label: "Lunch on the boat" },
    { time: "13:30", label: "3rd dive – Shark Island" },
    { time: "15:30", label: "Depart back to Koh Tao" },
  ];

  const funDiveIncludes = [
    "2 guided dives with a professional instructor",
    "Full diving equipment",
    "Full air tank (180–200 bar)",
    "Fresh pineapple on the boat 🍍",
    "Dive insurance",
    "Option to add photography",
  ];

  const sailRockIncludes = [
    "3 dives (2× Sail Rock + Shark Island)",
    "Full diving equipment",
    "Breakfast & Thai lunch buffet",
    "Coffee, tea & cookies ☕",
    "Fresh fruits 🍍",
    "Dive insurance",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Morning Dives ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-border bg-card p-6 flex flex-col"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-sand flex items-center justify-center">
            <Sun className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Morning Dives</h3>
            <p className="text-xs text-muted-foreground">Daily departures</p>
          </div>
        </div>

        <TimelineRow steps={morningSchedule} />

        <div className="border-t border-border mt-5 pt-4 flex flex-col gap-2">
          {funDiveIncludes.map((item) => (
            <IncludedItem key={item} text={item} />
          ))}
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground font-display">฿1,800</span>
            <span className="text-sm text-muted-foreground ml-1">/ person</span>
          </div>
          <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-6">
            <Link to="/fun-dive-booking">Book Now</Link>
          </Button>
        </div>
      </motion.div>

      {/* ── Afternoon Dives ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6 flex flex-col"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-sand flex items-center justify-center">
            <Sunset className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Afternoon Dives</h3>
            <p className="text-xs text-muted-foreground">Daily departures</p>
          </div>
        </div>

        <TimelineRow steps={afternoonSchedule} />

        <div className="border-t border-border mt-5 pt-4 flex flex-col gap-2">
          {funDiveIncludes.map((item) => (
            <IncludedItem key={item} text={item} />
          ))}
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground font-display">฿1,800</span>
            <span className="text-sm text-muted-foreground ml-1">/ person</span>
          </div>
          <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-6">
            <Link to="/fun-dive-booking">Book Now</Link>
          </Button>
        </div>
      </motion.div>

      {/* ── Sail Rock ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border-2 border-primary/30 bg-gradient-to-b from-primary/5 to-card p-6 flex flex-col relative overflow-hidden"
      >
        {/* crown badge */}
        <div className="absolute top-3 right-3 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
          ⭐ Flagship
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
            <Anchor className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Sail Rock</h3>
            <p className="text-xs text-muted-foreground">Full-day trip · Every 3 days</p>
          </div>
        </div>

        {/* Upcoming dates */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <CalendarIcon className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">Next trips:</span>
          {sailRockDates.map((d) => (
            <span
              key={d.toISOString()}
              className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full"
            >
              {format(d, "MMM d")}
            </span>
          ))}
        </div>

        <TimelineRow steps={sailRockSchedule} />

        <div className="border-t border-border mt-5 pt-4 flex flex-col gap-2">
          {sailRockIncludes.map((item) => (
            <IncludedItem key={item} text={item} />
          ))}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Camera className="h-4 w-4 text-primary shrink-0" />
            <span>Photo package available +฿500</span>
          </div>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground font-display">฿3,800</span>
            <span className="text-sm text-muted-foreground ml-1">/ person</span>
          </div>
          <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-6">
            <Link to="/fun-dive-booking">Book Now</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DiveSchedule;
