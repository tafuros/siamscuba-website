import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Accessibility, X, Plus, Minus, Contrast, Link2, Pause, RotateCcw } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Native accessibility menu (הצהרת/תפריט נגישות) — no third-party overlay.
 * Drives user-adjustable a11y settings via data-attributes on <html> (see the
 * `html[data-a11y-*]` rules in index.css) and persists them to localStorage.
 * Required complements for IL תקנות נגישות (IS 5568 / WCAG 2.0 AA): text resize,
 * high contrast, link emphasis, motion stop — plus a link to the statement page.
 */

type A11ySettings = {
  fontScale: number; // 0..3
  contrast: boolean;
  links: boolean;
  noMotion: boolean;
};

const KEY = "siamscuba-a11y";
const DEFAULTS: A11ySettings = { fontScale: 0, contrast: false, links: false, noMotion: false };

const isBrowser = typeof window !== "undefined";

function load(): A11ySettings {
  if (!isBrowser) return DEFAULTS;
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return DEFAULTS;
  }
}

function apply(s: A11ySettings) {
  if (!isBrowser) return;
  const el = document.documentElement;
  el.dataset.a11yFont = String(s.fontScale);
  el.dataset.a11yContrast = s.contrast ? "on" : "off";
  el.dataset.a11yLinks = s.links ? "on" : "off";
  el.dataset.a11yMotion = s.noMotion ? "off" : "on";
}

// Apply persisted settings as early as the module loads (before first paint of
// the menu) so a returning user doesn't see a flash of un-adjusted UI. No-op on
// the server (SSG) where there's no window.
apply(load());

// Localized labels. EN is the fallback for es/fr (the toggles are universal and
// the legal statement is HE/EN only).
const LABELS = {
  he: {
    open: "תפריט נגישות",
    panel: "הגדרות נגישות",
    heading: "נגישות",
    close: "סגור תפריט נגישות",
    textSize: "גודל טקסט",
    smaller: "הקטן טקסט",
    larger: "הגדל טקסט",
    sizes: ["רגיל", "גדול", "גדול יותר", "מקסימלי"],
    contrast: "ניגודיות גבוהה",
    links: "הדגשת קישורים",
    noMotion: "עצירת אנימציות",
    statement: "הצהרת נגישות",
    reset: "איפוס",
  },
  en: {
    open: "Accessibility menu",
    panel: "Accessibility settings",
    heading: "Accessibility",
    close: "Close accessibility menu",
    textSize: "Text size",
    smaller: "Decrease text size",
    larger: "Increase text size",
    sizes: ["Normal", "Large", "Larger", "Maximum"],
    contrast: "High contrast",
    links: "Highlight links",
    noMotion: "Stop animations",
    statement: "Accessibility statement",
    reset: "Reset",
  },
} as const;

const AccessibilityMenu = () => {
  const { language, isRTL } = useLanguage();
  const L = language === "he" ? LABELS.he : LABELS.en;

  const [open, setOpen] = useState(false);
  const [s, setS] = useState<A11ySettings>(load);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    apply(s);
    if (!isBrowser) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* storage may be blocked (private mode) — settings still apply for the session */
    }
  }, [s]);

  // Esc closes; restore focus to the trigger.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
  }, [open]);

  const set = useCallback(<K extends keyof A11ySettings>(k: K, v: A11ySettings[K]) => {
    setS((prev) => ({ ...prev, [k]: v }));
  }, []);

  const reset = useCallback(() => setS(DEFAULTS), []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={L.open}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-50 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-white/70 transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Accessibility size={24} aria-hidden="true" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/20"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={L.panel}
            dir={isRTL ? "rtl" : "ltr"}
            className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-4 z-50 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-primary">{L.heading}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={L.close}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Text size */}
            <div className="mb-3">
              <div className="mb-1.5 text-sm font-medium">{L.textSize}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => set("fontScale", Math.max(0, s.fontScale - 1))}
                  disabled={s.fontScale === 0}
                  aria-label={L.smaller}
                  className="grid size-9 place-items-center rounded-lg border border-border hover:bg-muted disabled:opacity-40"
                >
                  <Minus size={16} aria-hidden="true" />
                </button>
                <div className="flex-1 text-center text-sm tabular-nums" aria-live="polite">
                  {L.sizes[s.fontScale]}
                </div>
                <button
                  type="button"
                  onClick={() => set("fontScale", Math.min(3, s.fontScale + 1))}
                  disabled={s.fontScale === 3}
                  aria-label={L.larger}
                  className="grid size-9 place-items-center rounded-lg border border-border hover:bg-muted disabled:opacity-40"
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Toggles */}
            <Toggle
              icon={<Contrast size={16} aria-hidden="true" />}
              label={L.contrast}
              checked={s.contrast}
              onChange={(v) => set("contrast", v)}
            />
            <Toggle
              icon={<Link2 size={16} aria-hidden="true" />}
              label={L.links}
              checked={s.links}
              onChange={(v) => set("links", v)}
            />
            <Toggle
              icon={<Pause size={16} aria-hidden="true" />}
              label={L.noMotion}
              checked={s.noMotion}
              onChange={(v) => set("noMotion", v)}
            />

            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <Link
                to="/accessibility"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-primary underline underline-offset-2 hover:opacity-80"
              >
                {L.statement}
              </Link>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                <RotateCcw size={14} aria-hidden="true" />
                {L.reset}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

function Toggle({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="mb-1.5 flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm hover:bg-muted"
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked ? "bg-primary" : "bg-muted-foreground/40"}`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${checked ? "start-0.5" : "end-0.5"}`}
        />
      </span>
    </button>
  );
}

export default AccessibilityMenu;
