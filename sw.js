const CACHE_NAME = 'hele-on-gtfs-v1';
const urlsToCache = [
    './',
'./index.html',
'./routes.txt',
'./stops.txt',
'./trips.txt',
'./stop_times.txt',
'./shapes.txt',
'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install event - caching the assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch event - serve from cache when offline, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Return cached version if found, otherwise fetch from network
            if (response) {
                return response;
            }
            return fetch(event.request);
        }
        )
    );
});

// Activate event - clean up old caches if you update version names
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
