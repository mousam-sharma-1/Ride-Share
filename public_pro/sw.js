var staticCacheName= 'site-static'
var assets= [
    '/about',
    '/js/app.js',
    '/navbar.html',
    '/11favicon.png',
    '/fallback.png',
    '/fallback.html',
    '/ms.jpg',
    '/ag.jpg',
    '/gb.jpg',
    'https://code.jquery.com/jquery-1.10.2.js',
    '/min_pro_clg/manifest.json',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
    'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js',
    '/favicon.ico',
    '/icons/icon-192x192.png',
]



//yo service worker 
self.addEventListener('install',evt =>{
    console.log("SERVICE WORKER installed");
    evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
        console.log("caching..")
        cache.addAll(assets);
    })
)
})

self.addEventListener('activate',evt =>{
console.log("service worker is active");
})

self.addEventListener('fetch',evt =>{
 //  console.log("fetch event");
   evt.respondWith(
       caches.match(evt.request).then(cacheRes =>{
           return cacheRes || fetch(evt.request);
       }).catch(() =>    caches.match('/fallback.html'))
   )
})