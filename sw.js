// Kubocycle: prima la rete (così gli aggiornamenti arrivano subito), se manca la rete usa la copia salvata
const C='kubocycle-v1';
const FILES=['kubocycle.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>Promise.allSettled(FILES.map(f=>c.add(f)))));
});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;     // le tessere della mappa e il meteo non si toccano
  e.respondWith(
    fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})
      .catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('kubocycle.html'):undefined)))
  );
});
