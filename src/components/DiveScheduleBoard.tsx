import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock, Users, Waves, AlertCircle } from "lucide-react";
import { trackBookNowClick } from "@/utils/tracking";
import {
  weeklySchedule,
  trips,
  alsoEveryDay,
  diveSitePath,
  tripBookingPath,
  SCHEDULE_NOTES,
  type DaySlot,
  type ScheduleDay,
  type Trip,
} from "@/data/diveScheduleBoard";

/**
 * The weekly board. Two rules shape this component:
 *
 * 1. NO PORTAL. Every slot's detail panel is rendered into the normal DOM and
 *    merely hidden when inactive. A Radix Dialog would put this content in a
 *    portal that only exists after a click, so the prerenderer would emit a
 *    board with no dive-site names, times or prices in the HTML - which is the
 *    entire reason this section was rebuilt.
 *
 * 2. NO BUILD-TIME CLOCK IN THE FIRST RENDER. The default open slot is a fixed
 *    index, never "today". vite-react-ssg bakes the first render into static
 *    HTML, so deriving it from a Date would ship a stale day and mismatch on
 *    hydration. "Today" is applied in an effect, after mount.
 */

const slotKey = (dayKey: string, i: number) => `${dayKey}-${i}`;

function SiteName({ name, note }: { name: string; note?: string }) {
  const path = diveSitePath(name);
  const label = (
    <>
      {name}
      {note ? <span className="text-white/50"> · {note}</span> : null}
    </>
  );
  // Internal links only where a real page exists - check:links fails the build
  // on anything else, and a dead link here would be on every page view.
  return path ? (
    <Link to={path} className="underline decoration-white/25 underline-offset-2 hover:decoration-white">
      {label}
    </Link>
  ) : (
    <span>{label}</span>
  );
}

function SlotButton({
  day,
  slot,
  index,
  active,
  isToday,
  onSelect,
}: {
  day: ScheduleDay;
  slot: DaySlot;
  index: number;
  active: boolean;
  isToday: boolean;
  onSelect: () => void;
}) {
  const trip = trips[slot.tripId];
  const id = slotKey(day.key, index);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={active}
      aria-controls={`slot-panel-${id}`}
      className={[
        "group w-full rounded-xl border p-3 text-left transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b2444]",
        active
          ? "border-sky-300/70 bg-sky-400/25 shadow-[0_0_0_1px_rgba(125,211,252,0.35)]"
          : "border-white/10 bg-white/[0.07] hover:border-white/25 hover:bg-white/[0.12]",
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-sm font-bold text-white">{trip.name}</span>
        {isToday && (
          <span className="rounded-full bg-amber-300/90 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-amber-950">
            Today
          </span>
        )}
      </div>
      <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium tabular-nums text-sky-200/90">
        <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
        {trip.meet} - {trip.back}
      </div>
      <ul className="mt-2 space-y-0.5 text-[13px] leading-snug text-white/85">
        {slot.sites.map((s, i) => (
          <li key={`${s.name}-${i}`}>
            <SiteName name={s.name} note={s.note} />
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
        <span className="text-[11px] text-white/60">
          {trip.dives} {trip.dives === 1 ? "dive" : "dives"}
        </span>
        <span className="font-display text-sm font-bold tabular-nums text-white">
          ฿{trip.priceThb.toLocaleString("en-US")}
        </span>
      </div>
    </button>
  );
}

function BookButton({ trip, className = "" }: { trip: Trip; className?: string }) {
  const to = tripBookingPath(trip);
  return (
    <Link
      to={to}
      onClick={() => trackBookNowClick({ location: trip.trackingSlot, product: trip.productCode ?? "", url: to })}
      className={
        "inline-flex h-11 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#0b2444] transition-colors hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b2444] " +
        className
      }
    >
      Book this trip
    </Link>
  );
}

function SlotPanel({ day, slot, index, active }: { day: ScheduleDay; slot: DaySlot; index: number; active: boolean }) {
  const trip = trips[slot.tripId];
  const id = slotKey(day.key, index);
  return (
    <div id={`slot-panel-${id}`} hidden={!active} className="border-t border-white/10 pt-6">
      <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">{day.label}</p>
          <h3 className="font-display text-2xl font-bold text-white">{trip.name}</h3>
          <p className="mt-1 text-sm text-white/70">{trip.tagline}</p>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-white/50">Meet at the dive center</dt>
              <dd className="font-semibold tabular-nums text-white">{trip.meet}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-white/50">Back on the pier</dt>
              <dd className="font-semibold tabular-nums text-white">{trip.back}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-white/50">Dives</dt>
              <dd className="font-semibold text-white">{trip.dives}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-white/50">Level</dt>
              <dd className="font-semibold text-white">{trip.level}</dd>
            </div>
          </dl>

          <div className="mt-5">
            <p className="text-[11px] uppercase tracking-wide text-white/50">Dive sites this day</p>
            <p className="mt-1 text-sm text-white/85">
              {slot.sites.map((s, i) => (
                <span key={`${s.name}-${i}`}>
                  {i > 0 && <span className="text-white/40"> · </span>}
                  <SiteName name={s.name} note={s.note} />
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.06] p-5">
          <p className="text-[11px] uppercase tracking-wide text-white/50">What's included</p>
          <ul className="mt-3 space-y-2">
            {trip.includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-white/85">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {trip.minDivers && (
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-300/10 p-3 text-xs text-amber-100">
              <Users className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{SCHEDULE_NOTES.refund(trip.minDivers)}</span>
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p>
              <span className="font-display text-3xl font-bold tabular-nums text-white">
                ฿{trip.priceThb.toLocaleString("en-US")}
              </span>
              <span className="ml-1 text-sm text-white/60">/ person</span>
            </p>
            <BookButton trip={trip} />
          </div>
        </div>
      </div>
    </div>
  );
}

const DiveScheduleBoard = () => {
  // Fixed default so the SSG HTML and the hydrated client agree. See header note.
  const [selected, setSelected] = useState<string>(slotKey(weeklySchedule[0].key, 0));
  const [todayKey, setTodayKey] = useState<string | null>(null);

  useEffect(() => {
    // Runs after hydration only, so it can safely read the visitor's real clock.
    const names = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    setTodayKey(names[new Date().getDay()]);
  }, []);

  // The selected slot id is the single source of truth; the mobile day picker
  // reads its day back out of it rather than keeping a second piece of state
  // that could drift out of sync with the open panel.
  const activeDay =
    weeklySchedule.find((d) => selected.startsWith(`${d.key}-`)) ?? weeklySchedule[0];

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-b from-[#0f3163] to-[#071a33] p-4 shadow-2xl sm:p-6 lg:p-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-bold text-white sm:text-2xl">This week on the boat</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-sky-200/80">
            <Waves className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="lg:hidden">Pick a day, then tap a trip for times, sites, price and booking</span>
            <span className="hidden lg:inline">Tap any trip for times, dive sites, what's included and the price</span>
          </p>
        </div>
        <p className="text-xs text-white/50">{SCHEDULE_NOTES.season}</p>
      </div>

      {/* MOBILE: an explicit day picker, not a swipe strip.
          The first build put the week in a horizontally scrolling row. It read
          as a single column with dead space next to it - nothing told the
          visitor the other six days were off-screen, so nobody would swipe.
          Seven short labels fit across the narrowest phone as a 7-up grid, so
          the whole week is visible and tappable with no hidden gesture. */}
      <div className="lg:hidden">
        <div className="grid grid-cols-7 gap-1">
          {weeklySchedule.map((day) => {
            const isActiveDay = activeDay.key === day.key;
            return (
              <button
                key={day.key}
                type="button"
                onClick={() => setSelected(slotKey(day.key, 0))}
                aria-pressed={isActiveDay}
                className={[
                  "flex flex-col items-center rounded-lg px-0.5 py-2 text-[11px] font-bold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70",
                  isActiveDay
                    ? "bg-sky-400/90 text-[#06213f]"
                    : "bg-white/[0.07] text-white/70 hover:bg-white/[0.14]",
                ].join(" ")}
              >
                <span>{day.short}</span>
                <span
                  aria-hidden="true"
                  className={[
                    "mt-1 h-1 w-1 rounded-full",
                    todayKey === day.key ? (isActiveDay ? "bg-[#06213f]" : "bg-amber-300") : "bg-transparent",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-center font-display text-base font-bold text-white">
          {activeDay.label}
          {todayKey === activeDay.key && <span className="ml-1.5 text-amber-300">· Today</span>}
        </p>

        <div className="mt-2 flex flex-col gap-2">
          {activeDay.slots.map((slot, i) => (
            <SlotButton
              key={slotKey(activeDay.key, i)}
              day={activeDay}
              slot={slot}
              index={i}
              active={selected === slotKey(activeDay.key, i)}
              isToday={todayKey === activeDay.key}
              onSelect={() => setSelected(slotKey(activeDay.key, i))}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP: the whole week as seven real columns. */}
      <div className="hidden lg:grid lg:grid-cols-7 lg:gap-3">
        {weeklySchedule.map((day) => (
          <div key={day.key}>
            <p className="mb-2 text-center font-display text-sm font-bold text-white">
              {day.label}
              {todayKey === day.key && <span className="ml-1 text-amber-300" aria-label="today">•</span>}
            </p>
            <div className="flex flex-col gap-2">
              {day.slots.map((slot, i) => (
                <SlotButton
                  key={slotKey(day.key, i)}
                  day={day}
                  slot={slot}
                  index={i}
                  active={selected === slotKey(day.key, i)}
                  isToday={todayKey === day.key}
                  onSelect={() => setSelected(slotKey(day.key, i))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs text-white/50">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {SCHEDULE_NOTES.weather}
      </p>

      {/* Every panel is in the DOM; only the selected one is shown. */}
      <div className="mt-6">
        {weeklySchedule.map((day) =>
          day.slots.map((slot, i) => (
            <SlotPanel
              key={slotKey(day.key, i)}
              day={day}
              slot={slot}
              index={i}
              active={selected === slotKey(day.key, i)}
            />
          )),
        )}
      </div>

      {/* Trips that aren't tied to a weekday. */}
      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">Also every day</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {alsoEveryDay.map((id) => {
            const trip = trips[id];
            return (
              <div key={id} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-display text-sm font-bold text-white">{trip.name}</h4>
                  <span className="font-display text-sm font-bold tabular-nums text-white">
                    ฿{trip.priceThb.toLocaleString("en-US")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/60">{trip.tagline}</p>
                <p className="mt-2 flex items-center gap-1 text-[11px] tabular-nums text-sky-200/80">
                  <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {trip.meet} - {trip.back}
                </p>
                <ul className="mt-2 space-y-1">
                  {trip.includes.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-xs text-white/75">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-sky-300" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3">
                  <BookButton trip={trip} className="h-9 w-full px-4 text-xs" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DiveScheduleBoard;
