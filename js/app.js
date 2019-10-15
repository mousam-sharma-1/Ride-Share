if('serviceWorker' in navigator){   
    navigator.serviceWorker.register('/sw.js')
    .then((reg)=> console.log("Service worker reg.",reg))
    .catch((err)=> console.log("Service worker not reg.",err))
}