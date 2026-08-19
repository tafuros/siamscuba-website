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
 */

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

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

let pending: Promise<PayPalNamespace> | null = null;
let pendingKey = "";

export function loadPayPalSdk(clientId: string, currency: string): Promise<PayPalNamespace> {
  const key = `${clientId}:${currency}`;
  // Re-opening the sheet must reuse the one script tag, not stack them up.
  if (pending && pendingKey === key) return pending;

  pendingKey = key;
  pending = new Promise<PayPalNamespace>((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      reject(new Error("paypal sdk needs a browser"));
      return;
    }
    if (window.paypal) {
      resolve(window.paypal);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js" +
      `?client-id=${encodeURIComponent(clientId)}` +
      `&currency=${encodeURIComponent(currency)}` +
      "&intent=authorize" +
      "&components=buttons" +
      "&disable-funding=paylater,credit";
    script.async = true;
    script.dataset.paypalSdk = "true";
    script.onload = () => {
      if (window.paypal) resolve(window.paypal);
      else reject(new Error("paypal sdk loaded without a namespace"));
    };
    script.onerror = () => {
      pending = null;
      reject(new Error("paypal sdk failed to load"));
    };
    document.head.appendChild(script);
  });
  return pending;
}
