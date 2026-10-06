import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BookingLink from "@/components/BookingLink";
import { CheckCircle2, Clock, Users, Waves, AlertCircle } from "lucide-react";
import { trackBookNowClick } from "@/utils/tracking";
import Price from "@/components/Price";
import { useLanguage } from "@/i18n/LanguageContext";
import { BOARD_UI, localizedTrips, plainTripName } from "@/data/diveScheduleBoardI18n";
import {
  weeklySchedule,
  trips as enTrips,
  alsoEveryDay,
  diveSitePath,
  tripBookingPath,
  nextDateFor,
  type DiveLeg,
  type ScheduleDay,
  type TripSite,
  type Trip,
  type TripId,
} from "@/data/diveScheduleBoard";

/**
 * The weekly board. Three rules shape this component:
 *
 * 1. NO PORTAL. Every detail panel is rendered into the normal DOM and merely
 *    hidden when inactive. A Radix Dialog would put this content in a portal
 *    that only exists after a click, so the prerenderer would emit a board with
 *    no dive-site names, times or prices in the HTML - which is the entire
 *    reason this section was rebuilt.
 *
 * 2. NO BUILD-TIME CLOCK IN THE FIRST RENDER. The default open slot is a fixed
 *    index, never "today". vite-react-ssg bakes the first render into static
 *    HTML, so deriving it from a Date would ship a stale day and mismatch on
 *    hydration. "Today" is applied in an effect, after mount.
 *
 * 3. ONE PANEL PER TRIP, NOT PER DAY-SLOT. Since 2026-09-10 the same two trips
 *    run every day, so a panel per day-slot would emit the identical block of
 *    prose fifteen times into the static HTML. Panels are keyed by trip; the
 *    weekday shown in the panel's eyebrow follows the selection.
 */

const slotKey = (dayKey: string, i: number) => `${dayKey}-${i}`;

/**
 * The board's words in the visitor's language (2026-10-06). Facts come from
 * diveScheduleBoard.ts; diveScheduleBoardI18n.ts swaps only the text. A
 * context instead of threading `trips` + `ui` through every sub-component.
 */
const BoardCtx = createContext({ trips: enTrips, ui: BOARD_UI.en });
const useBoard = () => useContext(BoardCtx);

/** Renders `{word}` in a trip name as a small, muted "(word)". */
const TripName = ({ name }: { name: string }) => (
  <>
    {name.split(/(\{[^}]+\})/).map((part, i) =>
      part.startsWith("{") ? (
        <span key={i} className="text-[0.75em] font-medium text-white/60">({part.slice(1, -1)})</span>
      ) : (
        part
      ),
    )}
  </>
);

/** Clock times are LTR in every language - "05:50 - 11:00" must not flip under rtl. */
const Times = ({ meet, back }: { meet: string; back: string }) => (
  <span dir="ltr">{meet} - {back}</span>
);

function SiteName({ name, note: rawNote }: { name: string; note?: string }) {
  const { ui } = useBoard();
  const note = rawNote === "wreck" ? ui.wreck : rawNote;
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

/** "Chumphon Pinnacle / Southwest Pinnacle / Shark Island - whichever ..." */
function DiveLegLine({ leg }: { leg: DiveLeg }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2 text-sm text-white/85">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-sky-300">{leg.label}</span>
      <span>
        {leg.sites?.map((s, i) => (
          <span key={`${s.name}-${i}`}>
            {i > 0 && <span className="text-white/40"> / </span>}
            <SiteName name={s.name} note={s.note} />
          </span>
        ))}
        {leg.sites?.length && leg.freeText ? <span className="text-white/50"> - {leg.freeText}</span> : null}
        {!leg.sites?.length && leg.freeText ? <span className="text-white/70">{leg.freeText}</span> : null}
      </span>
    </li>
  );
}

/**
 * "Sail Rock, Sail Rock, Shark Island" reads as a mistake on a card. Two dives
 * at the same site collapse to "Sail Rock ×2" while the data stays one entry
 * per dive, which is what the detail panel and the JSON-LD need.
 */
function collapseRepeats(sites: TripSite[]): { site: TripSite; count: number }[] {
  const out: { site: TripSite; count: number }[] = [];
  for (const site of sites) {
    const last = out[out.length - 1];
    if (last && last.site.name === site.name) last.count += 1;
    else out.push({ site, count: 1 });
  }
  return out;
}

function SlotButton({
  tripId,
  active,
  isToday,
  onSelect,
  panelId,
}: {
  tripId: TripId;
  active: boolean;
  isToday: boolean;
  onSelect: () => void;
  panelId: string;
}) {
  const { trips, ui } = useBoard();
  const trip = trips[tripId];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={active}
      aria-controls={panelId}
      className={[
        "group w-full rounded-xl border p-3 text-start transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b2444]",
        active
          ? "border-sky-300/70 bg-sky-400/25 shadow-[0_0_0_1px_rgba(125,211,252,0.35)]"
          : trip.flagship
            ? "border-amber-300/40 bg-amber-300/[0.10] hover:border-amber-300/60 hover:bg-amber-300/[0.16]"
            : "border-white/10 bg-white/[0.07] hover:border-white/25 hover:bg-white/[0.12]",
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-sm font-bold text-white"><TripName name={trip.name} /></span>
        {isToday && (
          <span className="rounded-full bg-amber-300/90 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-amber-950">
            {ui.today}
          </span>
        )}
      </div>
      <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium tabular-nums text-sky-200/90">
        <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
        <Times meet={trip.meet} back={trip.back} />
      </div>
      {trip.boardSites.length > 0 && (
        <p className="mt-2 text-[12px] leading-snug text-white/85">
          {collapseRepeats(trip.boardSites).map(({ site, count }, i) => (
            <span key={`${site.name}-${i}`}>
              {i > 0 && <span className="text-white/40"> · </span>}
              <SiteName name={site.name} note={site.note} />
              {count > 1 && <span className="text-white/60"> ×{count}</span>}
            </span>
          ))}
          {trip.boardMore && <span className="block text-white/55">{trip.boardMore}</span>}
        </p>
      )}
      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
        <span className="text-[11px] text-white/60">
          {trip.dives} {trip.dives === 1 ? ui.dive : ui.dives}
        </span>
        <span className="font-display text-sm font-bold tabular-nums text-white">
          <Price thb={trip.priceThb} estimate="inline" />
        </span>
      </div>
      {trip.footnote && <p className="mt-1.5 text-[10px] leading-snug text-white/50">{trip.footnote}</p>}
    </button>
  );
}

function BookButton({ trip, className = "" }: { trip: Trip; className?: string }) {
  const { ui } = useBoard();
  const to = tripBookingPath(trip);
  return (
    <BookingLink
      to={to}
      onClick={() => trackBookNowClick({ location: trip.trackingSlot, product: trip.productCode ?? "", url: to })}
      className={
        "inline-flex h-11 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#0b2444] transition-colors hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b2444] " +
        className
      }
    >
      {ui.bookTrip}
    </BookingLink>
  );
}

/**
 * Direct booking for the day being looked at (Ben 2026-10-02). Clarity: 108 taps
 * on the weekday buttons but 1 on "Book this trip", which sat inside a panel
 * that only opened after a second tap. This books the selected trip on the next
 * date of that weekday, with both preselected in the wizard.
 */
function BookDayButton({ trip, day }: { trip: Trip; day: ScheduleDay }) {
  const { ui } = useBoard();
  // The date depends on today's clock, so it is added after mount only.
  const [date, setDate] = useState<string | undefined>(undefined);
  useEffect(() => setDate(nextDateFor(day.key, new Date(), trip.meet)), [day.key, trip.meet]);
  const to = tripBookingPath(trip, date);
  return (
    <BookingLink
      to={to}
      onClick={() => trackBookNowClick({ location: `${trip.trackingSlot}-day`, product: trip.productCode ?? "", url: to })}
      className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[#0b2444] transition-colors hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b2444]"
    >
      {ui.bookDay(ui.days[day.key].label, plainTripName(trip.name))}
    </BookingLink>
  );
}

const tripPanelId = (tripId: TripId) => `trip-panel-${tripId}`;

function TripPanel({ trip, dayLabel, active }: { trip: Trip; dayLabel: string; active: boolean }) {
  const { ui } = useBoard();
  return (
    <div id={tripPanelId(trip.id)} hidden={!active} className="border-t border-white/10 pt-6">
      <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">{dayLabel}</p>
          <h3 className="font-display text-2xl font-bold text-white"><TripName name={trip.name} /></h3>
          <p className="mt-1 text-sm text-white/70">{trip.tagline}</p>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-white/50">{ui.meetLabel}</dt>
              <dd className="font-semibold tabular-nums text-white"><span dir="ltr">{trip.meet}</span></dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-white/50">{ui.backLabel}</dt>
              <dd className="font-semibold tabular-nums text-white"><span dir="ltr">{trip.back}</span></dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-white/50">{ui.divesLabel}</dt>
              <dd className="font-semibold text-white">{trip.dives}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-white/50">{ui.levelLabel}</dt>
              <dd className="font-semibold text-white">{trip.level}</dd>
            </div>
          </dl>

          {trip.divePlan.length > 0 && (
            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-wide text-white/50">{ui.plan}</p>
              <ul className="mt-2 space-y-1.5">
                {trip.divePlan.map((leg) => (
                  <DiveLegLine key={leg.label} leg={leg} />
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white/[0.06] p-5">
          <p className="text-[11px] uppercase tracking-wide text-white/50">{ui.included}</p>
          <ul className="mt-3 space-y-2">
            {trip.includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-white/85">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {trip.footnote && <p className="mt-3 text-[11px] leading-snug text-white/55">{trip.footnote}</p>}

          {trip.minDivers && (
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-300/10 p-3 text-xs text-amber-100">
              <Users className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{ui.refund(trip.minDivers)}</span>
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p>
              <span className="font-display text-3xl font-bold tabular-nums text-white">
                <Price thb={trip.priceThb} estimate="inline" />
              </span>
              <span className="ms-1 text-sm text-white/60">{ui.perPerson}</span>
            </p>
            <BookButton trip={trip} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Every trip that appears somewhere in the week, in first-appearance order. */
const boardTrips: TripId[] = Array.from(
  new Set(weeklySchedule.flatMap((d: ScheduleDay) => d.slots)),
);

const DiveScheduleBoard = () => {
  const { language } = useLanguage();
  const ui = BOARD_UI[language] ?? BOARD_UI.en;
  const trips = useMemo(() => localizedTrips(language), [language]);
  // Fixed default so the SSG HTML and the hydrated client agree. See header note.
  const [selected, setSelected] = useState<string>(slotKey(weeklySchedule[0].key, 0));
  const [todayKey, setTodayKey] = useState<string | null>(null);

  useEffect(() => {
    // Runs after hydration only, so it can safely read the visitor's real clock.
    const names = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    setTodayKey(names[new Date().getDay()]);
  }, []);

  // The selected slot id is the single source of truth; the mobile day picker
  // and the open panel both read back out of it rather than keeping a second
  // piece of state that could drift out of sync.
  const activeDay = weeklySchedule.find((d) => selected.startsWith(`${d.key}-`)) ?? weeklySchedule[0];
  const activeIndex = Number(selected.slice(selected.lastIndexOf("-") + 1));
  const activeTripId = activeDay.slots[activeIndex] ?? activeDay.slots[0];

  return (
    <BoardCtx.Provider value={{ trips, ui }}>
    <div className="overflow-hidden rounded-3xl bg-gradient-to-b from-[#0f3163] to-[#071a33] p-4 shadow-2xl sm:p-6 lg:p-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-bold text-white sm:text-2xl">{ui.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-sky-200/80">
            <Waves className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="lg:hidden">{ui.hintMobile}</span>
            <span className="hidden lg:inline">{ui.hintDesktop}</span>
          </p>
        </div>
        <p className="text-xs text-white/50">{ui.season}</p>
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
            const hasFlagship = day.slots.some((id) => trips[id].flagship);
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
                    : hasFlagship
                      ? "bg-amber-300/20 text-amber-100 hover:bg-amber-300/30"
                      : "bg-white/[0.07] text-white/70 hover:bg-white/[0.14]",
                ].join(" ")}
              >
                <span>{ui.days[day.key].short}</span>
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
          {ui.days[activeDay.key].label}
          {todayKey === activeDay.key && <span className="ms-1.5 text-amber-300">· {ui.today}</span>}
        </p>

        <div className="mt-2 flex flex-col gap-2">
          {activeDay.slots.map((tripId, i) => (
            <SlotButton
              key={slotKey(activeDay.key, i)}
              tripId={tripId}
              panelId={tripPanelId(tripId)}
              active={selected === slotKey(activeDay.key, i)}
              isToday={todayKey === activeDay.key}
              onSelect={() => setSelected(slotKey(activeDay.key, i))}
            />
          ))}
        </div>
        <BookDayButton trip={trips[activeTripId]} day={activeDay} />
      </div>

      {/* DESKTOP: the whole week as seven real columns. */}
      <div className="hidden lg:grid lg:grid-cols-7 lg:gap-3">
        {weeklySchedule.map((day) => (
          <div key={day.key}>
            <p className="mb-2 text-center font-display text-sm font-bold text-white">
              {ui.days[day.key].label}
              {todayKey === day.key && (
                <span
                  className="ms-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-300 align-middle"
                  aria-label="today"
                />
              )}
            </p>
            <div className="flex flex-col gap-2">
              {day.slots.map((tripId, i) => (
                <SlotButton
                  key={slotKey(day.key, i)}
                  tripId={tripId}
                  panelId={tripPanelId(tripId)}
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
        {ui.weather}
      </p>

      {/* Every trip's panel is in the DOM; only the selected one is shown. */}
      <div className="mt-6">
        {boardTrips.map((tripId) => (
          <TripPanel
            key={tripId}
            trip={trips[tripId]}
            dayLabel={ui.days[activeDay.key].label}
            active={activeTripId === tripId}
          />
        ))}
      </div>

      {/* Trips that aren't tied to a weekday. */}
      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">{ui.alsoEveryDay}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {alsoEveryDay.map((id) => {
            const trip = trips[id];
            return (
              <div key={id} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-display text-sm font-bold text-white"><TripName name={trip.name} /></h4>
                  <span className="font-display text-sm font-bold tabular-nums text-white">
                    <Price thb={trip.priceThb} estimate="inline" />
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/60">{trip.tagline}</p>
                <p className="mt-2 flex items-center gap-1 text-[11px] tabular-nums text-sky-200/80">
                  <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <Times meet={trip.meet} back={trip.back} />
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
    </BoardCtx.Provider>
  );
};

export default DiveScheduleBoard;
