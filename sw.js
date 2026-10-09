const CACHE = 'mnsn-v6';
const FILES = [
  './', './index.html', './manifest.webmanifest',
  './icone/logo.png', './icone/icona-192.png', './icone/icona-512.png', './icone/icona-180.png',
  './giochi/scatolina.html', './giochi/supermercato.html', './giochi/gambero-rosso.html',
  './giochi/uri.html', './giochi/mazzetti.html'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Rete prima (così gli aggiornamenti arrivano subito), copia salvata se offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && (res.ok || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
