import { useEffect } from "react";
import { useRouteError } from "react-router-dom";

// Stale-deploy recovery. The site deploys often; a tab holding yesterday's
// build keeps its old hashed asset URLs. On the next client-side navigation
// (e.g. browser Back from /fun-dive-booking) two things can 404 on Vercel:
//   1. vite-react-ssg's static-loader-data-manifest-<hash>.json - the fetch
//      gets Vercel's "The page could not be found" TEXT, .json() throws
//      SyntaxError ("Unexpected token 'T' ... is not valid JSON").
//   2. A lazy route chunk (assets/<page>-<hash>.js) - dynamic import fails.
// Both mean "this tab is running an outdated build". The right fix is a full
// reload: the fresh HTML references the new hashes and the navigation works.
// We auto-reload ONCE per minute at most (guarded via sessionStorage) so a
// genuinely broken deploy can never put the tab in an infinite reload loop.

const RELOAD_STAMP_KEY = "siam_stale_reload_at";
const RELOAD_MIN_INTERVAL_MS = 60_000;

const isStaleDeployError = (err: unknown): boolean => {
  const msg =
    err instanceof Error
      ? `${err.name}: ${err.message}`
      : typeof err === "object" && err !== null && "data" in err
        ? String((err as { data?: unknown }).data ?? "")
        : String(err ?? "");
  return /is not valid JSON|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError/i.test(
    msg,
  );
};

const canAutoReload = (): boolean => {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_STAMP_KEY));
    return !(last > 0 && Date.now() - last < RELOAD_MIN_INTERVAL_MS);
  } catch {
    // Storage blocked (private mode): reload once per page lifecycle anyway -
    // without the stamp we cannot loop-guard across reloads, but a reload
    // loop also cannot persist state, so each load starts fresh and renders
    // the fallback below if the error immediately recurs... play it safe and
    // do NOT auto-reload without a working guard.
    return false;
  }
};

const RouteErrorBoundary = () => {
  const error = useRouteError();
  const stale = isStaleDeployError(error);

  useEffect(() => {
    if (!stale || !canAutoReload()) return;
    try {
      sessionStorage.setItem(RELOAD_STAMP_KEY, String(Date.now()));
    } catch {
      return;
    }
    window.location.reload();
  }, [stale]);

  // Branded, calm fallback (matches the ocean-deep first-paint background).
  // Shown for a moment during the auto-reload, or persistently for real errors.
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        backgroundColor: "#0a335c",
        color: "rgba(255,255,255,0.92)",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 32,
          height: 32,
          border: "2px solid rgba(255,255,255,0.25)",
          borderTopColor: "rgba(255,255,255,0.9)",
          borderRadius: "50%",
          animation: "siam-spin 0.8s linear infinite",
        }}
      />
      <style>{"@keyframes siam-spin{to{transform:rotate(360deg)}}"}</style>
      <p style={{ margin: 0, fontSize: "1rem" }}>
        {stale ? "Updating to the latest version…" : "Something went wrong."}
      </p>
      {!stale && (
        <button
          type="button"
          onClick={() => window.location.replace("/")}
          style={{
            marginTop: "0.5rem",
            padding: "0.6rem 1.4rem",
            borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.08)",
            color: "inherit",
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          Back to homepage
        </button>
      )}
    </div>
  );
};

export default RouteErrorBoundary;
