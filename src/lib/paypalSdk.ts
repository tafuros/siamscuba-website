/**
 * Lazy loader for the PayPal JS SDK.
 *
 * The script is injected on demand - only once a guest reaches the payment step
 * of the hotel booking sheet - so vite-react-ssg never sees it during prerender
 * and no other page on the site pays for it. There is no CSP on this project,
 * so a paypal.com script tag needs no allowlisting; if one is ever added, this
 * is the single place that has to appear in `script-src`.
 *
 * The client id is not a build-time VITE_ variable: it comes from
 * GET /api/hotel-booking?action=payment-config at runtime, so the same bundle
 * runs against sandbox, live, or the credential-free simulated mode.
 *
 * LOCALE: left to itself the SDK guesses a language from the browser and the
 * IP, which put Hebrew buttons on the English /hotel page. The locale is now
 * always passed explicitly and follows the page the guest is reading. The SDK
 * bakes its locale into the loaded script, so each locale gets its own
 * `data-namespace` (window.paypalSdk0, ...paypalSdk1, ...) instead of the
 * shared `window.paypal`. That is what lets the hotel mini-site switch language
 * without a reload and still get buttons in the new language - a single cached
 * instance would silently keep whichever locale loaded first.
 */

import type { Language } from "@/i18n/translations";

export interface PayPalButtonsController {
  render(container: HTMLElement): Promise<void>;
  close?(): void;
}

export interface PayPalButtonsConfig {
  style?: Record<string, string | number>;
  createOrder: () => string | Promise<string>;
  onApprove: (data: { orderID: string }) => void | Promise<void>;
  onCancel?: () => void;
  onError?: (err: unknown) => void;
}

export interface PayPalNamespace {
  Buttons(config: PayPalButtonsConfig): PayPalButtonsController;
}

/** The PayPal locale code for each language the hotel mini-site ships in. */
export const PAYPAL_LOCALES: Record<Language, string> = {
  en: "en_US",
  he: "he_IL",
  es: "es_ES",
  fr: "fr_FR",
};

const FALLBACK_LOCALE = PAYPAL_LOCALES.en;

/** Never throws on an unknown language - an English button beats no button. */
export function paypalLocale(lang: string | null | undefined): string {
  if (!lang) return FALLBACK_LOCALE;
  return PAYPAL_LOCALES[lang as Language] ?? FALLBACK_LOCALE;
}

type NamespacedWindow = Window & Record<string, unknown>;

const instances = new Map<string, Promise<PayPalNamespace>>();
let namespaceCounter = 0;

/** Test hook - drops the cached script promises so a suite can load again. */
export function __resetPayPalSdkForTests(): void {
  instances.clear();
  namespaceCounter = 0;
}

export function loadPayPalSdk(
  clientId: string,
  currency: string,
  locale: string,
): Promise<PayPalNamespace> {
  // Locale is part of the key: the same client id in two languages is two
  // different scripts, not one script reused with the wrong words on it.
  const key = `${clientId}:${currency}:${locale}`;
  // Re-opening the sheet must reuse the one script tag, not stack them up.
  const cached = instances.get(key);
  if (cached) return cached;

  const namespace = `paypalSdk${namespaceCounter++}`;
  const pending = new Promise<PayPalNamespace>((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      reject(new Error("paypal sdk needs a browser"));
      return;
    }
    const scope = window as NamespacedWindow;
    if (scope[namespace]) {
      resolve(scope[namespace] as PayPalNamespace);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js" +
      `?client-id=${encodeURIComponent(clientId)}` +
      `&currency=${encodeURIComponent(currency)}` +
      `&locale=${encodeURIComponent(locale)}` +
      "&intent=authorize" +
      "&components=buttons" +
      "&disable-funding=paylater,credit";
    script.async = true;
    script.dataset.paypalSdk = locale;
    script.dataset.namespace = namespace;
    script.onload = () => {
      const ns = scope[namespace] as PayPalNamespace | undefined;
      if (ns) resolve(ns);
      else reject(new Error("paypal sdk loaded without a namespace"));
    };
    script.onerror = () => {
      instances.delete(key);
      reject(new Error("paypal sdk failed to load"));
    };
    document.head.appendChild(script);
  });
  instances.set(key, pending);
  return pending;
}
