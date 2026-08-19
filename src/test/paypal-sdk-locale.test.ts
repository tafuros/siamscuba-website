import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  PAYPAL_LOCALES,
  paypalLocale,
  loadPayPalSdk,
  __resetPayPalSdkForTests,
  type PayPalNamespace,
} from "@/lib/paypalSdk";
import { languageNames } from "@/i18n/translations";

/**
 * The bug this guards: on the English /hotel page PayPal rendered a Hebrew card
 * button, because with no `locale` the SDK guesses from the browser and the IP.
 * The locale now comes from the page, and the loader's cache is keyed by it so
 * a language switch cannot silently keep the first locale that loaded.
 */

const CLIENT = "test-client-id";

/** jsdom never runs the injected script - stand in for what PayPal would do. */
function resolveScript(index: number): HTMLScriptElement {
  const scripts = Array.from(
    document.querySelectorAll<HTMLScriptElement>("script[data-paypal-sdk]"),
  );
  const script = scripts[index];
  const namespace = script.dataset.namespace!;
  (window as unknown as Record<string, unknown>)[namespace] = {
    Buttons: () => ({ render: async () => {} }),
  } satisfies PayPalNamespace;
  script.dispatchEvent(new Event("load"));
  return script;
}

const sdkScripts = () =>
  Array.from(document.querySelectorAll<HTMLScriptElement>("script[data-paypal-sdk]"));

beforeEach(() => {
  __resetPayPalSdkForTests();
  document.head.innerHTML = "";
  for (const key of Object.keys(window)) {
    if (key.startsWith("paypalSdk")) delete (window as unknown as Record<string, unknown>)[key];
  }
});

afterEach(() => {
  document.head.innerHTML = "";
});

describe("paypalLocale", () => {
  it("maps every site language to its PayPal locale", () => {
    expect(paypalLocale("en")).toBe("en_US");
    expect(paypalLocale("he")).toBe("he_IL");
    expect(paypalLocale("es")).toBe("es_ES");
    expect(paypalLocale("fr")).toBe("fr_FR");
  });

  it("covers every language the site ships, with no extras", () => {
    expect(Object.keys(PAYPAL_LOCALES).sort()).toEqual(Object.keys(languageNames).sort());
  });

  it("falls back to en_US rather than throwing on an unknown language", () => {
    expect(paypalLocale("de")).toBe("en_US");
    expect(paypalLocale("")).toBe("en_US");
    expect(paypalLocale(null)).toBe("en_US");
    expect(paypalLocale(undefined)).toBe("en_US");
  });
});

describe("loadPayPalSdk - locale in the script url", () => {
  it("passes the locale explicitly instead of letting the SDK guess", () => {
    void loadPayPalSdk(CLIENT, "THB", "en_US");
    const src = sdkScripts()[0].src;
    expect(src).toContain("locale=en_US");
    expect(src).toContain("client-id=test-client-id");
    expect(src).toContain("currency=THB");
    // the money side of the flow must not drift
    expect(src).toContain("intent=authorize");
  });

  it("sends he_IL for the Hebrew page", () => {
    void loadPayPalSdk(CLIENT, "THB", paypalLocale("he"));
    expect(sdkScripts()[0].src).toContain("locale=he_IL");
  });

  it.each([
    ["en", "locale=en_US"],
    ["he", "locale=he_IL"],
    ["es", "locale=es_ES"],
    ["fr", "locale=fr_FR"],
  ])("loads %s with %s", (lang, expected) => {
    void loadPayPalSdk(CLIENT, "THB", paypalLocale(lang));
    expect(sdkScripts()[0].src).toContain(expected);
  });
});

describe("loadPayPalSdk - cache keyed by locale", () => {
  it("reuses the one script when nothing changed", async () => {
    const first = loadPayPalSdk(CLIENT, "THB", "en_US");
    const second = loadPayPalSdk(CLIENT, "THB", "en_US");
    expect(second).toBe(first);
    expect(sdkScripts()).toHaveLength(1);
    resolveScript(0);
    await expect(first).resolves.toHaveProperty("Buttons");
  });

  it("does NOT reuse the English instance for Hebrew", async () => {
    const en = loadPayPalSdk(CLIENT, "THB", "en_US");
    resolveScript(0);
    await en;

    const he = loadPayPalSdk(CLIENT, "THB", "he_IL");
    expect(he).not.toBe(en);
    const scripts = sdkScripts();
    expect(scripts).toHaveLength(2);
    expect(scripts[0].src).toContain("locale=en_US");
    expect(scripts[1].src).toContain("locale=he_IL");
  });

  it("gives each locale its own namespace so the instances cannot collide", async () => {
    loadPayPalSdk(CLIENT, "THB", "en_US");
    loadPayPalSdk(CLIENT, "THB", "fr_FR");
    const [enScript, frScript] = sdkScripts();
    expect(enScript.dataset.namespace).toBeTruthy();
    expect(frScript.dataset.namespace).toBeTruthy();
    expect(enScript.dataset.namespace).not.toBe(frScript.dataset.namespace);
  });

  it("resolves with the namespace the SDK actually created", async () => {
    const pending = loadPayPalSdk(CLIENT, "THB", "es_ES");
    const script = resolveScript(0);
    const ns = await pending;
    expect(ns).toBe((window as unknown as Record<string, unknown>)[script.dataset.namespace!]);
  });

  it("a currency change is also a new instance", () => {
    loadPayPalSdk(CLIENT, "THB", "en_US");
    loadPayPalSdk(CLIENT, "USD", "en_US");
    expect(sdkScripts()).toHaveLength(2);
  });

  it("drops a failed load from the cache so a retry re-injects", async () => {
    const failing = loadPayPalSdk(CLIENT, "THB", "en_US");
    sdkScripts()[0].dispatchEvent(new Event("error"));
    await expect(failing).rejects.toThrow(/failed to load/);

    const retry = loadPayPalSdk(CLIENT, "THB", "en_US");
    expect(retry).not.toBe(failing);
    expect(sdkScripts()).toHaveLength(2);
  });
});
