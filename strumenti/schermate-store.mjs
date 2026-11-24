// Schermate per App Store e Google Play, in italiano e in inglese.
// Le crea il workflow «Schermate per gli store» (GitHub → Actions → Run workflow) e le mette nell'artefatto «schermate-store».
// Niente contenuti di stagione (apertura e diapositive di Natale, eventi): le schermate restano valide tutto l'anno.
//   iPhone 6,9"  1320 x 2868  → schermate/iphone/<lingua>-NN-nome.jpg
//   Android      1080 x 2040  → schermate/android/<lingua>-NN-nome.jpg (Google Play: lato lungo al massimo il doppio del corto)
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = 'http://localhost:8099/index.html';
const OUT = 'schermate';
const dati = JSON.parse(fs.readFileSync('www/data/contenuti.json', 'utf8'));
delete dati.home.apertura;
dati.home.slider = (dati.home.slider || []).filter((x) => !x.fino && !/^#evento-/.test(x.link || ''));
dati.eventi = [];
const corpo = JSON.stringify(dati);

const SCHERMATE = [
  ['01-home', 'home'],
  ['02-torre-salsa', 'torre-salsa'],
  ['03-spiagge', 'spiagge'],
  ['04-esperienze', 'esperienze'],
  ['05-cosa-vedere', 'visit'],
  ['06-mappa', 'mappa'],
  ['07-mangiare', 'mangiare'],
  ['08-museo', 'luogo-museo-civilta-contadina'],
];
const DISPOSITIVI = {
  iphone: { viewport: { width: 440, height: 956 }, deviceScaleFactor: 3, sat: 50,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' },
  android: { viewport: { width: 432, height: 816 }, deviceScaleFactor: 2.5, sat: 28,
    userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36' },
};
// nell'app degli store non ci sono «installa l'app» né le notifiche del sito
const CSS = `.entra{animation:none!important} .installa,.avviso-notifiche,.nota-tasto,
  [data-azione="installa"],[data-azione="notifiche-cambia"],[data-azione="notifiche-attiva"]{display:none!important}`;

const errori = [];
const browser = await chromium.launch();
for (const [nomeDisp, d] of Object.entries(DISPOSITIVI)) {
  fs.mkdirSync(`${OUT}/${nomeDisp}`, { recursive: true });
  for (const lingua of ['it', 'en']) {
    const ctx = await browser.newContext({ viewport: d.viewport, deviceScaleFactor: d.deviceScaleFactor, isMobile: true,
      hasTouch: true, reducedMotion: 'reduce', locale: lingua === 'it' ? 'it-IT' : 'en-GB', userAgent: d.userAgent });
    await ctx.route(/contenuti\.json/, (r) => r.fulfill({ status: 200, contentType: 'application/json; charset=utf-8',
      headers: { 'access-control-allow-origin': '*' }, body: corpo }));
    const pg = await ctx.newPage();
    pg.on('pageerror', (e) => errori.push(`${nomeDisp}/${lingua}: ${e.message}`));
    await pg.goto(BASE, { waitUntil: 'networkidle' });
    await pg.evaluate(() => { localStorage.clear(); localStorage.setItem('vm-notifiche-chiusa', String(Date.now())); localStorage.setItem('vm-installa-chiusa', String(Date.now())); });
    await pg.reload({ waitUntil: 'networkidle' });
    // la mappa dell'app resta nel codice: la prendiamo quando nasce per inquadrare paese, Bovo Marina e Torre Salsa
    await pg.evaluate(() => { L.Map.addInitHook(function () { window.__mappa = this; }); });
    await pg.addStyleTag({ content: `:root{--sat:${d.sat}px!important} ${CSS}` });
    await pg.evaluate(() => { location.hash = 'info'; });
    await pg.waitForTimeout(600);
    await pg.click(`[data-azione='lingua'][data-val='${lingua}']`).catch((e) => errori.push(`lingua ${lingua}: ${e.message}`));
    await pg.waitForTimeout(600);
    for (const [nome, hash] of SCHERMATE) {
      await pg.evaluate((h) => { location.hash = h; window.scrollTo(0, 0); }, hash);
      await pg.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      if (hash === 'mappa') {
        await pg.waitForTimeout(1500);
        await pg.evaluate(() => { if (window.__mappa) window.__mappa.setView([37.386, 13.333], 13, { animate: false }); });
        await pg.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      }
      await pg.waitForTimeout(hash === 'mappa' ? 3000 : 2200);
      await pg.addStyleTag({ content: CSS });
      await pg.screenshot({ path: `${OUT}/${nomeDisp}/${lingua}-${nome}.jpg`, type: 'jpeg', quality: 90 });
    }
    await ctx.close();
  }
}
await browser.close();
console.log(errori.length ? 'Errori:\n' + errori.join('\n') : 'Nessun errore');
