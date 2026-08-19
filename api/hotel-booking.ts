// Vercel serverless function: the Siam Hotel & Hostel two-stage booking engine.
//
// One self-contained function (pattern: api/chat.ts - the project root is
// "type": "module", so Vercel ships raw ESM and does NOT bundle sibling files;
// everything is inlined and data is read via fs from api/_hotel-data.json,
// shipped through vercel.json -> functions.includeFiles).
//
// Internal routing (method + query):
//   GET  ?action=payment-config  what the booking sheet needs to draw the
//        payment step: provider, simulated flag, PayPal client id, amount.
//   POST ?action=hold            stage 0 - validate the form, then open a
//        1,000 THB AUTHORIZATION with the provider. Honeypot +
//        min-time-to-submit + per-email dedupe + per-IP rate limit all run
//        BEFORE any money is touched. Responds {holdToken, orderId}.
//   POST ?action=confirm-hold    stage 1 - body {holdToken, orderId}. Turns the
//        guest-approved order into a real authorization, and ONLY THEN creates
//        the request: provisional email to the guest (Resend) -> notify staff
//        via n8n -> respond {ok, ref}. A failed or abandoned payment creates
//        nothing and emails nobody.
//   POST                        (no query) rejected with `hold_required` - a
//        request cannot exist without money behind it.
//   GET  ?t=<decide-token>       Ben's decision page. STRICTLY read-only
//        (email/WhatsApp link scanners must not be able to trigger a decision).
//   POST ?t=<decide-token>&action=approve|decline
//        idempotency check against the n8n status webhook, then CAPTURE (approve)
//        or VOID (decline) the authorization, then the final / decline email,
//        then log the event to n8n. Money moves before the promise is made: if
//        capture or void fails the guest is NOT emailed and Ben sees why.
//   POST ?action=register        guest registration completion
//        body {token, details} - verify guest-token, log event to n8n.
//
// Tokens: HMAC-SHA256 (node:crypto), format base64url(payload).base64url(sig).
//   hold-token:   typ "hold",   exp now + 30 min (carries the order nonce)
//   decide-token: typ "decide", exp ~ check-in + 1 day (carries the auth id)
//   guest-token:  typ "guest",  exp ~ check-out
//
// The system has no database. The authorization id therefore rides inside the
// signed decide token - Ben's decision URL IS the record - and is mirrored into
// the n8n audit log on the `requested` event.
//
// n8n contract (workflow built separately in the Nemo repo - keep in sync):
//   POST ${HOTEL_NOTIFY_URL}                 header X-Hotel-Token
//        body {event: "requested"|"approved"|"declined"|"registration_completed", ref, ...}
//   GET  ${HOTEL_NOTIFY_URL}-status?ref=<ref> header X-Hotel-Token
//        -> 200 {status: "requested"|"approved"|"declined", at?: string}
//   n8n being down NEVER fails a guest request (log + continue) and the status
//   check fails OPEN (undecided) - the jsonl on the droplet is the audit trail.
//
// Env (Ben installs in the Vercel dashboard - never hardcoded):
//   RESEND_API_KEY       unset -> LOG-ONLY email mode (payloads to console,
//                        responses carry {emailMode:"log"}; everything else works)
//   HOTEL_BOOKING_SECRET unset -> dev fallback secret (fine locally; MUST be set
//                        in prod before go-live or tokens are forgeable)
//   HOTEL_NOTIFY_URL / HOTEL_NOTIFY_TOKEN  unset -> notify skipped (logged)
//   PAYPAL_CLIENT_ID / PAYPAL_SECRET  either unset -> SIMULATED HOLD mode: the
//                        authorize/capture/void calls are logged instead of
//                        made, fake ids come back, and every response carries
//                        {holdMode:"simulated"} so a tester can tell. The whole
//                        flow stays exercisable locally and on previews.
//   PAYPAL_ENV           "sandbox" (default) | "live" - which PayPal host to talk to

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// ---------------------------------------------------------------------------
// Data (generated - see scripts/build-hotel-data.ts)
// ---------------------------------------------------------------------------

export type Lang = "en" | "he" | "es" | "fr";
const LANGS: Lang[] = ["en", "he", "es", "fr"];

interface HotelData {
  hotel: {
    name: string;
    address: string | null;
    area: string;
    checkIn: string | null;
    checkOut: string | null;
    mapsUrl: string | null;
    whatsapp: string;
    siteUrl: Record<Lang, string>;
  };
  rooms: Record<
    string,
    {
      name: Record<Lang, string>;
      price: number | null;
      priceUnit: "night" | "bed";
      sleeps: number | null;
      soldOut: boolean;
    }
  >;
  strings: Record<
    Lang,
    { perNight: string; perBed: string; nightOne: string; nightMany: string; guestsWord: string }
  >;
  emails: Record<
    "provisional" | "final" | "decline",
    Record<Lang, { subject: string; html: string }>
  >;
}

const DATA = JSON.parse(
  readFileSync(join(process.cwd(), "api/_hotel-data.json"), "utf8"),
) as HotelData;

const PUBLIC_BASE = "https://siamscuba.com";

// Links we mail out (the decide page, the guest registration page) must point at
// the deployment that generated them. Hardcoding production made every preview
// deployment emit a link into a production build where the function may not
// exist yet - untestable before merge. Set per request, production as fallback.
let linkBase = PUBLIC_BASE;

function baseUrl(): string {
  return linkBase;
}

function setLinkBase(req: VercelRequest): void {
  const fwd = req.headers["x-forwarded-host"] ?? req.headers.host;
  const host = Array.isArray(fwd) ? fwd[0] : fwd;
  if (!host) {
    linkBase = PUBLIC_BASE;
    return;
  }
  const local = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  linkBase = `${local ? "http" : "https"}://${host}`;
}
const EMAIL_FROM = "Siam Hotel & Hostel <hotel@siamscuba.com>";
const EMAIL_REPLY_TO = "hotel@siamscuba.com";
// Exported so the booking sheet's client-side copy can quote the same numbers.
// The server stays the authority - the client only pre-empts the round trip.
export const MAX_NIGHTS = 30;
export const MAX_GUESTS = 6;
const MIN_SUBMIT_MS = 2000; // form open -> submit faster than this = bot
const DEDUPE_WINDOW_MS = 10 * 60_000; // same email within 10 min -> same ref, no re-email

// ---------------------------------------------------------------------------
// Abuse dampeners (warm-instance memory - same caveat as api/chat.ts: cheap
// burst protection, not a hard guarantee across instances/cold starts)
// ---------------------------------------------------------------------------

const RATE_WINDOW_MS = 30_000;
const RATE_MAX = 10;
const ipHits = new Map<string, number[]>();
const recentByEmail = new Map<string, { ref: string; at: number }>();

export function rateLimited(ip: string, now = Date.now()): boolean {
  const fresh = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (ipHits.size > 5000) {
    for (const [k, v] of ipHits) {
      if (!v.some((t) => now - t < RATE_WINDOW_MS)) ipHits.delete(k);
    }
  }
  if (fresh.length >= RATE_MAX) {
    ipHits.set(ip, fresh);
    return true;
  }
  fresh.push(now);
  ipHits.set(ip, fresh);
  return false;
}

/** Test hook - clears warm-memory state so cases don't bleed into each other. */
export function __resetStateForTests(): void {
  ipHits.clear();
  recentByEmail.clear();
  simHolds.clear();
}

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

export interface TokenPayload {
  typ: "decide" | "guest" | "hold";
  ref: string;
  room: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  lang: Lang;
  exp: number; // ms epoch

  // -- hold tokens only --
  /** Binds the token to the provider order we opened (PayPal custom_id). */
  nonce?: string;
  /** Honeypot decoy: looks and behaves like a real hold, moves no money. */
  decoy?: boolean;

  // -- decide tokens only --
  /** Provider authorization id to capture on approve / void on decline. */
  auth?: string;
  /** The authorization came from the simulated provider (no real money). */
  holdSim?: boolean;
}

function secret(): string {
  const s = process.env.HOTEL_BOOKING_SECRET;
  if (s) return s;
  console.warn("[hotel-booking] HOTEL_BOOKING_SECRET is not set - using DEV fallback secret");
  return "dev-only-hotel-booking-secret";
}

const b64url = (buf: Buffer) => buf.toString("base64url");

function sign(payloadB64: string, key: string): string {
  return b64url(createHmac("sha256", key).update(payloadB64).digest());
}

export function signToken(payload: TokenPayload, key = secret()): string {
  const p = b64url(Buffer.from(JSON.stringify(payload), "utf8"));
  return `${p}.${sign(p, key)}`;
}

export type VerifyResult =
  | { ok: true; payload: TokenPayload }
  | { ok: false; reason: "invalid" | "expired" };

export function verifyToken(token: string, key = secret(), now = Date.now()): VerifyResult {
  const parts = typeof token === "string" ? token.split(".") : [];
  if (parts.length !== 2 || !parts[0] || !parts[1]) return { ok: false, reason: "invalid" };
  const expected = Buffer.from(sign(parts[0], key));
  const got = Buffer.from(parts[1]);
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) {
    return { ok: false, reason: "invalid" };
  }
  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (typeof payload?.exp !== "number" || payload.exp < now) return { ok: false, reason: "expired" };
  return { ok: true, payload };
}

/**
 * Reference alphabet: uppercase, with every character that gets misheard or
 * misread over the phone removed - 0/O, 1/I/L and U are all gone.
 */
export const REF_ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ"; // 30 chars

/**
 * `SH-MMDD-XXXX`, e.g. SH-0818-K7M2 - Siam Hotel, the request date in Koh Tao
 * time, and 4 unambiguous random characters. Readable out loud, short enough to
 * write on a paper booking sheet. Old `HB-...` refs stay valid inside already
 * issued tokens; only the generator changed.
 */
export function makeRef(now = Date.now()): string {
  const mmdd = bangkokToday(now).slice(5).replace("-", "");
  const limit = 256 - (256 % REF_ALPHABET.length); // reject above this - no modulo bias
  let rand = "";
  while (rand.length < 4) {
    for (const byte of randomBytes(8)) {
      if (byte >= limit) continue;
      rand += REF_ALPHABET[byte % REF_ALPHABET.length];
      if (rand.length === 4) break;
    }
  }
  return `SH-${mmdd}-${rand}`;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAY_MS = 86_400_000;

/** The hotel lives at UTC+7 - "today" means today in Koh Tao. */
export function bangkokToday(now = Date.now()): string {
  return new Date(now + 7 * 3_600_000).toISOString().slice(0, 10);
}

export interface BookingRequest {
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  lang: Lang;
}

export type ValidationResult =
  | { ok: true; data: BookingRequest }
  | { ok: false; error: string };

export function validateRequest(body: Record<string, unknown>, now = Date.now()): ValidationResult {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const room = str(body.room);
  const roomData = DATA.rooms[room];
  if (!roomData || roomData.soldOut) return { ok: false, error: "invalid_room" };

  const checkIn = str(body.checkIn);
  const checkOut = str(body.checkOut);
  // Each date failure gets its own code so the sheet can tell the guest what to
  // fix instead of dumping them on "contact us". The rejections themselves are
  // unchanged - this only splits one code into four.
  if (!DATE_RE.test(checkIn) || !DATE_RE.test(checkOut)) return { ok: false, error: "invalid_dates" };
  const ci = Date.parse(`${checkIn}T00:00:00Z`);
  const co = Date.parse(`${checkOut}T00:00:00Z`);
  if (!Number.isFinite(ci) || !Number.isFinite(co)) return { ok: false, error: "invalid_dates" };
  if (checkIn < bangkokToday(now)) return { ok: false, error: "checkin_in_past" };
  const nights = Math.round((co - ci) / DAY_MS);
  if (nights < 1) return { ok: false, error: "checkout_not_after_checkin" };
  if (nights > MAX_NIGHTS) return { ok: false, error: "stay_too_long" };

  const guests = Number(body.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    return { ok: false, error: "invalid_guests" };
  }

  const name = str(body.name).slice(0, 100);
  if (name.length < 2) return { ok: false, error: "invalid_name" };

  const email = str(body.email);
  if (!EMAIL_RE.test(email) || email.length > 200) return { ok: false, error: "invalid_email" };

  const phone = str(body.phone).slice(0, 40) || undefined;

  const notes = str(body.notes);
  if (notes.length > 300) return { ok: false, error: "invalid_notes" };

  const lang = str(body.lang) as Lang;
  if (!LANGS.includes(lang)) return { ok: false, error: "invalid_lang" };

  return {
    ok: true,
    data: { room, checkIn, checkOut, nights, guests, name, email, phone, notes: notes || undefined, lang },
  };
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Tiny mustache subset: {{#key}}...{{/key}} sections kept only when the value
 * is non-empty, then {{key}} interpolation (always HTML-escaped; & -> &amp;
 * inside href attributes is valid HTML).
 */
export function renderTemplate(tpl: string, vars: Record<string, string | number | undefined>): string {
  const val = (k: string) => {
    const v = vars[k];
    return v === undefined || v === null ? "" : String(v);
  };
  return tpl
    .replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, k, inner) => (val(k) ? inner : ""))
    .replace(/\{\{(\w+)\}\}/g, (_, k) => escapeHtml(val(k)));
}

const LOCALE: Record<Lang, string> = { en: "en-GB", he: "he-IL", es: "es-ES", fr: "fr-FR" };

// Decision timestamps come back as an ISO instant and are read by whoever is
// standing at the desk, so they render in Koh Tao time, not UTC.
export function formatDecidedAt(iso: string | undefined): string {
  if (!iso) return "an earlier time";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "an earlier time";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
  }).format(d);
}

function formatDate(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

function nightsLabel(n: number, lang: Lang): string {
  const s = DATA.strings[lang];
  return n === 1 ? s.nightOne : s.nightMany.replace("{n}", String(n));
}

function priceLine(room: string, lang: Lang): string {
  const r = DATA.rooms[room];
  if (!r || r.price == null) return "";
  const unit = r.priceUnit === "bed" ? DATA.strings[lang].perBed : DATA.strings[lang].perNight;
  return `฿${r.price.toLocaleString("en-US")} ${unit}`;
}

const waLink = () => `https://wa.me/${DATA.hotel.whatsapp}`;

/**
 * The hotel page on THIS deployment (preview or prod), in the guest's language.
 * Used as the provider's return/cancel destination, so a guest who bails out of
 * the payment lands back where they started rather than on production.
 */
function hotelPageUrl(lang: Lang): string {
  const path = DATA.hotel.siteUrl[lang]?.replace(PUBLIC_BASE, "") || "/hotel";
  return `${baseUrl()}${path}`;
}

/**
 * Compose one of the 3 emails in the guest's language. Exported for tests.
 *
 * `prepaid` / `noPrepaid` / `released` are section switches, never printed:
 * exactly one of the first two is set on the final email (a booking whose hold
 * was captured says the 1,000 THB is credited against the bill; one without a
 * hold - a legacy request, or an approval after the authorization lapsed - says
 * the full amount is due at reception). `released` guards the decline email's
 * "we let the hold go" paragraph the same way.
 */
export function buildEmail(
  kind: "provisional" | "final" | "decline",
  lang: Lang,
  req: BookingRequest & { ref: string },
  extra: {
    registerUrl?: string;
    alternative?: string;
    prepaid?: boolean;
    released?: boolean;
  } = {},
): { subject: string; html: string } {
  const tpl = DATA.emails[kind][lang];
  // Grouped the way the guest's own locale writes it, so the email matches the
  // booking sheet word for word (es "฿1.000", fr "฿1 000", en/he "฿1,000").
  // useGrouping "always" is required: Spanish and French otherwise leave a
  // four-digit number ungrouped ("1000"), which would not match the copy. The
  // French separator is normalised from a narrow no-break space to a plain one
  // so the string is identical to the hand-written copy in src/data/hotel.ts.
  const holdAmount = `฿${new Intl.NumberFormat(LOCALE[lang], { useGrouping: "always" })
    .format(HOLD_AMOUNT)
    .replace(/[\u202f\u00a0]/g, " ")}`;
  const vars: Record<string, string | number | undefined> = {
    holdAmount,
    prepaid: extra.prepaid ? holdAmount : "",
    noPrepaid: extra.prepaid ? "" : "1",
    released: extra.released ? holdAmount : "",
    name: req.name,
    ref: req.ref,
    roomName: DATA.rooms[req.room]?.name[lang] ?? req.room,
    checkIn: formatDate(req.checkIn, lang),
    checkOut: formatDate(req.checkOut, lang),
    nightsLabel: nightsLabel(req.nights, lang),
    guests: req.guests,
    guestsWord: DATA.strings[lang].guestsWord,
    priceLine: priceLine(req.room, lang),
    checkInTime: DATA.hotel.checkIn ?? "14:00",
    checkOutTime: DATA.hotel.checkOut ?? "11:00",
    address: DATA.hotel.address ?? DATA.hotel.area,
    mapsUrl: DATA.hotel.mapsUrl ?? "",
    registerUrl: extra.registerUrl,
    alternative: extra.alternative,
    waLink: waLink(),
    hotelUrl: DATA.hotel.siteUrl[lang],
  };
  return {
    subject: renderTemplate(tpl.subject, vars),
    html: renderTemplate(tpl.html, vars),
  };
}

// ---------------------------------------------------------------------------
// Email sending (Resend via plain fetch; LOG-ONLY mode when the key is unset)
// ---------------------------------------------------------------------------

export type EmailMode = "sent" | "log";

async function sendEmail(to: string, subject: string, html: string): Promise<EmailMode> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(
      "[hotel-booking] EMAIL (log-only mode)\n" +
        JSON.stringify({ from: EMAIL_FROM, to, reply_to: EMAIL_REPLY_TO, subject }, null, 2) +
        "\n--- html ---\n" +
        html,
    );
    return "log";
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10_000);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: EMAIL_FROM, to, reply_to: EMAIL_REPLY_TO, subject, html }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`resend status ${res.status}`);
    return "sent";
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Payment hold - the provider seam
// ---------------------------------------------------------------------------
// A guest puts 1,000 THB behind an availability request as an AUTHORIZATION.
// Ben approves -> we CAPTURE it (a prepayment credited against the bill, not a
// separate refundable deposit). Ben declines -> we VOID it and the guest was
// never charged.
//
// Everything provider-specific lives between here and the end of this section.
// Moving to a Thai provider later (Omise / PromptPay) means writing a third
// HoldProvider and adding one line to getHoldProvider() - the booking flow
// below never mentions PayPal.

export const HOLD_AMOUNT = 1000;
export const HOLD_CURRENCY = "THB";
/** PayPal expects THB with 2 decimals. */
const holdValue = () => HOLD_AMOUNT.toFixed(2);

export type HoldFailure =
  | "not_approved" // the guest never finished approving the order
  | "expired" // 3-day honor period / 29-day validity elapsed
  | "already_captured"
  | "voided"
  | "declined" // the issuer said no
  | "provider_error"; // network, credentials, anything else

export type HoldResult =
  | { ok: true; id: string; simulated: boolean; already?: boolean }
  | { ok: false; code: HoldFailure; message: string; simulated: boolean };

export type StartHoldResult =
  | { ok: true; orderId: string; approveUrl?: string; simulated: boolean }
  | { ok: false; code: HoldFailure; message: string; simulated: boolean };

export interface StartHoldInput {
  /** Random value we also stamp on the provider order, so the order the guest
   *  approved is provably the order this signed token was minted for. */
  nonce: string;
  ref: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface HoldProvider {
  name: "paypal" | "simulated";
  simulated: boolean;
  /** Public identifier the browser SDK needs (PayPal client id). */
  clientId?: string;
  env?: string;
  startHold(input: StartHoldInput): Promise<StartHoldResult>;
  /** Guest-approved order -> a real authorization we can later capture/void. */
  authorizeHold(orderId: string, nonce: string): Promise<HoldResult>;
  captureHold(authId: string): Promise<HoldResult>;
  voidHold(authId: string): Promise<HoldResult>;
}

// -- PayPal Orders v2 over plain fetch (no SDK - this file ships as raw ESM) --

const PAYPAL_TIMEOUT_MS = 12_000;

function paypalBase(): string {
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

/** Maps a PayPal error body onto our small failure vocabulary. */
export function classifyPaypalError(status: number, body: unknown): { code: HoldFailure; message: string } {
  const b = (body ?? {}) as { name?: string; message?: string; details?: { issue?: string; description?: string }[] };
  const issue = b.details?.[0]?.issue ?? b.name ?? "";
  const described = b.details?.[0]?.description ?? b.message ?? `status ${status}`;
  const up = issue.toUpperCase();
  if (up.includes("ALREADY_CAPTURED")) return { code: "already_captured", message: described };
  if (up.includes("EXPIRED")) return { code: "expired", message: described };
  if (up.includes("VOIDED")) return { code: "voided", message: described };
  if (up.includes("DECLINED") || up.includes("INSTRUMENT_DECLINED")) {
    return { code: "declined", message: described };
  }
  if (up.includes("ORDER_NOT_APPROVED") || up.includes("PAYER_ACTION_REQUIRED")) {
    return { code: "not_approved", message: described };
  }
  return { code: "provider_error", message: `${issue || "paypal_error"}: ${described}` };
}

async function paypalFetch(
  path: string,
  init: { method: string; body?: unknown; requestId?: string },
): Promise<{ ok: true; json: Record<string, unknown> } | { ok: false; code: HoldFailure; message: string }> {
  const id = process.env.PAYPAL_CLIENT_ID;
  const sec = process.env.PAYPAL_SECRET;
  if (!id || !sec) return { ok: false, code: "provider_error", message: "paypal credentials missing" };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), PAYPAL_TIMEOUT_MS);
  try {
    const auth = Buffer.from(`${id}:${sec}`).toString("base64");
    const tokenRes = await fetch(`${paypalBase()}/v1/oauth2/token`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials",
      signal: ctrl.signal,
    });
    if (!tokenRes.ok) {
      return { ok: false, code: "provider_error", message: `paypal auth status ${tokenRes.status}` };
    }
    const { access_token: accessToken } = (await tokenRes.json()) as { access_token?: string };
    if (!accessToken) return { ok: false, code: "provider_error", message: "paypal auth returned no token" };

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    // Provider-side idempotency: PayPal replays the first result for a repeated
    // request id instead of moving the money twice.
    if (init.requestId) headers["PayPal-Request-Id"] = init.requestId;

    const res = await fetch(`${paypalBase()}${path}`, {
      method: init.method,
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: ctrl.signal,
    });
    const text = await res.text();
    let json: Record<string, unknown> = {};
    if (text) {
      try {
        json = JSON.parse(text) as Record<string, unknown>;
      } catch {
        json = {};
      }
    }
    if (!res.ok) return { ok: false, ...classifyPaypalError(res.status, json) };
    return { ok: true, json };
  } catch (err) {
    return {
      ok: false,
      code: "provider_error",
      message: err instanceof Error ? err.message : "paypal request failed",
    };
  } finally {
    clearTimeout(timer);
  }
}

function paypalProvider(): HoldProvider {
  const fail = (r: { code: HoldFailure; message: string }): HoldResult => ({
    ok: false,
    code: r.code,
    message: r.message,
    simulated: false,
  });

  return {
    name: "paypal",
    simulated: false,
    clientId: process.env.PAYPAL_CLIENT_ID,
    env: process.env.PAYPAL_ENV === "live" ? "live" : "sandbox",

    async startHold(input) {
      const res = await paypalFetch("/v2/checkout/orders", {
        method: "POST",
        requestId: `order-${input.nonce}`,
        body: {
          intent: "AUTHORIZE",
          purchase_units: [
            {
              custom_id: input.nonce,
              invoice_id: input.ref,
              description: input.description.slice(0, 127),
              amount: { currency_code: HOLD_CURRENCY, value: holdValue() },
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                shipping_preference: "NO_SHIPPING",
                user_action: "PAY_NOW",
                return_url: input.returnUrl,
                cancel_url: input.cancelUrl,
              },
            },
          },
        },
      });
      if (!res.ok) return { ok: false, code: res.code, message: res.message, simulated: false };
      const orderId = typeof res.json.id === "string" ? res.json.id : "";
      if (!orderId) {
        return { ok: false, code: "provider_error", message: "paypal returned no order id", simulated: false };
      }
      const links = Array.isArray(res.json.links) ? (res.json.links as { rel?: string; href?: string }[]) : [];
      const approveUrl = links.find((l) => l.rel === "payer-action" || l.rel === "approve")?.href;
      return { ok: true, orderId, approveUrl, simulated: false };
    },

    async authorizeHold(orderId, nonce) {
      const res = await paypalFetch(`/v2/checkout/orders/${encodeURIComponent(orderId)}/authorize`, {
        method: "POST",
        requestId: `auth-${nonce}`,
        body: {},
      });
      if (!res.ok) return fail(res);
      const units = res.json.purchase_units as
        | { custom_id?: string; payments?: { authorizations?: { id?: string; status?: string }[] } }[]
        | undefined;
      const unit = units?.[0];
      // The order the guest approved must be the one this token was minted for.
      if (unit?.custom_id && unit.custom_id !== nonce) {
        return fail({ code: "provider_error", message: "authorization does not belong to this request" });
      }
      const authId = unit?.payments?.authorizations?.[0]?.id;
      if (!authId) return fail({ code: "provider_error", message: "paypal returned no authorization id" });
      return { ok: true, id: authId, simulated: false };
    },

    async captureHold(authId) {
      const res = await paypalFetch(`/v2/payments/authorizations/${encodeURIComponent(authId)}/capture`, {
        method: "POST",
        requestId: `capture-${authId}`,
        body: {
          amount: { currency_code: HOLD_CURRENCY, value: holdValue() },
          final_capture: true,
        },
      });
      if (!res.ok) {
        // Capturing an already-captured authorization is the double-tap case:
        // the money is exactly where we wanted it, so this is a success.
        if (res.code === "already_captured") {
          return { ok: true, id: authId, simulated: false, already: true };
        }
        return fail(res);
      }
      const captureId = typeof res.json.id === "string" ? res.json.id : authId;
      return { ok: true, id: captureId, simulated: false };
    },

    async voidHold(authId) {
      const res = await paypalFetch(`/v2/payments/authorizations/${encodeURIComponent(authId)}/void`, {
        method: "POST",
        requestId: `void-${authId}`,
      });
      if (!res.ok) {
        // Already void, or expired unused - either way the guest's money never
        // moved, which is precisely what a decline needs to be true.
        if (res.code === "voided" || res.code === "expired") {
          return { ok: true, id: authId, simulated: false, already: true };
        }
        return fail(res);
      }
      return { ok: true, id: authId, simulated: false };
    },
  };
}

// -- Simulated provider (no credentials configured) ---------------------------

type SimState = "authorized" | "captured" | "voided" | "expired";
const simHolds = new Map<string, SimState>();

/** Test hook - force a simulated authorization into a given provider state. */
export function __setSimulatedHoldState(authId: string, state: SimState): void {
  simHolds.set(authId, state);
}

const simLog = (what: string, detail: Record<string, unknown>) =>
  console.log(`[hotel-booking] HOLD (simulated mode) ${what}`, JSON.stringify(detail));

function simulatedProvider(): HoldProvider {
  const bad = (code: HoldFailure, message: string): HoldResult => ({ ok: false, code, message, simulated: true });

  return {
    name: "simulated",
    simulated: true,
    env: "simulated",

    async startHold(input) {
      const orderId = `SIMORDER-${input.nonce}`;
      simLog("would authorize", {
        orderId,
        amount: holdValue(),
        currency: HOLD_CURRENCY,
        ref: input.ref,
        description: input.description,
      });
      return { ok: true, orderId, simulated: true };
    },

    async authorizeHold(orderId, nonce) {
      if (orderId !== `SIMORDER-${nonce}`) {
        return bad("provider_error", "simulated order does not match this request");
      }
      const authId = `SIMAUTH-${nonce}`;
      simHolds.set(authId, "authorized");
      simLog("authorized", { orderId, authId, amount: holdValue(), currency: HOLD_CURRENCY });
      return { ok: true, id: authId, simulated: true };
    },

    async captureHold(authId) {
      const state = simHolds.get(authId) ?? "authorized";
      if (state === "captured") {
        simLog("capture skipped - already captured", { authId });
        return { ok: true, id: `SIMCAPTURE-${authId}`, simulated: true, already: true };
      }
      if (state === "expired") return bad("expired", "simulated authorization expired");
      if (state === "voided") return bad("voided", "simulated authorization was voided");
      simHolds.set(authId, "captured");
      simLog("captured", { authId, amount: holdValue(), currency: HOLD_CURRENCY });
      return { ok: true, id: `SIMCAPTURE-${authId}`, simulated: true };
    },

    async voidHold(authId) {
      const state = simHolds.get(authId) ?? "authorized";
      if (state === "captured") return bad("already_captured", "simulated authorization was already captured");
      if (state === "voided" || state === "expired") {
        simLog("void skipped - nothing held", { authId, state });
        return { ok: true, id: authId, simulated: true, already: true };
      }
      simHolds.set(authId, "voided");
      simLog("voided", { authId, amount: holdValue(), currency: HOLD_CURRENCY });
      return { ok: true, id: authId, simulated: true };
    },
  };
}

export function getHoldProvider(): HoldProvider {
  if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_SECRET) return paypalProvider();
  console.warn("[hotel-booking] PAYPAL_CLIENT_ID/PAYPAL_SECRET unset - running in SIMULATED hold mode");
  return simulatedProvider();
}

/** Ben-readable reason, for the decision page and the audit log. */
export function holdFailureText(code: HoldFailure, verb: "capture" | "release"): string {
  switch (code) {
    case "expired":
      return `The 1,000 THB authorization has expired (PayPal holds them for 3 days, 29 at the outside), so it could not be ${verb === "capture" ? "charged" : "released"}. The guest was never charged.`;
    case "already_captured":
      return "The 1,000 THB was already charged. Refund it in PayPal if this booking is not going ahead.";
    case "voided":
      return "The authorization was already released, so there is nothing left to charge.";
    case "declined":
      return "The guest's bank declined the charge.";
    case "not_approved":
      return "The guest never finished approving the payment, so there is no authorization to work with.";
    default:
      return `PayPal could not ${verb} the hold right now.`;
  }
}

// ---------------------------------------------------------------------------
// n8n staff notification + status (fail-open by design)
// ---------------------------------------------------------------------------

async function notifyStaff(event: Record<string, unknown>): Promise<void> {
  const url = process.env.HOTEL_NOTIFY_URL;
  const token = process.env.HOTEL_NOTIFY_TOKEN;
  if (!url || !token) {
    console.log("[hotel-booking] NOTIFY (skipped - HOTEL_NOTIFY_URL/TOKEN unset)", JSON.stringify(event));
    return;
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Hotel-Token": token },
      body: JSON.stringify(event),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
  } catch (err) {
    // Staff notification must NEVER fail the guest's request.
    console.error("[hotel-booking] notify failed:", err instanceof Error ? err.message : err);
  } finally {
    clearTimeout(timer);
  }
}

type DecisionStatus = { decided: false } | { decided: true; action: string; at: string };

async function fetchDecisionStatus(ref: string): Promise<DecisionStatus> {
  const url = process.env.HOTEL_NOTIFY_URL;
  const token = process.env.HOTEL_NOTIFY_TOKEN;
  if (!url || !token) return { decided: false };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch(`${url}-status?ref=${encodeURIComponent(ref)}`, {
      headers: { "X-Hotel-Token": token },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    // The workflow names this field `at`; `decidedAt` is accepted too so an
    // older or renamed payload still shows a real time instead of a blank.
    const json = (await res.json()) as { status?: string; at?: string; decidedAt?: string };
    if (json?.status === "approved" || json?.status === "declined") {
      return { decided: true, action: json.status, at: formatDecidedAt(json.at ?? json.decidedAt) };
    }
    return { decided: false };
  } catch (err) {
    // Fail OPEN: if the status webhook is down we allow the decision. Worst
    // case a double-tap re-sends one email; the jsonl still logs both events.
    console.error("[hotel-booking] status check failed:", err instanceof Error ? err.message : err);
    return { decided: false };
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Ben-facing HTML pages (self-contained, inline CSS, mobile-first)
// ---------------------------------------------------------------------------

function page(title: string, inner: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="robots" content="noindex,nofollow"/>
<title>${escapeHtml(title)}</title>
<style>
  body{margin:0;padding:20px 14px;background:#f2f7fb;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#072a45;}
  .card{max-width:480px;margin:0 auto;background:#fff;border-radius:18px;padding:24px 22px;box-shadow:0 12px 40px -16px rgba(7,42,69,.35);}
  h1{font-size:19px;margin:0 0 4px;}
  .sub{font-size:12px;color:#5b7386;margin:0 0 18px;}
  .box{background:#f2f7fb;border-radius:12px;padding:13px 15px;font-size:14px;line-height:1.7;margin:0 0 16px;}
  .row{display:flex;justify-content:space-between;gap:10px;font-size:14px;padding:3px 0;}
  .row span:first-child{color:#5b7386;}
  .row span:last-child{text-align:right;overflow-wrap:anywhere;}
  button{width:100%;border:0;border-radius:999px;padding:14px;font-size:15px;font-weight:600;cursor:pointer;}
  .approve{background:#10b981;color:#fff;margin:0 0 14px;}
  .decline{background:#fff;color:#b42318;border:1.5px solid #f1c6c0;}
  textarea{width:100%;box-sizing:border-box;border:1px solid #d5e2ec;border-radius:12px;padding:10px 12px;font:inherit;font-size:14px;margin:0 0 10px;resize:vertical;}
  .note{font-size:12px;color:#8aa0b2;margin:16px 0 0;line-height:1.6;}
  .ok{color:#10b981;} .no{color:#b42318;}
  .reflabel{margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#5b7386;text-align:center;}
  .ref{display:block;margin:0 0 16px;padding:11px 14px;border:1.5px solid #cfe0ee;border-radius:12px;background:#f2f7fb;text-align:center;
       font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:22px;font-weight:700;letter-spacing:.16em;color:#072a45;}
</style></head><body><div class="card">${inner}</div></body></html>`;
}

function row(label: string, value: string): string {
  return value ? `<div class="row"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>` : "";
}

/** The reference, big and letter-spaced - read it out to the guest on the phone. */
function refBlock(ref: string, label = "Reference"): string {
  return `<p class="reflabel">${escapeHtml(label)}</p><div class="ref">${escapeHtml(ref)}</div>`;
}

function summaryRows(p: TokenPayload): string {
  const nights = Math.round(
    (Date.parse(`${p.checkOut}T00:00:00Z`) - Date.parse(`${p.checkIn}T00:00:00Z`)) / DAY_MS,
  );
  const price = priceLine(p.room, "en");
  return (
    `<div class="box"><strong>${escapeHtml(DATA.rooms[p.room]?.name.en ?? p.room)}</strong>` +
    (price ? `<br/>${escapeHtml(price)}` : "") +
    `</div>` +
    row("Dates", `${p.checkIn} → ${p.checkOut} (${nights}n)`) +
    row("Guests", String(p.guests)) +
    row("Name", p.name) +
    row("Email", p.email) +
    row("Phone", p.phone ?? "") +
    row("Language", p.lang.toUpperCase()) +
    row("Notes", p.notes ?? "")
  );
}

const holdText = () => `฿${HOLD_AMOUNT.toLocaleString("en-US")}`;

/** The money banner on Ben's decision page - what tapping actually does. */
function holdBanner(p: TokenPayload): string {
  if (!p.auth) {
    return `<div class="box">No payment hold on this request (it came in before deposits, or the guest paid nothing). Approving just sends the confirmation.</div>`;
  }
  const sim = p.holdSim ? " <strong>(simulated - no real money)</strong>" : "";
  return (
    `<div class="box"><strong>${escapeHtml(holdText())} held</strong> on the guest's card.${sim}<br/>` +
    `Approve charges it now and credits it against their bill. Decline releases it - they are never charged.</div>`
  );
}

function decisionPageHtml(p: TokenPayload, token: string): string {
  const base = `/api/hotel-booking?t=${encodeURIComponent(token)}`;
  return page(
    `Booking request ${p.ref}`,
    `<h1>Hotel booking request</h1><p class="sub">Siam Hotel &amp; Hostel · decide below, the guest gets emailed automatically</p>` +
      refBlock(p.ref) +
      summaryRows(p) +
      holdBanner(p) +
      `<form method="post" action="${base}&amp;action=approve" style="margin:20px 0 0;">
         <button type="submit" class="approve">Approve - room is available</button>
       </form>
       <form method="post" action="${base}&amp;action=decline">
         <textarea name="alternative" rows="2" maxlength="500" placeholder="Alternative to suggest (optional - goes into the decline email)"></textarea>
         <button type="submit" class="decline">Decline - no availability</button>
       </form>
       <p class="note">Approve ${
         p.auth ? `charges the ${escapeHtml(holdText())} hold, then sends` : "sends"
       } the confirmation + registration link. Decline ${
         p.auth ? "releases the hold, then sends" : "sends"
       } a polite no-availability email (with your alternative, if written). Nothing is sent until you tap.</p>`,
  );
}

/**
 * Capture or void failed. Ben must not be told the guest was emailed, because
 * the guest was not - so this page names the reason and, for an approve that
 * could not take the money, offers to confirm the room anyway with the email
 * wording that says nothing was charged.
 */
function holdFailurePage(
  action: "approve" | "decline",
  code: HoldFailure,
  p: TokenPayload,
  token: string,
): string {
  const base = `/api/hotel-booking?t=${encodeURIComponent(token)}`;
  const heading = action === "approve" ? "Could not charge the hold" : "Could not release the hold";
  const canOverride = action === "approve" && code !== "already_captured";
  return page(
    heading,
    `<h1><span class="no">${escapeHtml(heading)}</span></h1>
     <p class="sub">Nothing was sent to the guest</p>` +
      refBlock(p.ref) +
      `<div class="box">${escapeHtml(holdFailureText(code, action === "approve" ? "capture" : "release"))}</div>` +
      `<div class="box">${escapeHtml(p.name)} (${escapeHtml(p.email)}) has <strong>not</strong> been emailed. ${
        action === "approve"
          ? "Decide what to do with the money first."
          : "Sort the payment out in PayPal, then tell them yourself - or reload this link and try again."
      }</div>` +
      (canOverride
        ? `<form method="post" action="${base}&amp;action=approve" style="margin:20px 0 0;">
             <input type="hidden" name="nopay" value="1"/>
             <button type="submit" class="approve">Approve anyway - no payment taken</button>
           </form>
           <p class="note">Sends the confirmation with the full amount due at reception, and says nothing about a prepayment. Use this when the hold lapsed but you still want the guest.</p>`
        : `<p class="note">Reload this link once the payment side is sorted and decide again.</p>`),
  );
}

function decidedPage(action: string, at: string, ref: string): string {
  const ok = action === "approved";
  return page(
    `Already ${action}`,
    `<h1>Already <span class="${ok ? "ok" : "no"}">${escapeHtml(action)}</span></h1>
     <p class="sub">Booking request</p>` +
      refBlock(ref) +
      `<div class="box">This request was ${escapeHtml(action)} at ${escapeHtml(at)}. No further email was sent to the guest.</div>`,
  );
}

function donePage(
  action: "approved" | "declined",
  p: TokenPayload,
  emailMode: EmailMode,
  money: { captured: boolean; released: boolean },
): string {
  const ok = action === "approved";
  const sim = p.holdSim ? " (simulated - no real money moved)" : "";
  const moneyLine = money.captured
    ? `<div class="box"><strong>${escapeHtml(holdText())} charged${escapeHtml(sim)}</strong> - credited against their bill, the rest is due at reception.</div>`
    : money.released
      ? `<div class="box"><strong>${escapeHtml(holdText())} released${escapeHtml(sim)}</strong> - the guest was never charged.</div>`
      : p.auth
        ? `<div class="box"><strong>No payment taken.</strong> The full amount is due at reception, and the email says so.</div>`
        : "";
  return page(
    `Done - ${action}`,
    `<h1><span class="${ok ? "ok" : "no"}">${ok ? "Approved" : "Declined"}</span> - guest emailed</h1>
     <p class="sub">Booking request</p>` +
      refBlock(p.ref) +
      moneyLine +
      `<div class="box">${escapeHtml(p.name)} (${escapeHtml(p.email)}) just received the ${
       ok ? "confirmation email with the registration link" : "no-availability email"
     }.${emailMode === "log" ? " <strong>(log-only mode - no real email was sent)</strong>" : ""}</div>`,
  );
}

function errorPage(title: string, msg: string): string {
  return page(title, `<h1>${escapeHtml(title)}</h1><div class="box">${escapeHtml(msg)}</div>`);
}

// ---------------------------------------------------------------------------
// Engine - one entry point shared by the Vercel handler and the Vite dev
// middleware, so localhost behaves exactly like prod.
// ---------------------------------------------------------------------------

export interface EngineInput {
  method: string;
  query: Record<string, string | undefined>;
  body: unknown;
  ip: string;
  now?: number;
}

export interface EngineOutput {
  status: number;
  contentType: "application/json" | "text/html; charset=utf-8";
  body: string;
}

const json = (status: number, obj: unknown): EngineOutput => ({
  status,
  contentType: "application/json",
  body: JSON.stringify(obj),
});
const html = (status: number, body: string): EngineOutput => ({
  status,
  contentType: "text/html; charset=utf-8",
  body,
});

export async function processRequest(input: EngineInput): Promise<EngineOutput> {
  const now = input.now ?? Date.now();
  const method = input.method.toUpperCase();
  const t = input.query.t;
  const action = input.query.action;

  if (method === "GET") {
    if (action === "payment-config") return paymentConfig();
    if (!t) return json(400, { error: "missing_token" });
    return decisionPage(t, now);
  }
  if (method !== "POST") return json(405, { error: "method_not_allowed" });

  if (action === "register") return register(input.body, now);
  if (action === "hold") return startHold(input, now);
  if (action === "confirm-hold") return confirmHold(input, now);
  if (t) {
    if (action !== "approve" && action !== "decline") return json(400, { error: "invalid_action" });
    return decide(t, action, input.body, now);
  }
  // A request with no money behind it is exactly what this change removed.
  return json(400, { error: "hold_required" });
}

// -- stage 0: what the booking sheet needs to draw the payment step -----------

function paymentConfig(): EngineOutput {
  const provider = getHoldProvider();
  return json(200, {
    provider: provider.name,
    simulated: provider.simulated,
    ...(provider.clientId && { clientId: provider.clientId }),
    env: provider.env,
    amount: HOLD_AMOUNT,
    currency: HOLD_CURRENCY,
  });
}

// -- stage 1a: validate, then open the authorization ---------------------------
//
// Order of operations matters and is the whole point of this endpoint: every
// cheap rejection (rate limit, honeypot, bot timing, field validation, dedupe)
// happens BEFORE the provider is contacted, and no request/email/notification
// exists until the money is actually held in stage 1b.

const HOLD_TOKEN_TTL_MS = 30 * 60_000;

async function startHold(input: EngineInput, now: number): Promise<EngineOutput> {
  if (rateLimited(input.ip, now)) return json(429, { error: "rate_limited" });

  const body = (input.body ?? {}) as Record<string, unknown>;
  if (JSON.stringify(body).length > 20_000) return json(413, { error: "payload_too_large" });

  const provider = getHoldProvider();
  const holdModeFlag = provider.simulated ? ({ holdMode: "simulated" } as const) : undefined;

  // Honeypot: bots fill the invisible "website" field. Hand back a decoy hold
  // that looks exactly like a real one, so they cannot tell they were caught -
  // but it never reaches a provider and confirming it sends nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    console.log("[hotel-booking] honeypot tripped from", input.ip);
    const decoyRef = makeRef(now);
    return json(200, {
      ok: true,
      ref: decoyRef,
      orderId: `SIMORDER-${randomBytes(9).toString("base64url")}`,
      provider: "simulated",
      simulated: true,
      amount: HOLD_AMOUNT,
      currency: HOLD_CURRENCY,
      holdToken: signToken({
        typ: "hold",
        decoy: true,
        ref: decoyRef,
        room: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
        name: "",
        email: "",
        lang: "en",
        exp: now + HOLD_TOKEN_TTL_MS,
      }),
      ...holdModeFlag,
    });
  }

  // Min time-to-submit: the form sends the timestamp it was opened at.
  const openedAt = Number(body.openedAt);
  if (!Number.isFinite(openedAt) || now - openedAt < MIN_SUBMIT_MS) {
    return json(400, { error: "too_fast" });
  }

  const v = validateRequest(body, now);
  if (!v.ok) return json(400, { error: v.error });
  const req = v.data;

  // Per-email dedupe: a double submit within 10 min returns the ref that was
  // already issued and - crucially - opens no second authorization.
  const dedupeKey = req.email.toLowerCase();
  const recent = recentByEmail.get(dedupeKey);
  if (recent && now - recent.at < DEDUPE_WINDOW_MS) {
    return json(200, { ok: true, duplicate: true, ref: recent.ref, ...holdModeFlag });
  }
  if (recentByEmail.size > 5000) {
    for (const [k, r] of recentByEmail) {
      if (now - r.at >= DEDUPE_WINDOW_MS) recentByEmail.delete(k);
    }
  }

  const ref = makeRef(now);
  const nonce = randomBytes(12).toString("base64url");
  const roomName = DATA.rooms[req.room]?.name.en ?? req.room;

  const started = await provider.startHold({
    nonce,
    ref,
    description: `${DATA.hotel.name} - ${roomName}, ${req.checkIn} to ${req.checkOut} (${ref})`,
    returnUrl: hotelPageUrl(req.lang),
    cancelUrl: hotelPageUrl(req.lang),
  });
  if (!started.ok) {
    console.error("[hotel-booking] hold could not be opened:", started.code, started.message);
    return json(502, { error: "hold_failed", code: started.code });
  }

  const holdToken = signToken({
    typ: "hold",
    nonce,
    ref,
    room: req.room,
    checkIn: req.checkIn,
    checkOut: req.checkOut,
    guests: req.guests,
    name: req.name,
    email: req.email,
    phone: req.phone,
    notes: req.notes,
    lang: req.lang,
    exp: now + HOLD_TOKEN_TTL_MS,
  });

  return json(200, {
    ok: true,
    ref,
    holdToken,
    orderId: started.orderId,
    ...(started.approveUrl && { approveUrl: started.approveUrl }),
    provider: provider.name,
    simulated: provider.simulated,
    amount: HOLD_AMOUNT,
    currency: HOLD_CURRENCY,
    ...holdModeFlag,
  });
}

// -- stage 1b: money is held -> the request may now exist ----------------------

async function confirmHold(input: EngineInput, now: number): Promise<EngineOutput> {
  const body = (input.body ?? {}) as Record<string, unknown>;
  if (JSON.stringify(body).length > 20_000) return json(413, { error: "payload_too_large" });

  const v = verifyToken(typeof body.holdToken === "string" ? body.holdToken : "", secret(), now);
  if (!v.ok) return json(v.reason === "expired" ? 410 : 400, { error: `hold_${v.reason}` });
  const p = v.payload;
  if (p.typ !== "hold") return json(400, { error: "hold_invalid" });

  const provider = getHoldProvider();
  const holdModeFlag = provider.simulated ? ({ holdMode: "simulated" } as const) : undefined;
  const emailModeFlag = process.env.RESEND_API_KEY ? undefined : ({ emailMode: "log" } as const);

  // The honeypot decoy from stage 1a: same success shape, nothing happens.
  if (p.decoy) return json(200, { ok: true, ref: p.ref, ...emailModeFlag, ...holdModeFlag });

  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  if (!orderId || orderId.length > 100) return json(400, { error: "invalid_order" });

  // Second dedupe read: a guest who double-approves inside the 10-minute window
  // gets the ref they already have instead of a second request.
  const dedupeKey = p.email.toLowerCase();
  const recent = recentByEmail.get(dedupeKey);
  if (recent && now - recent.at < DEDUPE_WINDOW_MS) {
    return json(200, { ok: true, duplicate: true, ref: recent.ref, ...emailModeFlag, ...holdModeFlag });
  }

  const held = await provider.authorizeHold(orderId, p.nonce ?? "");
  if (!held.ok) {
    // No authorization means no request, no email to the guest, no ping to Ben.
    console.error("[hotel-booking] authorization failed:", held.code, held.message);
    return json(402, { error: "hold_not_authorized", code: held.code });
  }

  const req: BookingRequest = {
    room: p.room,
    checkIn: p.checkIn,
    checkOut: p.checkOut,
    nights: Math.round((Date.parse(`${p.checkOut}T00:00:00Z`) - Date.parse(`${p.checkIn}T00:00:00Z`)) / DAY_MS),
    guests: p.guests,
    name: p.name,
    email: p.email,
    phone: p.phone,
    notes: p.notes,
    lang: p.lang,
  };
  const ref = p.ref;

  // Decide-token stays valid until the day after check-in (Ben can still act
  // on a same-day request the next morning); +2d from check-in midnight UTC
  // comfortably covers that in Bangkok time. It carries the authorization id -
  // with no database, this token IS the record of the held money.
  const decideToken = signToken({
    typ: "decide",
    ref,
    room: req.room,
    checkIn: req.checkIn,
    checkOut: req.checkOut,
    guests: req.guests,
    name: req.name,
    email: req.email,
    phone: req.phone,
    notes: req.notes,
    lang: req.lang,
    auth: held.id,
    ...(held.simulated && { holdSim: true }),
    exp: Date.parse(`${req.checkIn}T00:00:00Z`) + 2 * DAY_MS,
  });
  const decideUrl = `${baseUrl()}/api/hotel-booking?t=${decideToken}`;

  // 1) Provisional email to the guest - this one is allowed to fail the
  //    request (guest must know we got it; dedupe is stored only on success
  //    so a retry works).
  let emailMode: EmailMode;
  try {
    const email = buildEmail("provisional", req.lang, { ...req, ref });
    emailMode = await sendEmail(req.email, email.subject, email.html);
  } catch (err) {
    console.error("[hotel-booking] provisional email failed:", err instanceof Error ? err.message : err);
    return json(502, { error: "email_failed" });
  }

  // 2) Staff notification via n8n - never fails the request. The authorization
  //    id goes into the audit log here so the droplet's jsonl can reconcile
  //    against PayPal even if the decide link is never opened.
  await notifyStaff({
    event: "requested",
    ref,
    room: req.room,
    checkIn: req.checkIn,
    checkOut: req.checkOut,
    guests: req.guests,
    name: req.name,
    email: req.email,
    phone: req.phone ?? null,
    lang: req.lang,
    notes: req.notes ?? null,
    decideUrl,
    holdAuthId: held.id,
    holdOrderId: orderId,
    holdAmount: HOLD_AMOUNT,
    holdCurrency: HOLD_CURRENCY,
    holdProvider: provider.name,
    holdSimulated: provider.simulated,
  });

  recentByEmail.set(dedupeKey, { ref, at: now });
  return json(200, { ok: true, ref, ...(emailMode === "log" && { emailMode }), ...holdModeFlag });
}

// -- stage 2: Ben decides -----------------------------------------------------

async function decisionPage(token: string, now: number): Promise<EngineOutput> {
  const v = verifyToken(token, secret(), now);
  if (!v.ok) {
    return html(
      v.reason === "expired" ? 410 : 400,
      errorPage(
        v.reason === "expired" ? "Link expired" : "Invalid link",
        v.reason === "expired"
          ? "This decision link has expired (check-in has passed). If the guest is still waiting, reach them directly."
          : "This link is not a valid booking-decision link.",
      ),
    );
  }
  if (v.payload.typ !== "decide") return html(400, errorPage("Invalid link", "Wrong token type for this page."));

  // Read-only status peek so an already-decided request shows its outcome
  // instead of live buttons. Fails open to showing the buttons.
  const status = await fetchDecisionStatus(v.payload.ref);
  if (status.decided) return html(200, decidedPage(status.action, status.at, v.payload.ref));

  return html(200, decisionPageHtml(v.payload, token));
}

async function decide(
  token: string,
  action: "approve" | "decline",
  rawBody: unknown,
  now: number,
): Promise<EngineOutput> {
  const body = (rawBody ?? {}) as Record<string, unknown>;
  const v = verifyToken(token, secret(), now);
  if (!v.ok) {
    return html(
      v.reason === "expired" ? 410 : 400,
      errorPage(v.reason === "expired" ? "Link expired" : "Invalid link", "This decision link is no longer usable."),
    );
  }
  const p = v.payload;
  if (p.typ !== "decide") return html(400, errorPage("Invalid link", "Wrong token type."));

  // Idempotency: if the jsonl already has a decision for this ref, show it and
  // send NOTHING (double-tap / two staff phones safety).
  const status = await fetchDecisionStatus(p.ref);
  if (status.decided) return html(200, decidedPage(status.action, status.at, p.ref));

  const req: BookingRequest & { ref: string } = {
    room: p.room,
    checkIn: p.checkIn,
    checkOut: p.checkOut,
    nights: Math.round((Date.parse(`${p.checkOut}T00:00:00Z`) - Date.parse(`${p.checkIn}T00:00:00Z`)) / DAY_MS),
    guests: p.guests,
    name: p.name,
    email: p.email,
    phone: p.phone,
    notes: p.notes,
    lang: p.lang,
    ref: p.ref,
  };

  let emailMode: EmailMode;
  let alternative: string | undefined;

  // ---- the money moves BEFORE the guest is told anything ----
  //
  // Tokens minted before deposits existed carry no `auth`; they decide exactly
  // as they always did, and their emails render the no-money wording.
  const provider = getHoldProvider();
  const hasHold = typeof p.auth === "string" && p.auth.length > 0;
  // "Approve anyway" - the only escape hatch, offered on the capture-failure
  // page. It confirms the room and says plainly that nothing was charged.
  const skipCapture = action === "approve" && body.nopay === "1";
  let captured = false;
  let released = false;

  if (hasHold && !skipCapture) {
    const outcome =
      action === "approve" ? await provider.captureHold(p.auth!) : await provider.voidHold(p.auth!);

    if (!outcome.ok) {
      // Never claim the guest was emailed when the money step failed. Ben sees
      // the real reason; the audit log gets it too.
      await notifyStaff({
        event: action === "approve" ? "capture_failed" : "void_failed",
        ref: p.ref,
        room: p.room,
        checkIn: p.checkIn,
        checkOut: p.checkOut,
        name: p.name,
        email: p.email,
        lang: p.lang,
        holdAuthId: p.auth,
        holdAmount: HOLD_AMOUNT,
        holdCurrency: HOLD_CURRENCY,
        holdErrorCode: outcome.code,
        holdErrorMessage: outcome.message,
      });
      console.error(
        `[hotel-booking] ${action === "approve" ? "capture" : "void"} failed for ${p.ref}:`,
        outcome.code,
        outcome.message,
      );
      return html(
        200,
        holdFailurePage(action, outcome.code, p, token),
      );
    }
    captured = action === "approve";
    released = action === "decline";
  }

  if (action === "approve") {
    // Guest token lets the guest open /hotel/book until their check-out day
    // has fully passed in Bangkok (+1d from check-out midnight UTC).
    const guestToken = signToken({
      typ: "guest",
      ref: p.ref,
      room: p.room,
      checkIn: p.checkIn,
      checkOut: p.checkOut,
      guests: p.guests,
      name: p.name,
      email: p.email,
      lang: p.lang,
      exp: Date.parse(`${p.checkOut}T00:00:00Z`) + DAY_MS,
    });
    const registerUrl = `${baseUrl()}/hotel/book?ref=${guestToken}`;
    try {
      const email = buildEmail("final", p.lang, req, { registerUrl, prepaid: captured });
      emailMode = await sendEmail(p.email, email.subject, email.html);
    } catch (err) {
      console.error("[hotel-booking] final email failed:", err instanceof Error ? err.message : err);
      return html(502, errorPage("Email failed", "The confirmation email could not be sent. Tap back and try again."));
    }
  } else {
    alternative = typeof body.alternative === "string" ? body.alternative.trim().slice(0, 500) : undefined;
    try {
      const email = buildEmail("decline", p.lang, req, { alternative, released });
      emailMode = await sendEmail(p.email, email.subject, email.html);
    } catch (err) {
      console.error("[hotel-booking] decline email failed:", err instanceof Error ? err.message : err);
      return html(502, errorPage("Email failed", "The decline email could not be sent. Tap back and try again."));
    }
  }

  // Log the decision to the jsonl (also what makes the idempotency check
  // catch the second tap). Never blocks the page.
  await notifyStaff({
    event: action === "approve" ? "approved" : "declined",
    ref: p.ref,
    room: p.room,
    checkIn: p.checkIn,
    checkOut: p.checkOut,
    guests: p.guests,
    name: p.name,
    email: p.email,
    lang: p.lang,
    ...(alternative ? { alternative } : {}),
    holdAuthId: p.auth ?? null,
    holdAmount: hasHold ? HOLD_AMOUNT : null,
    holdCurrency: hasHold ? HOLD_CURRENCY : null,
    holdOutcome: captured ? "captured" : released ? "voided" : skipCapture ? "skipped" : "none",
    holdSimulated: p.holdSim === true || provider.simulated,
  });

  return html(
    200,
    donePage(action === "approve" ? "approved" : "declined", p, emailMode, { captured, released }),
  );
}

// -- stage 3: guest registration ---------------------------------------------

async function register(body: unknown, now: number): Promise<EngineOutput> {
  const b = (body ?? {}) as Record<string, unknown>;
  if (JSON.stringify(b).length > 20_000) return json(413, { error: "payload_too_large" });

  const v = verifyToken(typeof b.token === "string" ? b.token : "", secret(), now);
  if (!v.ok) return json(v.reason === "expired" ? 410 : 400, { error: `token_${v.reason}` });
  if (v.payload.typ !== "guest") return json(400, { error: "token_invalid" });

  const d = (b.details ?? {}) as Record<string, unknown>;
  const str = (x: unknown, max: number) => (typeof x === "string" ? x.trim().slice(0, max) : "");
  const details = {
    arrivalTime: str(d.arrivalTime, 100),
    ferry: str(d.ferry, 100),
    nationality: str(d.nationality, 100),
    requests: str(d.requests, 500),
  };

  await notifyStaff({
    event: "registration_completed",
    ref: v.payload.ref,
    room: v.payload.room,
    checkIn: v.payload.checkIn,
    checkOut: v.payload.checkOut,
    name: v.payload.name,
    email: v.payload.email,
    lang: v.payload.lang,
    details,
  });

  return json(200, { ok: true });
}

// ---------------------------------------------------------------------------
// Vercel handler
// ---------------------------------------------------------------------------

export function clientIp(req: VercelRequest): string {
  const xff = req.headers["x-forwarded-for"];
  const raw = Array.isArray(xff) ? xff[0] : xff;
  return raw?.split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    setLinkBase(req);
    const query: Record<string, string | undefined> = {};
    for (const [k, val] of Object.entries(req.query ?? {})) {
      query[k] = Array.isArray(val) ? val[0] : val;
    }
    let body: unknown = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const out = await processRequest({ method: req.method ?? "GET", query, body, ip: clientIp(req) });
    res.status(out.status).setHeader("Content-Type", out.contentType).send(out.body);
  } catch (err) {
    console.error("[api/hotel-booking]", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "internal_error" });
  }
}
