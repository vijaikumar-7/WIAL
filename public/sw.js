const CACHE_NAME = "wial-hub-shell-v1";
const SHELL = ["/", "/about", "/coaches", "/chapters", "/events", "/resources", "/contact", "/certification"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)).catch(() => Promise.resolve())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => caches.match("/")))
  );
});
