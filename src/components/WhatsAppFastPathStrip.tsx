import { useMemo } from "react";
import { trackWhatsAppFastPathClick } from "@/utils/tracking";
import { useLanguage } from "@/i18n/LanguageContext";
import { WHATSAPP_NUMBER } from "@/utils/whatsapp";

/**
 * WhatsApp fast-path strip for the fun-dive booking page.
 *
 * A compact strip above the booking wizard offering the "book in 30 seconds"
 * WhatsApp path (funnel-fix spec Part 2). Secondary in visual weight to the
 * wizard - it's a fast path, not a bail-out. The prefilled message carries
 * MID-FORM context ("before I finish the booking form") so Nemo treats it as
 * a form-completion assist and steers the customer back to the form.
 *
 * i18n: the VISIBLE copy is localized (en/he/es/fr via LanguageContext, and
 * the strip mirrors under dir="rtl"). The wa.me PREFILL message is NOT - it
 * stays English in every language because Nemo's mid-form detection pattern-
 * matches the exact English markers. Do not translate BASE_MESSAGE.
 */

// The strip dials WHATSAPP_NUMBER (utils/whatsapp.ts) - the one number this
// site knows. There is no separate fast-path number: the shop line and Nemo
// have been the same +66 line since the cutover on 2026-06-03, so a dedicated
// constant here could only ever drift out of sync with the shared one. It did:
// this file shipped on 2026-07-10 hardcoding the retired +972 line (dead since
// June), and every click landed on an unanswered number until 2026-07-17.
// If a genuinely different number is ever needed, add it in utils/whatsapp.ts
// beside the shared one - do not reintroduce a private literal here.

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
  // Visible copy only - the prefill href below deliberately ignores language.
  // LanguageContext is hydration-safe (renders "en" first, adopts the saved
  // language in a pre-paint layout effect), so consuming it adds no
  // localStorage read to the initial render.
  const { t } = useLanguage();

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
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }, [product, date]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppFastPathClick({ product, date, url: href })}
      className="mb-4 flex items-center gap-3 rounded-xl border border-border/50 bg-card px-3 py-2.5 shadow-sm transition-colors hover:border-[#25D366]/40 hover:bg-[#25D366]/5"
      aria-label={`${t("wa_strip_headline")} ${t("wa_strip_subline")}`}
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
      {/* flex-1 pushes the button to the far edge on phones (current design);
          from sm up the text hugs its content so icon + text + button stay
          grouped instead of stretching sparse across the wide container. */}
      <span className="min-w-0 flex-1 sm:flex-none">
        <span className="block text-sm font-semibold leading-tight text-foreground">
          {t("wa_strip_headline")}
        </span>
        <span className="block text-xs leading-tight text-muted-foreground">
          {t("wa_strip_subline")}
        </span>
      </span>
      <span
        className="flex-none rounded-full px-4 py-1.5 text-sm font-semibold text-white"
        style={{ backgroundColor: "#25D366" }}
      >
        {t("wa_strip_chat")}
      </span>
    </a>
  );
};

export default WhatsAppFastPathStrip;
