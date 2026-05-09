// Siam Scuba Service Worker - minimal stale-while-revalidate strategy
// Goal: speed up repeat visits without breaking first-time visitors or
// accidentally caching the wrong things. Bump VERSION to invalidate
// the cache after any behavior change here.

const VERSION = "v2-2026-05-10";
const CACHE_NAME = `siamscuba-${VERSION}`;

// Pages we precache so a repeat visitor opening any of these gets an
// instant render. Keep this list short to avoid cache pressure.
const PRECACHE_URLS = ["/", "/he", "/blog"];

// A response is only safe to cache if it's a clean 200 from our own
// origin and not a Vercel bot-challenge HTML body served at any URL
// (challenges come back with status 403 + text/html + x-vercel-mitigated,
// but we belt-and-suspenders the content-type too).
function isCacheable(response, expectedKind) {
  if (!response || !response.ok) return false;
  if (response.type === "opaque" || response.type === "opaqueredirect") return false;
  if (response.redirected) return false;
  if (response.headers.get("x-vercel-mitigated")) return false;
  const ct = (response.headers.get("content-type") || "").toLowerCase();
  if (expectedKind === "asset") {
    // Hashed JS/CSS/images/fonts must come back as their own type, never HTML.
    if (ct.startsWith("text/html")) return false;
  }
  if (expectedKind === "html") {
    if (!ct.startsWith("text/html")) return false;
  }
  return true;
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // .catch(() => null) so a single 404 in PRECACHE_URLS doesn't abort install
      Promise.all(PRECACHE_URLS.map((url) => cache.add(url).catch(() => null))),
    ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((n) => n.startsWith("siamscuba-") && n !== CACHE_NAME)
            .map((n) => caches.delete(n)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Same-origin only - never intercept analytics, GTM, fonts.googleapis, etc.
  if (url.origin !== self.location.origin) return;

  // Never intercept any API call or webhook
  if (url.pathname.startsWith("/api/")) return;

  const isStaticAsset =
    url.pathname.startsWith("/assets/") ||
    /\.(?:js|css|woff2?|ttf|otf|webp|avif|jpg|jpeg|png|svg|ico)$/.test(url.pathname);

  // Static assets: cache-first (Vite emits hashed filenames so they're immutable).
  // Critical: only cache *clean* responses. Vercel's bot mitigation can return
  // a 403 HTML body for an /assets/*.js URL; if we cached that we'd serve
  // garbage HTML to the JS parser on every repeat visit.
  if (isStaticAsset) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (isCacheable(response, "asset")) cache.put(request, response.clone());
          return response;
        } catch (err) {
          return cached || Response.error();
        }
      }),
    );
    return;
  }

  // HTML navigations: stale-while-revalidate. Same rule — never cache a
  // bot-challenge page. We also skip caching when SSG might have shipped a
  // new build with renamed asset hashes; the safety net is that we only
  // store HTML that came back as text/html with no mitigation flag.
  const accept = request.headers.get("Accept") || "";
  if (request.mode === "navigate" || accept.includes("text/html")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((response) => {
            if (isCacheable(response, "html")) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      }),
    );
  }
});
