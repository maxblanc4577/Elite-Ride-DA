// Service Worker for Elite Ride Dominica Offline Mode
const CACHE_NAME = 'elite-ride-cache-v1';
const ESTIMATION_CACHE_NAME = 'elite-ride-estimation-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/metadata.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== ESTIMATION_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Listen to postMessage to cache ride estimation data
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_RIDE_ESTIMATION') {
    const data = event.data.payload;
    event.waitUntil(
      caches.open(ESTIMATION_CACHE_NAME).then((cache) => {
        const response = new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        });
        return cache.put('/api/offline-estimation-cache', response);
      })
    );
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Intercept offline estimation cache API
  if (url.pathname === '/api/offline-estimation-cache') {
    event.respondWith(
      caches.open(ESTIMATION_CACHE_NAME).then((cache) => {
        return cache.match('/api/offline-estimation-cache').then((cached) => {
          if (cached) return cached;
          return new Response(JSON.stringify({ error: 'No cached estimation available' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
