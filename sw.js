// Cache name
const CACHE_NAME = 'rfc-clock-caches-v1.1';
// Cache targets
const urlsToCache = [
    './',
    './index.html',
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

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
