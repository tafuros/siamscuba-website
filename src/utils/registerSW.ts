// Service worker registration with safety hatches:
// - Production-only (avoid stale caches during dev work)
// - Defers to window load so it doesn't compete with LCP fetches
// - Auto-unregisters if ?nosw=1 is in the URL (kill switch for users
//   who hit a bad cache)

export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (!import.meta.env.PROD) return;

  // Kill switch for emergencies
  if (new URLSearchParams(window.location.search).has("nosw")) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    });
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failed - silent. Site continues to work without SW.
    });
  });
}
