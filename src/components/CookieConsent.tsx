import { useState, useEffect } from "react";

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
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, "denied");
    updateConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(1rem)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
      {/* Soft backdrop: dims the floating buttons behind so the cookie choice
          floats clearly above the rest. Sits above every floating element
          (chat/accessibility z-50, social/book z-40). Cleared once answered. */}
      <div
        aria-hidden
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px] animate-[fadeIn_0.25s_ease-out]"
        style={{ animationFillMode: "both" }}
      />
      <div
        role="dialog"
        aria-label="Cookie consent"
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-lg z-[70]
          bg-[#0A0A0A]/95 backdrop-blur-sm text-white text-sm rounded-2xl shadow-2xl ring-1 ring-white/10
          px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3
          animate-[slideUp_0.3s_ease-out]"
        style={{ animationFillMode: "both" }}
      >
        <p className="text-xs sm:text-sm text-white/80 leading-snug flex-1">
          We use cookies to improve your experience and measure site performance.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="px-3 py-1.5 text-xs rounded-lg text-white/60 hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 text-xs rounded-lg bg-[#1873BF] hover:bg-[#155f9c] text-white font-semibold transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
