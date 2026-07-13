import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { translations, rtlLanguages, type Language } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const isBrowser = typeof window !== "undefined";

// Layout effect on the client (runs synchronously after hydration, before
// paint), plain effect during SSG rendering (where useLayoutEffect warns).
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

const isKnownLanguage = (value: string | null): value is Language =>
  value !== null && value in translations;

// Locale URL prefixes that exist as real routes (see src/routes.tsx):
// /es/* (Spanish blog + landers), /he + /he/* (Hebrew landing + landers),
// /fr/* (French landers). On these pages the URL is the strongest signal of
// the visitor's language - it MUST win over a (possibly stale) localStorage
// value. Real bug this fixes: a visitor on /es/fun-dives with a leftover
// siam-lang=he got Hebrew UI and a Hebrew Nemo chat.
// (exported for tests)
export const pathLanguage = (pathname: string): Language | null => {
  const match = pathname.match(/^\/(es|he|fr)(\/|$)/);
  return match ? (match[1] as Language) : null;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // HYDRATION CONTRACT: the first client render MUST match the SSG HTML, which
  // is always built with "en". Reading localStorage in the useState initializer
  // made returning he/es/fr visitors render different text on first paint,
  // which threw React #418/#425 and forced a full client re-render (#423) on
  // EVERY page load. So: start at "en", then adopt the saved language in a
  // layout effect - it runs before the browser paints, so there is no visible
  // English flash, and hydration always succeeds.
  const [language, setLanguageState] = useState<Language>("en");

  // Locale prefix of the CURRENT route ("/es/..." -> "es"), reactive to SPA
  // navigations. LanguageProvider renders inside the route element (App), so
  // the router context is always available here.
  const { pathname } = useLocation();
  const urlLanguage = pathLanguage(pathname);
  const didInitRef = useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser) return;
    const isFirstRun = !didInitRef.current;
    didInitRef.current = true;
    // On a locale-prefixed page the URL WINS over localStorage (see
    // pathLanguage above). State only - we deliberately do NOT persist it, so
    // following a /he link never traps an English visitor in Hebrew forever.
    if (urlLanguage) {
      setLanguageState(urlLanguage);
      return;
    }
    // Unprefixed page: original behavior - adopt the saved language once, on
    // mount. On later SPA navigations keep whatever the visitor is already
    // reading in (e.g. /es/fun-dives -> / stays Spanish).
    if (!isFirstRun) return;
    const saved = window.localStorage.getItem("siam-lang");
    if (isKnownLanguage(saved) && saved !== "en") setLanguageState(saved);
  }, [urlLanguage]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (isBrowser) window.localStorage.setItem("siam-lang", lang);
  }, []);

  const isRTL = rtlLanguages.includes(language);

  useEffect(() => {
    if (!isBrowser) return;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = useCallback(
    (key: string): string => {
      const strings = translations[language];
      return (strings as Record<string, string>)[key] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
