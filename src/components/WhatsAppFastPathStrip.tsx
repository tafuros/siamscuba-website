import { useMemo } from "react";
import { trackWhatsAppFastPathClick } from "@/utils/tracking";

/**
 * WhatsApp fast-path strip for the fun-dive booking page.
 *
 * A compact strip above the booking wizard offering the "book in 30 seconds"
 * WhatsApp path (funnel-fix spec Part 2). Secondary in visual weight to the
 * wizard - it's a fast path, not a bail-out. The prefilled message carries
 * MID-FORM context ("before I finish the booking form") so Nemo treats it as
 * a form-completion assist and steers the customer back to the form.
 */

// Fast-path number. Swaps to the dedicated Nemo number at cutover - change
// this ONE line only. (Intentionally separate from WHATSAPP_NUMBER in
// utils/whatsapp.ts, which stays on the shop line.)
export const FASTPATH_WHATSAPP_NUMBER = "972528641581";

// Mid-form base message - Ben's exact requirement. Nemo pattern-matches on
// "before I finish the booking form" to route this as a mid-form assist.
const BASE_MESSAGE =
  "Hi! I have a few questions before I finish the booking form 🤿 (fun dives, via the website)";

// Human labels for the wizard product codes forwarded on the URL / postMessage.
// Unknown codes pass through raw - still useful context for Nemo.
const PRODUCT_LABELS: Record<string, string> = {
  SAILROCK: "Sail Rock",
  DSD: "Discover Scuba Diving",
  FUNDIVE: "fun dives",
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2026-07-13" -> "Jul 13". Non-ISO input passes through unchanged. */
function formatDate(raw: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (!m) return raw;
  const monthIdx = Number(m[2]) - 1;
  const day = Number(m[3]);
  if (monthIdx < 0 || monthIdx > 11 || day < 1 || day > 31) return raw;
  return `${MONTHS[monthIdx]} ${day}`;
}

export interface WhatsAppFastPathStripProps {
  /** Wizard product code (URL param or SIAM_BOOKING_LEAD), e.g. "SAILROCK". */
  product?: string;
  /** Selected dive date (URL param or SIAM_BOOKING_LEAD courseStartDate). */
  date?: string;
}

const WhatsAppFastPathStrip = ({ product, date }: WhatsAppFastPathStripProps) => {
  // Reactive href: enriches with trip context as wizard state arrives.
  // HYDRATION-SAFE by construction: the parent passes product/date only from
  // effects/postMessages (never on first render), so the static HTML and the
  // first client render both carry the plain BASE_MESSAGE href.
  const href = useMemo(() => {
    let text = BASE_MESSAGE;
    const parts: string[] = [];
    if (product) parts.push(PRODUCT_LABELS[product.toUpperCase()] ?? product);
    if (date) parts.push(formatDate(date));
    if (parts.length > 0) text += ` - I was booking ${parts.join(", ")}`;
    return `https://wa.me/${FASTPATH_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }, [product, date]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppFastPathClick({ product, date, url: href })}
      className="mb-4 flex items-center gap-3 rounded-xl border border-border/50 bg-card px-3 py-2.5 shadow-sm transition-colors hover:border-[#25D366]/40 hover:bg-[#25D366]/5"
      aria-label="Chat with us on WhatsApp instead of the booking form"
      data-testid="whatsapp-fastpath"
    >
      <span
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full"
        style={{ backgroundColor: "#25D366" }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.8-1.2-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.4 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4 0 .1 0 .7-.1 1.4z" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-tight text-foreground">
          Prefer to book in 30 seconds?
        </span>
        <span className="block text-xs leading-tight text-muted-foreground">
          Chat with us on WhatsApp - instant reply
        </span>
      </span>
      <span
        className="flex-none rounded-full px-4 py-1.5 text-sm font-semibold text-white"
        style={{ backgroundColor: "#25D366" }}
      >
        Chat
      </span>
    </a>
  );
};

export default WhatsAppFastPathStrip;
