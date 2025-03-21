// Cache name
const CACHE_NAME = 'rfc-clock-caches-v2';
// Cache targets
const urlsToCache = [
    // './',
    // './index.html',
    './css/style.css',
    './js/clock.js',
    './js/hanabi.js',
    './lib/p5.min.js',
    './img/logo.png',
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function (cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

// 古いキャッシュを削除
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// ネットワーク優先でキャッシュを更新
self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request)
        .then(function (response) {
            return caches.open(CACHE_NAME).then(function (cache) {
                cache.put(event.request, response.clone());
                return response;
            });
        })
        .catch(function () {
            return caches.match(event.request);
        })
    );
});
