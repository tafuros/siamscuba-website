import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { translations, rtlLanguages, type Language } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const isBrowser = typeof window !== "undefined";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (!isBrowser) return "en";
    const saved = window.localStorage.getItem("siam-lang");
    return (saved as Language) || "en";
  });

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
