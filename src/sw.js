/* MODDACHECK service worker — app shell oflayn ishlaydi (qidiruv, ma'lumotnoma).
 * %%VERSION%% va %%PRECACHE%% build vaqtida to'ldiriladi (scripts/build.mjs). */
const VERSION = '%%VERSION%%';
const CACHE = 'moddacheck-' + VERSION;
const PRECACHE = %%PRECACHE%%;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('moddacheck-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Faqat o'z domenimiz; API (Worker) va tashqi resurslar kesh qilinmaydi
  if (url.origin !== self.location.origin) return;

  // Navigatsiya: tarmoq birinchi, bo'lmasa kesh (index.html)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }
  // Statik fayllar: kesh birinchi, fon rejimida yangilash
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && res.status === 200) caches.open(CACHE).then((c) => c.put(req, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
