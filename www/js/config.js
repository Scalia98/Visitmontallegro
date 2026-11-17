/*
 * Visit Montallegro Bovo Marina — impostazioni
 * Modifica solo questo file per collegare l'app ai tuoi servizi.
 */
window.MONTALLEGRO_CONFIG = {
  // Indirizzo di un contenuti.json pubblicato online (stessa struttura di www/data/contenuti.json).
  // Se impostato, l'app scarica eventi e luoghi aggiornati a ogni apertura, senza ripubblicare sugli store.
  // È il file del repository GitHub (che deve essere pubblico): si modifica lì e i telefoni lo scaricano.
  DATA_URL: 'https://raw.githubusercontent.com/Scalia98/Visitmontallegro/main/www/data/contenuti.json',

  // Chiave gratuita CARTO per lo sfondo della mappa (https://carto.com/basemaps/apikey, uso non commerciale).
  // Vuota = sfondo OpenStreetMap standard, va bene per i test.
  CARTO_KEY: '',

  // Link mostrati nell'app
  PORTALE: 'https://visitmontallegrobovomarina.it',
  PRIVACY: 'privacy.html',

  // Versione web (GitHub Pages): si apre da qualsiasi telefono; finché mancano gli store, "Condividi l'app" manda questo link
  WEB_URL: 'https://scalia98.github.io/Visitmontallegro/',

  // Link corto da far girare (QR, bio, tasto «Condividi l'app»): su WordPress il plugin Redirection lo rimanda a WEB_URL.
  // Le notifiche e i link alle singole pagine usano invece WEB_URL, perché aprono l'app installata solo con il suo indirizzo.
  LINK_APP: 'https://visitmontallegrobovomarina.it/app',

  // Dopo la pubblicazione: link agli store, usati dal tasto "Condividi l'app"
  APP_STORE_URL: '',
  PLAY_STORE_URL: '',

  // Notifiche push (OneSignal, piano gratuito): l'App ID dell'app creata su onesignal.com
  // (Settings > Keys & IDs). Vuoto = notifiche nascoste.
  ONESIGNAL_APP_ID: '3a88d8ba-cc4f-401e-805a-c56a08eb869f',
  // solo per Safari su Mac fino alla versione 15 (lo dà OneSignal insieme all'App ID)
  ONESIGNAL_SAFARI_WEB_ID: 'web.onesignal.auto.24e91fba-47ec-4183-a873-89e8fb838de6',

  VERSIONE: '1.0'
};
