// sw.js
(() => {
  'use strict';

  /* ==========================================================================
     1. Cache Version & Assets
     ========================================================================== */
  const CACHE_NAME = 'shared-messages-v1';
  const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    'styles/main.css',
    'scripts/main.js',
    'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0..1000;1..1000&family=Lora:ital,wght@0..700;1..700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'
  ];

  /* ==========================================================================
     2. Install Event: Pre-cache Essential Assets
     ========================================================================== */
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(ASSETS))
        .then(() => self.skipWaiting())
        .catch(err => console.error('Service Worker install failed:', err))
    );
  });

  /* ==========================================================================
     3. Activate Event: Clean Up Old Caches
     ========================================================================== */
  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys()
        .then(keys =>
          Promise.all(
            keys.filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
          )
        )
        .then(() => self.clients.claim())
        .catch(err => console.error('Service Worker activate failed:', err))
    );
  });

  /* ==========================================================================
     4. Fetch Event: Serve from Cache, Fallback to Network
     ========================================================================== */
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(cached => {
          if (cached) return cached;
          return fetch(event.request)
            .catch(() => {
              // If navigation request fails, serve the cached index.html
              if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
              }
            });
        })
    );
  });
})();
