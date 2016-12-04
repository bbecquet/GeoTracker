const CACHE_NAME = 'geotracker_cache';

self.addEventListener('install', event => {
  console.log('Installing Service Worker');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache =>
        fetch('/static/meta/assets.json')
          .then(response => response.json())
          .then(assets => {
            console.log('Webpack assets', assets);
            const pathsToCache = Object.keys(assets)
              .filter(key => key !== 'sw.js') // don't cache the SW itself
              .map(key => '/' + assets[key]);
            pathsToCache.unshift('/');
            cache.addAll(pathsToCache);
          })
      ).then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) { return response; }

        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  // Calling claim() to force a "controllerchange" event on navigator.serviceWorker
  event.waitUntil(self.clients.claim());
});
