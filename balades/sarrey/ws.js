const CACHE_NAME = 'ecoutons-voir-sarrey-v1';

// Liste des ressources essentielles à pré-charger pour le mode hors-ligne
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  // Vos fichiers audio locaux
  '/audio/etape-1.mp3',
  '/audio/etape-2.mp3',
  '/audio/etape-3.mp3',
  // Vos images locales
  '/images/etape-1.webp',
  '/images/etape-2.webp'
];

// Installation : Téléchargement et stockage de toutes les ressources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Interception des requêtes : Servir depuis le cache si hors-ligne
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Retourne le fichier depuis le cache local
      }
      return fetch(event.request); // Sinon fait la requête réseau
    })
  );
});