import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Language } from "@/i18n/translations";

const STORAGE_KEY = "cookie_consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

function updateConsent(granted: boolean) {
  const value = granted ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
  // Microsoft Clarity consentv2, gated to the same analytics_storage state.
  // Denied = cookieless no-consent recording (still captures heatmaps/replay,
  // no cookies); granted = first-party cookies + cross-session stitching. Safe
  // as a no-op if Clarity hasn't loaded yet (deferred); __loadClarity re-reads
  // the stored consent on load so a returning granted visitor still records.
  window.clarity?.("consentv2", {
    ad_Storage: value,
    analytics_Storage: value,
  });
  if (granted) {
    // Meta Pixel consent gate: GTM's Meta base tag fires on this event (pixel
    // init + the landing PageView), so the pixel only ever loads WITH ad
    // consent. Fires on banner accept AND on mount for returning granted
    // visitors - exactly once per page load. See docs/meta-pixel-gtm-spec.md.
    window.dataLayer?.push({ event: "ads_consent_granted" });
  }
}

// The banner used to be English on every page; Clarity showed Hebrew, Spanish
// and French visitors meeting it in English (Ben 2026-10-02: translate it).
const COPY: Record<Language, { label: string; text: string; privacy: string; decline: string; accept: string }> = {
  en: {
    label: "Cookie consent",
    text: "We use cookies to improve the site and measure how it performs.",
    privacy: "Privacy",
    decline: "Decline",
    accept: "Accept",
  },
  he: {
    label: "הסכמה לעוגיות",
    text: "אנחנו משתמשים בעוגיות כדי לשפר את האתר ולמדוד את הביצועים שלו.",
    privacy: "פרטיות",
    decline: "לא, תודה",
    accept: "מאשר/ת",
  },
  es: {
    label: "Consentimiento de cookies",
    text: "Usamos cookies para mejorar el sitio y medir su rendimiento.",
    privacy: "Privacidad",
    decline: "Rechazar",
    accept: "Aceptar",
  },
  fr: {
    label: "Consentement aux cookies",
    text: "Nous utilisons des cookies pour améliorer le site et mesurer ses performances.",
    privacy: "Confidentialité",
    decline: "Refuser",
    accept: "Accepter",
  },
};

const CookieConsent = () => {
  const { language, isRTL } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "granted") {
      updateConsent(true);
    } else if (stored === "denied") {
      // Already denied, nothing to do
    } else {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "granted");
    updateConsent(true);
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-resolved"));
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, "denied");
    updateConsent(false);
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-resolved"));
  };

  if (!visible) return null;

  const copy = COPY[language] ?? COPY.en;

  // A thin bar pinned to the bottom, no backdrop (Ben 2026-10-02). Clarity
  // showed the old dimmed modal as an extra step on every first visit; the page
  // now stays usable while the choice waits. Consent Mode is untouched: nothing
  // is granted until Accept.
  return (
    <div
      role="region"
      aria-label={copy.label}
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-[#0D1B26]/95 text-white backdrop-blur-md
        pb-[env(safe-area-inset-bottom,0px)] animate-[ccUp_0.3s_ease-out]"
      style={{ animationFillMode: "both" }}
    >
      <style>{`@keyframes ccUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
        <p className="min-w-0 flex-1 basis-56 text-xs leading-snug text-white/80 sm:text-sm">
          {copy.text}{" "}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-white">
            {copy.privacy}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={handleDecline}
            className="rounded-lg px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            {copy.decline}
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-[#1873BF] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#155f9c]"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
