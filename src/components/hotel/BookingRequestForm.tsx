import { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, CheckCircle2, MessageCircle, ShieldCheck, ArrowLeft } from "lucide-react";
import type { Language } from "@/i18n/translations";
import { type HotelRoom, type HotelCopy, hotelWhatsAppLink } from "@/data/hotel";
import { trackWhatsAppClick } from "@/utils/tracking";
import { loadPayPalSdk, paypalLocale, type PayPalButtonsController } from "@/lib/paypalSdk";
import { bangkokToday, bookingErrorMessage, validateStayDates } from "@/lib/hotelBookingErrors";

/**
 * "Request to book" sheet - stages 0 and 1 of the booking flow.
 *
 * Two steps, in this order and never the other way round:
 *   1. details  -> POST ?action=hold. The server validates everything first
 *      (dates, guests, honeypot, min-submit-time, rate limit, dedupe) and only
 *      then opens a 1,000 THB AUTHORIZATION, handing back a signed hold token.
 *   2. payment  -> the guest approves the hold with PayPal, then
 *      POST ?action=confirm-hold turns it into a real authorization and creates
 *      the request. Abandoning here creates nothing and emails nobody.
 *
 * The provider is discovered at runtime (?action=payment-config), so with no
 * PayPal credentials configured the sheet shows an honest "simulate the hold"
 * button and the whole flow stays clickable on localhost and previews.
 *
 * Carries the same two silent anti-bot signals the API enforces: a honeypot
 * field ("website" - humans never see it) and the timestamp the form was opened
 * at (submits faster than 2s are rejected server-side).
 *
 * Failures the guest can fix (a same-day range, a past check-in, a stay over 30
 * nights, a typo'd email) get their own inline message in the page's language,
 * next to the field at fault - see src/lib/hotelBookingErrors.ts. The generic
 * "message us on WhatsApp" line is now reserved for failures that are genuinely
 * ours: network, provider, anything unmapped. The date rules also run here
 * before the request goes out, so a two-second mistake never opens a hold; the
 * server re-checks all of them and stays the authority.
 */

interface BookingRequestFormProps {
  room: HotelRoom;
  copy: HotelCopy;
  lang: Language;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Status = "idle" | "sending" | "success";
type PayState = "loading" | "ready" | "processing" | "error" | "cancelled";

interface HoldSession {
  holdToken: string;
  orderId: string;
  ref: string;
  simulated: boolean;
  clientId?: string;
  currency: string;
}

interface PaymentConfig {
  provider: string;
  simulated: boolean;
  clientId?: string;
  currency: string;
}

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
  const [checkOut, setCheckOut] = useState("");
  // Two error slots: one beside the date pair, one under the form. Only ever
  // one of them is set, so the guest sees a single instruction at a time.
  const [dateError, setDateError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [hold, setHold] = useState<HoldSession | null>(null);
  const [payState, setPayState] = useState<PayState>("loading");
  const openedAtRef = useRef(0);
  const buttonsHostRef = useRef<HTMLDivElement>(null);
  const waHref = hotelWhatsAppLink(lang, room.name[lang]);
  // The hotel is in Thailand - "today" has to be Bangkok's, or a guest booking
  // from Europe is offered a date the server already counts as the past.
  const today = bangkokToday();

  const showError = useCallback(
    (code: string | null | undefined) => {
      const { scope, message } = bookingErrorMessage(code, copy);
      setDateError(scope === "dates" ? message : null);
      setFormError(scope === "dates" ? null : message);
    },
    [copy],
  );

  // The min-time-to-submit clock starts when the sheet opens, not on mount.
  useEffect(() => {
    if (open) {
      openedAtRef.current = Date.now();
      setStatus("idle");
      setHold(null);
      setPayState("loading");
      setDateError(null);
      setFormError(null);
    }
  }, [open]);

  /** Stage 1b - the guest approved the hold, so the request may now be created. */
  const confirmHold = useCallback(
    async (session: HoldSession, orderId: string) => {
      setPayState("processing");
      try {
        const res = await fetch("/api/hotel-booking?action=confirm-hold", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ holdToken: session.holdToken, orderId }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error ?? `status ${res.status}`);
        setRef(json.ref);
        setLogMode(json.emailMode === "log");
        setStatus("success");
      } catch {
        setPayState("error");
      }
    },
    [],
  );

  // Draw the PayPal buttons once the sheet is on the payment step. Nothing is
  // fetched or injected before that point.
  useEffect(() => {
    if (!hold || status === "success" || hold.simulated) return;
    const host = buttonsHostRef.current;
    if (!host || !hold.clientId) {
      setPayState("error");
      return;
    }

    let cancelled = false;
    let controller: PayPalButtonsController | null = null;

    // Explicit locale: left to guess, the SDK reads the browser and the IP and
    // put Hebrew buttons on the English page. It follows `lang` now, and the
    // loader keys its cached script by locale so a language switch without a
    // reload really does redraw the buttons in the new language.
    loadPayPalSdk(hold.clientId, hold.currency, paypalLocale(lang))
      .then((paypal) => {
        if (cancelled || !buttonsHostRef.current) return;
        controller = paypal.Buttons({
          style: { layout: "vertical", shape: "pill", height: 46 },
          createOrder: () => hold.orderId,
          onApprove: (data) => confirmHold(hold, data.orderID || hold.orderId),
          onCancel: () => setPayState("cancelled"),
          onError: () => setPayState("error"),
        });
        return controller.render(buttonsHostRef.current).then(() => {
          if (!cancelled) setPayState("ready");
        });
      })
      .catch(() => {
        if (!cancelled) setPayState("error");
      });

    return () => {
      cancelled = true;
      try {
        controller?.close?.();
      } catch {
        /* the SDK throws when closing an already-torn-down instance */
      }
    };
  }, [hold, status, confirmHold, lang]);

  /** Stage 1a - validate the details and open the hold. No request exists yet. */
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = new FormData(e.currentTarget);

    // Same-day and backwards ranges are caught here, before any request and
    // before any money is held - the guest fixes it in two seconds instead of
    // being told to go and message us.
    const ci = String(form.get("checkIn") ?? "");
    const co = String(form.get("checkOut") ?? "");
    const dateProblem = validateStayDates(ci, co, today);
    if (dateProblem) {
      showError(dateProblem);
      return;
    }

    setDateError(null);
    setFormError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/hotel-booking?action=hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: room.slug,
          checkIn: ci,
          checkOut: co,
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
      if (!res.ok || !json.ok) {
        // The API's validation code decides which message the guest sees; an
        // unmapped one (hold_failed, too_fast, ...) lands on the generic line.
        showError(typeof json.error === "string" ? json.error : null);
        setStatus("idle");
        return;
      }

      // A double submit inside the dedupe window already has a request behind
      // it - go straight to the confirmation instead of holding money twice.
      if (json.duplicate) {
        setRef(json.ref);
        setLogMode(json.emailMode === "log");
        setStatus("success");
        return;
      }

      let config: PaymentConfig | null = null;
      if (!json.simulated) {
        const cfgRes = await fetch("/api/hotel-booking?action=payment-config");
        config = (await cfgRes.json()) as PaymentConfig;
      }

      setHold({
        holdToken: json.holdToken,
        orderId: json.orderId,
        ref: json.ref,
        simulated: Boolean(json.simulated),
        clientId: config?.clientId,
        currency: json.currency ?? "THB",
      });
      setPayState(json.simulated ? "ready" : "loading");
      setStatus("idle");
    } catch {
      // Network or a malformed response - not the guest's to fix.
      showError(null);
      setStatus("idle");
    }
  };

  const backToDetails = () => {
    setHold(null);
    setPayState("loading");
    setStatus("idle");
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

              <p className="flex items-start gap-2 rounded-xl bg-white/70 px-3.5 py-2.5 text-left text-xs leading-relaxed text-[#072a45]/70">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                {copy.bookSuccessHold}
              </p>

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
          ) : hold ? (
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-display text-lg leading-snug">{copy.payStepTitle}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#072a45]/65">{copy.payStepIntro}</p>
              </div>

              <div className="rounded-2xl border border-[#0b4a8f]/15 bg-white/75 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#072a45]/45">
                    {copy.payAmountLabel}
                  </span>
                  <span dir="ltr" className="font-display text-2xl leading-none text-[#0b4a8f]">
                    ฿1,000
                  </span>
                </div>
                <ul className="mt-3 flex flex-col gap-2 border-t border-[#072a45]/8 pt-3">
                  {copy.payPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-[13px] leading-relaxed text-[#072a45]/75">
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {payState === "processing" ? (
                <p className="rounded-xl bg-white/70 px-3.5 py-3 text-center text-sm text-[#072a45]/70">
                  {copy.payProcessing}
                </p>
              ) : hold.simulated ? (
                <div className="flex flex-col gap-2">
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                    {copy.paySimulatedNote}
                  </p>
                  <button
                    type="button"
                    onClick={() => confirmHold(hold, hold.orderId)}
                    className="rounded-full bg-[#0b4a8f] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(11,74,143,0.9)] transition hover:bg-[#0a3a6b]"
                  >
                    {copy.paySimulatedButton}
                  </button>
                </div>
              ) : (
                <div>
                  {payState === "loading" && (
                    <p className="py-3 text-center text-sm text-[#072a45]/45">…</p>
                  )}
                  {/* PayPal renders its buttons into this host; the SDK script is
                      injected only once this step is on screen. */}
                  <div ref={buttonsHostRef} />
                </div>
              )}

              {payState === "cancelled" && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800">
                  {copy.payCancelled}
                </p>
              )}
              {payState === "error" && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
                  {copy.payError}
                </p>
              )}

              {payState !== "processing" && (
                <button
                  type="button"
                  onClick={backToDetails}
                  className="flex items-center justify-center gap-1.5 text-sm font-medium text-[#072a45]/60 transition hover:text-[#0b4a8f]"
                >
                  <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                  {copy.payBack}
                </button>
              )}
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

              <div>
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
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        setDateError(null);
                      }}
                      aria-invalid={dateError ? true : undefined}
                      aria-describedby={dateError ? `dates-err-${room.slug}` : undefined}
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
                      value={checkOut}
                      onChange={(e) => {
                        setCheckOut(e.target.value);
                        setDateError(null);
                      }}
                      aria-invalid={dateError ? true : undefined}
                      aria-describedby={dateError ? `dates-err-${room.slug}` : undefined}
                      className={FIELD}
                    />
                  </div>
                </div>
                {dateError && (
                  <p
                    id={`dates-err-${room.slug}`}
                    role="alert"
                    className="mt-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
                  >
                    {dateError}
                  </p>
                )}
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

              {formError && (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700"
                >
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-1 rounded-full bg-[#0b4a8f] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(11,74,143,0.9)] transition hover:bg-[#0a3a6b] disabled:opacity-60"
              >
                {status === "sending" ? copy.bookSending : copy.payContinue}
              </button>

              <p className="flex items-start gap-1.5 text-center text-xs leading-relaxed text-[#072a45]/55">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                {copy.payFormNote}
              </p>

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
