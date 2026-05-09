// Siam Scuba Service Worker - minimal stale-while-revalidate strategy
// Goal: speed up repeat visits without breaking first-time visitors or
// accidentally caching the wrong things. Bump VERSION to invalidate
// the cache after any behavior change here.

const VERSION = "v1-2026-05-10";
const CACHE_NAME = `siamscuba-${VERSION}`;

// Pages we precache so a repeat visitor opening any of these gets an
// instant render. Keep this list short to avoid cache pressure.
const PRECACHE_URLS = ["/", "/he", "/blog"];

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

  // Static assets: cache-first (Vite emits hashed filenames so they're immutable)
  if (isStaticAsset) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch (err) {
          return cached || Response.error();
        }
      }),
    );
    return;
  }

  // HTML navigations: stale-while-revalidate
  const accept = request.headers.get("Accept") || "";
  if (request.mode === "navigate" || accept.includes("text/html")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      }),
    );
  }
});
