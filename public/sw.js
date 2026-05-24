// Self-destructing service worker.
// Previously this SW ran a stale-while-revalidate cache that pinned old
// index.html, causing returning visitors to load HTML referencing asset
// hashes that Vercel had already garbage-collected. Result: JS bundle
// 404s, React never hydrates, user stuck on splash logo.
//
// We removed SW caching entirely. This file remains only to clean up
// existing installs. When the browser fetches /sw.js and sees this new
// version, it installs, activates, deletes every cache, unregisters
// itself, and force-reloads open clients so they refetch fresh HTML
// straight from Vercel's CDN.
//
// Once enough time has passed that we're confident no client still has
// the old SW registered (~30 days conservatively), this file can be
// deleted entirely.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => {
        try {
          client.navigate(client.url);
        } catch {
          // older Safari may throw on navigate(); ignore
        }
      });
    })(),
  );
});

// No fetch handler - all requests go straight to the network (and Vercel CDN).
