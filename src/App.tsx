import { useEffect, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import CookieConsent from "./components/CookieConsent";
import { trackPageView } from "@/utils/tracking";

const queryClient = new QueryClient();

const RouteTracker = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageView({ page_path: location.pathname + location.search });
  }, [location]);
  return null;
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
        <Toaster />
        <Sonner />
        <RouteTracker />
        <CookieConsent />
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
