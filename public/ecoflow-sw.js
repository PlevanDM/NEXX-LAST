const CACHE_NAME = 'ecoflow-tracker-v1';
const PRECACHE = [
  '/nexx/power-tracker',
  '/ecoflow-manifest.json',
  '/static/nexx-logo.png',
  '/static/vendor/react.production.min.js',
  '/static/vendor/react-dom.production.min.js',
  '/data/power-stations.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // API calls — network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(fetch(e.request).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(CACHE_NAME).then(cache => cache.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request)));
    return;
  }
  // Static — cache first
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).then(r => {
    if (r.ok && r.type === 'basic') { const cl = r.clone(); caches.open(CACHE_NAME).then(cache => cache.put(e.request, cl)); }
    return r;
  })));
});
