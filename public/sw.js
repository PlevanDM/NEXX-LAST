// NEXX GSM Service Worker v2.0 - Updated to prevent JS/CSS caching
const CACHE_NAME = 'nexx-gsm-v2.0-20260123';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/nexx-logo.png',
  '/static/nexx-logo-animated.svg',
  '/static/nexx-logo-dark-transparent.png'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Network first, fallback to cache
// DO NOT cache JavaScript/CSS files with version parameters to ensure updates
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Don't cache JS/CSS files with version parameters (e.g., ?v=10.2.0)
  const isVersionedAsset = (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) && url.search.includes('v=');
  
  // Don't cache i18n.js, database.js, or any .min.js files
  const isDynamicAsset = url.pathname.includes('i18n.js') || 
                         url.pathname.includes('database.js') || 
                         url.pathname.includes('.min.js') ||
                         url.pathname.includes('price-calculator.js');
  
  if (isVersionedAsset || isDynamicAsset) {
    // Always fetch from network, no caching
    event.respondWith(fetch(event.request));
    return;
  }
  
  // For other files, use network first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone and cache successful responses (only for non-dynamic assets)
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
