/* Notifiche push (OneSignal): sta in push/ con il suo ambito, separato dal service worker dell'app (sw.js).
   Prima di OneSignal: quando si tocca una notifica, lascia nella cache la pagina da aprire. Su iPhone l'app
   installata a volte si apre sulla home invece che sul link della notifica (difetto di iOS): l'app legge questo
   promemoria appena torna in primo piano e va alla pagina giusta (promemoriaNotifica in app.js). */
self.addEventListener('notificationclick', function (event) {
  var d = (event.notification && event.notification.data) || {};
  var url = d.launchURL || d.url || '';
  if (typeof url !== 'string' || url.indexOf('#') < 0) return;
  event.waitUntil(caches.open('vm-notifica').then(function (c) {
    return c.put(new URL('apri-notifica', self.registration.scope).href,
      new Response(JSON.stringify({ url: url, t: Date.now() }), { headers: { 'Content-Type': 'application/json' } }));
  }).catch(function () { /* niente */ }));
});
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');
