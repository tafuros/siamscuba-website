import { useEffect, useRef, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, useLocation } from "react-router-dom";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import CookieConsent from "./components/CookieConsent";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import { trackPageView } from "@/utils/tracking";
import { captureUtmFromUrl, captureGclidFromUrl } from "@/utils/utm";

// Floating chat widget - client-only, not SEO content. Lazy-load it so its
// code (and the avatar) is split out of the initial app bundle and fetched
// after hydration instead of blocking it.
const NemoChat = lazy(() => import("@/components/NemoChat"));

// Premium "gate" intro overlay. Dormant in production: when VITE_ENTRY_GATE is
// not "on", this constant folds to false and Rollup tree-shakes the dynamic
// import away entirely - the gate chunk is never emitted and the bundle + SSG
// output are identical to today. Flip the flag in Vercel to go live.
// See plans/mellow-soaring-zebra.md.
const ENTRY_GATE_ON = import.meta.env.VITE_ENTRY_GATE === "on";
const EntryGate = ENTRY_GATE_ON ? lazy(() => import("@/components/EntryGate")) : null;

const queryClient = new QueryClient();

const RouteTracker = () => {
  const location = useLocation();
  const utmCapturedRef = useRef(false);
  useEffect(() => {
    if (!utmCapturedRef.current) {
      captureUtmFromUrl();
      captureGclidFromUrl();
      utmCapturedRef.current = true;
    }
    trackPageView({ page_path: location.pathname + location.search });
  }, [location]);
  return null;
};

const SkipLink = () => {
  const { language } = useLanguage();
  return (
    <a href="#main-content" className="skip-link">
      {language === "he" ? "דלג לתוכן הראשי" : "Skip to main content"}
    </a>
  );
};

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-ocean-deep">
    <div className="w-8 h-8 border-2 border-ocean-light/30 border-t-ocean-light rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <SkipLink />
        <Toaster />
        <Sonner />
        <RouteTracker />
        <CookieConsent />
        <SpeedInsights />
        <Analytics />
        <main id="main-content">
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </main>
        <AccessibilityMenu />
        {ENTRY_GATE_ON && EntryGate && (
          <Suspense fallback={null}>
            <EntryGate />
          </Suspense>
        )}
        <Suspense fallback={null}>
          <NemoChat />
        </Suspense>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
