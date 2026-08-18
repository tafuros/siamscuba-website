// Vercel serverless function: the Siam Hotel & Hostel two-stage booking engine.
//
// One self-contained function (pattern: api/chat.ts - the project root is
// "type": "module", so Vercel ships raw ESM and does NOT bundle sibling files;
// everything is inlined and data is read via fs from api/_hotel-data.json,
// shipped through vercel.json -> functions.includeFiles).
//
// Internal routing (method + query):
//   POST                        (no query) create a booking request:
//        validate -> provisional email to the guest (Resend) -> notify staff
//        via n8n -> respond {ok, ref}. Honeypot + min-time-to-submit +
//        per-email dedupe + per-IP rate limit.
//   GET  ?t=<decide-token>       Ben's decision page. STRICTLY read-only
//        (email/WhatsApp link scanners must not be able to trigger a decision).
//   POST ?t=<decide-token>&action=approve|decline
//        idempotency check against the n8n status webhook, then final email
//        (approve) or polite decline email, then log the event to n8n.
//   POST ?action=register        guest registration completion
//        body {token, details} - verify guest-token, log event to n8n.
//
// Tokens: HMAC-SHA256 (node:crypto), format base64url(payload).base64url(sig).
//   decide-token: typ "decide", exp ~ check-in + 1 day
//   guest-token:  typ "guest",  exp ~ check-out
//
// n8n contract (workflow built separately in the Nemo repo - keep in sync):
//   POST ${HOTEL_NOTIFY_URL}                 header X-Hotel-Token
//        body {event: "requested"|"approved"|"declined"|"registration_completed", ref, ...}
//   GET  ${HOTEL_NOTIFY_URL}-status?ref=<ref> header X-Hotel-Token
//        -> 200 {status: "requested"|"approved"|"declined", decidedAt?: string}
//   n8n being down NEVER fails a guest request (log + continue) and the status
//   check fails OPEN (undecided) - the jsonl on the droplet is the audit trail.
//
// Env (Ben installs in the Vercel dashboard - never hardcoded):
//   RESEND_API_KEY       unset -> LOG-ONLY email mode (payloads to console,
//                        responses carry {emailMode:"log"}; everything else works)
//   HOTEL_BOOKING_SECRET unset -> dev fallback secret (fine locally; MUST be set
//                        in prod before go-live or tokens are forgeable)
//   HOTEL_NOTIFY_URL / HOTEL_NOTIFY_TOKEN  unset -> notify skipped (logged)

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
const EMAIL_FROM = "Siam Hotel & Hostel <hotel@siamscuba.com>";
const EMAIL_REPLY_TO = "hotel@siamscuba.com";
const MAX_NIGHTS = 30;
const MAX_GUESTS = 6;
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
}

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

export interface TokenPayload {
  typ: "decide" | "guest";
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

/** `HB-<base36 timestamp>-<4 random base36 chars>`, e.g. HB-mek3q1v0-x7f2 */
export function makeRef(now = Date.now()): string {
  let rand = "";
  while (rand.length < 4) {
    rand += (randomBytes(1)[0] % 36).toString(36);
  }
  return `HB-${now.toString(36)}-${rand}`;
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
  if (!DATE_RE.test(checkIn) || !DATE_RE.test(checkOut)) return { ok: false, error: "invalid_dates" };
  const ci = Date.parse(`${checkIn}T00:00:00Z`);
  const co = Date.parse(`${checkOut}T00:00:00Z`);
  if (!Number.isFinite(ci) || !Number.isFinite(co)) return { ok: false, error: "invalid_dates" };
  if (checkIn < bangkokToday(now)) return { ok: false, error: "invalid_dates" };
  const nights = Math.round((co - ci) / DAY_MS);
  if (nights < 1 || nights > MAX_NIGHTS) return { ok: false, error: "invalid_dates" };

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

/** Compose one of the 3 emails in the guest's language. Exported for tests. */
export function buildEmail(
  kind: "provisional" | "final" | "decline",
  lang: Lang,
  req: BookingRequest & { ref: string },
  extra: { registerUrl?: string; alternative?: string } = {},
): { subject: string; html: string } {
  const tpl = DATA.emails[kind][lang];
  const vars: Record<string, string | number | undefined> = {
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
    const json = (await res.json()) as { status?: string; decidedAt?: string };
    if (json?.status === "approved" || json?.status === "declined") {
      return { decided: true, action: json.status, at: json.decidedAt ?? "unknown time" };
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
</style></head><body><div class="card">${inner}</div></body></html>`;
}

function row(label: string, value: string): string {
  return value ? `<div class="row"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>` : "";
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
    row("Notes", p.notes ?? "") +
    row("Ref", p.ref)
  );
}

function decisionPageHtml(p: TokenPayload, token: string): string {
  const base = `/api/hotel-booking?t=${encodeURIComponent(token)}`;
  return page(
    `Booking request ${p.ref}`,
    `<h1>Hotel booking request</h1><p class="sub">Siam Hotel &amp; Hostel · decide below, the guest gets emailed automatically</p>` +
      summaryRows(p) +
      `<form method="post" action="${base}&amp;action=approve" style="margin:20px 0 0;">
         <button type="submit" class="approve">Approve - room is available</button>
       </form>
       <form method="post" action="${base}&amp;action=decline">
         <textarea name="alternative" rows="2" maxlength="500" placeholder="Alternative to suggest (optional - goes into the decline email)"></textarea>
         <button type="submit" class="decline">Decline - no availability</button>
       </form>
       <p class="note">Approve sends the confirmation + registration link. Decline sends a polite no-availability email (with your alternative, if written). Nothing is sent until you tap.</p>`,
  );
}

function decidedPage(action: string, at: string, ref: string): string {
  const ok = action === "approved";
  return page(
    `Already ${action}`,
    `<h1>Already <span class="${ok ? "ok" : "no"}">${escapeHtml(action)}</span></h1>
     <p class="sub">Request ${escapeHtml(ref)}</p>
     <div class="box">This request was ${escapeHtml(action)} at ${escapeHtml(at)}. No further email was sent to the guest.</div>`,
  );
}

function donePage(action: "approved" | "declined", p: TokenPayload, emailMode: EmailMode): string {
  const ok = action === "approved";
  return page(
    `Done - ${action}`,
    `<h1><span class="${ok ? "ok" : "no"}">${ok ? "Approved" : "Declined"}</span> - guest emailed</h1>
     <p class="sub">Request ${escapeHtml(p.ref)}</p>
     <div class="box">${escapeHtml(p.name)} (${escapeHtml(p.email)}) just received the ${
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
    if (!t) return json(400, { error: "missing_token" });
    return decisionPage(t, now);
  }
  if (method !== "POST") return json(405, { error: "method_not_allowed" });

  if (action === "register") return register(input.body, now);
  if (t) {
    if (action !== "approve" && action !== "decline") return json(400, { error: "invalid_action" });
    return decide(t, action, input.body, now);
  }
  return createRequest(input, now);
}

// -- stage 1: guest request ---------------------------------------------------

async function createRequest(input: EngineInput, now: number): Promise<EngineOutput> {
  if (rateLimited(input.ip, now)) return json(429, { error: "rate_limited" });

  const body = (input.body ?? {}) as Record<string, unknown>;
  if (JSON.stringify(body).length > 20_000) return json(413, { error: "payload_too_large" });

  const emailModeFlag = process.env.RESEND_API_KEY ? undefined : ("log" as const);

  // Honeypot: bots fill the invisible "website" field. Fake a success (same
  // shape as the real one) so they can't tell they were caught. No email.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    console.log("[hotel-booking] honeypot tripped from", input.ip);
    return json(200, { ok: true, ref: makeRef(now), ...(emailModeFlag && { emailMode: emailModeFlag }) });
  }

  // Min time-to-submit: the form sends the timestamp it was opened at.
  const openedAt = Number(body.openedAt);
  if (!Number.isFinite(openedAt) || now - openedAt < MIN_SUBMIT_MS) {
    return json(400, { error: "too_fast" });
  }

  const v = validateRequest(body, now);
  if (!v.ok) return json(400, { error: v.error });
  const req = v.data;

  // Per-email dedupe: double-submit within 10 min returns the same ref and
  // does not re-email.
  const dedupeKey = req.email.toLowerCase();
  const recent = recentByEmail.get(dedupeKey);
  if (recent && now - recent.at < DEDUPE_WINDOW_MS) {
    return json(200, { ok: true, ref: recent.ref, ...(emailModeFlag && { emailMode: emailModeFlag }) });
  }
  if (recentByEmail.size > 5000) {
    for (const [k, r] of recentByEmail) {
      if (now - r.at >= DEDUPE_WINDOW_MS) recentByEmail.delete(k);
    }
  }

  const ref = makeRef(now);

  // Decide-token stays valid until the day after check-in (Ben can still act
  // on a same-day request the next morning); +2d from check-in midnight UTC
  // comfortably covers that in Bangkok time.
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
    exp: Date.parse(`${req.checkIn}T00:00:00Z`) + 2 * DAY_MS,
  });
  const decideUrl = `${PUBLIC_BASE}/api/hotel-booking?t=${decideToken}`;

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

  // 2) Staff notification via n8n - never fails the request.
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
  });

  recentByEmail.set(dedupeKey, { ref, at: now });
  return json(200, { ok: true, ref, ...(emailMode === "log" && { emailMode }) });
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
  body: unknown,
  now: number,
): Promise<EngineOutput> {
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
    const registerUrl = `${PUBLIC_BASE}/hotel/book?ref=${guestToken}`;
    try {
      const email = buildEmail("final", p.lang, req, { registerUrl });
      emailMode = await sendEmail(p.email, email.subject, email.html);
    } catch (err) {
      console.error("[hotel-booking] final email failed:", err instanceof Error ? err.message : err);
      return html(502, errorPage("Email failed", "The confirmation email could not be sent. Tap back and try again."));
    }
  } else {
    const b = (body ?? {}) as Record<string, unknown>;
    alternative = typeof b.alternative === "string" ? b.alternative.trim().slice(0, 500) : undefined;
    try {
      const email = buildEmail("decline", p.lang, req, { alternative });
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
  });

  return html(200, donePage(action === "approve" ? "approved" : "declined", p, emailMode));
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
