// Ellext PWA Service Worker - Safe Offline Shell & Caching
const CACHE_NAME = 'ellext-static-v2';

// Public static assets safe to cache
const STATIC_ASSETS = [
  '/',
  '/assets/brand/ellext-logo.jpg',
  '/favicon.ico'
];

// Patterns that MUST NEVER be cached to protect patron & CRM privacy
const NEVER_CACHE_PATTERNS = [
  /\/api\/admin/,
  /\/api\/account/,
  /\/api\/auth/,
  /\/api\/orders/,
  /\/admin/,
  /\/account/,
  /\/checkout/
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache non-fatal error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data?.text() || 'A new order has arrived.' };
  }
  const target = typeof payload.url === 'string' && payload.url.startsWith('/admin')
    ? payload.url
    : '/admin/orders';
  event.waitUntil(self.registration.showNotification(payload.title || 'New Ellext order', {
    body: payload.body || 'Open the admin app to review the order.',
    icon: payload.icon || '/assets/brand/ellext-app-icon.svg',
    badge: payload.badge || '/assets/brand/ellext-app-icon.svg',
    tag: payload.tag || 'ellext-new-order',
    data: { url: target },
    requireInteraction: true
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const requested = event.notification.data?.url;
  const target = new URL(typeof requested === 'string' && requested.startsWith('/admin') ? requested : '/admin/orders', self.location.origin);
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (clients) => {
    for (const client of clients) {
      if (new URL(client.url).origin === self.location.origin && new URL(client.url).pathname.startsWith('/admin') && 'navigate' in client) {
        await client.navigate(target.href);
        return client.focus();
      }
    }
    return self.clients.openWindow(target.href);
  }));
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Never cache non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // 2. Never cache sensitive account, auth, checkout, or admin routes/APIs
  const isSensitive = NEVER_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname));
  if (isSensitive) {
    return; // Pass straight to network
  }

  // 3. For images & static media: Cache First with network fallback
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Return fallback image if any
          return cachedResponse;
        });
      })
    );
    return;
  }

  // 4. For HTML pages: Network First with safe fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request).then((cachedResponse) => {
          return cachedResponse || caches.match('/');
        });
      })
    );
  }
});
