/* Visit Montallegro Bovo Marina — funzionamento offline per la versione web (nell'app installata i file sono già sul telefono) */
const CACHE = 'visit-montallegro-v9';
const FILES = [
  './', 'index.html', 'css/app.css', 'js/config.js', 'js/app.js', 'data/contenuti.json',
  'vendor/leaflet/leaflet.js', 'vendor/leaflet/leaflet.css', 'vendor/capacitor/capacitor.js',
  'fonts/inter-latin-wght-normal.woff2', 'fonts/fraunces-latin-opsz-normal.woff2', 'img/logo-tondo.png', 'icons/icon-192.png', 'icons/apple-touch-icon.png', 'privacy.html',
  'img/foto/torre-salsa-falesia.jpg', 'img/foto/torre-salsa-spiaggia.jpg', 'img/foto/torre-salsa-acqua.jpg',
  'img/foto/torre-salsa-marna.jpg', 'img/foto/torre-salsa-dama-bianca.jpg', 'img/foto/capo-bianco-tramonto.jpg',
  'img/foto/montallegro-monte-suso.jpg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // mappe e meteo vanno sempre in rete
  // contenuti: prima la rete (per avere gli eventi aggiornati), poi la copia salvata
  if (url.pathname.endsWith('/data/contenuti.json')) {
    e.respondWith(
      fetch(req).then((res) => {
        const copia = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copia));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
