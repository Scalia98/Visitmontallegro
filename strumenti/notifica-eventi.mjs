// Visit Montallegro Bovo Marina — notifiche automatiche dei nuovi eventi (OneSignal).
// Lo lancia il workflow «Notifiche nuovi eventi» (.github/workflows/notifiche.yml) a ogni modifica
// di www/data/contenuti.json sul ramo main. A mano:  node strumenti/notifica-eventi.mjs
//
// Cosa fa
//  1. Confronta contenuti.json prima e dopo il push e trova gli eventi da annunciare: quelli nuovi
//     e quelli che prima erano «da confermare» e ora sono confermati. Salta bozze, eventi già finiti,
//     eventi ancora da confermare e quelli con "notifica": false. Con "notifica": {"it": "…", "en": "…"}
//     il testo della notifica è quello scritto lì.
//     Richiamo: per riavvisare un evento già annunciato (per esempio «ultimi posti») aggiungi o cambia
//     "richiamo": {"id": "<nome nuovo>", "it": "…", "en": "…"}. Parte un avviso con quel testo
//     ogni volta che cambia l'id; lo stesso id non parte due volte.
//  2. Aspetta che il programma nuovo sia online: raw.githubusercontent.com tiene una copia in cache
//     fino a 5 minuti e le foto nuove arrivano con il workflow «Versione web».
//  3. Manda un solo avviso per push, in italiano a chi ha l'app in italiano (tag lingua = it, o senza tag)
//     e in inglese a chi la usa in inglese (lingua = en). Un evento: titolo dell'evento e link alla sua
//     pagina. Più eventi: un avviso con i titoli e link alla pagina del programma (o a Eventi).
//  4. Tra le 21 e le 9 (ora italiana) non disturba: la notifica parte alle 9:30.
//
// Variabili d'ambiente (le passa il workflow)
//   ONESIGNAL_API_KEY  chiave API dell'app OneSignal (segreto del repository). Senza, non manda niente.
//   PRIMA, DOPO        i commit da confrontare (github.event.before e github.sha).
//   EVENTI             id degli eventi da annunciare, separati da virgola, al posto del confronto.
//   PROVA=1            solo prova: manda subito e solo al telefono di prova (campo «telefono» dell'avvio a mano,
//                      o PROVA_ID: id delle iscrizioni separati da virgola).
//   MANUALE=1          avvio a mano: niente attesa iniziale e ogni avvio manda di nuovo.
//   SOLO_ANTEPRIMA=1   mostra le notifiche senza mandarle.
//   Solo per le prove dello script: ONESIGNAL_URL, ATTESA_MINIMA e PAUSA (secondi), LIMITE (minuti), ADESSO (data ISO).
import { readFileSync, appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const radice = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE_DATI = 'www/data/contenuti.json';
const env = process.env;
const vero = (v) => /^(1|true|si|sì|yes)$/i.test(String(v || '').trim());
const elencoIds = (v) => String(v || '').split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);

const config = readFileSync(path.join(radice, 'www/js/config.js'), 'utf8');
const voce = (k) => (config.match(new RegExp(k + "\\s*:\\s*'([^']*)'")) || [])[1] || '';
const APP_ID = voce('ONESIGNAL_APP_ID');
const WEB_URL = voce('WEB_URL').replace(/#.*$/, '');
const DATA_URL = voce('DATA_URL');
const API = env.ONESIGNAL_URL || 'https://api.onesignal.com/notifications?c=push';
const CHIAVE = (env.ONESIGNAL_API_KEY || '').trim();
const PROVA = vero(env.PROVA);
// telefono di prova: campo «telefono» dell'avvio a mano, letto dal file dell'evento (così l'id non compare nei log pubblici)
let PROVA_ID = elencoIds(env.PROVA_ID);
try {
  const evento = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH || '', 'utf8'));
  if (evento.inputs && evento.inputs.telefono) PROVA_ID = elencoIds(evento.inputs.telefono);
} catch { /* fuori da GitHub Actions */ }
PROVA_ID.forEach((id) => console.log('::add-mask::' + id));
const MANUALE = vero(env.MANUALE);
const ANTEPRIMA = vero(env.SOLO_ANTEPRIMA);
const ATTESA_MINIMA = (env.ATTESA_MINIMA ? +env.ATTESA_MINIMA : 6 * 60) * 1000;
const PAUSA = (env.PAUSA ? +env.PAUSA : 30) * 1000;
const LIMITE = (env.LIMITE ? +env.LIMITE : 20) * 60 * 1000;

const T = {
  it: {
    nuovo: 'Nuovo evento', confermato: 'Confermato', nuovi: 'Nuovi eventi in programma', programmaNuovo: 'Ecco il programma',
    titoloVari: 'Nuovi eventi a Montallegro', e: 'e', altri: (n) => `e altri ${n}`, dateDaDefinire: 'date da definire',
    mesi: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
    giorni: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    giorno: (g, d, m) => `${g} ${d} ${m}`,
    stessoMese: (a, b, m) => `Dal ${a} al ${b} ${m}`,
    mesiDiversi: (a, ma, b, mb) => `Dal ${a} ${ma} al ${b} ${mb}`
  },
  en: {
    nuovo: 'New event', confermato: 'Confirmed', nuovi: 'New events on the calendar', programmaNuovo: 'Here is the programme',
    titoloVari: 'New events in Montallegro', e: 'and', altri: (n) => `and ${n} more`, dateDaDefinire: 'dates to be announced',
    mesi: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    giorni: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    giorno: (g, d, m) => `${g} ${d} ${m}`,
    stessoMese: (a, b, m) => `${a}–${b} ${m}`,
    mesiDiversi: (a, ma, b, mb) => `${a} ${ma} – ${b} ${mb}`
  }
};
const LINGUE = ['it', 'en'];

/* ---------- piccoli aiuti ---------- */
const tx = (v, L) => (v == null ? '' : typeof v === 'string' ? v : v[L] || v.it || v.en || '');
const fineDi = (e) => e.fine || e.inizio || '';
const pausa = (ms) => new Promise((ok) => setTimeout(ok, ms));
const log = (s) => console.log(s);
function riepilogo(md) { if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, md + '\n'); }
function esci(msg, codice = 0) {
  if (msg) log(codice ? `::error::${msg}` : `::notice::${msg}`);
  if (msg) riepilogo((codice ? '❌ ' : '') + msg);
  process.exit(codice);
}
// UUID fisso per lo stesso annuncio: se il workflow riparte, OneSignal non lo manda due volte (vale 30 giorni)
function uuidDa(testo) {
  const h = createHash('sha1').update('visit-montallegro:' + testo).digest();
  h[6] = (h[6] & 0x0f) | 0x50;
  h[8] = (h[8] & 0x3f) | 0x80;
  const x = h.subarray(0, 16).toString('hex');
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`;
}

/* ---------- ora italiana ---------- */
function roma(d) {
  const f = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZoneName: 'longOffset'
  });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  return { giorno: `${p.year}-${p.month}-${p.day}`, ora: +p.hour, offset: (p.timeZoneName || 'GMT').replace('GMT', '') || '+00:00' };
}
function giornoDopo(g) {
  const [a, m, d] = g.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, d + 1)).toISOString().slice(0, 10);
}
// tra le 21 e le 9 la notifica aspetta le 9:30
function quandoMandare(adesso) {
  const r = roma(adesso);
  if (r.ora >= 9 && r.ora < 21) return { inviaDopo: null, giorno: r.giorno };
  const giorno = r.ora >= 21 ? giornoDopo(r.giorno) : r.giorno;
  return { inviaDopo: `${giorno}T09:30:00${roma(new Date(`${giorno}T09:30:00Z`)).offset}`, giorno };
}

/* ---------- testi ---------- */
function quando(e, L) {
  const t = T[L], ora = tx(e.ora, L);
  let s = tx(e.quando, L);
  if (!s && e.inizio) {
    const [a1, m1, d1] = e.inizio.split('-').map(Number);
    const [a2, m2, d2] = fineDi(e).split('-').map(Number);
    if (e.inizio === fineDi(e)) s = t.giorno(t.giorni[new Date(Date.UTC(a1, m1 - 1, d1)).getUTCDay()], d1, t.mesi[m1 - 1]);
    else if (m1 === m2 && a1 === a2) s = t.stessoMese(d1, d2, t.mesi[m1 - 1]);
    else s = t.mesiDiversi(d1, t.mesi[m1 - 1], d2, t.mesi[m2 - 1]);
    if (e.dateDaDefinire) s += ' · ' + t.dateDaDefinire;
  }
  return [s, ora].filter(Boolean).join(' · ');
}
function elenco(titoli, L) {
  const t = T[L];
  if (titoli.length <= 1) return titoli.join('');
  if (titoli.length <= 3) return titoli.slice(0, -1).join(', ') + ' ' + t.e + ' ' + titoli[titoli.length - 1];
  return titoli.slice(0, 3).join(', ') + ' ' + t.altri(titoli.length - 3);
}
const assoluto = (f) => (!f ? null : /^https?:\/\//.test(f) ? f : WEB_URL + f.replace(/^\.?\//, ''));

// un solo avviso per push: un evento → la sua pagina; più eventi dello stesso programma → il programma; altrimenti → Eventi
function componi(annunci, tutti) {
  const perId = new Map(tutti.map((e) => [e.id, e]));
  const lista = [...annunci].sort((x, y) => (x.e.inizio || '').localeCompare(y.e.inizio || ''));
  if (lista.length === 1) {
    const { e, tipo } = lista[0];
    return {
      pagina: 'evento-' + e.id, ids: [e.id], foto: e.foto,
      testi: Object.fromEntries(LINGUE.map((L) => [L, {
        titolo: tx(e.titolo, L),
        testo: (tipo === 'richiamo' && e.richiamo && tx(e.richiamo, L)) ||
          (e.notifica && typeof e.notifica === 'object' && tx(e.notifica, L)) ||
          [tipo === 'confermato' ? T[L].confermato : T[L].nuovo, quando(e, L), tx(e.luogo, L)].filter(Boolean).join(' · ')
      }]))
    };
  }
  const radici = new Set(lista.map(({ e }) => e.gruppo || e.id));
  const padre = radici.size === 1 ? perId.get([...radici][0]) : null;
  const figli = padre ? lista.filter(({ e }) => e.id !== padre.id) : lista;
  const padreNuovo = padre && lista.some(({ e }) => e.id === padre.id);
  return {
    pagina: padre ? 'evento-' + padre.id : 'eventi', ids: lista.map(({ e }) => e.id),
    foto: padre ? padre.foto : (lista.find(({ e }) => e.foto) || { e: {} }).e.foto,
    testi: Object.fromEntries(LINGUE.map((L) => [L, {
      titolo: padre ? tx(padre.titolo, L) : T[L].titoloVari,
      testo: (padreNuovo ? T[L].programmaNuovo : T[L].nuovi) + ': ' + elenco(figli.map(({ e }) => tx(e.titolo, L)), L)
    }]))
  };
}

/* ---------- dati ---------- */
function leggiCommit(commit) {
  try {
    return JSON.parse(execFileSync('git', ['show', `${commit}:${FILE_DATI}`], { cwd: radice, encoding: 'utf8', maxBuffer: 64e6, stdio: ['ignore', 'pipe', 'ignore'] }));
  } catch { return null; }
}
const annunciabile = (e, giorno) => e && e.id && !e.bozza && e.notifica !== false && !e.daConfermare && (!fineDi(e) || fineDi(e) >= giorno);

async function scaricaJSON(url) {
  const r = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}
async function online(url) {
  try { const r = await fetch(url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now(), { method: 'HEAD' }); return r.ok; } catch { return false; }
}
// aspetta che chi tocca la notifica trovi già l'evento nell'app (dati su raw.githubusercontent.com, foto sulla web app)
async function aspettaOnline(annunci, foto, minima) {
  const inizio = Date.now();
  let dati = false, immagini = foto.length === 0;
  for (;;) {
    if (!dati) {
      try {
        const d = await scaricaJSON(DATA_URL);
        const remoti = new Map((d.eventi || []).map((e) => [e.id, e]));
        dati = annunci.every(({ e }) => remoti.has(e.id) && !remoti.get(e.id).daConfermare);
      } catch { dati = false; }
    }
    if (!immagini) immagini = (await Promise.all(foto.map(online))).every(Boolean);
    const passati = Date.now() - inizio;
    if (dati && immagini && passati >= minima) return true;
    if (passati >= LIMITE) {
      if (dati) { log('::warning::Le foto nuove non sono ancora online: la notifica parte lo stesso.'); return true; }
      return false;
    }
    log(`… aspetto che il programma nuovo sia online (dati ${dati ? 'ok' : 'no'}, foto ${immagini ? 'ok' : 'no'}, ${Math.round(passati / 1000)} s)`);
    await pausa(PAUSA);
  }
}

/* ---------- OneSignal ---------- */
async function manda(corpo, descrizione) {
  if (ANTEPRIMA) { log(`\n[anteprima] ${descrizione}\n` + JSON.stringify(corpo, null, 2)); return { anteprima: true }; }
  const r = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: 'Key ' + CHIAVE },
    body: JSON.stringify(corpo)
  });
  let ris = {};
  try { ris = await r.json(); } catch { /* risposta vuota */ }
  if (r.status === 401 || r.status === 403) esci('OneSignal rifiuta la chiave: controlla il segreto ONESIGNAL_API_KEY (Settings → Secrets and variables → Actions).', 1);
  if (!r.ok) esci(`OneSignal ha risposto ${r.status}: ${JSON.stringify(ris.errors || ris)}`, 1);
  const errori = [].concat(ris.errors || []).map(String);
  if (!ris.id) {
    if (errori.some((x) => /not subscribed|no (recipients|subscribers)/i.test(x))) return { nessuno: true };
    esci(`OneSignal non ha mandato «${descrizione}»: ${errori.join('; ') || 'motivo non indicato'}`, 1);
  }
  return { id: ris.id, ripetuta: r.headers.get('idempotent-replayed') === 'true' };
}

/* ---------- via ---------- */
const nuovo = JSON.parse(readFileSync(path.join(radice, FILE_DATI), 'utf8'));
const tutti = nuovo.eventi || [];
const adesso = env.ADESSO ? new Date(env.ADESSO) : new Date();
const invio = PROVA ? { inviaDopo: null, giorno: roma(adesso).giorno } : quandoMandare(adesso);

let annunci;
if (elencoIds(env.EVENTI).length) {
  annunci = elencoIds(env.EVENTI).map((id) => {
    const e = tutti.find((x) => x.id === id);
    if (!e) esci(`Nel programma non c'è nessun evento con id «${id}».`, 1);
    return { e, tipo: 'nuovo' };
  });
} else if (PROVA) {
  const prossimo = tutti.filter((e) => annunciabile(e, invio.giorno) && !e.programma)
    .sort((x, y) => (x.inizio || '').localeCompare(y.inizio || ''))[0];
  if (!prossimo) esci('Per la prova serve almeno un evento in programma.', 1);
  annunci = [{ e: prossimo, tipo: 'nuovo' }];
} else {
  const prima = env.PRIMA && !/^0+$/.test(env.PRIMA) ? leggiCommit(env.PRIMA) : null;
  if (!prima) esci('Non trovo la versione precedente di contenuti.json: niente da confrontare, nessuna notifica.');
  const vecchi = new Map((prima.eventi || []).map((e) => [e.id, e]));
  annunci = tutti.filter((e) => annunciabile(e, invio.giorno)).flatMap((e) => {
    const v = vecchi.get(e.id);
    if (!v) return [{ e, tipo: 'nuovo' }];
    if (v.daConfermare) return [{ e, tipo: 'confermato' }];
    const r = e.richiamo && typeof e.richiamo === 'object' && e.richiamo.id;
    if (r && r !== (v.richiamo && v.richiamo.id)) return [{ e, tipo: 'richiamo' }];
    return [];
  });
  if (!annunci.length) esci('Nessun evento nuovo, appena confermato o con un richiamo nuovo: nessuna notifica.');
}

const avviso = componi(annunci, tutti);
const webUrl = WEB_URL + '#' + avviso.pagina;
const appUrl = 'visitmontallegro://' + avviso.pagina.replace(/^evento-/, 'evento/');
const immagine = assoluto(avviso.foto);

log(`Da annunciare: ${annunci.map(({ e, tipo }) => `${e.id} (${tipo})`).join(', ')}`);
log(`Link: ${webUrl}` + (invio.inviaDopo ? ` · parte alle 9:30 (${invio.inviaDopo})` : ' · parte subito'));

if (!APP_ID) esci('Manca ONESIGNAL_APP_ID in www/js/config.js: nessuna notifica.', 1);
if (!CHIAVE && !ANTEPRIMA) {
  log('::warning::Manca il segreto ONESIGNAL_API_KEY: la notifica non parte. Aggiungilo in Settings → Secrets and variables → Actions.');
  riepilogo('⚠️ Manca il segreto **ONESIGNAL_API_KEY**: notifica non mandata.');
  process.exit(0);
}
if (PROVA && !PROVA_ID.length) esci('Per la prova scrivi nel campo «telefono» l\'id dell\'iscrizione di prova (OneSignal → Users & subscriptions → Test subscriptions).', 1);

if (!PROVA && !ANTEPRIMA) {
  const fotoNuove = annunci.map(({ e }) => assoluto(e.foto)).filter((f) => f && f.startsWith(WEB_URL));
  const ok = await aspettaOnline(annunci, [...new Set(fotoNuove)], MANUALE ? 0 : ATTESA_MINIMA);
  if (!ok) esci('Il programma nuovo non risulta online dopo 20 minuti: notifica non mandata. Riprova dal workflow (Run workflow).', 1);
}

const righe = ['### Notifica', '', `Link: ${webUrl}`, invio.inviaDopo ? `Programmata per le 9:30 (${invio.inviaDopo})` : 'Inviata subito', ''];
for (const L of PROVA ? ['it'] : LINGUE) {
  const { titolo, testo } = avviso.testi[L];
  const corpo = {
    app_id: APP_ID,
    target_channel: 'push',
    name: `${PROVA ? 'Prova' : MANUALE ? 'Manuale' : 'Automatica'} · ${avviso.ids.join(', ')} · ${L}`,
    headings: { en: titolo, it: titolo },
    contents: { en: testo, it: testo },
    web_url: webUrl,
    app_url: appUrl,
    idempotency_key: PROVA ? randomUUID() : uuidDa(`${MANUALE ? 'manuale:' + (env.GITHUB_RUN_ID || randomUUID()) : 'auto'}:${annunci.map(({ e, tipo }) => (tipo === 'richiamo' ? 'richiamo-' + e.richiamo.id : tipo) + ':' + e.id).sort().join(',')}:${L}`)
  };
  if (immagine) corpo.chrome_web_image = immagine;
  if (invio.inviaDopo) corpo.send_after = invio.inviaDopo;
  if (PROVA) {
    corpo.include_subscription_ids = PROVA_ID;
  } else {
    corpo.filters = L === 'en'
      ? [{ field: 'tag', key: 'lingua', relation: '=', value: 'en' }]
      : [{ field: 'tag', key: 'lingua', relation: '=', value: 'it' }, { operator: 'OR' }, { field: 'tag', key: 'lingua', relation: 'not_exists' }];
  }
  const ris = await manda(corpo, `${L}: ${titolo}`);
  const esito = ris.anteprima ? 'anteprima' : ris.nessuno ? 'nessun iscritto in questa lingua' : ris.ripetuta ? 'già mandata prima (non ripetuta)' : 'mandata';
  log(`${L.toUpperCase()} · ${titolo} — ${testo} → ${esito}`);
  righe.push(`- **${L.toUpperCase()}** · ${titolo} — ${testo} → ${esito}`);
}
riepilogo(righe.join('\n'));
