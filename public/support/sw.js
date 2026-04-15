const CACHE_NAME = 'cuky-support-v5.2.0';
const ASSETS = [
    './',
    './index.html',
    './styles.css?v=5.2.0',
    './app.js?v=5.2.0',
    './cuky.webp'
];

// Instalar y cachear recursos
self.addEventListener('install', (e) => {
    self.skipWaiting(); // Forzar a que el nuevo SW tome el control inmediatamente
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// Limpiar caches antiguos
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
});

// Estrategia: Network First (Priorizar red, si falla usar cache)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => {
            return caches.match(e.request);
        })
    );
});
