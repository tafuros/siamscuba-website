/**
 * Siam Scuba — Conversion Tracking Utilities
 * Wraps gtag() and fbq() so every conversion event fires to both Google Ads/GA4
 * and Meta Pixel from a single function. Keeping the calls paired here prevents
 * the "added GA but forgot Meta" drift as new events get added.
 */

import { getStoredUtm, getStoredGclid, type UtmParams } from "@/utils/utm";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    clarity?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = "AW-18050429438";
const CONVERSION_LABEL = "u_9ACKH36KMcEP7jjp9D";
// "Booking - Pay Later": a confirmed booking with no deposit paid yet.
// Lower-tier conversion than a paid Purchase, fired WITHOUT a value.
const BOOKING_PAY_LATER_LABEL = "9WY5CICH4rscEP7jjp9D";

// Per-event Google Ads conversion labels. Fill in real labels from
// Google Ads → Goals → Conversions after creating the actions. Until set,
// the events still fire as gtag events (and to GA4) but won't count as
// Google Ads conversions. See docs/google-ads-blueprint.md §10.
const LEAD_CONVERSION_LABEL: string | null = "XvmFCNXAjrMcEP7jjp9D";
const WHATSAPP_CONVERSION_LABEL: string | null = "GDJZCNjAjrMcEP7jjp9D";

function gtag(...args: unknown[]): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

function fbq(...args: unknown[]): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

function utmFields(): Record<string, string | undefined> {
  const utm: UtmParams = getStoredUtm();
  if (!utm.source) return {};
  return {
    campaign_source: utm.source,
    campaign_medium: utm.medium,
    campaign_name: utm.campaign,
    campaign_content: utm.content,
    campaign_term: utm.term,
  };
}

// ── Enhanced Conversions for Web (user-provided data) ────────────────────────
// Google Ads matches conversions to ad clicks more accurately when the page
// sends the customer's email/phone alongside the conversion. We send UNHASHED
// data via gtag('set','user_data',{...}); Google normalizes + SHA-256 hashes it
// client-side before it leaves the browser - we must NOT pre-hash (double-hash
// = no match). `allow_enhanced_conversions: true` is set on the AW config in
// index.html. `set` associates the data with every SUBSEQUENT event on the
// page, so it MUST be called BEFORE the conversion event fires.
// Spec: https://support.google.com/google-ads/answer/13258081
//
// Consent: this is gated by Google Consent Mode v2. Defaults are 'denied'
// (index.html) and only flip to 'granted' when the visitor accepts cookies
// (CookieConsent.tsx -> ad_user_data: granted). When ad_user_data is denied,
// gtag withholds the user_data payload from the conversion ping, so no
// unconsented PII is transmitted - the set() call is harmless in that state.

export interface EnhancedConversionData {
  /** Raw email, lower-cased/trimmed by Google. Leave undefined if unknown. */
  email?: string | null;
  /** Phone in E.164 (e.g. +66825068898). Google normalizes; we light-clean. */
  phone?: string | null;
}

/** Strip spaces, dashes, parens from a phone so it reads closer to E.164. */
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s().-]/g, "");
  return cleaned.startsWith("+") ? cleaned : cleaned;
}

/**
 * Sets enhanced-conversion user data for subsequent conversion events.
 * No-op when neither field is present, so it's safe to call unconditionally.
 */
function setEnhancedConversionData(data?: EnhancedConversionData): void {
  if (!data) return;
  const userData: Record<string, string> = {};
  const email = data.email?.trim();
  if (email) userData.email = email.toLowerCase();
  const phone = data.phone?.trim();
  if (phone) userData.phone_number = normalizePhone(phone);
  if (Object.keys(userData).length === 0) return;
  gtag("set", "user_data", userData);
}

export interface WhatsAppClickParams {
  location: string;
  url?: string;
}

export function trackWhatsAppClick(params: WhatsAppClickParams): void {
  gtag("event", "whatsapp_click", {
    event_category: "engagement",
    event_label: params.location,
    url: params.url,
    ...utmFields(),
  });
  if (WHATSAPP_CONVERSION_LABEL) {
    gtag("event", "conversion", {
      send_to: `${GA_MEASUREMENT_ID}/${WHATSAPP_CONVERSION_LABEL}`,
    });
  }
  fbq("track", "Contact", { location: params.location });
}

export interface WhatsAppFastPathClickParams {
  /** Wizard product code when known (e.g. "SAILROCK"). */
  product?: string;
  /** Selected dive date when known (ISO). */
  date?: string;
  /** The wa.me href that was clicked (carries the prefill). */
  url?: string;
}

/**
 * Fired when the visitor taps the WhatsApp fast-path strip on the booking
 * page (funnel-fix spec Part 2). A SIGNAL, not a conversion - no Google Ads
 * send_to, so it never inflates conversion counts. Fires to:
 * - GTM/GA4 via a plain dataLayer push (GTM custom-event triggers key on it)
 * - gtag (GA4 event stream)
 * - Microsoft Clarity custom event (filterable in recordings/heatmaps)
 * - Meta as a custom event (house rule: GA and Meta stay paired)
 */
export function trackWhatsAppFastPathClick(
  params: WhatsAppFastPathClickParams,
): void {
  if (typeof window !== "undefined") {
    window.dataLayer?.push({
      event: "whatsapp_fastpath_click",
      product: params.product,
      dive_date: params.date,
      url: params.url,
    });
    if (typeof window.clarity === "function") {
      window.clarity("event", "whatsapp_fastpath_click");
    }
  }
  gtag("event", "whatsapp_fastpath_click", {
    event_category: "engagement",
    event_label: "booking_page_strip",
    product: params.product,
    dive_date: params.date,
    ...utmFields(),
  });
  fbq("trackCustom", "WhatsAppFastPathClick", { product: params.product });
}

// ── Booking wizard step funnel ───────────────────────────────────────────────
// The DiveOS customer wizard (embedded iframe on /fun-dive-booking) posts
// SIAM_BOOKING_STEP on every step change. Step semantics are the TRIP-FIRST
// order deployed 2026-07-08 (7 steps - supersedes the old 6-step order where
// 1=personal, 2=activities, ... 6=deposit):
//   1 trip · 2 contact (SIAM_BOOKING_LEAD fires here) · 3 personal ·
//   4 medical · 5 waiver · 6 accommodation · 7 review (deposit)
// We NEVER forward the raw number alone to analytics - every event carries the
// step NAME so GA4/GTM/Clarity funnels stay readable even if DiveOS reorders
// steps again (only this map would change).
export const BOOKING_STEP_NAMES: Record<number, string> = {
  1: "trip",
  2: "contact",
  3: "personal",
  4: "medical",
  5: "waiver",
  6: "accommodation",
  7: "review",
};

export interface BookingStepParams {
  /** Wizard step index, 1-7 (trip-first order). */
  step: number;
  /** Navigation direction reported by the wizard. */
  direction?: "forward" | "back";
}

/**
 * Fired when the booking wizard advances to a step (once per step per page
 * session - dedupe lives at the call site). A SIGNAL, not a conversion - no
 * Google Ads send_to, so it never inflates conversion counts. Fires to:
 * - GTM/GA4 via dataLayer push (GTM custom-event triggers key on it)
 * - gtag (GA4 event stream) with step_number + step_name
 * - Microsoft Clarity custom event (filterable per step in recordings)
 * - Meta as a custom event (house rule: GA and Meta stay paired)
 */
export function trackBookingStep(params: BookingStepParams): void {
  const stepName = BOOKING_STEP_NAMES[params.step] ?? `step_${params.step}`;
  if (typeof window !== "undefined") {
    window.dataLayer?.push({
      event: "booking_step",
      step_number: params.step,
      step_name: stepName,
      direction: params.direction,
    });
    if (typeof window.clarity === "function") {
      window.clarity("event", `booking_step_${stepName}`);
    }
  }
  gtag("event", "booking_step", {
    event_category: "booking_funnel",
    event_label: stepName,
    step_number: params.step,
    step_name: stepName,
    direction: params.direction,
    ...utmFields(),
  });
  fbq("trackCustom", "BookingStep", {
    step_number: params.step,
    step_name: stepName,
  });
}

export interface GenerateLeadParams {
  form_name: "fun_dive_booking" | "booking_wizard" | "course_inquiry" | "contact";
  dive_date?: string;
  product?: string;
  /** Enhanced-conversion user data. Lead capture usually has a phone. */
  email?: string | null;
  phone?: string | null;
}

export function trackGenerateLead(params: GenerateLeadParams): void {
  // Enhanced conversions: set user data BEFORE the conversion event (when present).
  setEnhancedConversionData({ email: params.email, phone: params.phone });
  gtag("event", "generate_lead", {
    event_category: "lead",
    form_name: params.form_name,
    dive_date: params.dive_date,
    product: params.product,
    currency: "THB",
    ...utmFields(),
  });
  if (LEAD_CONVERSION_LABEL) {
    gtag("event", "conversion", {
      send_to: `${GA_MEASUREMENT_ID}/${LEAD_CONVERSION_LABEL}`,
      currency: "THB",
    });
  }
  fbq("track", "Lead", {
    form_name: params.form_name,
    content_name: params.product,
    currency: "THB",
  });
}

export interface PageViewParams {
  page_path: string;
  page_title?: string;
}

export function trackPageView(params: PageViewParams): void {
  gtag("event", "page_view", {
    page_path: params.page_path,
    page_title: params.page_title ?? document.title,
    send_to: GA_MEASUREMENT_ID,
    ...utmFields(),
  });
  fbq("track", "PageView");
}

export interface PurchaseParams {
  transaction_id: string;
  value?: number;
  currency?: string;
  item_name?: string;
  /** Enhanced-conversion user data (email/phone). Improves Google Ads match. */
  email?: string | null;
  phone?: string | null;
}

export function trackPurchase(params: PurchaseParams): void {
  // Enhanced conversions: set user data BEFORE the conversion event so gtag
  // attaches the hashed identifiers to the conversion ping.
  setEnhancedConversionData({ email: params.email, phone: params.phone });
  gtag("event", "purchase", {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: params.currency ?? "THB",
    items: params.item_name
      ? [{ item_name: params.item_name, currency: "THB", price: params.value }]
      : [],
    ...utmFields(),
  });
  gtag("event", "conversion", {
    send_to: `${GA_MEASUREMENT_ID}/${CONVERSION_LABEL}`,
    value: params.value,
    currency: params.currency ?? "THB",
    transaction_id: params.transaction_id,
  });
  fbq("track", "Purchase", {
    value: params.value,
    currency: params.currency ?? "THB",
    content_name: params.item_name,
  });
}

export interface BookingPayLaterParams {
  transaction_id: string;
  product?: string;
  /** Enhanced-conversion user data (email/phone). Improves Google Ads match. */
  email?: string | null;
  phone?: string | null;
}

/**
 * Fires for a confirmed booking where no deposit was paid (pay-on-arrival).
 * Lower-tier than a paid Purchase: NO monetary value is attached - it counts
 * the booking commitment, not revenue. Google Ads action "Booking - Pay Later".
 */
export function trackBookingPayLater(params: BookingPayLaterParams): void {
  // Enhanced conversions: set user data BEFORE the conversion event.
  setEnhancedConversionData({ email: params.email, phone: params.phone });
  gtag("event", "booking_pay_later", {
    event_category: "booking",
    transaction_id: params.transaction_id,
    content_name: params.product,
    ...utmFields(),
  });
  gtag("event", "conversion", {
    send_to: `${GA_MEASUREMENT_ID}/${BOOKING_PAY_LATER_LABEL}`,
    transaction_id: params.transaction_id,
  });
  fbq("track", "Schedule", {
    content_name: params.product,
  });
}

export interface ViewContentParams {
  offer: string;
  lang: string;
  value?: number;
}

export function trackViewContent(params: ViewContentParams): void {
  gtag("event", "view_item", {
    item_name: params.offer,
    item_category: "campaign_lander",
    language: params.lang,
    value: params.value,
    currency: "THB",
    ...utmFields(),
  });
  fbq("track", "ViewContent", {
    content_name: params.offer,
    content_category: "campaign_lander",
    value: params.value,
    currency: "THB",
  });
}

// ── Nemo chat engagement ─────────────────────────────────────────────────────
// These are SIGNALS, not conversions. They fire as gtag/GA4 + Meta custom events
// only - no Google Ads conversion send_to - so they never inflate conversion
// counts. The real lead conversion is generate_lead, fired only on form submit.

/** Fired when the visitor opens the chat (pill click or teaser accept). */
export function trackChatOpen(source: "pill" | "teaser"): void {
  gtag("event", "chat_open", {
    event_category: "engagement",
    event_label: source,
    ...utmFields(),
  });
  fbq("trackCustom", "ChatOpen", { source });
}

/** Fired on the visitor's FIRST message in a chat session. */
export function trackChatEngaged(): void {
  gtag("event", "chat_engaged", {
    event_category: "engagement",
    ...utmFields(),
  });
  fbq("trackCustom", "ChatEngaged");
}

/** Fired when a persistent chat CTA button is clicked. */
export function trackChatCtaClick(cta: "fun_dive" | "whatsapp" | "courses"): void {
  gtag("event", "chat_cta_click", {
    event_category: "engagement",
    event_label: cta,
    ...utmFields(),
  });
  fbq("trackCustom", "ChatCtaClick", { cta });
}

// ── Chat lead capture (POST to DiveOS + Google Ads generate_lead) ────────────
// Contract: /Users/.../campaign-plans/lead-capture-contract.md
// POST https://dash.siamscuba.com/api/public/lead with X-Lead-Token header.
// The token is public-facing (gates the endpoint) and is read from the build
// env var VITE_LEAD_TOKEN. Ben must set the SAME value in Vercel and in DiveOS.

const LEAD_ENDPOINT = "https://dash.siamscuba.com/api/public/lead";
const LEAD_TOKEN = import.meta.env.VITE_LEAD_TOKEN ?? "";

export interface ChatLeadInput {
  phone: string;
  name?: string | null;
  lang: "en" | "es" | "he";
  course?: string | null;
  dates?: string | null;
  message?: string | null;
  // Where the lead came from. Defaults to "website-chat" (the chat console).
  // Landers pass "lander" so DiveOS can attribute the source. DiveOS de-dupes
  // by phone within 24h regardless of source.
  source?: string | null;
  // Chat session id - lets DiveOS link this lead back to the conversation that
  // produced it (the same id is sent on the chat-log calls). See chat-console
  // contract.
  sessionId?: string | null;
}

export interface ChatLeadResult {
  ok: boolean;
  leadId?: string;
  error?: string;
}

/**
 * Posts a captured chat lead to the DiveOS public lead endpoint, then (on a
 * network-level success) fires the existing generate_lead Google Ads + Meta
 * conversion. The gclid is pulled from sessionStorage (captured first-touch on
 * landing) so this click can later be uploaded back to Google Ads as a booking.
 */
export async function submitChatLead(input: ChatLeadInput): Promise<ChatLeadResult> {
  const utm: UtmParams = getStoredUtm();
  const payload = {
    source: input.source ?? "website-chat",
    phone: input.phone || null,
    name: input.name ?? null,
    lang: input.lang,
    course: input.course ?? null,
    dates: input.dates ?? null,
    message: input.message ?? null,
    sessionId: input.sessionId ?? null,
    gclid: getStoredGclid(),
    utm: {
      source: utm.source ?? null,
      medium: utm.medium ?? null,
      campaign: utm.campaign ?? null,
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Lead-Token": LEAD_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { ok: false, error: `status ${res.status}` };
    }

    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; leadId?: string };

    // Fire the lead conversion only after a successful POST so the conversion
    // count matches stored leads. trackGenerateLead handles GA + Meta + the
    // Google Ads generate_lead conversion (AW-18050429438/XvmFCNXAjrMcEP7jjp9D).
    trackGenerateLead({
      form_name: "course_inquiry",
      product: input.course ?? undefined,
      // Enhanced conversions: the chat captured a phone (and maybe more) - pass
      // it so the lead conversion can be matched to the click in Google Ads.
      phone: input.phone || null,
    });

    return { ok: data.ok !== false, leadId: data.leadId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "network_error" };
  }
}

// ── Entry gate qualification ─────────────────────────────────────────────────
// SIGNALS, not conversions (no Ads send_to). The gate now asks what the visitor
// is here to do (level) and where (location) - that answer is the single most
// valuable segmentation input we have at first touch, so it goes to GA4/Meta.

export interface GateAnswerParams {
  /** "beginner" | "funDives" | "training" */
  level: string;
  /** "kohTao" | "kohPhangan" | "similan" - absent when the level skips the step. */
  location?: string | null;
  /** Where the answer sent them: a route path, or "/" when the gate just closed. */
  destination: string;
}

/** Fired once the gate resolves the visitor's answer to a destination. */
export function trackGateAnswer(params: GateAnswerParams): void {
  gtag("event", "gate_answer", {
    event_category: "engagement",
    event_label: params.level,
    gate_level: params.level,
    gate_location: params.location ?? undefined,
    gate_destination: params.destination,
    ...utmFields(),
  });
  fbq("trackCustom", "GateAnswer", {
    level: params.level,
    location: params.location ?? undefined,
    destination: params.destination,
  });
}
