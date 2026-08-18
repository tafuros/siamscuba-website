import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, CheckCircle2, MessageCircle } from "lucide-react";
import type { Language } from "@/i18n/translations";
import { type HotelRoom, type HotelCopy, hotelWhatsAppLink } from "@/data/hotel";
import { trackWhatsAppClick } from "@/utils/tracking";

/**
 * "Request to book" modal - stage 1 of the two-stage booking flow.
 *
 * Submits to POST /api/hotel-booking, which emails the guest a provisional
 * confirmation and pings Ben's phone for the availability decision. Carries
 * the same two silent anti-bot signals the API enforces: a honeypot field
 * ("website" - humans never see it) and the timestamp the form was opened at
 * (submits faster than 2s are rejected server-side).
 */

interface BookingRequestFormProps {
  room: HotelRoom;
  copy: HotelCopy;
  lang: Language;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Status = "idle" | "sending" | "success" | "error";

const FIELD =
  "w-full rounded-xl border border-[#d5e2ec] bg-white/80 px-3.5 py-2.5 text-sm text-[#072a45] outline-none transition focus:border-[#0b4a8f]/60 focus:bg-white";
const LABEL = "mb-1 block text-xs font-medium text-[#072a45]/60";

const BookingRequestForm = ({ room, copy, lang, open, onOpenChange }: BookingRequestFormProps) => {
  const [status, setStatus] = useState<Status>("idle");
  const [ref, setRef] = useState("");
  // The engine reports emailMode:"log" when no mail key is configured (preview
  // and local dev). Saying "check your email" there sends the tester hunting
  // for a mail that was only ever written to the function log.
  const [logMode, setLogMode] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const openedAtRef = useRef(0);
  const waHref = hotelWhatsAppLink(lang, room.name[lang]);
  const today = new Date().toISOString().slice(0, 10);

  // The min-time-to-submit clock starts when the sheet opens, not on mount.
  useEffect(() => {
    if (open) {
      openedAtRef.current = Date.now();
      setStatus("idle");
    }
  }, [open]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/hotel-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: room.slug,
          checkIn: form.get("checkIn"),
          checkOut: form.get("checkOut"),
          guests: Number(form.get("guests")),
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone") || undefined,
          notes: form.get("notes") || undefined,
          lang,
          website: form.get("website"), // honeypot - stays empty for humans
          openedAt: openedAtRef.current,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? `status ${res.status}`);
      setRef(json.ref);
      setLogMode(json.emailMode === "log");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-[#041c2e]/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          dir={lang === "he" ? "rtl" : "ltr"}
          className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-h-[92svh] w-full max-w-md overflow-y-auto rounded-t-[26px] border border-white/70 bg-[#f2f7fb]/95 p-6 font-body text-[#072a45] shadow-[0_-10px_60px_-15px_rgba(4,28,46,0.6)] backdrop-blur-xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-6 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[26px] sm:data-[state=open]:slide-in-from-bottom-2"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="font-display text-xl leading-tight">
                {copy.requestToBook}
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-sm text-[#072a45]/60">
                {room.name[lang]}
                {room.pricePerNight != null && (
                  <>
                    {" · ฿"}
                    {room.pricePerNight.toLocaleString()}
                    <span className="text-xs">
                      {" "}
                      {room.priceUnit === "bed" ? copy.perBed : copy.perNight}
                    </span>
                  </>
                )}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label={copy.bookClose}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/70 bg-white/70 text-[#072a45]/70 transition hover:bg-white"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
              <p className="font-display text-lg">{copy.bookSuccessTitle}</p>
              <p className="text-sm leading-relaxed text-[#072a45]/70">{copy.bookSuccessBody}</p>

              {/* The reference gets its own chip: big, spaced and screenshot-friendly. */}
              <div className="mt-1 w-full">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#072a45]/45">
                  {copy.bookRefLabel}
                </p>
                <p
                  dir="ltr"
                  className="select-all rounded-2xl border border-[#0b4a8f]/25 bg-white px-5 py-3 font-mono text-2xl font-bold tabular-nums tracking-[0.16em] text-[#0b4a8f] shadow-[0_6px_18px_-12px_rgba(11,74,143,0.9)]"
                >
                  {ref}
                </p>
              </div>

              {logMode ? (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                  Test mode: no email was sent - the message was written to the deployment log.
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="mt-2 rounded-full bg-[#0b4a8f] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a3a6b]"
              >
                {copy.bookClose}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3.5">
              {/* Honeypot - visually hidden, never announced; bots fill it. */}
              <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
                <label>
                  Website
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`ci-${room.slug}`} className={LABEL}>
                    {copy.bookCheckIn}
                  </label>
                  <input
                    id={`ci-${room.slug}`}
                    name="checkIn"
                    type="date"
                    required
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor={`co-${room.slug}`} className={LABEL}>
                    {copy.bookCheckOut}
                  </label>
                  <input
                    id={`co-${room.slug}`}
                    name="checkOut"
                    type="date"
                    required
                    min={checkIn || today}
                    className={FIELD}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`g-${room.slug}`} className={LABEL}>
                  {copy.bookGuests}
                </label>
                <select id={`g-${room.slug}`} name="guests" required defaultValue="2" className={FIELD}>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`n-${room.slug}`} className={LABEL}>
                  {copy.bookName}
                </label>
                <input
                  id={`n-${room.slug}`}
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  className={FIELD}
                />
              </div>

              <div>
                <label htmlFor={`e-${room.slug}`} className={LABEL}>
                  {copy.bookEmail}
                </label>
                <input
                  id={`e-${room.slug}`}
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  autoComplete="email"
                  className={FIELD}
                />
              </div>

              <div>
                <label htmlFor={`p-${room.slug}`} className={LABEL}>
                  {copy.bookPhone}
                </label>
                <input
                  id={`p-${room.slug}`}
                  name="phone"
                  type="tel"
                  maxLength={40}
                  autoComplete="tel"
                  className={FIELD}
                />
              </div>

              <div>
                <label htmlFor={`nt-${room.slug}`} className={LABEL}>
                  {copy.bookNotes}
                </label>
                <textarea id={`nt-${room.slug}`} name="notes" rows={2} maxLength={300} className={FIELD} />
              </div>

              {status === "error" && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
                  {copy.bookError}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-1 rounded-full bg-[#0b4a8f] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(11,74,143,0.9)] transition hover:bg-[#0a3a6b] disabled:opacity-60"
              >
                {status === "sending" ? copy.bookSending : copy.bookSubmit}
              </button>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick({ location: `hotel-form-${room.slug}`, url: waHref })}
                className="flex items-center justify-center gap-1.5 text-sm font-medium text-[#072a45]/60 transition hover:text-[#0b4a8f]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {copy.orWhatsApp}
              </a>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BookingRequestForm;
