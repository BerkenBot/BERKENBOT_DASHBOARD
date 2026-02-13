// Service worker: network-first strategy to bypass GitHub Pages CDN cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .catch(() => caches.match(event.request))
  );
});
