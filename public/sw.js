// Service Worker for Elite Ride Dominica Offline Mode & Map Tile Caching
const CACHE_NAME = 'elite-ride-cache-v2';
const ESTIMATION_CACHE_NAME = 'elite-ride-estimation-cache-v1';
const MAP_TILE_CACHE_NAME = 'elite-ride-map-tiles-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/metadata.json',
  '/public/favicon.svg',
  '/public/elite-ride-logo.svg',
];

// Pre-generated SVG vector map tile data for Dominica critical corridors
const DOMINICA_MAP_TILES = [
  {
    region: 'roseau',
    name: 'Roseau Bayfront & Capital Corridor',
    bounds: { latMin: 15.29, latMax: 15.32, lngMin: -61.40, lngMax: -61.37 },
    roads: ['Dame Eugenia Charles Blvd', 'E.O. Leblanc Hwy South', 'Independence St', 'Bayfront Cruise Berth'],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256"><rect width="256" height="256" fill="#0f172a"/><path d="M20 220 C60 180, 100 140, 140 100 S220 40, 240 20" stroke="#10b981" stroke-width="4" fill="none"/><path d="M60 250 L120 180 L180 120" stroke="#059669" stroke-width="2" fill="none" stroke-dasharray="4 2"/><circle cx="80" cy="160" r="6" fill="#3b82f6"/><text x="92" y="164" fill="#94a3b8" font-size="10" font-family="sans-serif">Roseau Ferry Hub</text></svg>`,
  },
  {
    region: 'portsmouth',
    name: 'Portsmouth & Cabrits National Park Corridor',
    bounds: { latMin: 15.55, latMax: 15.60, lngMin: -61.48, lngMax: -61.44 },
    roads: ['Prince Rupert Bay Arterial', 'Cabrits Peninsula Access', 'Secret Bay Resort Road'],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256"><rect width="256" height="256" fill="#0f172a"/><path d="M10 240 Q100 200, 150 120 T240 10" stroke="#10b981" stroke-width="4" fill="none"/><circle cx="150" cy="120" r="6" fill="#10b981"/><text x="162" y="124" fill="#94a3b8" font-size="10" font-family="sans-serif">Prince Rupert Bay</text></svg>`,
  },
  {
    region: 'dom_airport',
    name: 'Douglas-Charles Airport (DOM) North Highway',
    bounds: { latMin: 15.53, latMax: 15.56, lngMin: -61.31, lngMax: -61.28 },
    roads: ['Melville Hall Airport Approach', 'Marigot North Coastal Rd', 'Londonderry Bridge'],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256"><rect width="256" height="256" fill="#0f172a"/><path d="M30 140 L220 140" stroke="#f59e0b" stroke-width="6" fill="none"/><path d="M10 200 C80 170, 160 140, 240 90" stroke="#10b981" stroke-width="4" fill="none"/><text x="40" y="125" fill="#f59e0b" font-size="11" font-weight="bold" font-family="sans-serif">DOM RUNWAY 09/27</text></svg>`,
  },
  {
    region: 'pont_casse',
    name: 'Pont Cassé Central Rainforest Pass',
    bounds: { latMin: 15.36, latMax: 15.39, lngMin: -61.36, lngMax: -61.33 },
    roads: ['Imperial Road', 'Morne Trois Pitons Traverse', 'Pont Cassé Roundabout'],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256"><rect width="256" height="256" fill="#091d17"/><circle cx="128" cy="128" r="16" stroke="#10b981" stroke-width="4" fill="none"/><path d="M128 20 L128 112 M128 144 L128 236 M20 128 L112 128 M144 128 L236 128" stroke="#10b981" stroke-width="3"/><text x="135" y="120" fill="#6ee7b7" font-size="9" font-family="sans-serif">Pont Cassé Rotary</text></svg>`,
  },
  {
    region: 'canefield',
    name: 'Canefield Airport (DCF) & Industrial Corridor',
    bounds: { latMin: 15.33, latMax: 15.35, lngMin: -61.40, lngMax: -61.38 },
    roads: ['E.O. Leblanc Coastal Hwy', 'Old Market Bypass', 'Canefield Strip'],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256"><rect width="256" height="256" fill="#0f172a"/><path d="M40 80 L200 200" stroke="#f59e0b" stroke-width="5" fill="none"/><path d="M20 20 C60 80, 100 160, 220 240" stroke="#10b981" stroke-width="4" fill="none"/><text x="45" y="70" fill="#f59e0b" font-size="10" font-family="sans-serif">DCF AIRPORT</text></svg>`,
  },
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE).catch(() => {})),
      // Cache Dominica Map Tile segments for offline GPS tracking
      caches.open(MAP_TILE_CACHE_NAME).then((tileCache) => {
        const promises = DOMINICA_MAP_TILES.map((tile) => {
          const res = new Response(tile.svg, {
            headers: {
              'Content-Type': 'image/svg+xml',
              'X-Dominica-Region': tile.region,
              'X-Cache-Status': 'pre-cached',
            },
          });
          return tileCache.put(`/api/tiles/${tile.region}`, res).catch(() => {});
        });

        // Cache map tile status metadata
        const statusRes = new Response(
          JSON.stringify({
            status: 'cached',
            count: DOMINICA_MAP_TILES.length,
            regions: DOMINICA_MAP_TILES.map((t) => t.name),
            timestamp: Date.now(),
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
        promises.push(tileCache.put('/api/tiles/status', statusRes).catch(() => {}));

        return Promise.all(promises);
      }),
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== ESTIMATION_CACHE_NAME && key !== MAP_TILE_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Listen to postMessage to cache ride estimation or map tile requests
self.addEventListener('message', (event) => {
  if (event.data) {
    if (event.data.type === 'CACHE_RIDE_ESTIMATION') {
      const data = event.data.payload;
      event.waitUntil(
        caches.open(ESTIMATION_CACHE_NAME).then((cache) => {
          const response = new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
          });
          return cache.put('/api/offline-estimation-cache', response);
        })
      );
    } else if (event.data.type === 'PRELOAD_MAP_TILES') {
      event.waitUntil(
        caches.open(MAP_TILE_CACHE_NAME).then((tileCache) => {
          return tileCache.match('/api/tiles/status');
        })
      );
    }
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Intercept Dominica Map Tile APIs (CacheFirst Strategy with Offline Synthetic Fallback)
  if (url.pathname.startsWith('/api/tiles/') || url.pathname.includes('/tiles/dominica/')) {
    event.respondWith(
      caches.open(MAP_TILE_CACHE_NAME).then((tileCache) => {
        return tileCache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Try network or fallback to generic Dominica coastal topographic tile
          return fetch(event.request).catch(() => {
            const defaultTile = DOMINICA_MAP_TILES[0];
            return new Response(defaultTile.svg, {
              headers: {
                'Content-Type': 'image/svg+xml',
                'X-Offline-Fallback': 'true',
              },
            });
          });
        });
      })
    );
    return;
  }

  // 2. Intercept External OpenStreetMap / Carto Map Tile CDN requests
  if (
    url.hostname.includes('tile.openstreetmap.org') ||
    url.hostname.includes('cartocdn.com') ||
    url.pathname.match(/\/\d+\/\d+\/\d+\.png$/)
  ) {
    event.respondWith(
      caches.open(MAP_TILE_CACHE_NAME).then((tileCache) => {
        return tileCache.match(event.request).then((cachedTile) => {
          if (cachedTile) return cachedTile;
          return fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                tileCache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              // Return offline SVG vector tile for Dominica when cell signal drops
              return new Response(DOMINICA_MAP_TILES[0].svg, {
                headers: { 'Content-Type': 'image/svg+xml', 'X-Offline-Tile': 'true' },
              });
            });
        });
      })
    );
    return;
  }

  // 3. Intercept offline estimation cache API
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

  // 4. Stale-while-revalidate for application assets
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
