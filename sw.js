const CACHE_NAME = 'stem-platform-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache for offline use
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/manifest.json',
    '/js/app.js',
    '/js/auth.js',
    '/js/student-dashboard.js',
    '/js/teacher-dashboard.js',
    '/js/module-player.js',
    '/js/offline-storage.js',
    '/js/gamification.js',
    '/js/i18n.js',
    '/offline.html'
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
    /^\/api\/modules/,
    /^\/api\/progress/,
    /^\/api\/analytics/
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Failed to cache static assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http requests
    if (!request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        handleRequest(request)
    );
});

async function handleRequest(request) {
    const url = new URL(request.url);
    
    try {
        // Try network first for API requests
        if (url.pathname.startsWith('/api/')) {
            return await networkFirst(request);
        }
        
        // For static assets, try cache first
        return await cacheFirst(request);
        
    } catch (error) {
        console.log('Request failed, serving offline fallback:', error);
        
        // If it's a navigation request, serve offline page
        if (request.mode === 'navigate') {
            return await caches.match(OFFLINE_URL) || 
                   new Response('Offline - Please check your connection', {
                       status: 503,
                       statusText: 'Service Unavailable'
                   });
        }
        
        // For other requests, return a generic offline response
        return new Response('Resource unavailable offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        console.log('Serving from cache:', request.url);
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network request failed:', error);
        throw error;
    }
}

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful API responses
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network request failed, trying cache:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('Serving API from cache:', request.url);
            return cachedResponse;
        }
        
        throw error;
    }
}

// Background sync for offline data
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Background sync triggered');
        event.waitUntil(syncOfflineData());
    }
});

async function syncOfflineData() {
    try {
        // Get offline data from IndexedDB
        const offlineData = await getOfflineData();
        
        if (offlineData && offlineData.length > 0) {
            console.log('Syncing offline data:', offlineData.length, 'items');
            
            // Send data to server
            const response = await fetch('/api/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(offlineData)
            });
            
            if (response.ok) {
                console.log('Offline data synced successfully');
                // Clear synced data from IndexedDB
                await clearSyncedData();
            } else {
                console.error('Failed to sync offline data');
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Helper functions for offline data management
async function getOfflineData() {
    // This would integrate with your IndexedDB implementation
    // For now, return empty array
    return [];
}

async function clearSyncedData() {
    // This would clear synced data from IndexedDB
    console.log('Clearing synced data from local storage');
}

// Push notifications for assignments and updates
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            vibrate: [100, 50, 100],
            data: data.data,
            actions: data.actions || []
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(cache => cache.addAll(event.data.urls))
        );
    }
});