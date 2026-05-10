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
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-20 md:max-w-lg z-50
        bg-[#0A0A0A]/90 backdrop-blur-sm text-white text-sm rounded-xl shadow-lg
        px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3
        animate-[slideUp_0.3s_ease-out]"
      style={{ animationFillMode: "both" }}
    >
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(1rem)}to{opacity:1;transform:translateY(0)}}`}</style>
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
          className="px-3 py-1.5 text-xs rounded-lg bg-[#1873BF] hover:bg-[#155f9c] text-white font-semibold transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
