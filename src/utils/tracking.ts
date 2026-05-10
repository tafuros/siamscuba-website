/**
 * Siam Scuba — Conversion Tracking Utilities
 * Wraps gtag() and fbq() so every conversion event fires to both Google Ads/GA4
 * and Meta Pixel from a single function. Keeping the calls paired here prevents
 * the "added GA but forgot Meta" drift as new events get added.
 */

import { getStoredUtm, type UtmParams } from "@/utils/utm";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_MEASUREMENT_ID = "AW-18050429438";
const CONVERSION_LABEL = "u_9ACKH36KMcEP7jjp9D";

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
  fbq("track", "Contact", { location: params.location });
}

export interface GenerateLeadParams {
  form_name: "fun_dive_booking" | "course_inquiry" | "contact";
  dive_date?: string;
  product?: string;
}

export function trackGenerateLead(params: GenerateLeadParams): void {
  gtag("event", "generate_lead", {
    event_category: "lead",
    form_name: params.form_name,
    dive_date: params.dive_date,
    product: params.product,
    currency: "THB",
    ...utmFields(),
  });
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
}

export function trackPurchase(params: PurchaseParams): void {
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
