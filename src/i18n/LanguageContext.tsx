import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  type ReactNode,
} from "react";
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

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // HYDRATION CONTRACT: the first client render MUST match the SSG HTML, which
  // is always built with "en". Reading localStorage in the useState initializer
  // made returning he/es/fr visitors render different text on first paint,
  // which threw React #418/#425 and forced a full client re-render (#423) on
  // EVERY page load. So: start at "en", then adopt the saved language in a
  // layout effect - it runs before the browser paints, so there is no visible
  // English flash, and hydration always succeeds.
  const [language, setLanguageState] = useState<Language>("en");

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser) return;
    const saved = window.localStorage.getItem("siam-lang");
    if (isKnownLanguage(saved) && saved !== "en") setLanguageState(saved);
  }, []);

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
