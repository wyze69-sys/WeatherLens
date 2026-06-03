const APP_CACHE = "weatherlens-shell-v1";
const API_CACHE = "weatherlens-openweather-v1";
const API_MAX_AGE = 24 * 60 * 60 * 1000;
const APP_SHELL = ["/", "/index.html", "/favicon.svg", "/icons.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(APP_CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => ![APP_CACHE, API_CACHE].includes(key)).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(API_CACHE);
  const cached = await cache.match(request);
  const cachedAt = cached ? Number(cached.headers.get("sw-cache-time") || 0) : 0;
  const freshEnough = cached && Date.now() - cachedAt < API_MAX_AGE;

  const network = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        const headers = new Headers(response.headers);
        headers.set("sw-cache-time", String(Date.now()));
        await cache.put(request, new Response(await response.clone().blob(), { status: response.status, statusText: response.statusText, headers }));
      }
      return response;
    })
    .catch(() => null);

  return freshEnough ? cached : (await network) || cached || Response.error();
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.hostname === "api.openweathermap.org") {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("/index.html")));
  }
});
