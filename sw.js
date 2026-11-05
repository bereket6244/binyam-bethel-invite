const CACHE_NAME = 'binyam-bethel-0256be29334aa953047fdfcbc4cdb07d9e29c363';
const PRECACHE = [];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('binyam-bethel-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if (url.pathname.includes('/api/') || /\/video\/birds-v\d+\/[^/]+-(?:high|medium|low)-[01]\.webp$/.test(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const key = event.request.mode === 'navigate' ? 'index.html' : event.request;
    const cached = await cache.match(key);
    if (event.request.mode === 'navigate') {
      try {
        const response = await fetch(event.request, {cache: 'no-store'});
        if (response.ok) event.waitUntil(cache.put(key, response.clone()));
        return response;
      } catch (error) {
        if (cached) return cached;
        throw error;
      }
    }
    const range = event.request.headers.get('range');
    if (cached && range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      if (match) {
        const buffer = await cached.arrayBuffer();
        const start = Number(match[1]);
        const end = match[2] ? Math.min(Number(match[2]), buffer.byteLength - 1) : buffer.byteLength - 1;
        if (start <= end && start < buffer.byteLength) {
          return new Response(buffer.slice(start, end + 1), {
            status: 206,
            headers: {
              'Content-Range': `bytes ${start}-${end}/${buffer.byteLength}`,
              'Content-Length': String(end - start + 1),
              'Content-Type': cached.headers.get('Content-Type') || 'video/mp4',
              'Accept-Ranges': 'bytes'
            }
          });
        }
      }
    }
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response.status === 200) event.waitUntil(cache.put(key, response.clone()));
    return response;
  })());
});
