/**
 * Siam Scuba — Conversion Tracking Utilities
 * Wraps gtag() calls with TypeScript types for all tracked events.
 * Google Ads Account: AW-18050429438
 * Conversion label: 9d1fCLb625gcEP7jjp9D
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
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

export interface WhatsAppClickParams {
  location: string;
  url?: string;
}

export function trackWhatsAppClick(params: WhatsAppClickParams): void {
  gtag("event", "whatsapp_click", {
    event_category: "engagement",
    event_label: params.location,
    url: params.url,
  });
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
  });
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
  });
  gtag("event", "conversion", {
    send_to: `${GA_MEASUREMENT_ID}/${CONVERSION_LABEL}`,
    value: params.value,
    currency: params.currency ?? "THB",
    transaction_id: params.transaction_id,
  });
}
