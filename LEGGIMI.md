# Visit Montallegro Bovo Marina

App ufficiale di Montallegro, Bovo Marina e della Riserva di Torre Salsa, per iPhone e Android. Un progetto della Pro Loco Montallegro APS.

Tenendo premuta l'icona compaiono le scorciatoie **Spiagge**, **Visit Torre Salsa** e **Visit**, con Condividi app ed Elimina app aggiunte dal telefono, come in Agrigento InfoApp.

Dentro l'app trovi, come in Agrigento InfoApp:
- **Home**: foto a scorrimento, meteo e mare adesso, le sezioni a riquadri, da non perdere, prossimi eventi, itinerari; in fondo «App realizzata da Disegna il tuo sito»
- **Visit Torre Salsa**: pagina dedicata con galleria di foto, numeri della riserva ed escursione guidata prenotabile su WhatsApp
- **Spiagge**: Torre Salsa, Bovo Marina, Eraclea Minoa, Scala dei Turchi, lidi e regole per il mare
- **Cosa vedere** (tab Visit): natura e riserve, storia e cultura, dintorni, con la distanza da te
- **Esperienze**: escursioni Seacily, a cavallo con L'operAmmare e la Scuderia Ranch Todaro, visite WWF, birdwatching al Laghetto Gorgo, SUP e kayak, museo
- **Itinerari**: una giornata di mare e a piedi nella pineta del Platani fino a Capo Bianco; con più di 4 itinerari compaiono i filtri per tipo
- **Mangiare e bere** (23 locali) e **Dove dormire** (37 strutture), con filtri per tipo, orari con «aperto adesso», prenotazioni, social e numeri
- **Sapori e prodotti** (formaggi, olio, vino, miele, pane, carne) e **Servizi utili** (farmacia, salute, trasporti, spesa, negozi, uffici)
- **Nei dintorni**: Siculiana, Siculiana Marina, Giallonardo, Villa Romana di Durrueli, Porto Empedocle, Agrigento, Sciacca, Caltabellotta e altro
- **Cerca**: una ricerca unica su luoghi, locali, strutture e servizi, in italiano e inglese
- **Come arrivare** (auto, autobus Lumia e FlixBus, treno, aereo)
- **Meteo** con previsioni a 7 giorni, onde e temperatura dell'acqua
- **Mappa** con i luoghi e la tua posizione, **Eventi**, **Info utili** con emergenze e numeri
- Italiano e inglese; funziona anche senza connessione (tranne mappa e meteo; le foto online vengono salvate nell'app quando la compila Codemagic)

---

## Com'è fatta

| Cartella | Cosa contiene |
|---|---|
| `www/` | L'app vera e propria (HTML, CSS, JavaScript). Uguale per iPhone, Android e web |
| `www/data/contenuti.json` | **Tutti i testi**: luoghi, locali, strutture, esperienze, eventi, itinerari, trasporti, contatti, in italiano e inglese |
| `www/img/foto/` | Le foto vere dentro l'app |
| `www/js/config.js` | Impostazioni: aggiornamento online dei contenuti, chiave mappa, link agli store |
| `ios/` | Progetto Xcode (solo iPhone). Scorciatoie in `ios/App/App/Info.plist`, gestite in `SceneDelegate.swift` |
| `android/` | Progetto Android Studio. Scorciatoie in `android/app/src/main/res/xml/shortcuts.xml` |
| `strumenti/scarica-foto.mjs` | Scarica dentro l'app le foto online (portale Visit Montallegro e Wikimedia Commons) e le riduce a 1400 px: lo fa Codemagic a ogni compilazione |
| `risorse/` | Logo ufficiale (originale, tondo e solo disegno), icona 1024, schermata di avvio, icona e grafica 1024 × 500 per Google Play |
| `screenshot-store/` | Schermate per App Store e Google Play, italiano e inglese |
| `codemagic.yaml` | Compilazione nel cloud per pubblicare **senza Mac** |

Tecnologia: Capacitor 8 (Ionic). Identificativo app: `it.visitmontallegrobovomarina.infoapp`. Sotto l'icona del telefono il nome è **Montallegro** (i nomi più lunghi vengono tagliati); sugli store il nome è **Visit Montallegro Bovo Marina**.

---

## Modificare i contenuti

Apri `www/data/contenuti.json` con un editor di testo (VS Code va benissimo).

- **Schede**: ogni luogo, locale, struttura o esperienza è una «scheda». Le `"categorie"` decidono dove compare: `spiagge`, `natura`, `cultura`, `dintorni`, `esperienze`, `mangiare`, `dormire`, `sapori`, `servizi`. Il campo `"sotto"` sceglie il filtro dentro la sezione (per esempio `ristoranti`, `bb`, `olio`, `salute`, `dintorni`): l'elenco dei filtri è in `"sottocategorie"`.
- **Testi**: ogni campo ha `"it"` e `"en"`. Le schede prese dal portale hanno i testi solo in italiano: chi usa l'app in inglese li legge in italiano finché non aggiungi `"en"`.
- **Orari**: blocco `"orari"` con i giorni `lun` … `dom`, per esempio `"mar": "19:00-22:30"`, `"sab": "12:30-15:00, 19:00-23:00"` oppure `"lun": "chiuso"`. L'app raggruppa i giorni uguali e scrive «Aperto adesso» o «Chiuso adesso» (ora italiana).
- **Zona**: `"zona"` (`paese`, `bovo`, `torre-salsa`, `campagna`, `eraclea`) oppure, per i posti fuori Montallegro, `"localita"` con il nome del paese.
- **Foto**: metti l'immagine in `www/img/foto/` (orizzontale, circa 1600 px di lato, JPG) e scrivi il percorso nel campo `"foto"`, per esempio `"foto": "img/foto/bovo-marina.jpg"`, con l'autore in `"credito"`. Senza foto si vede un fondo colorato con l'icona della categoria.
- **Contatti di una scheda**: blocco `"contatti"` con `"tel"`, `"whatsapp"` (con il 39 davanti), `"web"`, `"email"`. Compaiono da soli i tasti Chiama, WhatsApp, Sito.
- **Posizione sulla mappa**: campi `"lat"` e `"lng"`. In Google Maps tieni premuto sul punto esatto e copia i due numeri. Senza coordinate la scheda non compare sulla mappa (ma Indicazioni funziona lo stesso con il nome in `"mappe"`).
- **Eventi**: aggiungi un blocco in `"eventi"` con date `"inizio"` e `"fine"` (formato `2026-12-19`). Gli eventi passati spariscono da soli.
- **Itinerari**: blocco in `"itinerari"` con `"titolo"`, `"intro"`, `"durata"`, `"foto"` e le `"tappe"` (ognuna con il testo e, se c'è, la `"scheda"` del luogo). `"tipo"` (`piedi`, `bici`, `cavallo`, `mare`, `natura`, `cultura`, `sapori`) decide il filtro e l'etichetta; `"dati"` (lunghezza, dislivello, difficoltà), `"traccia"` (link al percorso GPS) e `"consigli"` sono facoltativi.
- A ogni modifica aggiorna `"versione"` (es. `"2026-12-01"`).

Poi, per portare le modifiche nelle app: `npx cap sync`.

### Da dove vengono i dati
- **Scopri il territorio** (portale): Riserva Torre Salsa, Bovo Marina, Monte Suso, Laghetto Gorgo, le calcare di gesso e il Museo della Civiltà Contadina hanno i testi e le **gallerie di foto** delle pagine «Scopri il territorio» di visitmontallegrobovomarina.it (62 foto). In home sono il carosello «Scopri il territorio» e in Cosa vedere la prima sezione. Dove il portale e le schede verificate della guida non coincidono (date, numeri, direzioni) vale la guida verificata; alcune parti generiche del portale (eventi di Bovo Marina, punti panoramici e sentieri con nomi non verificabili) non sono state riportate.
- **Portale** (`"fonte": "portale"`, 95 schede): locali, strutture, produttori, esperienze e servizi della guida di visitmontallegrobovomarina.it, con i dati verificati dalla Pro Loco a novembre 2026. Le schede in bozza e le note interne del portale **non** sono state pubblicate.
- **Dintorni** (`"fonte": "ricerca"`, 30 schede): luoghi, ristoranti e alloggi fuori Montallegro presi da fonti pubbliche (italia.it, siti ufficiali, guide). Prima di pubblicare sugli store fai una telefonata di controllo ai locali e alle strutture: orari e numeri cambiano.
- Le altre schede (riserva, spiagge, chiese, Seacily, eventi, trasporti) sono quelle dell'app originale. L'itinerario della pineta del Platani, il birdwatching e l'Azienda Agricola Calogero Caruana sono stati aggiunti a novembre 2026 da fonti pubbliche (Balarm, komoot, schede dei produttori).

### Da completare
- **Foto mancanti**: la guida del portale ha le foto solo per 11 schede; locali, strutture, servizi e posti dei dintorni per ora hanno il fondo colorato con l'icona. Aggiungi le foto sul portale o in `www/img/foto/`.
- **Coordinate mancanti**: molte schede del portale e dei dintorni non hanno `"lat"` e `"lng"`, quindi non compaiono sulla mappa (Indicazioni funziona lo stesso con l'indirizzo).
- **Date dei mercatini di Natale** e programma completo del Natale.
- Foto di Torre Salsa in `www/img/foto/` e foto di Seacily: verifica di poterle usare (se sono tue, nessun problema).
- Azienda Agricola Calogero Caruana: manca la foto.

### Aggiornare i contenuti senza ripubblicare sugli store
L'app, a ogni apertura, scarica `www/data/contenuti.json` dal repository GitHub `Scalia98/Visitmontallegro` (indirizzo in `www/js/config.js`, voce `DATA_URL`; il repository deve essere **pubblico**).
1. Modifica `www/data/contenuti.json` su GitHub (eventi, luoghi, orari, foto, contatti, siti) e aumenta `"versione"`.
2. Salva (Commit): alla prossima apertura tutti i telefoni vedono i contenuti nuovi. Le foto già salvate dentro l'app continuano a funzionare anche senza rete.
3. Grafica e funzioni nuove (sezioni, pulsanti, colori) invece richiedono una nuova versione: avvia di nuovo il workflow su Codemagic e carica l'aggiornamento sugli store.

### Partner e soci
- In home (riquadri «Pro Loco Montallegro»), in Info e in fondo a Mangiare, Dormire, Sapori, Servizi ed Esperienze ci sono **Diventa socio** e **Diventa partner**: pagine con WhatsApp, Chiama ed Email alla Pro Loco, con il messaggio già scritto.
- **Quote**: nel blocco `"proloco"` di `contenuti.json` scrivi `"quotaSocio"` e `"prezzoPartner"`, per esempio `{"it": "15 € l'anno", "en": "€15 a year"}`. Se restano vuoti l'app scrive «chiedi alla Pro Loco». `"moduloSocio"` (facoltativo): indirizzo https di un modulo di iscrizione online, compare come tasto «Modulo online».
- **Attivare un partner**: nella sua scheda aggiungi `"partner": true`, oppure la data di fine `"partner": "2027-09-30"` (scaduta la data, il bollino sparisce da solo). Il partner ha il bollino ★ Partner, sta in cima alla sua sezione e ai filtri, compare in home tra i «Consigliati dalla Pro Loco» (ogni giorno apre la fila un partner diverso) e nell'elenco della pagina Diventa partner.
- Con il repository GitHub pubblico basta modificare il file e aumentare `"versione"`: il bollino compare a tutti senza aggiornare l'app.
- **Niente pagamenti nell'app**: quote e spazi partner si incassano fuori dall'app (bonifico, contanti, ricevuta della Pro Loco). L'app resta gratuita e senza acquisti, che è una delle condizioni dell'esonero Apple.
- Per ora nessuna attività è segnata come partner.

---

## Provarla subito sul telefono

Carica il contenuto della cartella `www/` su SiteGround (per esempio un sottodominio `app.visitmontallegrobovomarina.it` con HTTPS) e aprilo dal telefono.
- **iPhone**: Safari → Condividi → Aggiungi alla schermata Home. Funziona tutto tranne il menu a pressione prolungata, che Apple concede solo alle app dello store.
- **Android**: Chrome → Installa app. Qui anche la versione web ha le scorciatoie.

---

## Pubblicare su App Store e Google Play

### 1. Gli account (a nome della Pro Loco)
Conviene pubblicare a nome della **Pro Loco Montallegro APS**, come ha fatto la Pro Loco Agrigento con Agrigento InfoApp: sullo store compare l'ente, non una persona.

- **D-U-N-S**: numero identificativo gratuito che Apple e Google chiedono alle organizzazioni. Cerca la Pro Loco su [developer.apple.com/enroll/duns-lookup](https://developer.apple.com/enroll/duns-lookup/) (meglio da Safari) con nome legale esatto, indirizzo della sede e un tuo contatto; se non c'è, invia la richiesta gratuita da lì. Dun & Bradstreet può chiamarti: tieni pronti statuto, codice fiscale e iscrizione al RUNTS. Arriva entro 5 giorni lavorativi, poi Apple impiega fino a 2 giorni lavorativi a riceverlo. Lo stesso numero serve per Google Play.
- **Apple Developer Program**: 99 USD l'anno. Le organizzazioni non profit riconosciute che pubblicano solo app gratuite, senza acquisti in app, possono chiedere l'**esonero dalla quota** (disponibile anche in Italia): durante l'iscrizione come organizzazione scegli l'opzione per richiedere l'esonero. Servono: Apple Account con autenticazione a due fattori e il tuo nome e cognome veri, il nome legale dell'ente (sarà il «venditore» sullo store), il D-U-N-S, sede e telefono, il sito su un dominio dell'ente (visitmontallegrobovomarina.it) e il contatto di una persona che confermi che puoi firmare per la Pro Loco. Apple valuta ogni richiesta.
- **Google Play Console**: 25 USD una tantum. Con un account **organizzazione** non serve il test chiuso obbligatorio (12 tester per 14 giorni) richiesto agli account personali nuovi.

### 2a. iPhone senza Mac (Codemagic)
1. Il progetto è su GitHub nel repository pubblico [`Scalia98/Visitmontallegro`](https://github.com/Scalia98/Visitmontallegro): pubblico perché l'app ne scarica i contenuti aggiornati.
2. Su [codemagic.io](https://codemagic.io) accedi con GitHub e aggiungi il repository. Il piano gratuito per account personali include 500 minuti al mese su Mac.
3. Su [App Store Connect](https://appstoreconnect.apple.com) crea l'app con l'identificativo `it.visitmontallegrobovomarina.infoapp`.
4. Sempre su App Store Connect: Utenti e accesso → Integrazioni → crea una chiave API (ruolo App Manager) e scarica il file `.p8`.
5. In Codemagic: Settings → Integrations → Developer Portal → aggiungi la chiave e chiamala **App Store Connect**.
6. In Settings → Code signing identities genera il certificato di distribuzione iOS e recupera il profilo App Store per `it.visitmontallegrobovomarina.infoapp`: Codemagic lo fa da solo con la chiave API.
7. Avvia il workflow **iPhone → TestFlight**: scarica le foto, compila, firma e carica l'app su TestFlight. Da lì la provi sul tuo iPhone e la invii in revisione.

### 2b. iPhone con un Mac
```
npm install
npm run foto
npx cap sync ios
npx cap open ios
```
In Xcode: scheda Signing & Capabilities → scegli il team della Pro Loco → Product → Archive → Distribute App.

### 3. Android
Con Android Studio: `npm run foto`, `npx cap sync android`, `npx cap open android` → Build → Generate Signed App Bundle → carica il file `.aab` su Play Console.
Con Codemagic: carica il keystore in Settings → Code signing identities con il nome `montallegro_keystore` e avvia **Android → App Bundle firmato**.

**Per provarla subito su un telefono Android** (senza Play Store né keystore): in Codemagic avvia **Android → APK da installare sul telefono**. Dopo circa 15 minuti scarichi `app-debug.apk` dalla pagina della build, lo apri sul telefono e confermi l'installazione (Android chiede di consentire le app da questa fonte).
Il keystore va conservato con cura: senza, non potrai più aggiornare l'app.

### 4. Cosa chiedono gli store
- **Privacy**: carica `www/privacy.html` sul sito e usa quell'indirizzo come URL dell'informativa. Nel questionario Apple sulla privacy la risposta è «Dati non raccolti».
- **Screenshot**: in `screenshot-store/` trovi le immagini iPhone 6,9" (1320 × 2868), in italiano e inglese, pronte da caricare.
- **Categoria**: Viaggi. **Età**: 4+.

### Testi per la scheda
- **Nome**: Visit Montallegro Bovo Marina
- **Sottotitolo**: Torre Salsa, spiagge ed eventi
- **Parole chiave**: montallegro,bovo marina,torre salsa,agrigento,sicilia,spiagge,riserva,eraclea minoa,pro loco,eventi
- **Descrizione**:
  Visit Montallegro Bovo Marina è la guida ufficiale di Montallegro, realizzata dalla Pro Loco Montallegro APS.
  Scopri la Riserva Naturale Torre Salsa e la Dama Bianca, la spiaggia di Bovo Marina, Eraclea Minoa e Capo Bianco, i ruderi del paese antico su Monte Suso, le chiese e il Museo della Civiltà Contadina.
  Prenota su WhatsApp la navetta per la spiaggia di Torre Salsa e le escursioni guidate, trova dove mangiare e dormire con orari e contatti, i prodotti tipici e i produttori del paese, la farmacia e i servizi utili, i posti da vedere nei dintorni, come arrivare, il meteo e il mare con le previsioni, la mappa, gli eventi e tutti i numeri utili.
  Tieni premuta l'icona per andare dritto a Spiagge, Visit Torre Salsa e Visit.

---

## Mappa, meteo e foto
- **Sfondo mappa**: per l'app pubblica chiedi la chiave gratuita CARTO su [carto.com/basemaps/apikey](https://carto.com/basemaps/apikey) (uso non commerciale) e mettila in `CARTO_KEY` dentro `www/js/config.js`. Senza chiave la mappa usa OpenStreetMap, che va bene per le prove.
- **Meteo**: Open-Meteo, gratuito per uso non commerciale e senza chiave.
- **Foto Wikimedia Commons**: i luoghi di «Cosa vedere» hanno la loro galleria (Scala dei Turchi, Valle dei Templi, Eraclea Minoa, Kolymbethra, Museo Griffo, Caltabellotta, Sciacca…). Solo foto con licenza libera verificata (pubblico dominio, CC0, CC BY, CC BY-SA): autore e licenza compaiono su ogni foto e nella sezione Info → Crediti c'è il link alla pagina di ciascun file. `npm run foto` (e Codemagic a ogni compilazione) le scarica dentro l'app. Per aggiungere altre foto a un luogo basta aggiungere voci al campo `galleria` della sua scheda in `www/data/contenuti.json` (foto, credito, didascalia).
- **Siti web**: ogni luogo ha il link al sito ufficiale (Parco Valle dei Templi, FAI, Farm Cultural Park, comuni) o alla sua pagina sul portale; le attività di Montallegro senza un sito proprio rimandano alla pagina del portale che le elenca (Dove mangiare, Dove dormire, Sapori, Cosa fare).
- **Mancano ancora le foto** di: Chiesa dell'Immacolata, Chiesa di San Leonardo, vecchia stazione, spiaggia di Giallonardo, Farm Cultural Park, e di ristoranti, B&B, negozi e servizi: per questi servono foto della Pro Loco o dei titolari (su Commons non ci sono foto libere).
- **Foto del portale**: `npm run foto` scarica anche le foto delle schede e delle gallerie prese da visitmontallegrobovomarina.it e le riduce con `sharp`, così nell'app installata ci sono anche senza rete; se il sito non risponde restano online e l'app le carica quando c'è rete. Le gallerie si aprono a tutto schermo; una foto che non si riesce a caricare sparisce dalla galleria invece di lasciare un riquadro vuoto.
- **Anteprima su Claude**: l'anteprima pubblicata su claude.ai non può caricare immagini da altri siti, quindi lì le foto del portale non si vedono (si vedono le foto già dentro l'app). Nell'app installata e nella versione web caricata sul tuo hosting si vedono tutte.

## Logo e colori
L'icona, la schermata di avvio e il marchio nella home nascono dal logo ufficiale in `risorse/logo-originale.png`. I titoli usano Fraunces, lo stesso carattere del portale (licenza SIL OFL, file in `www/fonts/`). I colori dell'app vengono dal logo: blu `#015199`, arancio sole `#F6A100`, verde oliva `#7F8302` (in `www/css/app.css`, variabili `--blu`, `--sole`, `--oliva`).
Per Google Play: icona `risorse/play-icona-512.png` e grafica in evidenza `risorse/play-grafica-1024x500.png`.

## Scorciatoie e link
L'app risponde ai link `visitmontallegro://`:
`visitmontallegro://spiagge` · `visitmontallegro://torre-salsa` · `visitmontallegro://visit` · `visitmontallegro://esperienze` · `visitmontallegro://eventi` · `visitmontallegro://luogo/birdwatching-gorgo` · `visitmontallegro://itinerario/mare`

Per cambiare le scorciatoie dell'icona: titolo, icona (nome di un simbolo SF Symbols) e link in `ios/App/App/Info.plist`; su Android in `res/xml/shortcuts.xml` e `res/values/strings.xml`. iPhone ne mostra al massimo quattro.
