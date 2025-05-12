// Tambahkan versi cache
const CACHE_NAME = 'kalkulator-v3'; // ubah versinya jika update
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/idb.js',
  '/manifest.json',
  '/icon.png'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate - Hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
