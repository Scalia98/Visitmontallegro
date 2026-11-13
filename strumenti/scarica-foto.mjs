// Visit Montallegro Bovo Marina — scarica dentro l'app le foto online (portale Visit Montallegro e Wikimedia Commons).
// Si lancia prima di "npx cap sync" (Codemagic lo fa da solo):  node strumenti/scarica-foto.mjs
// Ogni "foto" che inizia per https:// (copertine delle schede, gallerie, slider della home, itinerari)
// viene salvata in www/img/foto/ e il contenuti.json viene aggiornato con il percorso locale:
// così l'app mostra le foto anche senza rete. Se c'è il pacchetto "sharp" le foto grandi vengono
// ridotte a 1400 px di lato (l'app resta leggera); senza "sharp" si salvano così come sono.
// Se un download non riesce l'indirizzo online resta com'è e l'app prova a caricarlo quando c'è rete.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const qui = path.dirname(fileURLToPath(import.meta.url));
const www = path.join(qui, '..', 'www');
const fileDati = path.join(www, 'data', 'contenuti.json');
const cartella = path.join(www, 'img', 'foto');
const UA = 'VisitMontallegroApp/1.0 (Pro Loco Montallegro APS; prolocomontallegro@gmail.com)';
const LATO = 1400;

let sharp = null;
try { sharp = (await import('sharp')).default; } catch { console.log('(sharp non installato: le foto si salvano senza ridurle)'); }

async function scarica(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'image/avif,image/webp,image/*;q=0.8' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const tipo = (r.headers.get('content-type') || '').split(';')[0];
  if (!tipo.startsWith('image/')) throw new Error(`non è un'immagine: ${tipo}`);
  return { buf: Buffer.from(await r.arrayBuffer()), tipo };
}

async function salva(nome, { buf, tipo }) {
  if (sharp) {
    try {
      const out = await sharp(buf).rotate().resize({ width: LATO, height: LATO, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
      const rel = `img/foto/${nome}.jpg`;
      await writeFile(path.join(www, rel), out);
      return { rel, kb: Math.round(out.length / 1024) };
    } catch (e) { console.warn(`   sharp non ce l'ha fatta (${e.message}), salvo l'originale`); }
  }
  const est = { 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' }[tipo] || 'jpg';
  const rel = `img/foto/${nome}.${est}`;
  await writeFile(path.join(www, rel), buf);
  return { rel, kb: Math.round(buf.length / 1024) };
}

const dati = JSON.parse(await readFile(fileDati, 'utf8'));
await mkdir(cartella, { recursive: true });
const giaFatte = new Map();   // stesso indirizzo usato più volte = un solo file
let fatte = 0, fallite = 0;

async function prendi(obj, nome) {
  if (!obj || !obj.foto || !/^https:\/\//.test(obj.foto)) return;
  if (giaFatte.has(obj.foto)) { obj.foto = giaFatte.get(obj.foto); delete obj.fotoRiserva; return; }
  for (const url of [obj.foto, obj.fotoRiserva].filter((u) => /^https:\/\//.test(u || ''))) {
    try {
      const { rel, kb } = await salva(nome, await scarica(url));
      console.log(`ok  ${nome}  ${kb} KB`);
      giaFatte.set(obj.foto, rel);
      obj.foto = rel;
      if (/^https:\/\//.test(obj.fotoRiserva || '')) delete obj.fotoRiserva;   // una riserva locale resta utile
      fatte++;
      return;
    } catch (e) {
      console.warn(`--  ${nome}: ${e.message}`);
    }
  }
  fallite++;
}

for (const s of dati.schede || []) {
  await prendi(s, `scheda-${s.id}`);
  for (const [i, g] of (s.galleria || []).entries()) await prendi(g, `scheda-${s.id}-${i + 1}`);   // la copertina ripetuta nella galleria riusa lo stesso file
}
for (const [i, sl] of ((dati.home && dati.home.slider) || []).entries()) await prendi(sl, `home-${i + 1}`);
for (const it of dati.itinerari || []) await prendi(it, `itinerario-${it.id}`);
for (const e of dati.eventi || []) await prendi(e, `evento-${e.id}`);

if (fatte) {
  await writeFile(fileDati, JSON.stringify(dati, null, 1) + '\n');
  // serve all'app quando scarica i contenuti aggiornati online: usa comunque le foto già salvate qui
  await writeFile(path.join(www, 'data', 'foto-locali.json'), JSON.stringify(Object.fromEntries(giaFatte), null, 1) + '\n');
}
console.log(`Foto scaricate: ${fatte}${fallite ? ` · non scaricate (restano online): ${fallite}` : ''}`);
