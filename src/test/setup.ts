import "@testing-library/jest-dom";

// localStorage POLYFILL.
//
// jsdom gives us sessionStorage but NOT localStorage under this runner: Node's
// own experimental `localStorage` global shadows jsdom's and stays disabled
// unless `--localstorage-file` is passed, so `window.localStorage` reads as
// undefined. Anything exercising the 30-day attribution mirror
// (src/utils/utm.ts) needs a real one.
//
// Production code must survive this state on its own - Safari private mode
// throws on the same access - and it does, via try/catch. This polyfill only
// makes the mirror observable in tests.
if (typeof window.localStorage === "undefined") {
  class MemoryStorage implements Storage {
    private store = new Map<string, string>();

    get length(): number {
      return this.store.size;
    }
    key(index: number): string | null {
      return Array.from(this.store.keys())[index] ?? null;
    }
    getItem(key: string): string | null {
      return this.store.has(key) ? this.store.get(key)! : null;
    }
    setItem(key: string, value: string): void {
      this.store.set(String(key), String(value));
    }
    removeItem(key: string): void {
      this.store.delete(key);
    }
    clear(): void {
      this.store.clear();
    }
    [name: string]: unknown;
  }

  const instance = new MemoryStorage();
  for (const target of [window, globalThis]) {
    Object.defineProperty(target, "localStorage", {
      configurable: true,
      writable: true,
      value: instance,
    });
  }
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
