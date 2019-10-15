//yo service worker
self.addEventListener('install',evt =>{
    console.log("SERVICE WORKER installed");
})

self.addEventListener('activate',evt =>{
console.log("service worker is active");
})

self.addEventListener('fetch',evt =>{
   // console.log("fetch event", evt);
})