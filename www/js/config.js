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

  // Dopo la pubblicazione: link agli store, usati dal tasto "Condividi l'app"
  APP_STORE_URL: '',
  PLAY_STORE_URL: '',

  // Notifiche push (OneSignal, piano gratuito): l'App ID dell'app creata su onesignal.com
  // (Settings > Keys & IDs). Vuoto = notifiche nascoste.
  ONESIGNAL_APP_ID: '',

  VERSIONE: '1.0'
};
