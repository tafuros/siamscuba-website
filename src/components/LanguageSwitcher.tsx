import { Globe } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/i18n/LanguageContext";
import { languageNames, languageFlags, type Language } from "@/i18n/translations";
import { localizedPath } from "@/lib/localeRoutes";
import { useCurrency } from "@/lib/CurrencyContext";
import { DISPLAY_CURRENCIES, currencyDef, type CurrencyCode } from "@/lib/currency";

const languages: Language[] = ["en", "he", "es", "fr"];

/**
 * The navbar's language picker - and, in the same menu, the display-currency
 * picker.
 *
 * WHY ONE CONTROL AND NOT TWO
 * The navbar already carries search, the gate compass, this picker, Book Now
 * and WhatsApp; on a phone that row is search / compass / this / hamburger. A
 * separate currency button would have been a fifth icon in a row that is
 * already the tightest part of the layout. Language and currency are also the
 * same decision to a visitor from abroad - "show me this in terms I read" - so
 * pairing them costs nothing in comprehension.
 *
 * The currency half hides itself entirely when rates are unavailable (offline,
 * blocked, both providers down). A picker that cannot convert is worse than no
 * picker: it invites a click that silently does nothing.
 */
const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency, canConvert, ratesDate } = useCurrency();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Picking a language has to move the URL, not just the strings. Locale
  // content lives on its own routes (/es, /he/fun-dives, /fr/fun-dives ...),
  // and setLanguage() alone left every one of them unreachable through the UI.
  // It also fought the URL-wins rule in LanguageContext: on a /es/* page the
  // pathname re-asserts Spanish, so a silent in-place switch could not stick.
  const handlePick = (lang: Language) => {
    setLanguage(lang);
    const target = localizedPath(pathname, lang);
    // null = stay put and let the i18n context translate the page in place.
    // Two different cases return null, and both must stay put:
    //   - no translated twin (blog posts, dive sites, booking) - guessing
    //     a path would hard-404 on Vercel;
    //   - the page already renders every language itself (the homepage) - see
    //     SELF_TRANSLATING in localeRoutes.ts. Jumping from "/" to /he sent the
    //     visitor to a Hebrew guide article instead of translating the homepage.
    if (target && target !== pathname) navigate(target);
  };

  const activeCurrency = currencyDef(currency);
  // The trigger shows the currency only once the visitor has moved off Baht -
  // on the default there is nothing to disambiguate, and a "฿" next to the flag
  // would just be noise on a page whose prices are already in Baht.
  const showCurrencyOnTrigger = canConvert && currency !== "THB";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={`${t("cur_heading_language")} / ${t("cur_heading_currency")}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-foreground backdrop-blur-md bg-white/15 border border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.3)] hover:bg-white/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-0.5 transition-all duration-200 focus:outline-none"
        >
          <Globe className="h-4 w-4" />
          <span>{languageFlags[language]}</span>
          {showCurrencyOnTrigger && (
            <span className="text-xs opacity-70">{activeCurrency.symbol}</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider opacity-50">
          {t("cur_heading_language")}
        </DropdownMenuLabel>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handlePick(lang)}
            className={`flex items-center gap-2 cursor-pointer ${
              lang === language ? "bg-accent/20 font-semibold" : ""
            }`}
          >
            <span>{languageFlags[lang]}</span>
            <span>{languageNames[lang]}</span>
          </DropdownMenuItem>
        ))}

        {canConvert && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider opacity-50">
              {t("cur_heading_currency")}
            </DropdownMenuLabel>
            {DISPLAY_CURRENCIES.map((def) => (
              <DropdownMenuItem
                key={def.code}
                onClick={() => setCurrency(def.code as CurrencyCode)}
                className={`flex items-center gap-2 cursor-pointer ${
                  def.code === currency ? "bg-accent/20 font-semibold" : ""
                }`}
              >
                <span className="w-5 text-center">{def.symbol}</span>
                <span>{def.code}</span>
                <span className="ms-auto text-[11px] opacity-50">{def.label}</span>
              </DropdownMenuItem>
            ))}
            {/* The honesty line. It sits where the choice is made, so a visitor
                cannot pick a currency without having been told what it means. */}
            <p className="px-2 py-2 text-[10.5px] leading-snug opacity-50">
              {t("cur_note")}
              {ratesDate ? ` (${ratesDate})` : ""}
            </p>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
