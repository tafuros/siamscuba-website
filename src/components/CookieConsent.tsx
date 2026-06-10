import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "cookie_consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
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
  window.fbq?.("consent", granted ? "grant" : "revoke");
  if (granted) {
    // Fire the suppressed PageView for the current route now that consent landed.
    window.fbq?.("track", "PageView");
  }
}

const CookieConsent = () => {
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

  return (
    <>
      <style>{`@keyframes ccRise{from{opacity:0;transform:translateY(0.75rem) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes ccFade{from{opacity:0}to{opacity:1}}`}</style>
      {/* Soft backdrop: dims the floating buttons behind so the cookie choice
          floats clearly above the rest. Sits above every floating element
          (chat/accessibility z-50, social/book z-40). Cleared once answered. */}
      <div
        aria-hidden
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] animate-[ccFade_0.25s_ease-out]"
        style={{ animationFillMode: "both" }}
      />
      {/* Positioning layer: a bottom bar on mobile (where it sits perfectly),
          a centred modal on desktop so it reads as a deliberate dialog rather
          than something stuck in the corner. */}
      <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 md:items-center pointer-events-none">
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="pointer-events-auto w-full max-w-lg md:max-w-md
            bg-gradient-to-b from-[#161616]/95 to-[#0A0A0A]/95 backdrop-blur-md text-white
            rounded-2xl shadow-2xl ring-1 ring-white/10
            px-5 py-4 md:px-6 md:py-5 flex flex-col gap-3 md:gap-4
            animate-[ccRise_0.35s_ease-out]"
          style={{ animationFillMode: "both" }}
        >
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1873BF]/15 ring-1 ring-[#1873BF]/30">
              <Cookie className="h-5 w-5 text-[#3b9ae0]" aria-hidden />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">We value your privacy</p>
              <p className="mt-0.5 text-xs sm:text-sm text-white/70 leading-snug">
                We use cookies to improve your experience and measure site performance.
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-xs rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2 text-xs rounded-lg bg-[#1873BF] hover:bg-[#155f9c] text-white font-semibold shadow-lg shadow-[#1873BF]/20 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
