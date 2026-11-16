/**
 * Enhanced Service Worker for PWA
 * Provides offline support, background sync, and push notifications
 */

const CACHE_VERSION = "v2";
const STATIC_CACHE = `autism-static-${CACHE_VERSION}`;
const API_CACHE = `autism-api-${CACHE_VERSION}`;
const IMAGE_CACHE = `autism-images-${CACHE_VERSION}`;

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("[SW] Installation complete");
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith("autism-") &&
                cacheName !== STATIC_CACHE &&
                cacheName !== API_CACHE &&
                cacheName !== IMAGE_CACHE,
            )
            .map((cacheName) => {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }),
        );
      })
      .then(() => {
        console.log("[SW] Activation complete");
        return self.clients.claim();
      }),
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // Strategy for API requests
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(apiStrategy(request));
    return;
  }

  // Strategy for images
  if (request.destination === "image") {
    event.respondWith(imageStrategy(request));
    return;
  }

  // Default strategy for static assets
  event.respondWith(staticStrategy(request));
});

/**
 * API Strategy: Network First, then Cache
 * Good for dynamic data that changes frequently
 */
async function apiStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache successful GET requests
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Fall back to cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      console.log("[SW] Serving cached API response:", request.url);
      return cachedResponse;
    }

    // Return offline fallback for API
    return new Response(
      JSON.stringify({
        error: "You are offline",
        offline: true,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

/**
 * Image Strategy: Cache First, then Network
 * Good for images that don't change often
 */
async function imageStrategy(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Return cached version immediately
    // Update cache in background
    fetch(request)
      .then((response) => {
        if (response.ok) {
          caches.open(IMAGE_CACHE).then((cache) => {
            cache.put(request, response);
          });
        }
      })
      .catch(() => {
        // Ignore background update errors
      });

    return cachedResponse;
  }

  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Return placeholder image
    return new Response("Image not available offline", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

/**
 * Static Strategy: Cache First, then Network
 * Good for static assets that rarely change
 */
async function staticStrategy(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Return offline page if available
    const offlinePage = await caches.match("/offline.html");
    if (offlinePage) {
      return offlinePage;
    }

    throw error;
  }
}

// Background Sync for offline mutations
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-patients" || event.tag === "sync-goals") {
    console.log("[SW] Background sync triggered:", event.tag);
    event.waitUntil(syncData(event.tag));
  }
});

/**
 * Sync data that was queued while offline
 */
async function syncData(tag) {
  // This would typically sync with IndexedDB or queue
  console.log("[SW] Syncing data for:", tag);

  // Notify all clients that sync is complete
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      type: "SYNC_COMPLETE",
      tag,
      timestamp: new Date().toISOString(),
    });
  });
}

// Push Notifications
self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received");

  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body || "New notification",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-72.png",
    tag: data.tag || "default",
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    data: data.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Autism Care Platform",
      options,
    ),
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.notification.tag);

  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      // Try to focus existing client
      for (const client of clientList) {
        if (client.url === event.notification.data?.url && "focus" in client) {
          return client.focus();
        }
      }

      // Open new window if no existing client
      if (self.clients.openWindow) {
        return self.clients.openWindow(event.notification.data?.url || "/");
      }
    }),
  );
});

// Message handler for communication with main thread
self.addEventListener("message", (event) => {
  console.log("[SW] Message received:", event.data);

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data.type === "CACHE_URLS") {
    const urls = event.data.urls;
    caches.open(STATIC_CACHE).then((cache) => {
      cache.addAll(urls);
    });
  }
});
