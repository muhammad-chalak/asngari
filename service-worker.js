const CACHE_NAME = "chalak-cache-v2";
const urlsToCache = ['./','index.html','style.css','script.js','manifest.json','icons/icon-192.png','icons/icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  if(requestUrl.pathname.startsWith('/images/')){
    event.respondWith(
      caches.match(event.request).then(function(response){
        return response || fetch(event.request).then(function(resp){
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(event.request, copy));
          return resp;
        }).catch(()=>caches.match('fallback-image'));
      })
    );
    return;
  }
  event.respondWith(caches.match(event.request).then(resp=>resp||fetch(event.request)));
});
