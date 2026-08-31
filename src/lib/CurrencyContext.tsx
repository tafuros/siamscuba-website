import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  startTransition,
  type ReactNode,
} from "react";
import {
  BASE_CURRENCY,
  formatConverted,
  isCurrencyCode,
  type CurrencyCode,
  type RateTable,
} from "@/lib/currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  /** Null until rates load, and forever if both providers are down. */
  rates: RateTable | null;
  /** The date the rates were published, for the "as of" line in the picker. */
  ratesDate: string | null;
  /** False while rates are missing - the picker hides itself on this. */
  canConvert: boolean;
  /** "≈ $360", or null when nothing should be shown. */
  convert: (thb: number) => string | null;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const isBrowser = typeof window !== "undefined";
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

const CURRENCY_KEY = "siam-currency";
const RATES_KEY = "siam-rates";

/**
 * How long a cached rate table stays usable in a visitor's browser.
 *
 * Longer than the CDN's 6h on purpose: this cache exists so a RETURNING visitor
 * who already picked a currency sees the converted number in the first paint
 * instead of watching it pop in. A day-old reference rate is well inside the
 * precision `roundEstimate` already throws away, and a fresh copy is fetched in
 * the background on every load regardless.
 */
const RATES_TTL_MS = 24 * 60 * 60 * 1000;

type CachedRates = { rates: RateTable; date: string; at: number };

const readCache = (): CachedRates | null => {
  // Safari private mode throws on the mere act of touching storage, and the
  // test environment has no localStorage at all - so every access is guarded.
  try {
    const raw = window.localStorage.getItem(RATES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedRates>;
    if (!parsed || typeof parsed.at !== "number" || !parsed.rates) return null;
    if (Date.now() - parsed.at > RATES_TTL_MS) return null;
    return { rates: parsed.rates, date: parsed.date ?? "", at: parsed.at };
  } catch {
    return null;
  }
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  // HYDRATION CONTRACT - the same one LanguageContext documents, and for the
  // same reason. The SSG HTML is built with the base currency, so the first
  // client render MUST also be THB. Reading localStorage in the useState
  // initialiser would make a returning visitor render different text than the
  // prerendered markup and throw React #418/#425 on every single page load.
  // Adoption happens in the layout effect below instead: it runs before the
  // browser paints, so there is no visible flash of the wrong currency.
  const [currency, setCurrencyState] = useState<CurrencyCode>(BASE_CURRENCY);
  const [rates, setRates] = useState<RateTable | null>(null);
  const [ratesDate, setRatesDate] = useState<string | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser) return;
    // React #421: a synchronous setState here would land while the lazy-route
    // Suspense boundaries are still hydrating and force them to client-render.
    // The language provider learned this the expensive way; marking the
    // adoption as a transition lets React finish hydrating first.
    try {
      const saved = window.localStorage.getItem(CURRENCY_KEY);
      if (isCurrencyCode(saved) && saved !== BASE_CURRENCY) {
        startTransition(() => setCurrencyState(saved));
      }
    } catch {
      /* storage blocked - stay on Baht, which is always correct */
    }
    const cached = readCache();
    if (cached) {
      startTransition(() => {
        setRates(cached.rates);
        setRatesDate(cached.date || null);
      });
    }
  }, []);

  // Always refresh in the background, even when the cache was warm - the fetch
  // is one CDN-cached request and it keeps a returning visitor from reading a
  // day-old rate for a week.
  useEffect(() => {
    if (!isBrowser) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/rates");
        if (!res.ok) return;
        const data = (await res.json()) as { rates?: RateTable; date?: string };
        if (cancelled || !data?.rates) return;
        setRates(data.rates);
        setRatesDate(data.date ?? null);
        try {
          window.localStorage.setItem(
            RATES_KEY,
            JSON.stringify({ rates: data.rates, date: data.date ?? "", at: Date.now() }),
          );
        } catch {
          /* storage blocked - the rates still work for this session */
        }
      } catch {
        // Offline, blocked, or both providers down. Whatever is in state stays;
        // if that is null the picker never appears and every price is plain
        // Baht, which is the correct fallback rather than a degraded one.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      window.localStorage.setItem(CURRENCY_KEY, code);
    } catch {
      /* storage blocked - the choice still holds for this session */
    }
  }, []);

  const convert = useCallback(
    (thb: number) => formatConverted(thb, currency, rates),
    [currency, rates],
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      rates,
      ratesDate,
      canConvert: rates !== null,
      convert,
    }),
    [currency, setCurrency, rates, ratesDate, convert],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
};
