// Service worker disabled. Kept as a no-op so existing call sites don't
// break, and so we have one place to also proactively unregister any SW
// that may still be installed in returning browsers. The self-destructing
// public/sw.js handles the same cleanup from the SW side; this is
// belt-and-suspenders for the brief window before the new sw.js takes
// over on a given browser.

export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });
}
