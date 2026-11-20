/*
 * Visit Montallegro Bovo Marina — logica dell'app
 * Pro Loco Montallegro APS
 */
(function () {
  'use strict';

  var CFG = window.MONTALLEGRO_CONFIG || {};
  var view = document.getElementById('view');
  var tabbar = document.getElementById('tabbar');
  var NOME_APP = 'Visit Montallegro Bovo Marina';

  /* ---------- memoria locale (può mancare: si va avanti lo stesso) ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('vmbm:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('vmbm:' + k, JSON.stringify(v)); } catch (e) { /* niente */ } }
  };

  /* ---------- Capacitor (solo nell'app installata) ---------- */
  var CapX = window.capacitorExports;
  var isNative = !!(CapX && CapX.Capacitor && CapX.Capacitor.isNativePlatform && CapX.Capacitor.isNativePlatform());
  var platform = CapX && CapX.Capacitor && CapX.Capacitor.getPlatform ? CapX.Capacitor.getPlatform() : 'web';
  var P = {};
  if (isNative) {
    P.App = CapX.registerPlugin('App');
    P.Share = CapX.registerPlugin('Share');
    P.Geolocation = CapX.registerPlugin('Geolocation');
    P.StatusBar = CapX.registerPlugin('StatusBar');
  }
  var isApple = platform === 'ios' || /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var riduciMovimento = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- testi dell'interfaccia ---------- */
  var UI = {
    it: {
      tabHome: "Home", tabVisit: "Visit", tabMappa: "Mappa", tabEventi: "Eventi", tabInfo: "Info",
      scopri: "Scopri", visitTorreSalsa: "Visit Torre Salsa", spiagge: "Spiagge", cosaVedere: "Cosa vedere", esperienze: "Esperienze",
      eventi: "Eventi", mangiare: "Mangiare", mangiareTitolo: "Mangiare e bere", dormire: "Dormire", dormireTitolo: "Dove dormire",
      itinerari: "Itinerari", comeArrivare: "Come arrivare", meteo: "Meteo", numeriUtili: "Numeri utili", mappa: "Mappa",
      daNonPerdere: "Da non perdere", vediTutti: "Vedi tutti", prossimiEventi: "Prossimi eventi", inEvidenza: "In evidenza", programma: "Il programma", parteDi: "Fa parte di", daConfermare: "Da confermare", siAggiorna: "Il programma si aggiorna qui sull'app.", tiAvvisiamo: "Hai le notifiche attive: ti avvisiamo noi.", avvisami: "Avvisami", notifiche: "Notifiche", notificheTitolo: "Attiva le notifiche", notificheSotto: "Ti avvisiamo degli eventi e delle novità di Montallegro.", attiva: "Attiva", notificheAttive: "Attive", notificheSpente: "Spente", notificheBloccate: "Bloccate", notificheOn: "Notifiche attive: ti avvisiamo noi.", notificheOff: "Notifiche spente.", notificheNo: "Le notifiche sono bloccate: puoi riattivarle dalle impostazioni del telefono o del browser, alla voce di questa app.", notificheErrore: "Non è stato possibile attivare le notifiche. Riprova tra poco.", notificheInstalla: "Su iPhone arrivano con l'app installata: aggiungila alla schermata Home.", installaTitolo: "Installa l'app", installa: "Installa", installaSotto: "Gratis: si apre come un'app e funziona anche senza rete.", installaIos: "In Safari tocca Condividi (anche dal menu ···) e poi «Aggiungi alla schermata Home».", installaInApp: "Per installarla apri questa pagina nel browser: tocca ··· e scegli di aprirla nel browser.", tutti: "Tutti", tutto: "Tutto",
      infoPraticheTitolo: "Info pratiche",
      visitIntro: "Spiagge, riserve naturali, storia e gite nei dintorni di Montallegro.",
      spiaggeIntro: "Sabbia fine, falesie bianche e chilometri di costa protetta tra Eraclea Minoa e Siculiana Marina.",
      lidi: "Lidi e stabilimenti", alMare: "Al mare, da sapere",
      regoleMare: [
        "In riserva non ci sono lidi né servizi: acqua, ombrellone e rifiuti sono affar tuo.",
        "Se trovi un nido di tartaruga Caretta caretta, tieniti a distanza e non toccare nulla.",
        "Non salire sulle falesie di marna e non staccarne pezzi: sono fragili e protette.",
        "Emergenze in mare: Guardia Costiera 1530. Emergenze a terra: 112."
      ],
      esperienzeIntro: "Escursioni in riserva, passeggiate a cavallo, kayak e SUP, natura e cultura del paese.",
      mangiareIntro: "Ristoranti, pizzerie, lidi sul mare, bar e pub di Montallegro e Bovo Marina, più i migliori indirizzi dei dintorni.", spiaggeVicine: "Altre spiagge vicine", territorio: "Scopri il territorio", altriLuoghi: "Altri luoghi da vedere", neiDintorni: "Nei dintorni", foto: "Foto", chiudi: "Chiudi", notiziePortale: "Notizie ed eventi sul portale", fotoNonDisponibile: "Foto non disponibile senza rete",
      dormireIntro: "Hotel, B&B, affittacamere, agriturismi, ville e case vacanza a Montallegro e Bovo Marina, sul mare e in campagna.",
      chiamaPrima: "Molti locali sul mare aprono solo in stagione: chiama prima di andare.",
      tuttiLocali: "Altri locali sul portale Visit Montallegro", tutteStrutture: "Tutte le strutture sul portale Visit Montallegro",
      prenotaWhatsApp: "Prenota su WhatsApp", prenota: "Prenota", whatsapp: "WhatsApp", chiama: "Chiama", sito: "Sito", email: "Email",
      indicazioni: "Indicazioni", condividi: "Condividi", salva: "Salva", salvato: "Salvato", vediScheda: "Vedi la scheda",
      daSapere: "Da sapere", infoPratiche: "Informazioni pratiche", negliItinerari: "Negli itinerari", indietro: "Indietro",
      preferiti: "I tuoi preferiti", preferitiIntro: "I luoghi che hai salvato con il cuore.", nessunPreferito: "Tocca il cuore su un luogo per ritrovarlo qui.",
      eventiTitolo: "Eventi", eventiIntro: "Cosa succede a Montallegro.", inProgramma: "In programma", ogniAnno: "Ogni anno a Montallegro",
      nessunEvento: "Nessun evento in programma per ora.", dateDaDefinire: "date in arrivo", organizza: "Organizza",
      infoTitolo: "Info utili", infoIntro: "Emergenze, contatti, trasporti e servizi.", emergenze: "Emergenze",
      lingua: "Lingua", app: "L'app", privacy: "Privacy", versione: "Versione", crediti: "Crediti foto e dati",
      progetto: "Visit Montallegro Bovo Marina è un progetto del Comune di Montallegro e della Pro Loco Montallegro APS.", realizzataDa: "App realizzata da",
      tipiItinerario: { piedi: "A piedi", bici: "In bici", cavallo: "A cavallo", mare: "Mare", natura: "Natura", cultura: "Cultura", sapori: "Sapori" },
      tracciaGps: "Traccia del percorso",
      vento: "Vento", mare: "Mare", acqua: "Acqua", tramonto: "Tramonto", alba: "Alba", percepita: "Percepita", umidita: "Umidità",
      meteoTitolo: "Meteo a Montallegro", meteoAdesso: "Adesso", previsioni: "Prossimi giorni", ilMare: "Il mare a Bovo Marina", onde: "Onde",
      meteoNo: "Dati meteo non disponibili: controlla la connessione.", oggi: "Oggi", domani: "Domani", pioggia: "pioggia",
      posizione: "Mostra la mia posizione", posizioneNo: "Posizione non disponibile. Controlla i permessi.",
      mappaSenzaSfondo: "Lo sfondo della mappa non si è caricato. Controlla la connessione.",
      copiato: "Testo copiato: incollalo dove vuoi", condivisioneNo: "Condivisione non disponibile qui",
      daTe: "{km} km da te", tappe: "{n} tappe", apri: "Apri", condividiApp: "Condividi l'app", portale: "Portale Visit Montallegro",
      creditiMappa: "Mappe © OpenStreetMap", creditiMeteo: "Meteo Open-Meteo.com (CC BY 4.0)",
      erroreDati: "Non riesco a caricare i contenuti. Chiudi e riapri l'app.", nonTrovato: "Pagina non trovata.", torna: "Torna alla home",
      salvatoToast: "Salvato nei preferiti", rimossoToast: "Rimosso dai preferiti",
      scoprila: "Scopri Montallegro e Bovo Marina con l'app Visit Montallegro",
      stagionale: "Stagionale", landingSotto: "Oasi WWF · Montallegro (AG)",
      escursione: "Escursione guidata", nellaRiserva: "Nella riserva", foto: "Foto", vediMappa: "Vedi sulla mappa",
      messaggioWa: "Ciao! Vorrei informazioni su: {x} (dall'app Visit Montallegro)", cellulare: "Cellulare",
      vediIndicazioni: "Come arrivare", tuttiNumeri: "Tutti i numeri utili", fotoDi: "Foto: {x}",
      sapori: "Sapori", saporiTitolo: "Sapori e prodotti", saporiIntro: "Formaggi, olio, vino, miele, pane e prodotti tipici di Montallegro, dai produttori del paese.",
      servizi: "Servizi", serviziTitolo: "Servizi utili", serviziIntro: "Farmacia, salute, trasporti, spesa, negozi e uffici: tutto quello che serve durante il soggiorno.",
      cerca: "Cerca", cercaTitolo: "Cerca nell'app", cercaSegnaposto: "Ristoranti, B&B, spiagge, farmacia…", nessunRisultato: "Nessun risultato. Prova con un'altra parola.", risultati: "{n} risultati", provaCon: "Prova con:",
      orari: "Orari", chiuso: "chiuso", cosaTrovi: "Cosa trovi", riconoscimenti: "Riconoscimenti", verificato: "Dati verificati: {x}", altroNumero: "Altro numero", contatti: "Contatti", prenota2: "Prenota",
      tuttiFiltro: "Tutti", zonaPaese: "In paese", zonaBovo: "Bovo Marina", zonaTorre: "Torre Salsa", zonaCampagna: "In campagna", zonaEraclea: "Eraclea Minoa", posizioneCirca: "posizione indicativa",
      partner: "Partner", partnerProLoco: "Partner della Pro Loco", consigliati: "Consigliati dalla Pro Loco", iNostriPartner: "I nostri partner",
      proLoco: "Pro Loco Montallegro", diventaSocio: "Diventa socio", diventaPartner: "Diventa partner",
      socioBreve: "Iscriviti e partecipa alla vita del paese", partnerBreve: "Metti in evidenza la tua attività",
      socioTitolo: "Diventa socio della Pro Loco",
      socioIntro: "La Pro Loco Montallegro APS organizza gli eventi, accoglie chi visita il paese e promuove Montallegro e Bovo Marina. Con la tessera ne fai parte anche tu.",
      socioPerche: "Perché iscriversi",
      socioVantaggi: [
        "Sostieni le feste, gli eventi e le iniziative del paese",
        "Partecipi alle assemblee e alle scelte dell'associazione",
        "Puoi dare una mano come volontario",
        "Sei sempre informato su quello che organizziamo"
      ],
      perInfo: "Per maggiori info", comeIscriversi: "Come iscriversi",
      socioCome: "Scrivi o chiama la Pro Loco: ti diciamo come iscriverti.",
      moduloOnline: "Modulo online",
      messaggioSocio: "Ciao! Vorrei diventare socio della Pro Loco Montallegro (dall'app Visit Montallegro).",
      oggettoSocio: "Iscrizione socio Pro Loco",
      partnerTitolo: "La tua attività in evidenza",
      partnerIntro: "Ristoranti, B&B, lidi, produttori ed esperienze: con uno spazio partner la tua scheda si fa notare da chi visita Montallegro e Bovo Marina.",
      partnerCosa: "Cosa comprende",
      partnerVantaggi: [
        "Il bollino «Partner» sulla tua scheda",
        "I primi posti nella tua categoria",
        "Uno spazio in home tra i «Consigliati dalla Pro Loco»",
        "Il tuo contributo sostiene gli eventi del paese"
      ],
      comeFunziona: "Come funziona",
      partnerCome: "Contatta la Pro Loco e concordiamo lo spazio. Aggiorniamo la tua scheda e il bollino compare a tutti, senza aggiornare l'app.",
      messaggioPartner: "Ciao! Ho un'attività e vorrei uno spazio partner nell'app Visit Montallegro.",
      oggettoPartner: "Spazio partner app Visit Montallegro",
      invitoPartner: "Hai un'attività a Montallegro?", invitoPartnerSotto: "Diventa partner: la tua scheda in evidenza nell'app."
    },
    en: {
      tabHome: "Home", tabVisit: "Visit", tabMappa: "Map", tabEventi: "Events", tabInfo: "Info",
      scopri: "Discover", visitTorreSalsa: "Visit Torre Salsa", spiagge: "Beaches", cosaVedere: "Sightseeing", esperienze: "Experiences",
      eventi: "Events", mangiare: "Eat", mangiareTitolo: "Eat & drink", dormire: "Stay", dormireTitolo: "Where to stay",
      itinerari: "Itineraries", comeArrivare: "Getting here", meteo: "Weather", numeriUtili: "Useful numbers", mappa: "Map",
      daNonPerdere: "Don't miss", vediTutti: "See all", prossimiEventi: "Coming up", inEvidenza: "Featured", programma: "Programme", parteDi: "Part of", daConfermare: "To be confirmed", siAggiorna: "The programme is updated here in the app.", tiAvvisiamo: "Notifications are on: we'll let you know.", avvisami: "Notify me", notifiche: "Notifications", notificheTitolo: "Turn on notifications", notificheSotto: "We'll let you know about events and news in Montallegro.", attiva: "Turn on", notificheAttive: "On", notificheSpente: "Off", notificheBloccate: "Blocked", notificheOn: "Notifications on: we'll keep you posted.", notificheOff: "Notifications off.", notificheNo: "Notifications are blocked: you can turn them back on in your phone or browser settings, under this app.", notificheErrore: "Couldn't turn on notifications. Please try again shortly.", notificheInstalla: "On iPhone they need the app installed: add it to your Home Screen.", installaTitolo: "Install the app", installa: "Install", installaSotto: "Free: opens like an app and works offline too.", installaIos: "In Safari tap Share (also in the ··· menu), then «Add to Home Screen».", installaInApp: "To install it, open this page in your browser: tap ··· and choose to open it in the browser.", tutti: "All", tutto: "All",
      infoPraticheTitolo: "Practical info",
      visitIntro: "Beaches, nature reserves, history and day trips around Montallegro.",
      spiaggeIntro: "Fine sand, white cliffs and miles of protected coast between Eraclea Minoa and Siculiana Marina.",
      lidi: "Beach clubs", alMare: "At the beach",
      regoleMare: [
        "There are no beach clubs or facilities in the reserve: water, shade and rubbish are up to you.",
        "If you find a loggerhead turtle nest, keep your distance and touch nothing.",
        "Don't climb the marl cliffs or break off pieces: they are fragile and protected.",
        "Emergencies at sea: Coast Guard 1530. On land: 112."
      ],
      esperienzeIntro: "Nature reserve hikes, horse rides, kayak and SUP, nature and local culture.",
      mangiareIntro: "Restaurants, pizzerias, beach clubs, bars and pubs in Montallegro and Bovo Marina, plus the best addresses nearby.", spiaggeVicine: "More beaches nearby", territorio: "Discover the area", altriLuoghi: "More places to see", neiDintorni: "Nearby", foto: "Photos", chiudi: "Close", notiziePortale: "News and events on the website", fotoNonDisponibile: "Photo not available offline",
      dormireIntro: "Hotels, B&Bs, guest rooms, farm stays, villas and holiday homes in Montallegro and Bovo Marina, by the sea and in the countryside.",
      chiamaPrima: "Many seaside places open only in season: call before you go.",
      tuttiLocali: "More places on the Visit Montallegro website", tutteStrutture: "All places to stay on the Visit Montallegro website",
      prenotaWhatsApp: "Book on WhatsApp", prenota: "Book", whatsapp: "WhatsApp", chiama: "Call", sito: "Website", email: "Email",
      indicazioni: "Directions", condividi: "Share", salva: "Save", salvato: "Saved", vediScheda: "See details",
      daSapere: "Good to know", infoPratiche: "Practical info", negliItinerari: "In these itineraries", indietro: "Back",
      preferiti: "Your favourites", preferitiIntro: "The places you saved with the heart.", nessunPreferito: "Tap the heart on a place to find it here.",
      eventiTitolo: "Events", eventiIntro: "What's on in Montallegro.", inProgramma: "Coming up", ogniAnno: "Every year in Montallegro",
      nessunEvento: "No events scheduled right now.", dateDaDefinire: "dates coming soon", organizza: "Organised by",
      infoTitolo: "Useful info", infoIntro: "Emergencies, contacts, transport and services.", emergenze: "Emergencies",
      lingua: "Language", app: "The app", privacy: "Privacy", versione: "Version", crediti: "Photo & data credits",
      progetto: "Visit Montallegro Bovo Marina is a project by the Municipality of Montallegro and Pro Loco Montallegro APS.", realizzataDa: "App made by",
      tipiItinerario: { piedi: "On foot", bici: "By bike", cavallo: "On horseback", mare: "Sea", natura: "Nature", cultura: "Culture", sapori: "Food & wine" },
      tracciaGps: "Route map",
      vento: "Wind", mare: "Sea", acqua: "Water", tramonto: "Sunset", alba: "Sunrise", percepita: "Feels like", umidita: "Humidity",
      meteoTitolo: "Weather in Montallegro", meteoAdesso: "Now", previsioni: "Next days", ilMare: "The sea at Bovo Marina", onde: "Waves",
      meteoNo: "Weather data unavailable: check your connection.", oggi: "Today", domani: "Tomorrow", pioggia: "rain",
      posizione: "Show my location", posizioneNo: "Location unavailable. Check permissions.",
      mappaSenzaSfondo: "The map background didn't load. Check your connection.",
      copiato: "Text copied: paste it anywhere", condivisioneNo: "Sharing is not available here",
      daTe: "{km} km away", tappe: "{n} stops", apri: "Open", condividiApp: "Share the app", portale: "Visit Montallegro website",
      creditiMappa: "Maps © OpenStreetMap", creditiMeteo: "Weather Open-Meteo.com (CC BY 4.0)",
      erroreDati: "Can't load the content. Close and reopen the app.", nonTrovato: "Page not found.", torna: "Back to home",
      salvatoToast: "Saved to favourites", rimossoToast: "Removed from favourites",
      scoprila: "Discover Montallegro and Bovo Marina with the Visit Montallegro app",
      stagionale: "Seasonal", landingSotto: "WWF reserve · Montallegro (AG)",
      escursione: "Guided trip", nellaRiserva: "In the reserve", foto: "Photos", vediMappa: "See on the map",
      messaggioWa: "Hi! I'd like some information about: {x} (from the Visit Montallegro app)", cellulare: "Mobile",
      vediIndicazioni: "Getting here", tuttiNumeri: "All useful numbers", fotoDi: "Photo: {x}",
      sapori: "Local food", saporiTitolo: "Local food & produce", saporiIntro: "Cheese, olive oil, wine, honey, bread and specialities from Montallegro's own producers.",
      servizi: "Services", serviziTitolo: "Useful services", serviziIntro: "Pharmacy, health, transport, groceries, shops and offices: everything you need during your stay.",
      cerca: "Search", cercaTitolo: "Search the app", cercaSegnaposto: "Restaurants, B&Bs, beaches, pharmacy…", nessunRisultato: "No results. Try another word.", risultati: "{n} results", provaCon: "Try:",
      orari: "Opening hours", chiuso: "closed", cosaTrovi: "What you'll find", riconoscimenti: "Awards", verificato: "Details checked: {x}", altroNumero: "Other number", contatti: "Contacts", prenota2: "Book",
      tuttiFiltro: "All", zonaPaese: "In town", zonaBovo: "Bovo Marina", zonaTorre: "Torre Salsa", zonaCampagna: "Countryside", zonaEraclea: "Eraclea Minoa", posizioneCirca: "approximate location",
      partner: "Partner", partnerProLoco: "Pro Loco partner", consigliati: "Recommended by the Pro Loco", iNostriPartner: "Our partners",
      proLoco: "Pro Loco Montallegro", diventaSocio: "Become a member", diventaPartner: "Become a partner",
      socioBreve: "Join in and take part in town life", partnerBreve: "Put your business in the spotlight",
      socioTitolo: "Join the Pro Loco",
      socioIntro: "Pro Loco Montallegro APS runs the town's events, welcomes visitors and promotes Montallegro and Bovo Marina. With a membership card you're part of it too.",
      socioPerche: "Why join",
      socioVantaggi: [
        "Support the town's festivals, events and projects",
        "Take part in the association's meetings and decisions",
        "Lend a hand as a volunteer",
        "Stay up to date on everything we organise"
      ],
      perInfo: "For more info", comeIscriversi: "How to join",
      socioCome: "Message or call the Pro Loco: we'll tell you how to join.",
      moduloOnline: "Online form",
      messaggioSocio: "Hi! I'd like to become a member of Pro Loco Montallegro (from the Visit Montallegro app).",
      oggettoSocio: "Pro Loco membership",
      partnerTitolo: "Put your business in the spotlight",
      partnerIntro: "Restaurants, B&Bs, beach clubs, producers and experiences: a partner listing makes your page stand out to everyone visiting Montallegro and Bovo Marina.",
      partnerCosa: "What's included",
      partnerVantaggi: [
        "A “Partner” badge on your page",
        "Top spots in your category",
        "A place on the home screen under “Recommended by the Pro Loco”",
        "Your contribution supports the town's events"
      ],
      comeFunziona: "How it works",
      partnerCome: "Contact the Pro Loco and we'll agree on your listing. We update your page and the badge shows up for everyone, with no app update needed.",
      messaggioPartner: "Hi! I run a business and I'd like a partner listing in the Visit Montallegro app.",
      oggettoPartner: "Partner listing – Visit Montallegro app",
      invitoPartner: "Run a business in Montallegro?", invitoPartnerSotto: "Become a partner: feature your page in the app."
    }
  };
  var MESI = {
    it: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  var GIORNI = {
    it: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  };
  var MESI_LUNGHI = {
    it: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };
  var GIORNI_LUNGHI = {
    it: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  };
  var VENTI = {
    it: ['Tramontana', 'Grecale', 'Levante', 'Scirocco', 'Mezzogiorno', 'Libeccio', 'Ponente', 'Maestrale'],
    en: ['N', 'NE', 'E', 'SE (Scirocco)', 'S', 'SW', 'W', 'NW (Mistral)']
  };

  var lang = store.get('lang', null) || ((navigator.language || 'it').toLowerCase().indexOf('it') === 0 ? 'it' : 'en');
  function t(k, vars) {
    var s = (UI[lang] && UI[lang][k]) || UI.it[k] || k;
    if (vars && typeof s === 'string') Object.keys(vars).forEach(function (v) { s = s.replace('{' + v + '}', vars[v]); });
    return s;
  }
  function tx(v) { return v == null ? '' : (typeof v === 'string' ? v : (v[lang] || v.it || '')); }
  function txa(v) { return v ? (v[lang] || v.it || []) : []; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- icone ---------- */
  var IC = {
    home: '<path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    map: '<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6zM9 4v14M15 6v14"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.4"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
    share: '<path d="M12 14.5V3.5M8 7.5l4-4 4 4M5.5 11.5V19a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-7.5"/>',
    directions: '<path d="M12 2.8 21.2 12 12 21.2 2.8 12z"/><path d="M9 14.5V11h6M13 9l2 2-2 2"/>',
    back: '<path d="M15 5 8 12l7 7"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    phone: '<path d="M6.5 3.5h3l1.8 4.6-2.2 1.5a11.5 11.5 0 0 0 5.3 5.3l1.5-2.2 4.6 1.8v3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4.5 5.6a2 2 0 0 1 2-2.1z"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.8 3.8 5.8 3.8 9s-1.2 6.2-3.8 9M12 3C9.4 5.8 8.2 8.8 8.2 12s1.2 6.2 3.8 9"/>',
    chat: '<path d="M20.5 12a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.2-4.2A8.5 8.5 0 1 1 20.5 12z"/><path d="M9 9.2c0 3 2.6 5.8 5.8 5.8l1-1.3-2-1-1 .8a4 4 0 0 1-2.3-2.3l.8-1-1-2z"/>',
    locate: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    pin: '<path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
    bus: '<rect x="4.5" y="3.5" width="15" height="14" rx="3"/><path d="M4.5 11h15M8 17.5V20M16 17.5V20"/><circle cx="8.5" cy="14.3" r=".9"/><circle cx="15.5" cy="14.3" r=".9"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    umbrella: '<path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5h-17A8.5 8.5 0 0 1 12 3.5zM12 12v6.5a2 2 0 0 1-4 0"/>',
    leaf: '<path d="M5 19.5C5 11 10 5 19.5 4.5 19 14 13 19.5 5 19.5zM5 19.5 14 10.5"/>',
    columns: '<path d="M3 9h18l-9-5zM5.5 9v9M10 9v9M14 9v9M18.5 9v9M3 20h18"/>',
    route: '<circle cx="6" cy="17" r="2.5"/><circle cx="18" cy="7" r="2.5"/><path d="M8.5 17H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>',
    car: '<path d="M4.5 16.5h15l-1.6-5.6a1.5 1.5 0 0 0-1.4-1.1h-9a1.5 1.5 0 0 0-1.4 1.1z"/><path d="M6.5 16.5v2.5M17.5 16.5v2.5"/><circle cx="8" cy="13.6" r=".9"/><circle cx="16" cy="13.6" r=".9"/>',
    hike: '<path d="M3.5 19.5 9 10l3.5 5 2.5-3.5 5.5 8z"/><circle cx="16.5" cy="5.5" r="2"/>',
    star: '<path d="m12 3.5 2.5 5.3 5.8.7-4.3 4 1.1 5.8L12 16.5l-5.1 2.8L8 13.5l-4.3-4 5.8-.7z"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.6 2.2H4.4z"/><path d="M10 20.6a2.2 2.2 0 0 0 4 0"/>',
    lifebuoy: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.8"/><path d="m5.6 5.6 3.7 3.7M18.4 5.6l-3.7 3.7M5.6 18.4l3.7-3.7M18.4 18.4l-3.7-3.7"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
    moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
    cloudsun: '<path d="M8.5 6.5V4.5M3.8 8.4l1.4 1.4M13.2 8.4l-1.4 1.4M3 13h2"/><path d="M6.6 12.4a3.6 3.6 0 0 1 6.3-2.6"/><path d="M8.5 20h9a3.5 3.5 0 0 0 .2-7 5 5 0 0 0-9.4 1.3A2.9 2.9 0 0 0 8.5 20z"/>',
    cloud: '<path d="M7 19h10.5a4 4 0 0 0 .2-8 6 6 0 0 0-11.4 1.6A3.3 3.3 0 0 0 7 19z"/>',
    rain: '<path d="M7 15.5h10.5a4 4 0 0 0 .2-8 6 6 0 0 0-11.4 1.6A3.3 3.3 0 0 0 7 15.5z"/><path d="m8.5 18.5-1 2.5M12.5 18.5l-1 2.5M16.5 18.5l-1 2.5"/>',
    storm: '<path d="M7 14.5h10.5a4 4 0 0 0 .2-8 6 6 0 0 0-11.4 1.6A3.3 3.3 0 0 0 7 14.5z"/><path d="m12.5 14.5-2 3.5h3l-2 3.5"/>',
    fog: '<path d="M4 9.5h16M3 13h18M5 16.5h14M7 20h10"/>',
    fork: '<path d="M7 3v7.5a2 2 0 0 0 2 2v8.5M5 3v6.5M9 3v6.5M17 21V3c-2.2 0-3.6 2.6-3.6 6.2 0 2.9 1.4 4.3 3.6 4.3"/>',
    bed: '<path d="M3 6v12.5M3 14.5h18v4M21 14.5v-3a2.5 2.5 0 0 0-2.5-2.5H11v5.5"/><circle cx="7" cy="11.2" r="1.8"/>',
    train: '<rect x="6" y="3.5" width="12" height="13" rx="3"/><path d="M6 11h12M9 16.5 7.5 20.5M15 16.5l1.5 4"/><circle cx="9" cy="13.8" r=".8"/><circle cx="15" cy="13.8" r=".8"/>',
    plane: '<path d="M21 15.5v-1.8l-8-5V4a1.5 1.5 0 0 0-3 0v4.7l-8 5v1.8l8-2.5v5l-2 1.5V21l3.5-1 3.5 1v-1.5l-2-1.5v-5z" transform="translate(.5 0)"/>',
    shuttle: '<path d="M3 16.5V8a2 2 0 0 1 2-2h10l5 5v5.5a1 1 0 0 1-1 1h-1M3 16.5a1 1 0 0 0 1 1h1M9 17.5h6M3 11h17"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>',
    tower: '<path d="M8 21V9.5l1-5h6l1 5V21M6 21h12M8 9.5h8M10.5 4.5V3M13.5 4.5V3M11 21v-4h2v4"/>',
    euro: '<path d="M17.5 6.6A6.5 6.5 0 1 0 17.5 17.4M4.5 10.5h9M4.5 13.5h9"/>',
    gauge: '<path d="M4 17.5a8 8 0 1 1 16 0"/><path d="m12 17.5 3.5-5"/>',
    sunset: '<path d="M3 18h18M5.5 21h13M7.5 14.5a4.5 4.5 0 0 1 9 0M12 3.5v5M9.5 6 12 8.5 14.5 6M4.8 10.8l1.4 1.4M19.2 10.8l-1.4 1.4"/>',
    wind: '<path d="M3 8.5h10.5A2.5 2.5 0 1 0 11 6M3 12.5h15a2.5 2.5 0 1 1-2.5 2.5M3 16.5h7"/>',
    drop: '<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/>',
    wave: '<path d="M2.5 9c2.4-2 4.6-2 7 0s4.6 2 7 0 3.5-1.6 5 0M2.5 14c2.4-2 4.6-2 7 0s4.6 2 7 0 3.5-1.6 5 0M2.5 19c2.4-2 4.6-2 7 0s4.6 2 7 0 3.5-1.6 5 0"/>',
    thermo: '<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v6.5"/>',
    camera: '<path d="M4 7.5h3l1.5-2.5h7L17 7.5h3a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.2" r="3.6"/>',
    basket: '<path d="M4 9.5h16l-1.6 9.2a1.5 1.5 0 0 1-1.5 1.3H7.1a1.5 1.5 0 0 1-1.5-1.3zM8.5 9.5 11 4M15.5 9.5 13 4M9.5 13v3.5M14.5 13v3.5"/>',
    shop: '<path d="M4 9.5V20h16V9.5M3 9.5l1.6-5h14.8l1.6 5zM3 9.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9.5 20v-5.5h5V20"/>',
    cup: '<path d="M5 8.5h11v5.5a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 14zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5v2.5M11 3.5v2.5M5 21h11"/>',
    glass: '<path d="M6 4h12l-6 8zM12 12v7.5M8.5 20.5h7M7.5 6h9"/>',
    cross: '<path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 12.6l-1.3 1.2a6 6 0 0 1-7.4.8l-6.9 6.9a2 2 0 0 1-2.9-2.9l6.9-6.9a6 6 0 0 1 .8-7.4L11.4 3l1.3 1.3a4 4 0 0 0 2 2z"/>',
    people: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0M16 4.8a3.2 3.2 0 0 1 0 6.4M17.5 14.2A6 6 0 0 1 21 20"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m15.5 15.5 5 5"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9"/>',
    facebook: '<path d="M14.5 8.5H16V5h-2a4 4 0 0 0-4 4v2.5H8V15h2v6h3.5v-6H16l.5-3.5h-3V9.5a1 1 0 0 1 1-1z"/>',
    ticket: '<path d="M3.5 8a2 2 0 0 0 0 4v4.5a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1V12a2 2 0 0 1 0-4V5.5a1 1 0 0 0-1-1h-15a1 1 0 0 0-1 1z" transform="translate(0 1)"/><path d="M14.5 5.5v13"/>'
  };
  function ic(nome, pieno, classe) {
    return '<svg viewBox="0 0 24 24" fill="' + (pieno ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"' + (classe ? ' class="' + classe + '"' : '') + '>' + (IC[nome] || '') + '</svg>';
  }

  /* ---------- dati ---------- */
  var DATA = null;
  var COLORI = {
    mare: 'var(--mare)', verde: 'var(--verde)', tufo: 'var(--tufo)', sabbia: 'var(--sabbia)',
    viola: 'var(--corallo)', arancio: 'var(--arancio)', blu: 'var(--indaco)', oliva: 'var(--oliva)', ardesia: 'var(--ardesia)'
  };
  var ICONE_SOTTO = {
    ristoranti: 'fork', mare: 'fork', bar: 'cup', pub: 'glass', eventi: 'star',
    hotel: 'bed', bb: 'bed', camere: 'bed', agri: 'leaf', villa: 'home', casa: 'home',
    formaggi: 'basket', olio: 'drop', vino: 'glass', miele: 'basket', conserve: 'basket', tipici: 'shop', pane: 'basket', carne: 'basket',
    info: 'info', salute: 'cross', trasporti: 'bus', spesa: 'basket', negozi: 'shop', fiori: 'leaf', servizi: 'wrench', benessere: 'star', comunita: 'people', svago: 'star',
    escursioni: 'hike', natura: 'leaf', cavallo: 'hike', cultura: 'columns'
  };
  var ZONE = { paese: 'zonaPaese', bovo: 'zonaBovo', 'torre-salsa': 'zonaTorre', campagna: 'zonaCampagna', eraclea: 'zonaEraclea' };

  function valido(d) { return d && Array.isArray(d.schede) && Array.isArray(d.categorie); }
  function caricaDaScript() {
    // riserva per le anteprime web dove fetch non è permesso: data/contenuti.js con window.MONTALLEGRO_DATA
    return new Promise(function (ok) {
      var s = document.createElement('script');
      s.src = 'data/contenuti.js';
      s.onload = function () { ok(window.MONTALLEGRO_DATA || null); };
      s.onerror = function () { ok(null); };
      document.head.appendChild(s);
    });
  }
  function usaFotoLocali(d, mappa) {
    if (!d || !mappa) return d;
    function fix(o) {
      if (o && o.foto && mappa[o.foto]) { o.foto = mappa[o.foto]; if (/^https?:/.test(o.fotoRiserva || '')) delete o.fotoRiserva; }
    }
    (d.schede || []).forEach(function (s) { fix(s); (s.galleria || []).forEach(fix); });
    ((d.home && d.home.slider) || []).forEach(fix);
    (d.itinerari || []).forEach(fix);
    (d.eventi || []).forEach(fix);
    return d;
  }
  // versioni tipo "2026-11-17.02": si confrontano i numeri uno per uno, non il testo
  // (come testo "2026-11-16.10" verrebbe prima di "2026-11-16.9" e l'app terrebbe i dati vecchi)
  function confrontaVersioni(a, b) {
    var x = String(a || '').match(/\d+/g) || [], y = String(b || '').match(/\d+/g) || [];
    for (var i = 0; i < Math.max(x.length, y.length); i++) {
      var d = (+x[i] || 0) - (+y[i] || 0);
      if (d) return d;
    }
    return 0;
  }
  var mappaFotoP = null;
  function mappaFotoLocali() {
    if (!mappaFotoP) mappaFotoP = fetch('data/foto-locali.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    return mappaFotoP;
  }
  function caricaDati() {
    var mappaFoto = mappaFotoLocali();
    var locale = fetch('data/contenuti.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).catch(function () { return null; })
      .then(function (d) { return valido(d) ? d : caricaDaScript(); });
    return locale.then(function (bundle) {
      var dati = valido(bundle) ? bundle : null;
      var salvati = store.get('dati', null);
      if (valido(salvati) && (!dati || confrontaVersioni(salvati.versione, dati.versione) > 0)) dati = salvati;
      if (!CFG.DATA_URL) return dati;
      return fetchJSON(CFG.DATA_URL, 6000).then(function (remoti) {
        if (valido(remoti) && (!dati || confrontaVersioni(remoti.versione, dati.versione) >= 0)) { store.set('dati', remoti); return remoti; }
        return dati;
      }).catch(function () { return dati; });
    }).then(function (d) { return mappaFoto.then(function (m) { return usaFotoLocali(d, m); }); });
  }
  // Una notifica può aprire un evento (o un luogo) appena aggiunto mentre il telefono ha ancora i contenuti
  // di qualche minuto prima (copia in cache, o app già aperta). Una volta per pagina li riscarica senza cache
  // e, se ci sono novità, ridisegna; nel frattempo la pagina mostra il caricamento invece di «Pagina non trovata».
  var giaCercati = {};
  function cercaNovita(pagina) {
    if (!CFG.DATA_URL || giaCercati[pagina]) return false;
    giaCercati[pagina] = true;
    fetchJSON(CFG.DATA_URL, 8000, true).then(function (remoti) {
      if (!valido(remoti) || confrontaVersioni(remoti.versione, DATA.versione) < 0) return null;
      store.set('dati', remoti);
      return mappaFotoLocali().then(function (m) { return usaFotoLocali(remoti, m); });
    }).catch(function () { return null; }).then(function (nuovi) {
      if (nuovi) DATA = nuovi;
      if (location.hash === '#' + pagina) ridisegna();
    });
    return true;
  }
  function fetchJSON(url, ms, senzaCache) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, ms || 8000) : null;
    var opz = ctrl ? { signal: ctrl.signal } : {};
    if (senzaCache) opz.cache = 'no-store';
    return fetch(url, opz).then(function (r) {
      if (timer) clearTimeout(timer);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  function scheda(id) { return DATA.schede.filter(function (p) { return p.id === id; })[0]; }
  function categoria(id) { return DATA.categorie.filter(function (c) { return c.id === id; })[0]; }
  function schedeDi(cat) { return DATA.schede.filter(function (p) { return p.categorie.indexOf(cat) >= 0; }); }
  function contatto(id) {
    var trovato = null;
    DATA.contatti.forEach(function (g) { g.voci.forEach(function (v) { if (v.id === id) trovato = v; }); });
    return trovato;
  }
  var VISIT_CAT = ['spiagge', 'natura', 'cultura', 'dintorni'];
  function luoghiVisit() { return DATA.schede.filter(function (p) { return p.categorie.some(function (c) { return VISIT_CAT.indexOf(c) >= 0; }) && p.categorie.indexOf('mangiare') < 0; }); }
  function catPrincipale(p) { return categoria(p.categorie[0]) || { colore: 'mare', icona: 'pin', nome: '' }; }
  function coloreDi(p) { return COLORI[catPrincipale(p).colore] || 'var(--mare)'; }
  function iconaDi(p) {
    if (p.id === 'torre-salsa') return 'tower';
    if ((p.fonte === 'portale' || p.fonte === 'imposta') && p.sotto && ICONE_SOTTO[[].concat(p.sotto)[0]]) return ICONE_SOTTO[[].concat(p.sotto)[0]];
    if (p.categorie[0] === 'dintorni' && p.categorie[1] && categoria(p.categorie[1])) return categoria(p.categorie[1]).icona;   // un museo nei dintorni ha l'icona del museo, non dell'auto
    return catPrincipale(p).icona;
  }
  function zonaTesto(p) { return p.zona && ZONE[p.zona] ? t(ZONE[p.zona]) : (p.localita ? tx(p.localita) : ''); }
  function etichettaDi(p) {
    if (p.etichetta) return tx(p.etichetta);
    return p.categorie.map(function (id) { var c = categoria(id); return c ? tx(c.nome) : ''; }).filter(Boolean).slice(0, 2).join(' · ');
  }

  /* ---------- partner della Pro Loco: nella scheda "partner": true, oppure la data di scadenza "AAAA-MM-GG" ---------- */
  function isPartner(p) {
    if (!p || !p.partner) return false;
    return p.partner === true || (typeof p.partner === 'string' && p.partner >= oggiISO());
  }
  function partnerPrima(lista) {   // i partner in cima, gli altri restano nel loro ordine
    return lista.map(function (p, i) { return { p: p, i: i, s: isPartner(p) ? 0 : 1 }; })
      .sort(function (a, b) { return a.s - b.s || a.i - b.i; })
      .map(function (x) { return x.p; });
  }
  function ruota(lista) {   // ogni giorno un partner diverso apre la fila
    if (lista.length < 2) return lista;
    var g = Math.floor(Date.now() / 864e5) % lista.length;
    return lista.slice(g).concat(lista.slice(0, g));
  }
  function bollino(p) { return isPartner(p) ? ' <span class="bollino-partner">' + ic('star', true) + esc(t('partner')) + '</span>' : ''; }

  /* ---------- foto: la foto vera se c'è, altrimenti un fondo con l'icona ---------- */
  function immagine(src, riserva, eager) {
    if (!src) return '';
    return '<img class="foto" src="' + esc(src) + '"' + (riserva ? ' data-riserva="' + esc(riserva) + '"' : '') +
      ' alt="" ' + (eager ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async">';
  }
  function copertina(p, classe, conCredito, eager) {
    return '<div class="copertina' + (classe ? ' ' + classe : '') + (p.foto ? '' : ' senza-foto') + '" style="--c:' + coloreDi(p) + '">' +
      '<span class="segnaposto" aria-hidden="true">' + ic(iconaDi(p)) + '</span>' + immagine(p.foto, p.fotoRiserva, eager) +
      (conCredito && p.foto && p.credito ? '<span class="credito">' + esc(t('fotoDi', { x: p.credito })) + '</span>' : '') + '</div>';
  }
  // senza rete (o con foto non raggiungibili) la galleria si accorcia invece di mostrare riquadri vuoti
  function togliFotoRotta(el) {
    var mini = el.closest && el.closest('.miniatura');
    if (mini) {
      var griglia = mini.parentNode;
      mini.remove();
      var sezione = griglia && griglia.closest('.blocco');
      if (griglia && !griglia.children.length && sezione) sezione.remove();
      else if (sezione) { var c = sezione.querySelector('.conta'); if (c) c.textContent = griglia.children.length; }
      return true;
    }
    var slide = el.closest && el.closest('.slider-galleria .slide');
    if (slide && slide.parentNode.children.length > 1) {
      var slider = slide.closest('.slider');
      slide.remove();
      var n = slider.querySelector('.slider-pista').children.length;
      var punti = slider.querySelector('.slider-punti');
      var cont = slider.querySelector('.slider-contatore');
      if (n < 2) { if (punti) punti.remove(); if (cont) cont.remove(); }
      else {
        if (punti && punti.lastElementChild) punti.lastElementChild.remove();
        if (cont) cont.textContent = '1 / ' + n;
      }
      return true;
    }
    return false;
  }
  document.addEventListener('error', function (e) {
    var el = e.target;
    if (!el || el.tagName !== 'IMG' || !el.classList.contains('foto')) return;
    var r = el.getAttribute('data-riserva');
    if (r) {
      el.removeAttribute('data-riserva');
      el.src = r;
      var cr = el.parentNode && el.parentNode.querySelector('.credito');
      if (cr) cr.remove();   // la foto di riserva ha un altro autore: niente credito sbagliato
      var tt = el.closest && el.closest('.slide') && el.closest('.slide').querySelector('.didascalia');
      if (tt) tt.remove();
      return;
    }
    if (togliFotoRotta(el)) return;
    var sl = el.closest && el.closest('.slider-galleria .slide');
    if (sl) { var tx2 = sl.querySelector('.slide-testo'); if (tx2) tx2.remove(); }
    var box = el.parentNode;
    el.remove();
    if (box && box.classList) {
      box.classList.add('senza-foto');
      var c = box.querySelector('.credito');
      if (c) c.remove();
    }
  }, true);

  /* ---------- preferiti ---------- */
  var preferiti = store.get('preferiti', []);
  function isPref(id) { return preferiti.indexOf(id) >= 0; }
  function cambiaPref(id) {
    if (isPref(id)) { preferiti = preferiti.filter(function (x) { return x !== id; }); toast(t('rimossoToast')); }
    else { preferiti.push(id); toast(t('salvatoToast')); }
    store.set('preferiti', preferiti);
  }

  /* ---------- posizione ---------- */
  var miaPos = null;
  function chiediPosizione() {
    var p;
    if (isNative) {
      p = P.Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 10000 }).then(function (pos) {
        return { lat: pos.coords.latitude, lng: pos.coords.longitude };
      });
    } else if (navigator.geolocation) {
      p = new Promise(function (ok, ko) {
        navigator.geolocation.getCurrentPosition(function (pos) { ok({ lat: pos.coords.latitude, lng: pos.coords.longitude }); }, ko, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
      });
    } else {
      p = Promise.reject(new Error('no geo'));
    }
    return p.then(function (pos) { miaPos = pos; return pos; });
  }
  function km(a, b) {
    var R = 6371, rad = Math.PI / 180;
    var dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function distanzaTesto(p) {
    if (!miaPos || p.lat == null) return '';
    var d = km(miaPos, p);
    return t('daTe', { km: d < 10 ? d.toFixed(1).replace('.', lang === 'it' ? ',' : '.') : Math.round(d) });
  }

  /* ---------- link esterni ---------- */
  function urlIndicazioni(p) {
    var q = p.mappe || tx(p.nome);
    var punto = p.navigaA || (p.lat != null ? { lat: p.lat, lng: p.lng } : null);   // navigaA: dove arriva l'auto (es. ingresso della riserva)
    // Con le coordinate, Mappe di Apple apre il percorso verso il punto esatto (con q= cercherebbe il nome e può sbagliare posto)
    if (isApple) return punto ? 'https://maps.apple.com/?daddr=' + punto.lat + ',' + punto.lng + '&dirflg=d' : 'https://maps.apple.com/?q=' + encodeURIComponent(q);
    var dest = punto ? punto.lat + ',' + punto.lng : q;
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(dest);
  }
  function urlCondivisione(p) {
    if (p.contatti && p.contatti.web) return p.contatti.web;
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.mappe || tx(p.nome));
  }
  function tel(n) {
    n = String(n).replace(/\s/g, '');
    if (/^\d{3,4}$/.test(n)) return 'tel:' + n;
    if (/^39\d{8,}$/.test(n)) return 'tel:+' + n;
    return 'tel:+39' + n;
  }
  function telTesto(n) {
    n = String(n).replace(/\s/g, '');
    if (n.length <= 4) return n;
    if (/^39\d{9,}$/.test(n)) return '+39 ' + telTesto(n.slice(2));
    if (/^3\d{9}$/.test(n)) return n.slice(0, 3) + ' ' + n.slice(3, 6) + ' ' + n.slice(6);
    if (/^0\d{7,10}$/.test(n)) {
      var pref = /^0[26]/.test(n) ? 2 : /^09[015]/.test(n) ? 3 : /^09/.test(n) ? 4 : 3;
      var r = n.slice(pref);
      return n.slice(0, pref) + ' ' + (r.length >= 6 ? r.slice(0, 3) + ' ' + r.slice(3) : r);
    }
    return n;
  }
  function urlWhatsApp(numero, cosa) {
    return 'https://wa.me/' + numero + (cosa ? '?text=' + encodeURIComponent(t('messaggioWa', { x: cosa })) : '');
  }
  function esterno(href, html, classe, etichetta) {
    return '<a class="' + (classe || '') + '" href="' + esc(href) + '" target="_blank" rel="noopener"' + (etichetta ? ' aria-label="' + esc(etichetta) + '"' : '') + '>' + html + '</a>';
  }

  /* ---------- condivisione ---------- */
  function condividi(titolo, testo, url) {
    var finale = [titolo, testo, url].filter(Boolean).join('\n');
    var tentativo;
    if (isNative) tentativo = P.Share.share({ title: titolo, text: testo, url: url || undefined, dialogTitle: titolo });
    else if (navigator.share) tentativo = navigator.share({ title: titolo, text: testo, url: url || undefined });
    else tentativo = Promise.reject(new Error('no share'));
    return tentativo.catch(function (e) {
      if (e && (e.name === 'AbortError' || /cancel/i.test(e.message || ''))) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(finale).then(function () { toast(t('copiato')); }, function () { toast(t('condivisioneNo')); });
      }
      toast(t('condivisioneNo'));
    });
  }

  var toastTimer = null;
  function toast(msg, durata) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('visibile');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('visibile'); }, durata || 2200);
  }

  /* ---------- installare la web app ----------
     Chrome, Edge e Android: tasto «Installa» (evento beforeinstallprompt).
     iPhone e iPad: istruzioni per «Aggiungi alla schermata Home».
     Browser dentro Instagram, Facebook e simili: prima va aperta nel browser. */
  var richiestaInstalla = null;
  var dentroSocial = /Instagram|FBAN|FBAV|FB_IAB|FBIOS|Line\/|TikTok|musical_ly|Bytedance|Snapchat|Pinterest/i.test(navigator.userAgent);
  function giaInstallata() {
    return isNative || navigator.standalone === true || !!(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  }
  function installabile() { return !giaInstallata() && (dentroSocial || !!richiestaInstalla || isApple); }
  function testoInstalla() { return dentroSocial ? t('installaInApp') : richiestaInstalla ? t('installaSotto') : t('installaIos'); }
  function installaChiusa() {
    try { return Date.now() - (+localStorage.getItem('vm-installa-chiusa') || 0) < 30 * 864e5; } catch (e) { return false; }
  }
  function chiudiInstalla() { try { localStorage.setItem('vm-installa-chiusa', String(Date.now())); } catch (e) { /* niente */ } }
  function cardInstalla() {
    if (!installabile() || installaChiusa()) return '';
    return '<div class="installa"><img src="icons/icon-192.png" alt="" width="46" height="46">' +
      '<div class="installa-testo"><b>' + esc(t('installaTitolo')) + '</b><small>' + esc(testoInstalla()) + '</small></div>' +
      (richiestaInstalla && !dentroSocial ? '<button type="button" class="installa-tasto" data-azione="installa">' + esc(t('installa')) + '</button>' : '') +
      '<button type="button" class="installa-chiudi" data-azione="installa-chiudi" aria-label="' + esc(t('chiudi')) + '">' + ic('close') + '</button></div>';
  }
  function aggiornaInstalla() {
    var posto = document.querySelector('.installa-posto');
    if (posto) posto.innerHTML = cardInstalla() || cardNotifiche();
  }
  function installa() {
    if (richiestaInstalla && !dentroSocial) {
      var r = richiestaInstalla;
      r.prompt();
      Promise.resolve(r.userChoice).then(function (c) {
        if (c && c.outcome === 'accepted') { richiestaInstalla = null; chiudiInstalla(); }
        aggiornaInstalla();
      });
    } else toast(testoInstalla(), 7000);
  }
  window.addEventListener('beforeinstallprompt', function (ev) { ev.preventDefault(); richiestaInstalla = ev; aggiornaInstalla(); });
  window.addEventListener('appinstalled', function () { richiestaInstalla = null; chiudiInstalla(); aggiornaInstalla(); });

  /* ---------- notifiche push (OneSignal) ----------
     Si attivano solo con un tocco. Il servizio si carica solo per chi le ha attivate.
     Su iPhone e iPad funzionano solo con l'app aggiunta alla schermata Home (iOS 16.4 o successivo). */
  var notif = { attive: !!store.get('notifiche', false), pronto: null };
  function notificheConInstallazione() { return !isNative && !!CFG.ONESIGNAL_APP_ID && !dentroSocial && isApple && !giaInstallata(); }
  function notificheDisponibili() {
    return !isNative && !!CFG.ONESIGNAL_APP_ID && !dentroSocial && !(isApple && !giaInstallata()) &&
      'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window && window.isSecureContext !== false;
  }
  function statoNotifiche() {
    if (!notificheDisponibili()) return 'no';
    if (Notification.permission === 'denied') return 'bloccate';
    return notif.attive && Notification.permission === 'granted' ? 'attive' : 'spente';
  }
  function maiChieste() { return statoNotifiche() === 'spente' && Notification.permission === 'default'; }
  function caricaOneSignal() {
    if (notif.pronto) return notif.pronto;
    notif.pronto = new Promise(function (ok, ko) {
      var base = location.pathname.replace(/[^/]*$/, '');
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(function (OneSignal) {
        return Promise.resolve(OneSignal.init({
          appId: CFG.ONESIGNAL_APP_ID,
          safari_web_id: CFG.ONESIGNAL_SAFARI_WEB_ID || undefined,
          path: base + 'push/',
          serviceWorkerPath: 'OneSignalSDKWorker.js',
          serviceWorkerParam: { scope: base + 'push/' },
          serviceWorkerOverrideForTypical: true,
          notifyButton: { enable: false },
          autoResubscribe: true,
          allowLocalhostAsSecureOrigin: true,
          // con l'app già aperta, il tocco sulla notifica la porta in primo piano; la pagina giusta la apre l'app
          notificationClickHandlerMatch: 'origin',
          notificationClickHandlerAction: 'focus'
        })).then(function () {
          try { OneSignal.Notifications.addEventListener('click', function (e) { vaiDaNotifica(e && e.result && e.result.url); }); } catch (er) { /* niente */ }
          // il service worker delle notifiche si aggiorna solo se glielo chiediamo (nessuna pagina sta in push/)
          if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) {
            navigator.serviceWorker.getRegistration(base + 'push/').then(function (r) { if (r) r.update(); }).catch(function () { /* niente */ });
          }
          ok(OneSignal);
        }, ko);
      });
      var s = document.createElement('script');
      s.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
      s.defer = true;
      s.onerror = function () { ko(new Error('onesignal')); };
      document.head.appendChild(s);
    });
    notif.pronto.catch(function () { notif.pronto = null; });
    return notif.pronto;
  }
  function iscriviOneSignal() {
    return caricaOneSignal().then(function (OS) {
      return Promise.resolve(OS.User.PushSubscription.optIn()).then(function () { OS.User.addTag('lingua', lang); });
    });
  }
  function ridisegna() { var y0 = window.scrollY; disegna(false); window.scrollTo(0, y0); }
  function attivaNotifiche() {
    if (!notificheDisponibili()) { if (notificheConInstallazione()) installa(); return; }
    if (Notification.permission === 'denied') { toast(t('notificheNo'), 7000); return; }
    // la richiesta del permesso parte subito, dentro il tocco (Safari lo vuole)
    var chiesta = Notification.permission === 'granted' ? 'granted' : Notification.requestPermission();
    Promise.resolve(chiesta).then(function (p) {
      if (p !== 'granted') { ridisegna(); if (p === 'denied') toast(t('notificheNo'), 7000); return; }
      notif.attive = true; store.set('notifiche', true);
      ridisegna();
      return iscriviOneSignal().then(function () { toast(t('notificheOn')); });
    }).catch(function () { toast(t('notificheErrore'), 5000); });
  }
  function spegniNotifiche() {
    notif.attive = false; store.set('notifiche', false);
    ridisegna();
    toast(t('notificheOff'));
    caricaOneSignal().then(function (OS) { return OS.User.PushSubscription.optOut(); }).catch(function () { /* niente */ });
  }
  function notificheChiuse() {
    try { return Date.now() - (+localStorage.getItem('vm-notifiche-chiusa') || 0) < 30 * 864e5; } catch (e) { return false; }
  }
  function cardNotifiche() {
    if (!maiChieste() || notificheChiuse()) return '';
    return '<div class="installa avviso-notifiche"><span class="installa-icona">' + ic('bell') + '</span>' +
      '<div class="installa-testo"><b>' + esc(t('notificheTitolo')) + '</b><small>' + esc(t('notificheSotto')) + '</small></div>' +
      '<button type="button" class="installa-tasto" data-azione="notifiche-attiva">' + esc(t('attiva')) + '</button>' +
      '<button type="button" class="installa-chiudi" data-azione="notifiche-chiudi" aria-label="' + esc(t('chiudi')) + '">' + ic('close') + '</button></div>';
  }
  function voceNotifiche() {
    var s = statoNotifiche();
    if (s === 'no') {
      return notificheConInstallazione() ? '<button type="button" class="voce voce-link" data-azione="installa">' + ic('bell') +
        '<span class="voce-nome">' + t('notifiche') + '<small class="voce-sotto">' + esc(t('notificheInstalla')) + '</small></span>' + ic('chevron', false, 'freccia') + '</button>' : '';
    }
    var testo = s === 'attive' ? t('notificheAttive') : s === 'bloccate' ? t('notificheBloccate') : t('notificheSpente');
    return '<button type="button" class="voce voce-link voce-notifiche stato-' + s + '" data-azione="notifiche-cambia" role="switch" aria-checked="' + (s === 'attive') + '">' + ic('bell') +
      '<span class="voce-nome">' + t('notifiche') + '</span><span class="stato-notifiche">' + esc(testo) + (s === 'bloccate' ? '' : '<span class="interruttore" aria-hidden="true"></span>') + '</span></button>';
  }
  function avviaNotifiche() {
    if (statoNotifiche() === 'attive') iscriviOneSignal().catch(function () { /* riprova al prossimo avvio */ });
  }
  // tocco su una notifica: va alla pagina del link (la parte dopo #, solo indirizzi dell'app)
  function vaiDaNotifica(url) {
    var h = String(url || '').split('#')[1];
    if (h && /^[\w-]+$/.test(h) && location.hash !== '#' + h) location.hash = h;
  }
  // Su iPhone l'app installata a volte si apre sulla home invece che sul link della notifica toccata.
  // Il service worker delle notifiche (push/OneSignalSDKWorker.js) lascia un promemoria nella cache:
  // lo leggiamo all'avvio e ogni volta che l'app torna in primo piano, e lo cancelliamo subito.
  function promemoriaNotifica() {
    if (!window.caches || !caches.open) return;
    var chiave = new URL('push/apri-notifica', location.href.replace(/#.*$/, '')).href;
    caches.open('vm-notifica').then(function (c) {
      return c.match(chiave).then(function (r) {
        if (!r) return;
        return r.json().then(function (d) {
          c.delete(chiave);
          if (d && d.url && Date.now() - (+d.t || 0) < 10 * 60 * 1000) vaiDaNotifica(d.url);
        });
      });
    }).catch(function () { /* niente */ });
  }
  function controllaPromemoria() { [0, 700, 2000, 4000].forEach(function (ms) { setTimeout(promemoriaNotifica, ms); }); }

  /* ---------- date ---------- */
  function oggiISO() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function partiData(s) { var p = s.split('-'); return { g: +p[2], m: +p[1] - 1, a: +p[0] }; }
  function intervallo(e) {
    var a = partiData(e.inizio), b = partiData(e.fine || e.inizio), M = MESI[lang];
    if (e.inizio === (e.fine || e.inizio)) return a.g + ' ' + M[a.m] + ' ' + a.a;
    if (a.m === b.m && a.a === b.a) return a.g + '–' + b.g + ' ' + M[a.m] + ' ' + a.a;
    if (a.a === b.a) return a.g + ' ' + M[a.m] + ' – ' + b.g + ' ' + M[b.m] + ' ' + b.a;
    return a.g + ' ' + M[a.m] + ' ' + a.a + ' – ' + b.g + ' ' + M[b.m] + ' ' + b.a;
  }
  function eventiFuturi() {
    var o = oggiISO();
    return (DATA.eventi || []).filter(function (e) { return (e.fine || e.inizio) >= o; })
      .sort(function (x, y) { return x.inizio < y.inizio ? -1 : x.inizio > y.inizio ? 1 : 0; });
  }
  function evento(id) { return (DATA.eventi || []).filter(function (x) { return x.id === id; })[0]; }
  // "quando" scrive le date a mano quando non sono di seguito (es. 26–30 dicembre e 2–3 gennaio)
  function quandoTesto(e) { return tx(e.quando) || (intervallo(e) + (e.dateDaDefinire ? ' · ' + t('dateDaDefinire') : '')); }
  function unGiorno(e) { return !e.quando && !e.dateDaDefinire && e.inizio === (e.fine || e.inizio); }
  // «Mercoledì 23 dicembre» / «Wednesday 23 December»
  function giornoLungo(s, conAnno) {
    var p = partiData(s), g = GIORNI_LUNGHI[lang][new Date(p.a, p.m, p.g).getDay()];
    return g.charAt(0).toUpperCase() + g.slice(1) + ' ' + p.g + ' ' + MESI_LUNGHI[lang][p.m] + (conAnno ? ' ' + p.a : '');
  }
  // "ora": testo libero per lingua, es. {"it": "ore 20:30", "en": "8:30 pm"} o "16:30–21:30"
  function conOra(testo, e) { return tx(e.ora) ? testo + ' · ' + tx(e.ora) : testo; }
  function dataEvento(e, conAnno) { return conOra(unGiorno(e) ? giornoLungo(e.inizio, conAnno) : quandoTesto(e), e); }
  // l'evento in evidenza resta in home ed Eventi fino al suo ultimo giorno
  function eventoInEvidenza() { return eventiFuturi().filter(function (e) { return e.evidenza; })[0]; }
  // "daConfermare": true = appuntamento non ancora confermato, con l'etichetta in elenco e nella pagina
  // «tanti altri eventi stanno arrivando» sotto il programma di un evento che ne raccoglie altri
  function notaProgramma(e, link) {
    var n = tx(e.programmaNota);
    if (!n) return '';
    var sotto = statoNotifiche() === 'attive' ? t('tiAvvisiamo') : t('siAggiorna');
    var dentro = ic('star') + '<span><b>' + esc(n) + '</b><small>' + esc(sotto) + '</small></span>';
    if (link) return '<a class="nota-programma" href="#evento-' + e.id + '">' + dentro + ic('chevron', false, 'freccia') + '</a>';
    var tasto = maiChieste() ? '<button type="button" class="nota-tasto" data-azione="notifiche-attiva">' + ic('bell') + esc(t('avvisami')) + '</button>' : '';
    return '<div class="nota-programma' + (tasto ? ' con-tasto' : '') + '">' + dentro + tasto + '</div>';
  }
  function etichettaStato(e) { return e.daConfermare ? '<span class="stato-evento">' + esc(t('daConfermare')) + '</span>' : ''; }
  function slideAttuale(s) { return !s.fino || s.fino >= oggiISO(); }
  function urlEvento(e) { return CFG.WEB_URL ? CFG.WEB_URL.replace(/#.*$/, '') + '#evento-' + e.id : (CFG.PORTALE || ''); }

  /* ---------- pezzi riutilizzati ---------- */
  function linguaToggle() {
    return '<div class="lingua" role="group" aria-label="' + t('lingua') + '">' +
      '<button type="button" data-azione="lingua" data-val="it" aria-pressed="' + (lang === 'it') + '">IT</button>' +
      '<button type="button" data-azione="lingua" data-val="en" aria-pressed="' + (lang === 'en') + '">EN</button></div>';
  }
  function marchio() {
    return '<div class="marchio"><img class="marchio-logo" src="img/logo-tondo.png" alt="" width="50" height="50">' +
      '<span class="marchio-testo"><b><i>Visit</i> Montallegro</b><small>Bovo Marina</small></span></div>';
  }
  function barra(titolo, destra) {
    return '<div class="barra"><button type="button" class="barra-tasto" data-azione="indietro" aria-label="' + t('indietro') + '">' + ic('back') + '</button>' +
      '<h1 class="barra-titolo">' + esc(titolo) + '</h1>' + (destra || '<span class="barra-tasto vuoto"></span>') + '</div>';
  }
  function testaPagina(titolo, intro, occhiello) {
    return '<header class="testata-pagina">' + (occhiello ? '<p class="occhiello">' + esc(occhiello) + '</p>' : '') +
      '<h1>' + esc(titolo) + '</h1>' + (intro ? '<p>' + esc(intro) + '</p>' : '') + '</header>';
  }
  function titoloSezione(testo, href, link) {
    return '<h2 class="titolo-sezione"><span>' + esc(testo) + '</span>' + (href ? '<a href="' + href + '">' + esc(link || t('vediTutti')) + '</a>' : '') + '</h2>';
  }
  function cardOrizzontale(p) {
    return '<a class="card" href="#luogo-' + p.id + '">' + copertina(p, 'card-foto') +
      '<div class="card-testo"><span class="etichetta" style="--c:' + coloreDi(p) + '">' + esc(etichettaDi(p)) + '</span><h3>' + esc(tx(p.nome)) + bollino(p) + '</h3></div></a>';
  }
  function cardAlta(p) {
    var n = (p.galleria || []).length;
    return '<a class="card-alta" href="#luogo-' + p.id + '" style="--c:' + coloreDi(p) + '">' + copertina(p, 'card-alta-foto') +
      '<div class="card-alta-testo"><span class="etichetta">' + esc(etichettaDi(p)) + '</span><h3>' + esc(tx(p.nome)) + bollino(p) + '</h3>' +
      '<p>' + esc(tx(p.breve)) + '</p></div>' + (n > 1 ? '<span class="card-alta-n">' + ic('camera') + n + '</span>' : '') + '</a>';
  }
  function riga(p, extra) {
    var d = distanzaTesto(p);
    var z = [zonaTesto(p), p.fascia].filter(Boolean).join(' · ');
    var meta = (d ? '<span class="distanza">' + ic('pin') + esc(d) + '</span>' : (z ? '<span class="zona">' + ic('pin') + esc(z) + '</span>' : '')) + (extra || '');
    return '<a class="riga' + (isPartner(p) ? ' partner' : '') + '" href="#luogo-' + p.id + '">' + copertina(p, 'riga-foto') +
      '<div class="riga-testo"><span class="etichetta" style="--c:' + coloreDi(p) + '">' + esc(etichettaDi(p)) +
      (p.stagionale ? ' · ' + t('stagionale') : '') + '</span><h3>' + esc(tx(p.nome)) + bollino(p) + '</h3>' + (tx(p.breve) ? '<p>' + esc(tx(p.breve)) + '</p>' : '') +
      (meta ? '<span class="riga-meta">' + meta + '</span>' : '') + '</div>' + ic('chevron', false, 'freccia') + '</a>';
  }
  function rigaEvento(e) {
    var a = partiData(e.inizio);
    return '<a class="evento" href="#evento-' + e.id + '">' +
      '<div class="data" aria-hidden="true"><b>' + a.g + '</b><span>' + MESI[lang][a.m] + '</span></div>' +
      '<div class="evento-testo"><h3>' + esc(tx(e.titolo)) + '</h3><p>' + esc(conOra(quandoTesto(e), e)) + etichettaStato(e) + '</p></div>' +
      ic('chevron', false, 'freccia') + '</a>';
  }
  function cardEvidenza(e) {
    var finta = { id: e.id, foto: e.foto, categorie: ['esperienze'] };
    return '<a class="card-evidenza" href="#evento-' + e.id + '">' + copertina(finta, 'card-evidenza-foto', false, true) +
      '<span class="chip-evidenza">' + ic('star', true) + esc(t('inEvidenza')) + '</span>' +
      '<span class="card-evidenza-testo"><span class="quando-evidenza">' + esc(dataEvento(e)) + (tx(e.occhiello) ? ' · ' + esc(tx(e.occhiello)) : '') + etichettaStato(e) + '</span>' +
      '<b class="titolo-evidenza">' + esc(tx(e.titolo)) + '</b>' +
      (tx(e.breve) ? '<span class="breve-evidenza">' + esc(tx(e.breve)) + '</span>' : '') +
      '<span class="luogo-evidenza">' + ic('pin') + esc(tx(e.luogo)) + '</span></span></a>';
  }
  /* ---------- itinerari: "tipo" decide filtro, etichetta e segnaposto della foto ---------- */
  var CAT_TIPO = { piedi: 'natura', bici: 'esperienze', cavallo: 'esperienze', mare: 'spiagge', natura: 'natura', cultura: 'cultura', sapori: 'sapori' };
  function tipoItinerario(it) { var tipi = t('tipiItinerario') || {}; return it.tipo && tipi[it.tipo] ? tipi[it.tipo] : ''; }
  function fotoItinerario(it, classe, eager) {
    return copertina({ foto: it.foto, categorie: [CAT_TIPO[it.tipo] || 'esperienze'], id: 'itinerario' }, classe, false, eager);
  }
  function etichettaItinerario(it, conTappe) {
    return [tipoItinerario(it), tx(it.durata), conTappe ? t('tappe', { n: it.tappe.length }) : ''].filter(Boolean).join(' · ');
  }
  function cardItinerario(it) {
    return '<a class="card" href="#itinerario-' + it.id + '">' + fotoItinerario(it, 'card-foto') +
      '<div class="card-testo"><span class="etichetta" style="--c:var(--corallo)">' + esc(etichettaItinerario(it, !it.tipo)) + '</span><h3>' + esc(tx(it.titolo)) + '</h3></div></a>';
  }
  function firmaApp() {
    return '<span>' + esc(t('realizzataDa')) + ' ' + esterno('https://disegnailtuosito.it', 'Disegna il tuo sito', 'firma-app') + '</span>' +
      esterno('https://disegnailtuosito.it', ic('globe') + 'disegnailtuosito.it', 'pillola sito-agenzia');
  }
  function tile(href, etichetta, icona, colore) {
    return '<a class="tile" href="' + href + '" style="--c:' + colore + '"><span class="tile-bolla">' + ic(icona) + '</span><span class="tile-nome">' + esc(etichetta) + '</span></a>';
  }
  function tileFoto(href, etichetta, foto, icona, classe) {
    return '<a class="tile-foto ' + (classe || '') + '" href="' + href + '">' + copertina({ foto: foto, categorie: ['spiagge'], id: 'x' }, '') +
      '<span class="tile-foto-nome">' + ic(icona) + esc(etichetta) + '</span></a>';
  }
  function fatto(icona, testo, azione) {
    return '<div class="fatto">' + ic(icona) + '<span>' + testo + '</span>' + (azione || '') + '</div>';
  }
  var ICONE_INFO = { orari: 'clock', dove: 'pin', navetta: 'shuttle', contatto: 'info', telefono: 'phone', prezzo: 'euro', difficolta: 'gauge', escursione: 'hike', stagione: 'sun', aereo: 'plane', durata: 'clock', lingue: 'globe', distanze: 'route' };
  function rigaFatto(i) {
    var icona = ICONE_INFO[i.tipo] || 'info';
    var azione = '';
    if (i.contatto) {
      var c = contatto(i.contatto);
      if (c && c.whatsapp) azione = esterno(urlWhatsApp(c.whatsapp), t('whatsapp'), 'vai');
      else if (c && c.tel) azione = '<a class="vai" href="' + tel(c.tel) + '">' + telTesto(c.tel) + '</a>';
    }
    if (i.tel) azione = '<a class="vai" href="' + tel(i.tel) + '">' + telTesto(i.tel) + '</a>';
    if (i.scheda && scheda(i.scheda)) azione = '<a class="vai" href="#luogo-' + i.scheda + '">' + t('apri') + '</a>';
    if (i.link) azione = esterno(i.link, t('apri'), 'vai');
    return fatto(icona, esc(i[lang] || i.it), azione);
  }
  function azione(href, icona, etichetta, opts) {
    opts = opts || {};
    var attr = opts.esterno ? ' target="_blank" rel="noopener"' : '';
    if (opts.data) return '<button type="button" class="azione' + (opts.classe ? ' ' + opts.classe : '') + '" ' + opts.data + '>' + ic(icona, opts.pieno) + '<span>' + esc(etichetta) + '</span></button>';
    return '<a class="azione' + (opts.classe ? ' ' + opts.classe : '') + '" href="' + esc(href) + '"' + attr + '>' + ic(icona) + '<span>' + esc(etichetta) + '</span></a>';
  }
  function azioniScheda(p, esclusi) {
    var c = p.contatti || {};
    var a = [];
    var esperienza = p.categorie.indexOf('esperienze') >= 0;
    if (c.whatsapp && !esperienza) a.push({ k: 'whatsapp', h: azione(urlWhatsApp(c.whatsapp, tx(p.nome)), 'chat', t('whatsapp'), { esterno: true, classe: 'verde' }) });
    if (c.tel) a.push({ k: 'tel', h: azione(tel(c.tel), 'phone', t('chiama'), { classe: c.whatsapp ? '' : 'primaria' }) });
    if (c.prenota) a.push({ k: 'prenota', h: azione(c.prenota, 'ticket', t('prenota2'), { esterno: true }) });
    if (p.mappe) a.push({ k: 'indicazioni', h: azione(urlIndicazioni(p), 'directions', t('indicazioni'), { esterno: true, classe: (c.tel || c.whatsapp || c.prenota) ? '' : 'primaria' }) });
    if (c.web) a.push({ k: 'web', h: azione(c.web, 'globe', t('sito'), { esterno: true }) });
    if (c.email && !c.web) a.push({ k: 'email', h: azione('mailto:' + c.email, 'mail', t('email')) });
    if (esclusi) a.slice(4).forEach(function (x) { esclusi.push(x.k); });
    var out = a.slice(0, 4).map(function (x) { return x.h; });
    if (p.lat != null && out.length < 4) out.push(azione('#mappa', 'map', t('mappa'), { data: 'data-azione="vedi-mappa" data-id="' + p.id + '"' }));
    out.push(azione('', 'share', t('condividi'), { data: 'data-azione="condividi" data-id="' + p.id + '"' }));
    return '<div class="azioni">' + out.join('') + '</div>';
  }
  function dominio(u) { return String(u).replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, ''); }
  function bottoniTondi(p) {
    var pref = isPref(p.id);
    return '<button type="button" class="tasto-tondo indietro" data-azione="indietro" aria-label="' + t('indietro') + '">' + ic('back') + '</button>' +
      '<button type="button" class="tasto-tondo cuore" data-azione="preferito" data-id="' + p.id + '" aria-pressed="' + pref + '" aria-label="' + (pref ? t('salvato') : t('salva')) + '">' + ic('heart', pref) + '</button>';
  }

  /* ---------- carosello di foto (home e galleria) ---------- */
  function slider(slides, opts) {
    opts = opts || {};
    return '<div class="slider' + (opts.classe ? ' ' + opts.classe : '') + '" data-slider' + (opts.auto ? ' data-auto="1"' : '') + '>' +
      '<div class="slider-pista">' + slides.map(function (s, i) {
        var base = opts.base || { categorie: ['spiagge'], id: 'x' };
        var dentro = copertina({ foto: s.foto, fotoRiserva: s.fotoRiserva, categorie: base.categorie, id: base.id, fonte: base.fonte, sotto: base.sotto, credito: s.credito }, '', !!s.credito, i === 0) +
          '<div class="slide-testo">' + (s.occhiello ? '<span class="occhiello">' + esc(tx(s.occhiello)) + '</span>' : '') +
          (s.titolo ? '<b>' + esc(tx(s.titolo)) + '</b>' : '') + (s.didascalia ? '<span class="didascalia">' + esc(tx(s.didascalia)) + '</span>' : '') + '</div>';
        return s.link ? '<a class="slide" href="' + s.link + '">' + dentro + '</a>' : '<div class="slide">' + dentro + '</div>';
      }).join('') + '</div>' +
      (slides.length > 1 ? '<div class="slider-punti" aria-hidden="true">' + slides.map(function (s, i) { return '<i' + (i === 0 ? ' class="attivo"' : '') + '></i>'; }).join('') + '</div>' : '') +
      (opts.contatore && slides.length > 1 ? '<span class="slider-contatore">1 / ' + slides.length + '</span>' : '') + '</div>';
  }
  var timerSlider = null;
  function attivaSlider() {
    clearInterval(timerSlider);
    document.querySelectorAll('[data-slider]').forEach(function (s) {
      var pista = s.querySelector('.slider-pista');
      var punti = s.querySelectorAll('.slider-punti i');
      var cont = s.querySelector('.slider-contatore');
      var n = pista.children.length;
      var indice = function () { return Math.round(pista.scrollLeft / Math.max(1, pista.clientWidth)); };
      var segna = function () {
        var i = indice();
        punti.forEach(function (p, k) { p.classList.toggle('attivo', k === i); });
        if (cont) cont.textContent = (i + 1) + ' / ' + n;
      };
      pista.addEventListener('scroll', function () { window.requestAnimationFrame(segna); }, { passive: true });
      if (s.getAttribute('data-auto') && n > 1 && !riduciMovimento) {
        var fermo = false;
        pista.addEventListener('touchstart', function () { fermo = true; }, { passive: true });
        pista.addEventListener('pointerdown', function () { fermo = true; });
        timerSlider = setInterval(function () {
          if (fermo || !document.body.contains(pista) || document.hidden) return;
          var prossimo = (indice() + 1) % n;
          pista.scrollTo({ left: prossimo * pista.clientWidth, behavior: 'smooth' });
        }, 5000);
      }
    });
  }

  /* ---------- apertura della home nelle feste: Natale a Montallegro disegnato in SVG ----------
     Le luminarie (le arcate di lampadine delle feste siciliane), la stella cometa, Monte Suso con i ruderi,
     il paese con le finestre accese, il mare di Bovo Marina con la falesia bianca di Capo Bianco e i fichi d'India.
     Le lampadine stanno in tre strati che si accendono a turno, come la «corsa» delle luminarie: si anima solo
     l'opacità di strati interi, così il telefono non ridisegna la scena a ogni fotogramma. */
  var scenaNataleSvg = null;
  function scenaNatale(cieloPieno) {   // cieloPieno: stelle anche dietro al titolo (per l'immagine di copertina)
    if (scenaNataleSvg && !cieloPieno) return scenaNataleSvg;
    var seme = 1912;
    var caso = function () { seme = (seme * 48271) % 2147483647; return seme / 2147483647; };
    var n = function (v) { return Math.round(v * 10) / 10; };
    var VB = 'viewBox="0 0 360 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"';
    var paese = [], finestre = [], lampade = [], luci = [[], [], []], stelle = [], brillano = [], riflesso = [], conta = 0;

    function lampada(x, y, piccola) {
      var g = conta++ % 3;
      x = n(x); y = n(y);
      lampade.push('<circle cx="' + x + '" cy="' + y + '" r="' + (piccola ? .8 : 1.05) + '"/>');
      luci[g].push('<circle cx="' + x + '" cy="' + y + '" r="' + (piccola ? 3.4 : 4.4) + '"/>');
    }
    // punti ogni `passo` lungo la metà alta di un'ellisse, con la normale verso l'esterno
    function arco(cx, cy, rx, ry, passo) {
      var punti = [], prima = null, fatto = passo;
      for (var i = 0; i <= 900; i++) {
        var a = Math.PI * (1 - i / 900), p = [cx + rx * Math.cos(a), cy - ry * Math.sin(a)];
        if (prima) fatto += Math.hypot(p[0] - prima[0], p[1] - prima[1]);
        if (fatto >= passo - .01) {
          var nx = Math.cos(a) / rx, ny = -Math.sin(a) / ry, l = Math.hypot(nx, ny);
          punti.push({ x: p[0], y: p[1], nx: nx / l, ny: ny / l });
          fatto = 0;
        }
        prima = p;
      }
      return punti;
    }
    function anello(cx, cy, r, quante, piccola) {
      for (var q = 0; q < quante; q++) lampada(cx + r * Math.cos(q * 2 * Math.PI / quante - Math.PI / 2), cy + r * Math.sin(q * 2 * Math.PI / quante - Math.PI / 2), piccola);
    }

    // cielo: stelle fisse e stelle che brillano (lasciando libero lo spazio del titolo)
    for (var s = 0; s < 120; s++) {
      var sx = n(3 + caso() * 354), sy = n(3 + caso() * 222), sr = n(.3 + caso() * caso() * 1.15), so = n(.3 + caso() * .6);
      if (!cieloPieno && sx > 62 && sx < 298 && sy > 60 && sy < 174) continue;
      (s % 3 ? stelle : brillano).push('<circle cx="' + sx + '" cy="' + sy + '" r="' + sr + '" opacity="' + so + '"/>');
    }

    // luminarie: fascia ad arco (due fili paralleli), in cima punte verso il cielo e festoni sotto,
    // rosone sulla chiave, colonne tortili ai lati con il capitello
    var fascia = arco(180, 162, 170, 134, 6.8), dentro = function (p, d) { return [p.x - p.nx * d, p.y - p.ny * d]; };
    fascia.forEach(function (p, i) {
      lampada(p.x, p.y);
      var q = dentro(p, 8);
      lampada(q[0], q[1]);
      if (p.y > 70 || Math.abs(p.x - 180) < 16) return;
      if (i % 4 === 2) { lampada(p.x + p.nx * 5.5, p.y + p.ny * 5.5, true); lampada(p.x + p.nx * 10.5, p.y + p.ny * 10.5, true); }
      var p2 = fascia[i + 4];
      if (i % 4 === 0 && p2 && p2.y <= 64) {
        var q1 = dentro(p, 8), q2 = dentro(p2, 8), mx = (q1[0] + q2[0]) / 2, my = (q1[1] + q2[1]) / 2;
        var hx = (q2[0] - q1[0]) / 2, hy = (q2[1] - q1[1]) / 2, prof = Math.hypot(hx, hy) * .75, m = fascia[i + 2];
        for (var k = 1; k < 6; k++) {
          var f = Math.PI * k / 6;
          lampada(mx - Math.cos(f) * hx - m.nx * prof * Math.sin(f), my - Math.cos(f) * hy - m.ny * prof * Math.sin(f), true);
        }
      }
    });
    anello(180, 14, 8.6, 13, true); anello(180, 14, 4, 6, true); lampada(180, 14);
    [16, 344].forEach(function (x0) {
      anello(x0, 167, 5.4, 9, true);
      for (var y = 178; y < 396; y += 6.4) {
        var o = 4.4 * Math.sin((y - 178) / 8);
        lampada(x0 + o, y, true);
        lampada(x0 - o, y + 3.2, true);
      }
    });

    // il paese ai piedi di Monte Suso: tre file di case, la chiesa, le finestre accese
    function fila(x0, x1, base, hMin, hMax, colore) {
      for (var x = x0; x < x1;) {
        var w = 9 + caso() * 11, h = hMin + caso() * (hMax - hMin);
        paese.push('<rect x="' + n(x) + '" y="' + n(base - h) + '" width="' + n(w + .6) + '" height="' + n(h + 14) + '" fill="' + colore + '"/>');
        if (caso() < .35) paese.push('<path d="M' + n(x - .4) + ' ' + n(base - h) + 'L' + n(x + w / 2) + ' ' + n(base - h - 4.5) + 'L' + n(x + w + 1) + ' ' + n(base - h) + 'Z" fill="' + colore + '"/>');
        var quante = caso() < .22 ? 0 : 1 + Math.floor(caso() * 2.6);
        for (var f = 0; f < quante; f++) {
          var fx = n(x + 2 + caso() * (w - 5)), fy = n(base - h + 2.5 + caso() * Math.max(1, h - 9));
          finestre.push('<circle cx="' + n(fx + .85) + '" cy="' + n(fy + 1.2) + '" r="3.2" fill="url(#sn-finestra)"/><rect x="' + fx + '" y="' + fy + '" width="1.7" height="2.4"/>');
        }
        x += w;
      }
    }
    fila(104, 236, 300, 9, 20, '#0d1a3b');
    paese.push('<rect x="145" y="252" width="11" height="52" fill="#0d1a3b"/><path d="M144 253h13l-6.5-8z" fill="#0d1a3b"/>' +
      '<path d="M150.5 245.5v-5M148.6 242.4h3.8" stroke="#0d1a3b" stroke-width="1.1"/>' +
      '<path d="M148.4 266v-3.4a2.1 2.1 0 0 1 4.2 0v3.4z" fill="#ffd27a"/><circle cx="150.5" cy="264" r="6" fill="url(#sn-finestra)"/>' +
      '<path d="M156 304v-24l15-9 15 9v24z" fill="#0d1a3b"/><circle cx="171" cy="283" r="2.2" fill="#ffd27a"/><circle cx="171" cy="283" r="6.5" fill="url(#sn-finestra)"/>');
    // lucine sparse sul fianco della collina, sempre sotto il crinale
    var crinale = [[88, 237], [112, 233], [132, 243], [150, 257], [172, 275], [205, 291], [242, 301]];
    var quota = function (x) {
      for (var k = 1; k < crinale.length; k++) if (x <= crinale[k][0]) { var p0 = crinale[k - 1], p1 = crinale[k]; return p0[1] + (p1[1] - p0[1]) * (x - p0[0]) / (p1[0] - p0[0]); }
      return 301;
    };
    for (var lu = 0; lu < 16; lu++) {
      var lx = 92 + caso() * 112, cima = quota(lx) + 4;
      finestre.push('<circle cx="' + n(lx) + '" cy="' + n(cima + caso() * Math.max(2, 296 - cima)) + '" r=".7" opacity="' + n(.5 + caso() * .5) + '"/>');
    }
    fila(66, 238, 316, 9, 17, '#0a1532');
    fila(24, 244, 332, 8, 15, '#07102a');

    // albero in piazza, con le sue lucine
    paese.push('<path d="M206 297l6 11h-3l6 10h-4l7 13h-24l7-13h-4l6-10h-3z" fill="#0e3d2e"/><path d="M206 292.6l1.1 2.3 2.5.3-1.8 1.7.4 2.5-2.2-1.2-2.2 1.2.4-2.5-1.8-1.7 2.5-.3z" fill="#ffd98a"/>');
    [[204, 304], [208.5, 309], [202, 313], [207, 316], [211.5, 320], [201, 322], [205.5, 325], [210, 328], [214.5, 330], [198, 329]].forEach(function (p) { lampada(p[0], p[1], true); });

    // riflesso della cometa sul mare
    for (var ry = 297; ry < 341; ry += 3.4) {
      var largo = 3 + (ry - 297) * .32, cx = 268 - (ry - 297) * .3;
      for (var tr = 0; tr < 2; tr++) {
        var rx = cx + (caso() - .5) * largo * 2, ll = 2 + caso() * (4 + (ry - 297) * .18);
        if (rx - ll / 2 < 247) continue;   // a sinistra c'è la collina
        riflesso.push('<rect x="' + n(rx - ll / 2) + '" y="' + n(ry) + '" width="' + n(ll) + '" height=".9" rx=".45" opacity="' + n(.45 + caso() * .5) + '"/>');
      }
    }

    var lampadeTutte = '<g fill="#f0c56e" opacity=".55">' + lampade.join('') + '</g>';
    var fondo = '<svg class="sn-scena" ' + VB + '><defs>' +
      '<linearGradient id="sn-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040c22"/><stop offset=".42" stop-color="#0a1f4d"/><stop offset=".66" stop-color="#16377a"/><stop offset=".8" stop-color="#36407e"/><stop offset="1" stop-color="#6a4c7a"/></linearGradient>' +
      '<radialGradient id="sn-paese-luce" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffb35c" stop-opacity=".42"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="sn-cometa" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff7de" stop-opacity=".95"/><stop offset=".35" stop-color="#ffd27a" stop-opacity=".32"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="sn-coda" gradientUnits="userSpaceOnUse" x1="268" y1="200" x2="382" y2="124"><stop offset="0" stop-color="#fff3c4" stop-opacity=".9"/><stop offset=".4" stop-color="#ffd27a" stop-opacity=".38"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="sn-mare" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a4888"/><stop offset="1" stop-color="#0a1a40"/></linearGradient>' +
      '<linearGradient id="sn-falesia" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#eceaf3"/><stop offset="1" stop-color="#9aa6c6"/></linearGradient>' +
      '<radialGradient id="sn-finestra" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffb648" stop-opacity=".5"/><stop offset="1" stop-color="#ffb648" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="sn-terra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050b1d" stop-opacity="0"/><stop offset="1" stop-color="#050b1d" stop-opacity=".75"/></linearGradient>' +
      '</defs>' +
      '<rect width="360" height="400" fill="url(#sn-cielo)"/>' +
      '<g fill="#fff">' + stelle.join('') + brillano.join('') + '</g>' +
      '<ellipse cx="170" cy="300" rx="215" ry="74" fill="url(#sn-paese-luce)"/>' +
      // stella cometa
      '<path d="M266 199C304 180 344 152 390 114L390 144C346 162 306 188 269 203Z" fill="url(#sn-coda)"/>' +
      '<path d="M270 198C310 176 348 148 390 124M271 201C314 184 352 164 390 152" stroke="#fff3cf" stroke-opacity=".35" stroke-width=".6" fill="none"/>' +
      '<circle cx="268" cy="200" r="30" fill="url(#sn-cometa)"/>' +
      '<path d="M268 178l2.1 19.9 19.9 2.1-19.9 2.1L268 222l-2.1-19.9-19.9-2.1 19.9-2.1z" fill="#fffdf6"/>' +
      '<path d="M268 200l6.4-6.4M268 200l6.4 6.4M268 200l-6.4 6.4M268 200l-6.4-6.4" stroke="#fffdf6" stroke-width="1" stroke-linecap="round"/>' +
      // mare di Bovo Marina e Capo Bianco
      '<rect x="190" y="292" width="170" height="70" fill="url(#sn-mare)"/>' +
      '<path d="M190 292.3H360" stroke="#8ea3dc" stroke-opacity=".45" stroke-width=".7"/>' +
      '<path d="M283 292.5l7-9 6-8.5 5-3.4c14-1.6 32-3.6 59-4.6v25.5z" fill="url(#sn-falesia)"/>' +
      '<path d="M296 286l4-9M306 289l3-14M318 290l2-16M331 290l1-17M345 291l.5-17" stroke="#8792b4" stroke-opacity=".55" stroke-width=".7"/>' +
      '<path d="M289 284.6l7-9.1 5-3.4c14-1.6 32-3.6 59-4.6" stroke="#0b1f2a" stroke-width="3" stroke-linejoin="round" fill="none"/>' +
      '<g fill="#0b1f2a"><circle cx="305" cy="270.6" r="2.4"/><circle cx="314" cy="269.4" r="2.8"/><circle cx="324" cy="268.6" r="2.2"/><circle cx="335" cy="267.4" r="3"/><circle cx="347" cy="266.6" r="2.4"/><circle cx="356" cy="266" r="2.8"/></g>' +
      '<path d="M283 292.7l7 6 6 4.4c16 1.3 34 2.4 64 2.6v-13z" fill="url(#sn-falesia)" opacity=".15"/>' +
      '<g fill="#ffdf9a" opacity=".45">' + riflesso.join('') + '</g>' +
      // Monte Suso con i ruderi
      '<path d="M-10 318C20 300 45 252 88 237C112 229 132 241 150 257C172 277 205 292 242 301L242 400H-10Z" fill="#142651"/>' +
      '<path d="M-10 318C20 300 45 252 88 237C112 229 132 241 150 257C172 277 205 292 242 301" stroke="#5a74b8" stroke-opacity=".5" stroke-width=".8" fill="none"/>' +
      '<path d="M79 239v-11h2v-2h2v3l2-2v12zM69 240v-5h3v2h3v-4h2v7zM92 239v-6h3v2l3-4h2v8z" fill="#142651"/>' +
      '<g fill="#ffd27a">' + paese.join('') + finestre.join('') + '</g>' +
      '<path d="M-10 334C50 326 120 328 190 338C240 345 300 352 370 358V410H-10Z" fill="#060d22"/>' +
      // fichi d'India in primo piano
      '<g fill="#091530" stroke="#6683c9" stroke-opacity=".6" stroke-width=".9">' +
      '<ellipse cx="44" cy="394" rx="14" ry="18" transform="rotate(-8 44 394)"/><ellipse cx="29" cy="366" rx="11" ry="15" transform="rotate(-30 29 366)"/>' +
      '<ellipse cx="58" cy="364" rx="11" ry="15" transform="rotate(22 58 364)"/><ellipse cx="42" cy="342" rx="9" ry="12.5" transform="rotate(-6 42 342)"/>' +
      '<ellipse cx="69" cy="343" rx="8.5" ry="11.5" transform="rotate(36 69 343)"/><ellipse cx="20" cy="342" rx="8" ry="11" transform="rotate(-40 20 342)"/></g>' +
      '<g fill="#b4503f" stroke="#ffb27a" stroke-opacity=".5" stroke-width=".6"><ellipse cx="38" cy="329.4" rx="2.1" ry="2.6"/><ellipse cx="44" cy="329" rx="2.1" ry="2.6"/>' +
      '<ellipse cx="73" cy="331.6" rx="2" ry="2.5" transform="rotate(30 73 331.6)"/><ellipse cx="14" cy="331.5" rx="2" ry="2.5" transform="rotate(-38 14 331.5)"/><ellipse cx="68" cy="351" rx="2" ry="2.5" transform="rotate(40 68 351)"/></g>' +
      '<rect y="300" width="360" height="100" fill="url(#sn-terra)"/>' +
      lampadeTutte + '</svg>';

    var strato = function (classe, interno2, defs) {
      return '<svg class="sn-strato ' + classe + '" ' + VB + '>' + (defs || '') + interno2 + '</svg>';
    };
    var svg = fondo +
      strato('sn-brillano', '<g fill="#fff">' + brillano.join('').replace(/opacity="[\d.]+"/g, '') + '</g>') +
      strato('sn-onde', '<g fill="#fff1c9">' + riflesso.join('') + '</g>') +
      luci.map(function (gruppo, g) {
        return strato('sn-luci sn-luci-' + g, '<g fill="url(#sn-alone-' + g + ')">' + gruppo.join('') + '</g>',
          '<defs><radialGradient id="sn-alone-' + g + '" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffdf6"/><stop offset=".22" stop-color="#fff4cf"/><stop offset=".3" stop-color="#ffdd92" stop-opacity=".62"/><stop offset=".62" stop-color="#ffc45c" stop-opacity=".2"/><stop offset="1" stop-color="#ffc45c" stop-opacity="0"/></radialGradient></defs>');
      }).join('');
    if (!cieloPieno) scenaNataleSvg = svg;
    return svg;
  }
  function aperturaHome(a) {
    if (!a || a.tema !== 'natale' || !slideAttuale(a)) return '';
    var polvere = '';
    for (var i = 0; i < 12; i++) polvere += '<i></i>';
    return '<a class="apertura apertura-natale" href="' + esc(a.link || '#eventi') + '">' + scenaNatale() +
      '<span class="sn-bagliore" aria-hidden="true"></span><span class="sn-polvere" aria-hidden="true">' + polvere + '</span>' +
      '<span class="sn-testo">' + (a.occhiello ? '<span class="sn-date">' + esc(tx(a.occhiello)) + '</span>' : '') +
      '<b class="sn-titolo">' + esc(tx(a.titolo)) + '</b>' +
      (a.sottotitolo ? '<span class="sn-sotto">' + esc(tx(a.sottotitolo)) + '</span>' : '') + '</span>' +
      (a.bottone ? '<span class="sn-tasto">' + esc(tx(a.bottone)) + ic('chevron') + '</span>' : '') + '</a>';
  }

  /* ---------- viste ---------- */
  var VISTE = {};

  VISTE.home = function () {
    var H = DATA.home || {};
    var evidenza = (H.evidenza || []).map(scheda).filter(Boolean);
    var territorio = (H.territorio || []).map(scheda).filter(Boolean);
    var evid = eventoInEvidenza();
    var ev = eventiFuturi().filter(function (e) { return e !== evid; }).slice(0, 3);
    var consigliati = ruota(DATA.schede.filter(isPartner)).slice(0, 10);
    return '<div class="pagina home">' +
      '<header class="testata-app">' + marchio() + '<div class="testata-destra"><a class="tasto-cerca" href="#cerca" aria-label="' + esc(t('cercaTitolo')) + '">' + ic('search') + '</a>' + linguaToggle() + '</div></header>' +
      '<div class="installa-posto">' + (cardInstalla() || cardNotifiche()) + '</div>' +
      (aperturaHome(H.apertura) || slider((H.slider || []).filter(slideAttuale), { auto: true, classe: 'slider-home' })) +
      (evid ? '<section class="blocco" aria-label="' + esc(t('inEvidenza')) + '">' + cardEvidenza(evid) + '</section>' : '') +
      '<div id="meteo-breve"></div>' +
      (territorio.length ? '<section class="blocco">' + titoloSezione(t('territorio'), '#visit') +
        '<div class="binario alto">' + territorio.map(cardAlta).join('') + '</div></section>' : '') +
      '<section class="blocco">' + titoloSezione(t('scopri')) +
      '<div class="griglia-foto">' +
      tileFoto('#torre-salsa', t('visitTorreSalsa'), 'img/foto/torre-salsa-spiaggia.jpg', 'tower', 'larga') +
      tileFoto('#spiagge', t('spiagge'), 'img/foto/torre-salsa-acqua.jpg', 'umbrella') +
      tileFoto('#esperienze', t('esperienze'), 'img/foto/capo-bianco-tramonto.jpg', 'hike') +
      '</div>' +
      '<nav class="griglia-tile" aria-label="' + t('scopri') + '">' +
      tile('#visit', t('cosaVedere'), 'compass', 'var(--blu)') +
      tile('#eventi', t('eventi'), 'calendar', 'var(--ambra)') +
      tile('#mangiare', t('mangiare'), 'fork', 'var(--arancio)') +
      tile('#dormire', t('dormire'), 'bed', 'var(--indaco)') +
      tile('#sapori', t('sapori'), 'basket', 'var(--oliva)') +
      tile('#servizi', t('servizi'), 'shop', 'var(--ardesia)') +
      tile('#itinerari', t('itinerari'), 'route', 'var(--corallo)') +
      tile('#trasporti', t('comeArrivare'), 'bus', 'var(--mare)') +
      tile('#meteo', t('meteo'), 'sun', 'var(--sabbia)') +
      tile('#info', t('numeriUtili'), 'lifebuoy', 'var(--rosso)') +
      '</nav></section>' +
      (consigliati.length ? '<section class="blocco">' + titoloSezione(t('consigliati')) +
        '<div class="binario">' + consigliati.map(cardOrizzontale).join('') + '</div></section>' : '') +
      '<section class="blocco">' + titoloSezione(t('daNonPerdere'), '#visit') +
      '<div class="binario">' + evidenza.map(cardOrizzontale).join('') + '</div></section>' +
      '<section class="blocco">' + titoloSezione(t('prossimiEventi'), '#eventi', t('tutti')) +
      '<div class="elenco">' + (ev.length ? ev.map(rigaEvento).join('') : '<p class="vuoto">' + t('nessunEvento') + '</p>') + '</div></section>' +
      '<section class="blocco">' + titoloSezione(t('itinerari'), '#itinerari') +
      '<div class="binario">' + DATA.itinerari.map(cardItinerario).join('') + '</div></section>' +
      '<section class="blocco">' + titoloSezione(t('proLoco')) + riquadriProLoco() + '</section>' +
      '<footer class="crediti"><span>' + t('progetto') + '</span>' + firmaApp() + '</footer></div>';
  };

  /* ---------- Pro Loco: diventa socio, diventa partner ---------- */
  function riquadriProLoco() {
    var r = function (href, icona, colore, titolo, sotto) {
      return '<a class="riquadro-pl" href="' + href + '"><span class="bolla" style="--c:' + colore + '">' + ic(icona) + '</span>' +
        '<b>' + esc(titolo) + '</b><small>' + esc(sotto) + '</small></a>';
    };
    return '<div class="pro-loco-riquadri">' + r('#socio', 'people', 'var(--blu)', t('diventaSocio'), t('socioBreve')) +
      r('#partner', 'star', 'var(--sole)', t('diventaPartner'), t('partnerBreve')) + '</div>';
  }
  function invitoPartner() {
    return '<a class="invito" href="#partner"><span class="bolla" style="--c:var(--sole)">' + ic('star') + '</span>' +
      '<span><b>' + esc(t('invitoPartner')) + '</b><small>' + esc(t('invitoPartnerSotto')) + '</small></span>' + ic('chevron', false, 'freccia') + '</a>';
  }
  function paginaProLoco(o) {
    var PL = DATA.proloco || {};
    var c = contatto(PL.contatto || 'pro-loco') || {};
    var messaggio = t(o.messaggio);
    var az = [];
    if (c.whatsapp) az.push(azione('https://wa.me/' + c.whatsapp + '?text=' + encodeURIComponent(messaggio), 'chat', t('whatsapp'), { esterno: true, classe: 'verde' }));
    if (c.tel) az.push(azione(tel(c.tel), 'phone', t('chiama'), { classe: c.whatsapp ? '' : 'primaria' }));
    if (c.email) az.push(azione('mailto:' + c.email + '?subject=' + encodeURIComponent(t(o.oggetto)) + '&body=' + encodeURIComponent(messaggio), 'mail', t('email')));
    if (o.modulo && /^https:\/\//.test(PL[o.modulo] || '')) az.push(azione(PL[o.modulo], 'globe', t('moduloOnline'), { esterno: true }));
    var partner = o.mostraPartner ? ruota(DATA.schede.filter(isPartner)) : [];
    return '<div class="pagina sotto pagina-proloco">' + barra(t(o.barra)) +
      '<header class="testata-proloco"><img class="proloco-logo" src="img/logo-tondo.png" alt="" width="64" height="64">' +
      '<p class="occhiello">' + esc(t('proLoco')) + '</p><h1>' + esc(t(o.titolo)) + '</h1><p>' + esc(t(o.intro)) + '</p></header>' +
      (az.length ? '<div class="azioni">' + az.join('') + '</div>' : '') +
      '<section class="blocco">' + titoloSezione(t(o.elenco)) + '<ul class="consigli">' + t(o.vantaggi).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></section>' +
      '<section class="blocco">' + titoloSezione(t(o.come)) +
      (c.tel ? '<div class="fatti">' + fatto('phone', esc(t('perInfo')), '<a class="vai" href="' + tel(c.tel) + '">' + telTesto(c.tel) + '</a>') + '</div>' : '') +
      '<p class="testo-come">' + esc(t(o.testoCome)) + '</p></section>' +
      (partner.length ? '<section class="blocco">' + titoloSezione(t('iNostriPartner')) + '<div class="elenco">' + partner.map(function (p) { return riga(p); }).join('') + '</div></section>' : '') +
      '</div>';
  }
  VISTE.socio = function () {
    return paginaProLoco({ barra: 'diventaSocio', titolo: 'socioTitolo', intro: 'socioIntro', elenco: 'socioPerche', vantaggi: 'socioVantaggi',
      come: 'comeIscriversi', testoCome: 'socioCome', messaggio: 'messaggioSocio', oggetto: 'oggettoSocio', modulo: 'moduloSocio' });
  };
  VISTE.partner = function () {
    return paginaProLoco({ barra: 'diventaPartner', titolo: 'partnerTitolo', intro: 'partnerIntro', elenco: 'partnerCosa', vantaggi: 'partnerVantaggi',
      come: 'comeFunziona', testoCome: 'partnerCome', messaggio: 'messaggioPartner', oggetto: 'oggettoPartner', mostraPartner: true });
  };

  VISTE.visit = function (r) {
    var filtro = r.filtro || 'tutto';
    var tutti = luoghiVisit();
    var lista = filtro === 'tutto' ? tutti.slice() : tutti.filter(function (p) { return p.categorie.indexOf(filtro) >= 0; });
    if (miaPos) lista.sort(function (a, b) { return (a.lat == null) - (b.lat == null) || (a.lat == null ? 0 : km(miaPos, a) - km(miaPos, b)); });
    var chip = function (id, nome, colore, n) {
      return '<a class="filtro" href="#' + (id === 'tutto' ? 'visit' : 'visit-' + id) + '" style="--c:' + colore + '"' + (filtro === id ? ' aria-current="true"' : '') + '>' + esc(nome) + ' <small>' + n + '</small></a>';
    };
    var chips = chip('tutto', t('tutto'), 'var(--blu)', tutti.length) + VISIT_CAT.map(function (id) {
      var c = categoria(id);
      var n = tutti.filter(function (p) { return p.categorie.indexOf(id) >= 0; }).length;
      return c && n ? chip(id, tx(c.nome), COLORI[c.colore], n) : '';
    }).join('');
    var corpo;
    if (filtro === 'tutto') {
      var idTerr = (DATA.home && DATA.home.territorio) || [];
      var terr = idTerr.map(scheda).filter(Boolean);
      var resto = tutti.filter(function (p) { return idTerr.indexOf(p.id) < 0; });
      var vicini = resto.filter(function (p) { return p.categorie.indexOf('dintorni') < 0; });
      var dintorni = resto.filter(function (p) { return p.categorie.indexOf('dintorni') >= 0; });
      corpo = (terr.length ? '<section class="blocco">' + titoloSezione(t('territorio')) + '<div class="elenco grande">' + terr.map(function (p) { return cardGrande(p); }).join('') + '</div></section>' : '') +
        (vicini.length ? '<section class="blocco">' + titoloSezione(t('altriLuoghi')) + '<div class="elenco">' + vicini.map(function (p) { return riga(p); }).join('') + '</div></section>' : '') +
        (dintorni.length ? '<section class="blocco">' + titoloSezione(t('neiDintorni'), '#visit-dintorni') + '<div class="elenco">' + dintorni.map(function (p) { return riga(p); }).join('') + '</div></section>' : '');
    } else {
      corpo = '<div class="elenco">' + lista.map(function (p) { return riga(p); }).join('') + '</div>';
    }
    return '<div class="pagina">' + testaPagina(t('cosaVedere'), t('visitIntro'), 'Visit Montallegro') +
      '<nav class="filtri" aria-label="Filtri">' + chips + '</nav>' + corpo + '</div>';
  };

  VISTE.spiagge = function () {
    var tutte = schedeDi('spiagge').filter(function (p) { return p.categorie.indexOf('mangiare') < 0; });
    var spiagge = tutte.filter(function (p) { return p.fonte !== 'ricerca'; });
    var vicine = tutte.filter(function (p) { return p.fonte === 'ricerca'; });
    var lidi = schedeDi('spiagge').filter(function (p) { return p.categorie.indexOf('mangiare') >= 0; });
    return '<div class="pagina sotto">' + barra(t('spiagge')) +
      '<div class="testata-foto">' + copertina({ foto: 'img/foto/torre-salsa-acqua.jpg', categorie: ['spiagge'], id: 'x' }, '', true, true) +
      '<div class="testata-foto-testo"><h1>' + t('spiagge') + '</h1><p>' + esc(t('spiaggeIntro')) + '</p></div></div>' +
      '<div class="elenco grande">' + spiagge.map(function (p) { return cardGrande(p); }).join('') + '</div>' +
      (vicine.length ? '<section class="blocco">' + titoloSezione(t('spiaggeVicine')) + '<div class="elenco">' + vicine.map(function (p) { return riga(p); }).join('') + '</div></section>' : '') +
      (lidi.length ? '<section class="blocco">' + titoloSezione(t('lidi')) + '<p class="nota">' + ic('sun') + esc(t('chiamaPrima')) + '</p><div class="elenco">' + lidi.map(function (p) { return riga(p); }).join('') + '</div></section>' : '') +
      '<section class="blocco">' + titoloSezione(t('alMare')) + '<ul class="consigli">' + t('regoleMare').map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></section></div>';
  };

  function cardGrande(p, extra) {
    return '<a class="card-grande" href="#luogo-' + p.id + '">' + copertina(p, 'card-grande-foto', true) +
      '<div class="card-grande-testo"><span class="etichetta" style="--c:' + coloreDi(p) + '">' + esc(etichettaDi(p)) + '</span>' +
      '<h3>' + esc(tx(p.nome)) + bollino(p) + '</h3><p>' + esc(tx(p.breve)) + '</p>' + (extra || '') + '</div></a>';
  }

  var ORDINE_ESPERIENZE = ['seacily-torre-salsa', 'seacily-capo-bianco', 'seacily-monte-suso', 'opera-ammare', 'scuderia-ranch-todaro', 'wwf-torre-salsa', 'birdwatching-gorgo', 'sup-kayak-torre-salsa', 'museo-civilta-contadina'];
  VISTE.esperienze = function () {
    var lista = partnerPrima(schedeDi('esperienze').slice().sort(function (a, b) {
      var x = ORDINE_ESPERIENZE.indexOf(a.id), y = ORDINE_ESPERIENZE.indexOf(b.id);
      return (x < 0 ? 99 : x) - (y < 0 ? 99 : y);
    }));
    return '<div class="pagina sotto">' + barra(t('esperienze')) +
      '<div class="testata-foto">' + copertina({ foto: 'img/foto/capo-bianco-tramonto.jpg', categorie: ['esperienze'], id: 'x', credito: 'Seacily' }, '', true, true) +
      '<div class="testata-foto-testo"><h1>' + t('esperienze') + '</h1><p>' + esc(t('esperienzeIntro')) + '</p></div></div>' +
      '<div class="elenco grande">' + lista.map(function (p) {
        var chips = (p.info || []).filter(function (i) { return i.tipo === 'prezzo' || (i.tipo === 'orari' && p.fonte !== 'portale') || i.tipo === 'durata'; }).slice(0, 2).map(function (i) {
          return '<span class="chip">' + ic(ICONE_INFO[i.tipo]) + esc((i[lang] || i.it).split(' · ')[0]) + '</span>';
        }).join('');
        return cardGrande(p, chips ? '<div class="chips">' + chips + '</div>' : '');
      }).join('') + '</div>' + invitoPartner() +
      '<section class="blocco">' + titoloSezione(t('itinerari'), '#itinerari') + '<div class="binario">' + DATA.itinerari.map(cardItinerario).join('') + '</div></section></div>';
  };

  // una scheda può stare in più sottosezioni: "sotto": ["ristoranti", "bar"]
  function haSotto(p, id) { return Array.isArray(p.sotto) ? p.sotto.indexOf(id) >= 0 : p.sotto === id; }
  function sottoVoce(p) {
    if (!p.sotto || !DATA.sottocategorie) return null;
    for (var i = 0; i < p.categorie.length; i++) {
      var el = DATA.sottocategorie[p.categorie[i]] || [];
      for (var j = 0; j < el.length; j++) if (haSotto(p, el[j].id)) return el[j];
    }
    return null;
  }
  function entrambe(v) { return v == null ? '' : (typeof v === 'string' ? v : [v.it, v.en].filter(Boolean).join(' ')); }
  function rigaContatto(p) {
    var c = p.contatti || {};
    var mini = '';
    if (c.tel || c.whatsapp) mini = '<span class="mini-azione">' + ic(c.tel ? 'phone' : 'chat') + esc(c.tel ? telTesto(c.tel) : t('whatsapp')) + '</span>';
    return riga(p, mini);
  }
  function paginaElenco(cat, titolo, intro, nota, linkPortale, filtro) {
    var tutti = partnerPrima(schedeDi(cat));
    var sotto = (DATA.sottocategorie && DATA.sottocategorie[cat]) || [];
    var colore = COLORI[(categoria(cat) || {}).colore] || 'var(--blu)';
    var lista = filtro ? tutti.filter(function (p) { return haSotto(p, filtro); }) : tutti;
    var chip = function (id, nome, n) {
      return '<a class="filtro" href="#' + cat + (id ? '-' + id : '') + '" style="--c:' + colore + '"' + ((filtro || '') === id ? ' aria-current="true"' : '') + '>' + esc(nome) + ' <small>' + n + '</small></a>';
    };
    var chips = sotto.length > 1 ? '<nav class="filtri" aria-label="Filtri">' + chip('', t('tuttiFiltro'), tutti.length) + sotto.map(function (x) {
      var n = tutti.filter(function (p) { return haSotto(p, x.id); }).length;
      return n ? chip(x.id, tx(x.nome), n) : '';
    }).join('') + '</nav>' : '';
    var corpo;
    if (!filtro && sotto.length > 1) {
      var senzaGruppo = tutti.filter(function (p) { return !sotto.some(function (x) { return haSotto(p, x.id); }); });
      corpo = sotto.map(function (x) {
        var gr = tutti.filter(function (p) { return haSotto(p, x.id); });
        return gr.length ? '<section class="gruppo-elenco"><h2 class="sottotitolo">' + esc(tx(x.nome)) + '</h2><div class="elenco">' + gr.map(rigaContatto).join('') + '</div></section>' : '';
      }).join('') + (senzaGruppo.length ? '<div class="elenco">' + senzaGruppo.map(rigaContatto).join('') + '</div>' : '');
    } else {
      corpo = '<div class="elenco">' + lista.map(rigaContatto).join('') + '</div>';
    }
    return '<div class="pagina sotto">' + barra(titolo) + testaPagina(titolo, intro) + chips +
      (nota ? '<p class="nota">' + ic('sun') + esc(nota) + '</p>' : '') + corpo + invitoPartner() +
      (linkPortale ?'<p class="altro">' + esterno(CFG.PORTALE || 'https://visitmontallegrobovomarina.it', ic('globe') + esc(linkPortale), 'pillola') + '</p>' : '') + '</div>';
  }
  VISTE.mangiare = function (r) { return paginaElenco('mangiare', t('mangiareTitolo'), t('mangiareIntro'), t('chiamaPrima'), '', r.filtro); };
  VISTE.dormire = function (r) { return paginaElenco('dormire', t('dormireTitolo'), t('dormireIntro'), '', '', r.filtro); };
  VISTE.sapori = function (r) { return paginaElenco('sapori', t('saporiTitolo'), t('saporiIntro'), '', '', r.filtro); };
  VISTE.servizi = function (r) { return paginaElenco('servizi', t('serviziTitolo'), t('serviziIntro'), '', '', r.filtro); };

  /* ---------- ricerca ---------- */
  var ricerca = '';
  function norm(x) { return String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  VISTE.cerca = function () {
    return '<div class="pagina sotto">' + barra(t('cerca')) +
      '<label class="cerca-box">' + ic('search') + '<input id="cerca-campo" type="search" enterkeyhint="search" autocomplete="off" placeholder="' + esc(t('cercaSegnaposto')) + '" value="' + esc(ricerca) + '" aria-label="' + esc(t('cercaTitolo')) + '"></label>' +
      '<div id="cerca-risultati"></div></div>';
  };
  function aggiornaRicerca() {
    var box = document.getElementById('cerca-risultati');
    if (!box) return;
    var q = norm(ricerca).trim();
    if (q.length < 2) {
      var idee = lang === 'it' ? ['Farmacia', 'Pizzeria', 'B&B', 'Piscina', 'Birdwatching', 'Olio', 'Formaggi', 'Cavallo', 'Supermercato', 'Taxi']
        : ['Pharmacy', 'Pizzeria', 'B&B', 'Pool', 'Birdwatching', 'Olive oil', 'Cheese', 'Horse', 'Supermarket', 'Taxi'];
      box.innerHTML = '<p class="conteggio">' + esc(t('provaCon')) + '</p><div class="chips idee">' + idee.map(function (x) {
        return '<button type="button" class="chip" data-azione="suggerisci" data-val="' + esc(x) + '">' + esc(x) + '</button>';
      }).join('') + '</div>';
      return;
    }
    var parole = q.split(/\s+/);
    var trovati = [];
    DATA.schede.forEach(function (p) {
      var sv = sottoVoce(p);
      var testo = norm([
        entrambe(p.nome), entrambe(p.etichetta), entrambe(p.breve),
        p.zona && ZONE[p.zona] ? UI.it[ZONE[p.zona]] + ' ' + UI.en[ZONE[p.zona]] : entrambe(p.localita),
        sv ? entrambe(sv.nome) : '',
        p.categorie.map(function (c) { var k = categoria(c); return k ? entrambe(k.nome) : ''; }).join(' '),
        (p.info || []).map(function (i) { return [i.it, i.en].filter(Boolean).join(' '); }).join(' '),
        (p.caratteristiche || []).join(' ')
      ].join(' '));
      if (!parole.every(function (w) { return testo.indexOf(w) >= 0; })) return;
      var nome = norm(entrambe(p.nome));
      trovati.push({ p: p, punti: parole.every(function (w) { return nome.indexOf(w) >= 0; }) ? 0 : 1 });
    });
    trovati = trovati.sort(function (a, b) { return a.punti - b.punti; }).map(function (x) { return x.p; });
    box.innerHTML = '<p class="conteggio">' + esc(t('risultati', { n: trovati.length })) + '</p>' +
      (trovati.length ? '<div class="elenco">' + trovati.slice(0, 80).map(rigaContatto).join('') + '</div>' : '<p class="vuoto">' + esc(t('nessunRisultato')) + '</p>');
  }
  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'cerca-campo') { ricerca = e.target.value; aggiornaRicerca(); }
  });

  VISTE.torreSalsa = function () {
    var p = scheda('torre-salsa');
    if (!p) return VISTE.nontrovato();
    var paragrafi = txa(p.testo).map(function (s) { return '<p>' + esc(s) + '</p>'; }).join('');
    var escur = scheda('seacily-torre-salsa'), dama = scheda('dama-bianca');
    var numeri = (p.numeri || []).map(function (n) { return '<div class="numero"><b>' + esc(n.valore) + '</b><span>' + esc(n[lang] || n.it) + '</span></div>'; }).join('');
    var box = function (s, titolo, testoBottone) {
      if (!s) return '';
      var c = s.contatti || {};
      var cta = c.whatsapp ? esterno(urlWhatsApp(c.whatsapp, tx(s.nome)), ic('chat') + esc(testoBottone), 'bottone verde') : '';
      var info = (s.info || []).filter(function (i) { return i.tipo === 'orari' || i.tipo === 'telefono'; }).map(rigaFatto).join('');
      return '<section class="riquadro">' + '<a class="riquadro-testa" href="#luogo-' + s.id + '">' + copertina(s, 'riquadro-foto') +
        '<div><span class="occhiello">' + esc(titolo) + '</span><h3>' + esc(tx(s.nome)) + '</h3></div>' + ic('chevron', false, 'freccia') + '</a>' +
        '<p>' + esc(tx(s.breve)) + '</p><div class="fatti">' + info + '</div>' + cta + '</section>';
    };
    return '<article class="dettaglio landing">' +
      '<div class="dettaglio-testa">' + slider(p.galleria || [{ foto: p.foto }], { classe: 'slider-galleria', contatore: true }) + bottoniTondi(p) + '</div>' +
      '<div class="dettaglio-corpo">' +
      '<div class="titoli"><span class="etichetta" style="--c:var(--verde)">' + esc(t('landingSotto')) + '</span><h1>' + esc(tx(p.nome)) + '</h1></div>' +
      (numeri ? '<div class="numeri">' + numeri + '</div>' : '') +
      '<p class="attacco">' + esc(tx(p.breve)) + '</p>' +
      azioniScheda(p) +
      '<div class="testo">' + paragrafi + '</div>' +
      box(escur, t('escursione'), t('prenotaWhatsApp')) +
      ((p.info || []).length ? '<section class="blocco"><h2>' + t('infoPratiche') + '</h2><div class="fatti">' + p.info.map(rigaFatto).join('') + '</div></section>' : '') +
      (txa(p.consigli).length ? '<section class="blocco"><h2>' + t('daSapere') + '</h2><ul class="consigli">' + txa(p.consigli).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></section>' : '') +
      (dama ? '<section class="blocco"><h2>' + t('nellaRiserva') + '</h2><div class="elenco">' + riga(dama) + '</div></section>' : '') +
      '</div></article>';
  };

  VISTE.luogo = function (r) {
    if (r.id === 'torre-salsa') return VISTE.torreSalsa();
    var p = scheda(r.id);
    if (!p) return cercaNovita('luogo-' + r.id) ? VISTE.attesa() : VISTE.nontrovato();
    var paragrafi = txa(p.testo).map(function (s) { return '<p>' + esc(s) + '</p>'; }).join('');
    var consigli = txa(p.consigli);
    var fatti = (p.info || []).map(rigaFatto);
    if (p.posizioneIndicativa) fatti.push(fatto('pin', esc(t('posizioneCirca'))));
    (p.riconoscimenti || []).forEach(function (r) { fatti.push(fatto('star', esc(r))); });
    var c = p.contatti || {};
    var cont = [];
    if (c.tel2) cont.push(fatto('phone', esc(t('altroNumero')), '<a class="vai" href="' + tel(c.tel2) + '">' + telTesto(c.tel2) + '</a>'));
    if (c.cell) cont.push(fatto('phone', esc(t('cellulare')), '<a class="vai" href="' + tel(c.cell) + '">' + telTesto(c.cell) + '</a>'));
    if (c.email) cont.push(fatto('mail', esc(c.email), '<a class="vai" href="mailto:' + esc(c.email) + '">' + t('email') + '</a>'));
    if (c.instagram) cont.push(fatto('instagram', 'Instagram', esterno(c.instagram, t('apri'), 'vai')));
    if (c.facebook) cont.push(fatto('facebook', 'Facebook', esterno(c.facebook, t('apri'), 'vai')));
    var esclusi = [];
    var bottoni = azioniScheda(p, esclusi);
    if (esclusi.indexOf('web') >= 0) cont.unshift(fatto('globe', esc(dominio(c.web)), esterno(c.web, t('sito'), 'vai')));
    var itin = DATA.itinerari.filter(function (it) { return it.tappe.some(function (s) { return s.scheda === p.id; }); });
    var cta = c.whatsapp && p.categorie.indexOf('esperienze') >= 0 ? esterno(urlWhatsApp(c.whatsapp, tx(p.nome)), ic('chat') + esc(t('prenotaWhatsApp')), 'bottone verde largo') : '';
    var galleria = p.galleria && p.galleria.length > 1
      ? slider(p.galleria.map(function (g, k) { return { foto: g.foto, fotoRiserva: k === 0 ? p.fotoRiserva : null, credito: g.credito || p.credito, didascalia: g.didascalia }; }), { classe: 'slider-galleria', contatore: true, base: p })
      : copertina(p, 'dettaglio-foto', true, true);
    var meta = [zonaTesto(p), p.fascia].filter(Boolean).join(' · ');
    var aperto = statoApertura(p);
    return '<article class="dettaglio" style="--c:' + coloreDi(p) + '">' +
      '<div class="dettaglio-testa">' + galleria + bottoniTondi(p) + '</div>' +
      '<div class="dettaglio-corpo">' +
      '<div class="titoli"><span class="etichetta">' + esc(etichettaDi(p)) + (p.stagionale ? ' · ' + t('stagionale') : '') + '</span>' +
      (isPartner(p) ? '<span class="bollino-partner grande">' + ic('star', true) + esc(t('partnerProLoco')) + '</span>' : '') + '<h1>' + esc(tx(p.nome)) + '</h1>' +
      (meta || aperto ? '<p class="meta">' + (meta ? '<span class="meta-zona">' + ic('pin') + esc(meta) + '</span>' : '') + aperto + '</p>' : '') + '</div>' +
      (tx(p.breve) ? '<p class="attacco">' + esc(tx(p.breve)) + '</p>' : '') +
      bottoni + cta +
      (paragrafi ? '<div class="testo">' + paragrafi + '</div>' : '') +
      (p.orari ? '<section class="blocco"><h2>' + t('orari') + '</h2><div class="orari">' + orariHtml(p.orari) + '</div></section>' : '') +
      (fatti.length ? '<section class="blocco"><h2>' + t('infoPratiche') + '</h2><div class="fatti">' + fatti.join('') + '</div></section>' : '') +
      ((p.caratteristiche || []).length ? '<section class="blocco"><h2>' + t('cosaTrovi') + '</h2><div class="chips">' + p.caratteristiche.map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join('') + '</div></section>' : '') +
      (consigli.length ? '<section class="blocco"><h2>' + t('daSapere') + '</h2><ul class="consigli">' + consigli.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></section>' : '') +
      ((p.galleria || []).length > 2 ? '<section class="blocco"><h2>' + t('foto') + ' <small class="conta">' + p.galleria.length + '</small></h2><div class="miniature">' +
        p.galleria.map(function (g, k) {
          return '<button type="button" class="miniatura" data-azione="apri-foto" data-id="' + p.id + '" data-i="' + k + '" aria-label="' + esc(t('foto') + ' ' + (k + 1)) + '">' +
            copertina({ foto: g.foto, categorie: p.categorie, id: p.id, fonte: p.fonte, sotto: p.sotto }, '') + '</button>';
        }).join('') + '</div></section>' : '') +
      (cont.length ? '<section class="blocco"><h2>' + t('contatti') + '</h2><div class="fatti">' + cont.join('') + '</div></section>' : '') +
      (itin.length ? '<section class="blocco"><h2>' + t('negliItinerari') + '</h2><div class="binario">' + itin.map(cardItinerario).join('') + '</div></section>' : '') +
      (p.verificato ? '<p class="verificato">' + esc(t('verificato', { x: meseTesto(p.verificato) })) + '</p>' : '') +
      '</div></article>';
  };

  function apriFoto(id, i) {
    var p = scheda(id);
    if (!p || !p.galleria || !p.galleria.length) return;
    chiudiFoto();
    var n = p.galleria.length;
    var box = document.createElement('div');
    box.className = 'visore';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', tx(p.nome));
    box.innerHTML = '<div class="visore-pista">' + p.galleria.map(function (g) {
      var did = tx(g.didascalia) || '';
      return '<figure><img src="' + esc(g.foto) + '" alt="' + esc(did || tx(p.nome)) + '" decoding="async">' +
        '<span class="visore-errore">' + ic('camera') + esc(t('fotoNonDisponibile')) + '</span>' +
        (did || g.credito ? '<figcaption>' + esc(did) + (g.credito ? '<small>© ' + esc(g.credito) + '</small>' : '') + '</figcaption>' : '') + '</figure>';
    }).join('') + '</div>' +
      '<button type="button" class="visore-chiudi" data-azione="chiudi-foto" aria-label="' + esc(t('chiudi')) + '">' + ic('close') + '</button>' +
      '<span class="visore-n">' + (i + 1) + ' / ' + n + '</span>';
    document.body.appendChild(box);
    document.documentElement.classList.add('bloccato');
    var pista = box.querySelector('.visore-pista');
    var conta = box.querySelector('.visore-n');
    pista.scrollLeft = i * pista.clientWidth;
    pista.addEventListener('scroll', function () {
      conta.textContent = (Math.round(pista.scrollLeft / Math.max(1, pista.clientWidth)) + 1) + ' / ' + n;
    }, { passive: true });
    box.querySelectorAll('img').forEach(function (im) {
      im.addEventListener('error', function () { im.parentNode.classList.add('rotta'); });
    });
    var chiudi = box.querySelector('.visore-chiudi');
    try { chiudi.focus({ preventScroll: true }); } catch (e) { /* niente */ }
  }
  function chiudiFoto() {
    var v = document.querySelector('.visore');
    if (v) v.remove();
    document.documentElement.classList.remove('bloccato');
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') chiudiFoto(); });

  var GIORNI_ORARI = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];
  var NOMI_GIORNI = { it: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'], en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] };
  function oraRoma() {
    try {
      var parti = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var v = {}; parti.forEach(function (x) { v[x.type] = x.value; });
      var g = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(v.weekday);
      return { g: g, m: (+v.hour % 24) * 60 + (+v.minute) };
    } catch (e) { var d = new Date(); return { g: (d.getDay() + 6) % 7, m: d.getHours() * 60 + d.getMinutes() }; }
  }
  function orariHtml(o) {
    var oggi = oraRoma().g, righe = [], i = 0;
    while (i < 7) {
      var v = o[GIORNI_ORARI[i]];
      if (v == null) { i++; continue; }
      var j = i;
      while (j + 1 < 7 && o[GIORNI_ORARI[j + 1]] === v) j++;
      var nome = i === j ? NOMI_GIORNI[lang][i] : NOMI_GIORNI[lang][i] + '–' + NOMI_GIORNI[lang][j];
      var testo = v === 'chiuso' ? t('chiuso') : v.replace(/-/g, '–').replace(/,\s*/g, ' · ');
      righe.push('<div class="orario' + (v === 'chiuso' ? ' chiuso' : '') + (oggi >= i && oggi <= j ? ' oggi' : '') + '"><span>' + esc(nome) + '</span><b>' + esc(testo) + '</b></div>');
      i = j + 1;
    }
    return righe.join('');
  }
  function statoApertura(p) {
    if (!p.orari || p.stagionale || (p.info || []).some(function (i) { return i.tipo === 'stagione'; })) return '';
    var ora = oraRoma(), v = p.orari[GIORNI_ORARI[ora.g]];
    if (v == null) return '';
    var aperto = v !== 'chiuso' && v.split(',').some(function (f) {
      var m = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/.exec(f);
      if (!m) return false;
      var da = +m[1] * 60 + +m[2], a = +m[3] * 60 + +m[4];
      if (a <= da) a += 1440;
      return (ora.m >= da && ora.m < a) || (ora.m + 1440 >= da && ora.m + 1440 < a);
    });
    return '<span class="stato-apertura' + (aperto ? ' aperto' : '') + '">' + (aperto ? (lang === 'it' ? 'Aperto adesso' : 'Open now') : (lang === 'it' ? 'Chiuso adesso' : 'Closed now')) + '</span>';
  }
  var MESI_EN = { gennaio: 'January', febbraio: 'February', marzo: 'March', aprile: 'April', maggio: 'May', giugno: 'June', luglio: 'July', agosto: 'August', settembre: 'September', ottobre: 'October', novembre: 'November', dicembre: 'December' };
  function meseTesto(x) { return lang === 'it' ? x : String(x).replace(/[a-z]+/, function (m) { return MESI_EN[m] || m; }); }

  VISTE.eventi = function () {
    var ev = eventiFuturi();
    var evid = eventoInEvidenza();
    return '<div class="pagina">' + testaPagina(t('eventiTitolo'), t('eventiIntro')) +
      (evid ? '<section class="blocco" aria-label="' + esc(t('inEvidenza')) + '">' + cardEvidenza(evid) + '</section>' : '') +
      '<section class="blocco">' + titoloSezione(t('inProgramma')) + '<div class="elenco">' +
      (ev.length ? ev.map(rigaEvento).join('') : '<p class="vuoto">' + t('nessunEvento') + '</p>') + '</div>' +
      ev.filter(function (e) { return e.programma; }).map(function (e) { return notaProgramma(e, true); }).join('') + '</section>' +
      '<section class="blocco">' + titoloSezione(t('ogniAnno')) + '<div class="elenco">' +
      (DATA.ricorrenze || []).map(function (e) {
        return '<div class="ricorrenza"><span class="quando">' + ic('calendar') + esc(tx(e.quando)) + '</span><h3>' + esc(tx(e.titolo)) + '</h3><p>' + esc(tx(e.testo)) + '</p></div>';
      }).join('') + '</div></section>' +
      '<p class="altro">' + esterno('https://www.visitmontallegrobovomarina.it/news-e-eventi/', ic('globe') + esc(t('notiziePortale')), 'pillola') + '</p></div>';
  };

  VISTE.evento = function (r) {
    var e = evento(r.id);
    if (!e) return cercaNovita('evento-' + r.id) ? VISTE.attesa() : VISTE.nontrovato();
    var finta = { id: e.id, foto: e.foto, categorie: ['esperienze'] };
    var padre = e.gruppo ? evento(e.gruppo) : null;
    var figli = e.programma ? (DATA.eventi || []).filter(function (x) { return x.gruppo === e.id; })
      .sort(function (x, y) { return x.inizio < y.inizio ? -1 : x.inizio > y.inizio ? 1 : 0; }) : [];
    var sch = e.scheda ? scheda(e.scheda) : null;
    var c = e.contatto ? contatto(e.contatto) : null;
    var msg = tx(e.messaggio) || t('messaggioWa', { x: tx(e.titolo) + ' (' + dataEvento(e) + ')' });
    var az = [];
    if (c && c.whatsapp) az.push(azione('https://wa.me/' + c.whatsapp + '?text=' + encodeURIComponent(msg), 'chat', t('whatsapp'), { esterno: true, classe: 'verde' }));
    if (c && c.tel) az.push(azione(tel(c.tel), 'phone', t('chiama'), { classe: c.whatsapp ? '' : 'primaria' }));
    if (e.mappe) az.push(azione(urlIndicazioni(e), 'directions', t('indicazioni'), { esterno: true }));
    if (!c) az.push(azione('#info', 'lifebuoy', t('infoTitolo')));
    az.push(azione('', 'share', t('condividi'), { data: 'data-azione="condividi-evento" data-id="' + e.id + '"' }));
    return '<article class="dettaglio" style="--c:var(--ambra)">' +
      '<div class="dettaglio-testa">' + copertina(finta, 'dettaglio-foto evento-foto', false, true) +
      '<button type="button" class="tasto-tondo indietro" data-azione="indietro" aria-label="' + t('indietro') + '">' + ic('back') + '</button>' +
      '<div class="data-grande" aria-hidden="true"><b>' + partiData(e.inizio).g + '</b><span>' + MESI[lang][partiData(e.inizio).m] + '</span></div></div>' +
      '<div class="dettaglio-corpo"><div class="titoli"><span class="etichetta">' + esc(tx(e.occhiello) || t('eventi')) + '</span><h1>' + esc(tx(e.titolo)) + '</h1>' + etichettaStato(e) + '</div>' +
      '<div class="fatti">' +
      fatto('calendar', esc(dataEvento(e, true))) +
      fatto('pin', esc(tx(e.luogo)), sch ? '<a class="vai" href="#luogo-' + sch.id + '">' + t('apri') + '</a>' : '') +
      (e.info || []).map(rigaFatto).join('') +
      (padre ? fatto('star', esc(t('parteDi') + ' ' + tx(padre.titolo)), '<a class="vai" href="#evento-' + padre.id + '">' + t('apri') + '</a>') : '') +
      (e.organizza ? fatto('info', t('organizza') + ': ' + esc(e.organizza)) : '') +
      '</div>' +
      '<div class="testo"><p>' + esc(tx(e.testo)) + '</p></div>' +
      (figli.length ? '<section class="blocco programma"><h2>' + esc(t('programma')) + '</h2><div class="elenco">' + figli.map(rigaEvento).join('') + '</div>' + notaProgramma(e) + '</section>' : '') +
      '<div class="azioni">' + az.join('') + '</div>' +
      '</div></article>';
  };

  VISTE.itinerari = function (r) {
    var filtro = r && r.filtro;
    var tipi = t('tipiItinerario') || {};
    var presenti = Object.keys(tipi).filter(function (k) { return DATA.itinerari.some(function (it) { return it.tipo === k; }); });
    var lista = filtro ? DATA.itinerari.filter(function (it) { return it.tipo === filtro; }) : DATA.itinerari;
    var chip = function (id, nome, n) {
      return '<a class="filtro" href="#itinerari' + (id ? '-' + id : '') + '" style="--c:var(--corallo)"' + ((filtro || '') === id ? ' aria-current="true"' : '') + '>' + esc(nome) + ' <small>' + n + '</small></a>';
    };
    // i filtri servono solo quando gli itinerari sono tanti
    var chips = presenti.length > 1 && DATA.itinerari.length > 4 ? '<nav class="filtri" aria-label="Filtri">' + chip('', t('tuttiFiltro'), DATA.itinerari.length) + presenti.map(function (k) {
      return chip(k, tipi[k], DATA.itinerari.filter(function (it) { return it.tipo === k; }).length);
    }).join('') + '</nav>' : '';
    return '<div class="pagina sotto">' + barra(t('itinerari')) + testaPagina(t('itinerari'), '') + chips +
      '<div class="elenco grande">' + lista.map(function (it) {
        return '<a class="card-grande" href="#itinerario-' + it.id + '">' + fotoItinerario(it, 'card-grande-foto') +
          '<div class="card-grande-testo"><span class="etichetta" style="--c:var(--corallo)">' + esc(etichettaItinerario(it, true)) + '</span><h3>' + esc(tx(it.titolo)) + '</h3><p>' + esc(tx(it.intro)) + '</p>' +
          (it.dati ? '<div class="chips"><span class="chip">' + ic('route') + esc(tx(it.dati).split(' · ')[0]) + '</span></div>' : '') + '</div></a>';
      }).join('') + '</div></div>';
  };

  VISTE.itinerario = function (r) {
    var it = DATA.itinerari.filter(function (x) { return x.id === r.id; })[0];
    if (!it) return VISTE.nontrovato();
    return '<article class="dettaglio" style="--c:var(--corallo)">' +
      '<div class="dettaglio-testa">' + fotoItinerario(it, 'dettaglio-foto', true) +
      '<button type="button" class="tasto-tondo indietro" data-azione="indietro" aria-label="' + t('indietro') + '">' + ic('back') + '</button></div>' +
      '<div class="dettaglio-corpo"><div class="titoli"><span class="etichetta">' + esc(etichettaItinerario(it, true)) + '</span><h1>' + esc(tx(it.titolo)) + '</h1></div>' +
      '<p class="attacco">' + esc(tx(it.intro)) + '</p>' +
      (it.dati ? '<div class="fatti">' + fatto('route', esc(tx(it.dati))) + '</div>' : '') +
      (it.traccia && /^https:\/\//.test(it.traccia.url || '') ? '<div class="azioni">' + azione(it.traccia.url, 'route', tx(it.traccia) || t('tracciaGps'), { esterno: true, classe: 'primaria' }) + '</div>' : '') +
      '<ol class="tappe">' + it.tappe.map(function (s) {
        var p = scheda(s.scheda);
        return '<li class="tappa"><div class="tappa-testo"><p>' + esc(s[lang] || s.it) + '</p>' +
          (p ? '<a class="tappa-link" href="#luogo-' + p.id + '">' + copertina(p, 'tappa-foto') + '<span>' + esc(tx(p.nome)) + '</span>' + ic('chevron', false, 'freccia') + '</a>' : '') + '</div></li>';
      }).join('') + '</ol>' +
      (txa(it.consigli).length ? '<section class="blocco"><h2>' + t('daSapere') + '</h2><ul class="consigli">' + txa(it.consigli).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></section>' : '') +
      '</div></article>';
  };

  VISTE.trasporti = function () {
    return '<div class="pagina sotto">' + barra(t('comeArrivare')) + testaPagina(t('comeArrivare'), '') +
      '<div class="elenco">' + (DATA.trasporti || []).map(function (m) {
        var voci = txaVoci(m.voci);
        var az = (m.azioni || []).map(function (a) {
          var et = tx(a.etichetta);
          if (a.tipo === 'tel') return '<a class="pillola" href="' + tel(a.valore) + '">' + ic('phone') + esc(et) + '</a>';
          if (a.tipo === 'web') return esterno(a.valore, ic('globe') + esc(et), 'pillola');
          if (a.tipo === 'scheda') return '<a class="pillola" href="#luogo-' + esc(a.valore) + '">' + ic('shuttle') + esc(et) + '</a>';
          return '';
        }).join('');
        return '<section class="trasporto"><div class="trasporto-testa"><span class="bolla" style="--c:var(--mare)">' + ic(m.icona) + '</span><h2>' + esc(tx(m.titolo)) + '</h2></div>' +
          '<p>' + esc(tx(m.testo)) + '</p>' + (voci.length ? '<ul class="consigli">' + voci.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul>' : '') +
          (az ? '<div class="voce-azioni">' + az + '</div>' : '') + '</section>';
      }).join('') + '</div></div>';
  };
  function txaVoci(voci) { return (voci || []).map(function (v) { return v[lang] || v.it; }); }

  VISTE.info = function () {
    var gruppi = DATA.contatti.map(function (g) {
      if (g.emergenza) {
        return '<section class="gruppo"><h2>' + esc(tx(g.gruppo)) + '</h2><div class="emergenze">' + g.voci.map(function (v) {
          return '<a class="emergenza" href="' + tel(v.tel) + '"><b>' + esc(v.tel) + '</b><span>' + esc(tx(v.nome)) + '</span></a>';
        }).join('') + '</div></section>';
      }
      return '<section class="gruppo"><h2>' + esc(tx(g.gruppo)) + '</h2><div class="voci">' + g.voci.map(function (v) {
        var az = [];
        if (v.tel) az.push('<a class="pillola" href="' + tel(v.tel) + '">' + ic('phone') + telTesto(v.tel) + '</a>');
        if (v.whatsapp) az.push(esterno(urlWhatsApp(v.whatsapp), ic('chat') + 'WhatsApp', 'pillola'));
        if (v.email) az.push('<a class="pillola" href="mailto:' + esc(v.email) + '">' + ic('mail') + esc(v.email) + '</a>');
        if (v.web) az.push(esterno(v.web, ic('globe') + t('sito'), 'pillola'));
        if (v.mappe) az.push(esterno(urlIndicazioni({ mappe: v.mappe }), ic('directions') + t('indicazioni'), 'pillola'));
        return '<div class="voce"><div class="voce-nome">' + esc(tx(v.nome)) + '</div>' + (v.nota ? '<div class="voce-nota">' + esc(tx(v.nota)) + '</div>' : '') +
          (az.length ? '<div class="voce-azioni">' + az.join('') + '</div>' : '') + '</div>';
      }).join('') + '</div></section>';
    });
    var store_ = CFG.APP_STORE_URL || CFG.PLAY_STORE_URL || CFG.WEB_URL;
    var link = function (href, icona, nome) { return '<a class="voce voce-link" href="' + href + '">' + ic(icona) + '<span class="voce-nome">' + esc(nome) + '</span>' + ic('chevron', false, 'freccia') + '</a>'; };
    var pratiche = '<section class="gruppo"><h2>' + t('infoPraticheTitolo') + '</h2><div class="voci">' +
      link('#servizi', 'shop', t('serviziTitolo')) + link('#trasporti', 'bus', t('comeArrivare')) + link('#meteo', 'sun', t('meteo')) +
      link('#dormire', 'bed', t('dormireTitolo')) + link('#mangiare', 'fork', t('mangiareTitolo')) + link('#sapori', 'basket', t('saporiTitolo')) + link('#cerca', 'search', t('cercaTitolo')) +
      '</div></section>';
    gruppi.splice(1, 0, pratiche);
    gruppi.splice(2, 0, '<section class="gruppo"><h2>' + esc(t('proLoco')) + '</h2><div class="voci">' +
      link('#socio', 'people', t('diventaSocio')) + link('#partner', 'star', t('diventaPartner')) + '</div></section>');
    return '<div class="pagina">' + testaPagina(t('infoTitolo'), t('infoIntro')) + gruppi.join('') +
      '<section class="gruppo"><h2>' + t('app') + '</h2><div class="voci">' +
      link('#preferiti', 'heart', t('preferiti') + ' (' + preferiti.length + ')') +
      '<div class="voce voce-riga"><span class="voce-nome">' + t('lingua') + '</span>' + linguaToggle() + '</div>' +
      voceNotifiche() +
      (installabile() ? '<button type="button" class="voce voce-link" data-azione="installa">' + ic('home') + '<span class="voce-nome">' + t('installaTitolo') + '</span>' + ic('chevron', false, 'freccia') + '</button>' : '') +
      (store_ ? '<button type="button" class="voce voce-link" data-azione="condividi-app">' + ic('share') + '<span class="voce-nome">' + t('condividiApp') + '</span>' + ic('chevron', false, 'freccia') + '</button>' : '') +
      '<div class="voce"><div class="voce-azioni">' + esterno(CFG.PORTALE || 'https://visitmontallegrobovomarina.it', ic('globe') + t('portale'), 'pillola') +
      '<a class="pillola" href="' + esc(CFG.PRIVACY || 'privacy.html') + '" target="_blank" rel="noopener">' + ic('info') + t('privacy') + '</a></div></div>' +
      '</div></section>' +
      '<section class="gruppo"><h2>' + t('crediti') + '</h2><ul class="crediti-elenco">' + (DATA.crediti || []).map(function (c) {
        return '<li>' + (c.link ? esterno(c.link, esc(c[lang] || c.it)) : esc(c[lang] || c.it)) + '</li>';
      }).join('') + '<li>' + t('creditiMappa') + (CFG.CARTO_KEY ? ', © CARTO' : '') + '</li><li>' + t('creditiMeteo') + '</li></ul></section>' +
      '<footer class="crediti"><span>' + t('progetto') + '</span>' + firmaApp() + '<span>' + t('versione') + ' ' + esc(CFG.VERSIONE || '1.0') + '</span></footer></div>';
  };

  VISTE.preferiti = function () {
    var lista = preferiti.map(scheda).filter(Boolean);
    return '<div class="pagina sotto">' + barra(t('preferiti')) + testaPagina(t('preferiti'), t('preferitiIntro')) +
      '<div class="elenco">' + (lista.length ? lista.map(function (p) { return riga(p); }).join('') : '<p class="vuoto">' + t('nessunPreferito') + '</p>') + '</div></div>';
  };

  VISTE.meteo = function () {
    return '<div class="pagina sotto">' + barra(t('meteo')) + testaPagina(t('meteoTitolo'), '') +
      '<div id="meteo-pieno"><div class="meteo-attesa"></div></div>' +
      '<footer class="crediti"><span>' + t('creditiMeteo') + '</span></footer></div>';
  };

  VISTE.mappa = function () {
    var cats = ['spiagge', 'natura', 'cultura', 'dintorni', 'esperienze', 'mangiare', 'dormire', 'sapori', 'servizi'];
    var chip = function (id, nome, colore) {
      return '<button type="button" class="filtro" data-azione="filtro-mappa" data-val="' + id + '" style="--c:' + colore + '" aria-pressed="' + (filtroMappa === id) + '">' + esc(nome) + '</button>';
    };
    return '<div class="mappa-pagina">' +
      '<div id="mappa" aria-label="' + t('mappa') + '"></div>' +
      '<div class="mappa-filtri"><div class="filtri">' + chip('tutto', t('tutto'), 'var(--blu)') +
      cats.map(categoria).filter(function (c) { return c && DATA.schede.some(function (p) { return p.lat != null && p.categorie.indexOf(c.id) >= 0; }); })
        .map(function (c) { return chip(c.id, tx(c.nome), COLORI[c.colore]); }).join('') + '</div></div>' +
      '<div id="mappa-avviso" class="mappa-avviso" hidden></div>' +
      '<button type="button" class="tasto-posizione" data-azione="posizione" aria-label="' + t('posizione') + '">' + ic('locate') + '</button>' +
      '<div id="foglio"></div></div>';
  };

  VISTE.attesa = function () { return '<div class="caricamento">' + marchio() + '</div>'; };

  VISTE.nontrovato = function () {
    return '<div class="pagina sotto">' + barra('') + testaPagina(t('nonTrovato'), '') + '<p><a class="pillola" href="#home">' + t('torna') + '</a></p></div>';
  };

  /* ---------- mappa ---------- */
  var mappa = null, livelloSegnaposti = null, segnaIo = null, filtroMappa = 'tutto', fuocoMappa = null;
  function chiudiMappa() { if (mappa) { try { mappa.stop(); mappa.remove(); } catch (e) { /* mappa già chiusa */ } mappa = null; livelloSegnaposti = null; segnaIo = null; } }
  function spillo(colore, icona) {
    return L.divIcon({
      className: '', iconSize: [36, 36], iconAnchor: [18, 36],
      html: '<div class="spillo" style="--c:' + colore + '">' + ic(icona) + '</div>'
    });
  }
  function apriMappa() {
    if (!window.L) return;
    var centro = DATA.paese || { lat: 37.39385, lng: 13.35005 };
    mappa = L.map('mappa', { zoomControl: false, attributionControl: true, tap: true }).setView([centro.lat, centro.lng], 12);
    var url, attrib;
    if (CFG.CARTO_KEY) {
      url = 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=' + encodeURIComponent(CFG.CARTO_KEY);
      attrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attribution">CARTO</a>';
    } else {
      url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      attrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    }
    var caricate = 0, errori = 0;
    L.tileLayer(url, { maxZoom: 18, attribution: attrib, crossOrigin: true })
      .on('tileload', function () { caricate++; })
      .on('tileerror', function () {
        errori++;
        if (errori >= 4 && caricate === 0) {
          var av = document.getElementById('mappa-avviso');
          if (av) { av.textContent = t('mappaSenzaSfondo'); av.hidden = false; }
        }
      }).addTo(mappa);
    L.control.zoom({ position: 'bottomleft' }).addTo(mappa);
    disegnaSegnaposti();
    if (fuocoMappa) {
      var p = scheda(fuocoMappa);
      fuocoMappa = null;
      if (p && p.lat != null) { mappa.setView([p.lat, p.lng], 14); mostraFoglio(p); }
    }
    setTimeout(function () { if (mappa) mappa.invalidateSize(); }, 60);
    if (miaPos) mostraMiaPosizione(false);
  }
  function disegnaSegnaposti() {
    if (!mappa) return;
    if (livelloSegnaposti) livelloSegnaposti.remove();
    livelloSegnaposti = L.layerGroup().addTo(mappa);
    var vicini = [];
    var paese = DATA.paese;
    if (paese && (filtroMappa === 'tutto' || filtroMappa === 'cultura')) {
      L.marker([paese.lat, paese.lng], { icon: L.divIcon({ className: '', iconSize: [14, 14], iconAnchor: [7, 7], html: '<div class="punto-paese"></div>' }), title: 'Montallegro', keyboard: false, zIndexOffset: -100 })
        .bindTooltip('Montallegro', { permanent: true, direction: 'left', offset: [-8, 0], className: 'etichetta-mappa' })
        .addTo(livelloSegnaposti);
      vicini.push([paese.lat, paese.lng]);
    }
    var visti = {};
    DATA.schede.forEach(function (p) {
      if (p.lat == null || p.id === 'montallegro') return;
      if (filtroMappa !== 'tutto' && p.categorie.indexOf(filtroMappa) < 0) return;
      var chiave = p.lat.toFixed(4) + ',' + p.lng.toFixed(4);
      var n = visti[chiave] = (visti[chiave] || 0) + 1;
      L.marker([p.lat + (n - 1) * 0.00016, p.lng + (n - 1) * 0.00026], { icon: spillo(coloreDi(p), iconaDi(p)), title: tx(p.nome), keyboard: true })
        .on('click', function () { mostraFoglio(p); })
        .addTo(livelloSegnaposti);
      if (filtroMappa !== 'tutto' || p.categorie.indexOf('dintorni') < 0) vicini.push([p.lat, p.lng]);
    });
    if (vicini.length > 1) mappa.fitBounds(vicini, { padding: [56, 56], maxZoom: 14, animate: false });
    else if (vicini.length === 1) mappa.setView(vicini[0], 13, { animate: false });
  }
  function mostraFoglio(p) {
    var el = document.getElementById('foglio');
    if (!el) return;
    var d = distanzaTesto(p);
    el.innerHTML = '<div class="foglio entra">' + copertina(p, 'foglio-foto') +
      '<div class="foglio-testo"><span class="etichetta" style="--c:' + coloreDi(p) + '">' + esc(etichettaDi(p)) + '</span><h3>' + esc(tx(p.nome)) + '</h3>' +
      (d || zonaTesto(p) ? '<p>' + esc(d || [zonaTesto(p), p.fascia].filter(Boolean).join(' · ')) + '</p>' : '') +
      '<div class="collegamenti"><a class="pillola piena" href="#luogo-' + p.id + '">' + t('apri') + '</a>' + esterno(urlIndicazioni(p), ic('directions') + t('indicazioni'), 'pillola') + '</div></div>' +
      '<button type="button" class="chiudi" data-azione="chiudi-foglio" aria-label="Chiudi">' + ic('close') + '</button></div>';
  }
  function mostraMiaPosizione(centra) {
    if (!mappa || !miaPos) return;
    if (segnaIo) segnaIo.remove();
    segnaIo = L.marker([miaPos.lat, miaPos.lng], { icon: L.divIcon({ className: '', iconSize: [18, 18], iconAnchor: [9, 9], html: '<div class="spillo-io"></div>' }), interactive: false }).addTo(mappa);
    if (centra) mappa.setView([miaPos.lat, miaPos.lng], Math.max(mappa.getZoom(), 13));
  }

  /* ---------- meteo (Open-Meteo, niente chiave) ---------- */
  function descrizioneMeteo(code, giorno) {
    var it = lang === 'it';
    if (code === 0) return { i: giorno === 0 ? 'moon' : 'sun', d: it ? 'Sereno' : 'Clear' };
    if (code <= 2) return { i: giorno === 0 ? 'cloud' : 'cloudsun', d: it ? 'Poco nuvoloso' : 'Partly cloudy' };
    if (code === 3) return { i: 'cloud', d: it ? 'Nuvoloso' : 'Cloudy' };
    if (code === 45 || code === 48) return { i: 'fog', d: it ? 'Nebbia' : 'Fog' };
    if (code >= 95) return { i: 'storm', d: it ? 'Temporale' : 'Thunderstorm' };
    if (code >= 51 && code <= 57) return { i: 'rain', d: it ? 'Pioggerella' : 'Drizzle' };
    if (code >= 71 && code <= 77) return { i: 'cloud', d: it ? 'Neve' : 'Snow' };
    if (code >= 80 && code <= 82) return { i: 'rain', d: it ? 'Rovesci' : 'Showers' };
    return { i: 'rain', d: it ? 'Pioggia' : 'Rain' };
  }
  function caricaMeteo() {
    var cache = store.get('meteo', null);
    if (cache && Date.now() - cache.t < 30 * 60 * 1000) return Promise.resolve(cache.d);
    var u = 'https://api.open-meteo.com/v1/forecast?latitude=37.39&longitude=13.35' +
      '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=Europe%2FRome&forecast_days=7';
    var m = 'https://marine-api.open-meteo.com/v1/marine?latitude=37.37&longitude=13.30&current=wave_height,sea_surface_temperature&daily=wave_height_max&timezone=Europe%2FRome&forecast_days=7';
    var aria = fetchJSON(u, 7000);
    var mare = fetchJSON(m, 7000).catch(function () { return null; });
    return Promise.all([aria, mare]).then(function (r) {
      var a = r[0].current || {}, b = r[1] && r[1].current ? r[1].current : {};
      var g = r[0].daily || {};
      var d = {
        temp: a.temperature_2m, perc: a.apparent_temperature, umid: a.relative_humidity_2m, code: a.weather_code,
        vento: a.wind_speed_10m, dir: a.wind_direction_10m, giorno: a.is_day,
        onda: typeof b.wave_height === 'number' ? b.wave_height : null,
        acqua: typeof b.sea_surface_temperature === 'number' ? b.sea_surface_temperature : null,
        giorni: (g.time || []).map(function (data, i) {
          return {
            data: data, code: g.weather_code[i], max: g.temperature_2m_max[i], min: g.temperature_2m_min[i],
            pioggia: g.precipitation_probability_max ? g.precipitation_probability_max[i] : null,
            alba: g.sunrise ? g.sunrise[i] : null, tramonto: g.sunset ? g.sunset[i] : null,
            onde: r[1] && r[1].daily && r[1].daily.wave_height_max ? r[1].daily.wave_height_max[i] : null
          };
        })
      };
      if (typeof d.temp !== 'number') throw new Error('meteo vuoto');
      store.set('meteo', { t: Date.now(), d: d });
      return d;
    }).catch(function () { return cache ? cache.d : null; });
  }
  function num(x, dec) { return lang === 'it' ? x.toFixed(dec).replace('.', ',') : x.toFixed(dec); }
  function ventoTesto(d) { return typeof d.dir === 'number' ? VENTI[lang][Math.round(d.dir / 45) % 8] : ''; }
  function mostraMeteoBreve() {
    caricaMeteo().then(function (d) {
      var el = document.getElementById('meteo-breve');
      if (!el || !d) return;
      var w = descrizioneMeteo(d.code, d.giorno);
      var oggi = d.giorni && d.giorni[0];
      el.innerHTML = '<a class="meteo-breve" href="#meteo" aria-label="' + t('meteoTitolo') + '"><span class="meteo-icona">' + ic(w.i) + '</span>' +
        '<span class="meteo-temp">' + Math.round(d.temp) + '°</span><span class="meteo-descr"><b>' + esc(w.d) + '</b><small>Montallegro · Bovo Marina</small></span>' +
        '<span class="meteo-dati">' + (d.acqua != null ? '<span>' + ic('wave') + Math.round(d.acqua) + '°</span>' : '') +
        (typeof d.vento === 'number' ? '<span>' + ic('wind') + Math.round(d.vento) + ' km/h</span>' : '') +
        (oggi && oggi.tramonto ? '<span>' + ic('sunset') + esc(String(oggi.tramonto).slice(11, 16)) + '</span>' : '') + '</span></a>';
    });
  }
  function mostraMeteoPieno() {
    caricaMeteo().then(function (d) {
      var el = document.getElementById('meteo-pieno');
      if (!el) return;
      if (!d) { el.innerHTML = '<p class="vuoto">' + t('meteoNo') + '</p>'; return; }
      var w = descrizioneMeteo(d.code, d.giorno);
      var oggi = d.giorni && d.giorni[0];
      var giorni = (d.giorni || []).map(function (g, i) {
        var dt = new Date(g.data + 'T12:00:00');
        var nome = i === 0 ? t('oggi') : i === 1 ? t('domani') : GIORNI[lang][dt.getDay()] + ' ' + dt.getDate();
        var wd = descrizioneMeteo(g.code, 1);
        return '<li><span class="g-nome">' + esc(nome) + '</span><span class="g-icona" title="' + esc(wd.d) + '">' + ic(wd.i) + '</span>' +
          '<span class="g-pioggia">' + (g.pioggia != null ? ic('drop') + g.pioggia + '%' : '') + '</span>' +
          '<span class="g-temp"><b>' + Math.round(g.max) + '°</b> ' + Math.round(g.min) + '°</span></li>';
      }).join('');
      el.innerHTML = '<section class="meteo-card"><div class="meteo-ora"><span class="meteo-icona grande">' + ic(w.i) + '</span>' +
        '<div><span class="meteo-temp grande">' + Math.round(d.temp) + '°</span><b>' + esc(w.d) + '</b></div></div>' +
        '<div class="meteo-griglia">' +
        (typeof d.perc === 'number' ? '<div>' + ic('thermo') + '<span>' + t('percepita') + '</span><b>' + Math.round(d.perc) + '°</b></div>' : '') +
        (typeof d.vento === 'number' ? '<div>' + ic('wind') + '<span>' + t('vento') + '</span><b>' + Math.round(d.vento) + ' km/h ' + esc(ventoTesto(d)) + '</b></div>' : '') +
        (typeof d.umid === 'number' ? '<div>' + ic('drop') + '<span>' + t('umidita') + '</span><b>' + Math.round(d.umid) + '%</b></div>' : '') +
        (oggi && oggi.tramonto ? '<div>' + ic('sunset') + '<span>' + t('tramonto') + '</span><b>' + esc(String(oggi.tramonto).slice(11, 16)) + '</b></div>' : '') +
        '</div></section>' +
        ((d.onda != null || d.acqua != null) ? '<section class="meteo-card mare"><h2>' + t('ilMare') + '</h2><div class="meteo-griglia">' +
          (d.acqua != null ? '<div>' + ic('thermo') + '<span>' + t('acqua') + '</span><b>' + Math.round(d.acqua) + '°</b></div>' : '') +
          (d.onda != null ? '<div>' + ic('wave') + '<span>' + t('onde') + '</span><b>' + num(d.onda, 1) + ' m</b></div>' : '') +
          '</div></section>' : '') +
        '<section class="meteo-card"><h2>' + t('previsioni') + '</h2><ul class="giorni">' + giorni + '</ul></section>';
    });
  }

  /* ---------- barra di stato (testo chiaro sopra le foto) ---------- */
  var statoScuro = null;
  function barraStato(scuro) {
    if (!isNative || !P.StatusBar || statoScuro === scuro) return;
    statoScuro = scuro;
    try { P.StatusBar.setStyle({ style: scuro ? 'DARK' : 'LIGHT' }).catch(function () {}); } catch (e) { /* niente */ }
  }

  /* ---------- navigazione ---------- */
  var SEZIONI_HOME = ['spiagge', 'esperienze', 'mangiare', 'dormire', 'sapori', 'servizi', 'cerca', 'itinerari', 'trasporti', 'meteo', 'torre-salsa', 'socio', 'partner'];
  var SEZIONI_INFO = ['trasporti', 'meteo', 'mangiare', 'dormire', 'sapori', 'servizi', 'cerca', 'socio', 'partner'];
  var FILTRI_VISIT = ['natura', 'cultura', 'dintorni'];
  var ultimoTab = 'home';
  function leggiRotta() {
    var h = decodeURIComponent((location.hash || '').replace(/^#\/?/, '')).trim();
    if (!h || h === 'home') return { tab: 'home', vista: 'home' };
    if (h === 'visit' || h === 'esplora') return { tab: 'visit', vista: 'visit', filtro: 'tutto' };
    if (FILTRI_VISIT.indexOf(h) >= 0) return { tab: 'visit', vista: 'visit', filtro: h };
    if (h.indexOf('visit-') === 0 && VISIT_CAT.indexOf(h.slice(6)) >= 0) return { tab: 'visit', vista: 'visit', filtro: h.slice(6) };
    if (h === 'torre-salsa' || h === 'luogo-torre-salsa') return { tab: ultimoTab === 'visit' || ultimoTab === 'mappa' ? ultimoTab : 'home', vista: 'torreSalsa' };
    var el = /^(mangiare|dormire|sapori|servizi)-([a-z]+)$/.exec(h);
    if (el) return { tab: ultimoTab === 'info' ? 'info' : 'home', vista: el[1], filtro: el[2] };
    var fi = /^itinerari-([a-z]+)$/.exec(h);
    if (fi) return { tab: ultimoTab === 'visit' ? 'visit' : 'home', vista: 'itinerari', filtro: fi[1] };
    if (SEZIONI_HOME.indexOf(h) >= 0) {
      var tabSez = SEZIONI_INFO.indexOf(h) >= 0 && ultimoTab === 'info' ? 'info' : 'home';
      return { tab: tabSez, vista: h };
    }
    if (h === 'mappa' || h === 'eventi' || h === 'info' || h === 'preferiti') {
      return { tab: { mappa: 'mappa', eventi: 'eventi', info: 'info', preferiti: 'info' }[h], vista: h };
    }
    if (h.indexOf('luogo-') === 0) return { tab: ultimoTab, vista: 'luogo', id: h.slice(6) };
    if (h.indexOf('evento-') === 0) return { tab: 'eventi', vista: 'evento', id: h.slice(7) };
    if (h.indexOf('itinerario-') === 0) return { tab: ultimoTab === 'visit' ? 'visit' : 'home', vista: 'itinerario', id: h.slice(11) };
    return { tab: 'home', vista: 'nontrovato' };
  }
  var pila = [];
  var scorrimenti = {};
  var hashCorrente = location.hash;
  var rotta = null;

  function disegna(tornando) {
    if (!DATA) return;
    chiudiFoto();
    rotta = leggiRotta();
    ultimoTab = rotta.tab;
    var suMappa = rotta.vista === 'mappa';
    document.body.classList.toggle('su-mappa', suMappa);
    if (!suMappa) chiudiMappa();
    view.innerHTML = (VISTE[rotta.vista] || VISTE.nontrovato)(rotta);
    var primo = view.firstElementChild;
    if (primo) primo.classList.add('entra');
    aggiornaTabbar(rotta.tab);
    barraStato(!!(primo && primo.classList.contains('dettaglio')));
    if (rotta.vista === 'home') mostraMeteoBreve();
    if (rotta.vista === 'meteo') mostraMeteoPieno();
    if (rotta.vista === 'cerca') {
      aggiornaRicerca();
      var campo = document.getElementById('cerca-campo');
      if (campo && !tornando) { try { campo.focus({ preventScroll: true }); } catch (e) { campo.focus(); } }
    }
    attivaSlider();
    if (suMappa) apriMappa();
    var y = tornando && scorrimenti[location.hash] ? scorrimenti[location.hash] : 0;
    window.scrollTo(0, y);
  }

  function aggiornaTabbar(tab) {
    var voci = [['home', 'home', 'tabHome'], ['visit', 'compass', 'tabVisit'], ['mappa', 'map', 'tabMappa'], ['eventi', 'calendar', 'tabEventi'], ['info', 'info', 'tabInfo']];
    var href = { home: '#home', visit: '#visit', mappa: '#mappa', eventi: '#eventi', info: '#info' };
    tabbar.innerHTML = voci.map(function (v) {
      return '<a class="tab" href="' + href[v[0]] + '"' + (tab === v[0] ? ' aria-current="page"' : '') + '>' + ic(v[1]) + '<span>' + t(v[2]) + '</span></a>';
    }).join('');
  }

  function indietro() {
    if (pila.length > 1) { history.back(); return; }
    var r = rotta || leggiRotta();
    var padre = { luogo: r.tab === 'home' ? 'home' : r.tab, evento: 'eventi', itinerario: 'itinerari', preferiti: 'info', torreSalsa: 'home' }[r.vista] || (r.tab === 'info' ? 'info' : 'home');
    location.hash = padre === 'visit' ? 'visit' : padre;
  }

  window.addEventListener('hashchange', function () {
    scorrimenti[hashCorrente] = window.scrollY;
    var nuovo = location.hash;
    var tornando = pila.length > 1 && pila[pila.length - 2] === nuovo;
    if (tornando) pila.pop(); else pila.push(nuovo);
    hashCorrente = nuovo;
    disegna(tornando);
  });

  /* ---------- tocchi ---------- */
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-azione]');
    if (!el) {
      var tab = ev.target.closest('.tab');
      if (tab && tab.getAttribute('href') === location.hash) { ev.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      return;
    }
    var az = el.getAttribute('data-azione');
    var id = el.getAttribute('data-id');
    if (az === 'lingua') {
      lang = el.getAttribute('data-val');
      store.set('lang', lang);
      document.documentElement.lang = lang;
      if (statoNotifiche() === 'attive') caricaOneSignal().then(function (OS) { OS.User.addTag('lingua', lang); }).catch(function () { /* niente */ });
      var y0 = window.scrollY;
      disegna(false);
      window.scrollTo(0, y0);
    } else if (az === 'preferito') {
      cambiaPref(id);
      var pref = isPref(id);
      el.setAttribute('aria-pressed', String(pref));
      el.setAttribute('aria-label', pref ? t('salvato') : t('salva'));
      el.innerHTML = ic('heart', pref);
    } else if (az === 'condividi') {
      var p = scheda(id);
      if (p) condividi(tx(p.nome), tx(p.breve) + '\n' + t('scoprila'), urlCondivisione(p));
    } else if (az === 'condividi-evento') {
      var e = (DATA.eventi || []).filter(function (x) { return x.id === id; })[0];
      if (e) condividi(tx(e.titolo), dataEvento(e, true) + (e.daConfermare ? ' (' + t('daConfermare').toLowerCase() + ')' : '') + ' · ' + tx(e.luogo) + '\n' + tx(e.testo), urlEvento(e));
    } else if (az === 'notifiche-attiva') {
      attivaNotifiche();
    } else if (az === 'notifiche-chiudi') {
      try { localStorage.setItem('vm-notifiche-chiusa', String(Date.now())); } catch (e2) { /* niente */ }
      aggiornaInstalla();
    } else if (az === 'notifiche-cambia') {
      var sn = statoNotifiche();
      if (sn === 'attive') spegniNotifiche(); else if (sn === 'bloccate') toast(t('notificheNo'), 7000); else attivaNotifiche();
    } else if (az === 'installa') {
      installa();
    } else if (az === 'installa-chiudi') {
      chiudiInstalla();
      aggiornaInstalla();
    } else if (az === 'condividi-app') {
      condividi(NOME_APP, t('scoprila'), [CFG.APP_STORE_URL, CFG.PLAY_STORE_URL].filter(Boolean).join('\n') || CFG.LINK_APP || CFG.WEB_URL);
    } else if (az === 'indietro') {
      indietro();
    } else if (az === 'vedi-mappa') {
      fuocoMappa = id;
      filtroMappa = 'tutto';
      if (location.hash === '#mappa') disegna(false); else location.hash = 'mappa';
    } else if (az === 'filtro-mappa') {
      filtroMappa = el.getAttribute('data-val');
      document.querySelectorAll('[data-azione="filtro-mappa"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === el)); });
      var f = document.getElementById('foglio');
      if (f) f.innerHTML = '';
      disegnaSegnaposti();
    } else if (az === 'suggerisci') {
      ricerca = el.getAttribute('data-val');
      var campo = document.getElementById('cerca-campo');
      if (campo) campo.value = ricerca;
      aggiornaRicerca();
    } else if (az === 'apri-foto') {
      apriFoto(el.getAttribute('data-id'), +el.getAttribute('data-i') || 0);
    } else if (az === 'chiudi-foto') {
      chiudiFoto();
    } else if (az === 'chiudi-foglio') {
      document.getElementById('foglio').innerHTML = '';
    } else if (az === 'posizione') {
      chiediPosizione().then(function () { mostraMiaPosizione(true); }, function () { toast(t('posizioneNo')); });
    }
  });

  /* ---------- app installata: scorciatoie dell'icona, link e tasto indietro ---------- */
  function vaiDaUrl(url) {
    var m = /^(?:visitmontallegro|montallegroinfoapp):\/\/(.*)$/i.exec(url || '');
    if (!m) return;
    var parti = m[1].replace(/^\/+|\/+$/g, '').split(/[/?#]/).filter(Boolean);
    var h = 'home';
    if ((parti[0] === 'luogo' || parti[0] === 'scheda') && parti[1]) h = 'luogo-' + parti[1];
    else if (parti[0] === 'evento' && parti[1]) h = 'evento-' + parti[1];
    else if (parti[0] === 'itinerario' && parti[1]) h = 'itinerario-' + parti[1];
    else if (parti[0] === 'esplora') h = 'visit';
    else if (parti[0]) h = parti[0];
    if (location.hash !== '#' + h) location.hash = h;
  }
  function avviaNativo() {
    if (!isNative) return;
    try { P.App.addListener('appUrlOpen', function (e) { vaiDaUrl(e && e.url); }); } catch (e) { /* niente */ }
    try { P.App.getLaunchUrl().then(function (r) { if (r && r.url) vaiDaUrl(r.url); }).catch(function () {}); } catch (e) { /* niente */ }
    try {
      P.App.addListener('backButton', function () {
        if (document.querySelector('.visore')) { chiudiFoto(); return; }
        if (pila.length > 1) history.back();
        else if (rotta && rotta.vista !== 'home') location.hash = 'home';
        else P.App.minimizeApp();
      });
    } catch (e) { /* niente */ }
  }

  /* ---------- avvio ---------- */
  document.documentElement.lang = lang;
  view.innerHTML = '<div class="caricamento">' + marchio() + '</div>';
  caricaDati().then(function (d) {
    if (!valido(d)) { view.innerHTML = '<div class="pagina"><p class="vuoto">' + t('erroreDati') + '</p></div>'; return; }
    DATA = d;
    pila = [location.hash];
    hashCorrente = location.hash;
    disegna(false);
    avviaNativo();
    avviaNotifiche();
    controllaPromemoria();
    document.addEventListener('visibilitychange', function () { if (!document.hidden) controllaPromemoria(); });
    window.addEventListener('pageshow', controllaPromemoria);
    window.addEventListener('focus', controllaPromemoria);
  });

  if ('serviceWorker' in navigator && location.protocol === 'https:' && !isNative && window.top === window.self) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
