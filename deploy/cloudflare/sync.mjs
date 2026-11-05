#!/usr/bin/env node
/* =====================================================================
   Cloudflare davanti al sito (perché: docs/cloudflare.md). Niente
   dipendenze: solo Node 22.

   Gira da solo a ogni deploy: è il servizio "cloudflare" di
   docker-compose.yml. Quando il sito nuovo risponde anche dal dominio
   pubblico allinea le regole di cache e le impostazioni della zona, poi
   svuota la cache (solo se la build è cambiata dall'ultima volta).

   A mano, dalla cartella del sito:
     docker compose run --rm cloudflare svuota     svuota la cache
     docker compose run --rm cloudflare regole     regole + impostazioni
     docker compose run --rm cloudflare verifica   cosa risponde Cloudflare
     … --prova                                     mostra, senza cambiare nulla

   Variabili (deploy/cloudflare/cloudflare.env, fuori da git):
     CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID   senza, il deploy non fa nulla
     CLOUDFLARE_REGOLE=sovrascrivi              sostituisce anche le regole di
                                                cache non create da qui
   ===================================================================== */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const env = process.env;
const API = (env.CLOUDFLARE_API ?? 'https://api.cloudflare.com/client/v4').replace(/\/$/, '');
const TOKEN = env.CLOUDFLARE_API_TOKEN?.trim() ?? '';
const ZONE = env.CLOUDFLARE_ZONE_ID?.trim() ?? '';
const DOMAIN = env.SITE_DOMAIN?.trim() ?? '';
// Il sito dentro la rete di Docker, e lo stesso sito visto da fuori.
const ORIGIN = (env.ORIGIN_URL ?? 'http://web:3000').replace(/\/$/, '');
const PUBLIC = (env.PUBLIC_URL ?? (DOMAIN ? `https://${DOMAIN}` : '')).replace(/\/$/, '');
// L'ultima build per cui si è svuotata la cache (volume "cloudflare-stato").
const STATE = env.CLOUDFLARE_STATO ?? '/stato/ultima-build';
const ARGS = process.argv.slice(2);
const COMMAND = ARGS.find((a) => !a.startsWith('--')) ?? 'deploy';
const PROVA = ARGS.includes('--prova');

/** Le regole create da qui hanno questa descrizione: le altre non si toccano. */
const PREFIX = 'andrea-bellettati · ';
const PHASE = 'http_request_cache_settings';

/** Le impostazioni della zona che il sito vuole (perché: docs/cloudflare.md). */
const SETTINGS = [
  ['ssl', 'strict'], // Caddy ha un certificato vero
  ['always_use_https', 'off'], // Caddy rinnova i certificati sulla porta 80 e fa già il redirect
  ['rocket_loader', 'off'], // riscrive gli script di Next
  ['email_obfuscation', 'off'], // cambia i mailto: e rompe l'idratazione di React
  ['browser_cache_ttl', 0], // il browser segue le intestazioni del sito
];

const log = (msg) => console.log(`[cloudflare] ${msg}`);
const warn = (msg) => console.warn(`[cloudflare] ! ${msg}`);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class CloudflareError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/** Una chiamata all'API. In prova le scritture si mostrano e basta. */
async function cf(method, path, body) {
  if (PROVA && method !== 'GET') {
    log(`(prova) ${method} ${path}${body ? `\n${JSON.stringify(body, null, 2)}` : ''}`);
    return null;
  }
  if (!TOKEN) return null; // prova senza token: niente letture
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(20_000),
  });
  const data = await res.json().catch(() => null);
  if (!data?.success) {
    const why = data?.errors?.map((e) => [e.code, e.message].filter(Boolean).join(' ')).join('; ') || `HTTP ${res.status}`;
    throw new CloudflareError(why, res.status);
  }
  return data.result;
}

/* ── Regole di cache ──────────────────────────────────────────────── */
async function wantedRules() {
  if (!/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/.test(DOMAIN)) throw new Error(`SITE_DOMAIN non sembra un dominio: «${DOMAIN}»`);
  const raw = await readFile(join(DIR, 'regole-cache.json'), 'utf8');
  return JSON.parse(raw.replaceAll('__DOMINIO__', DOMAIN)).rules;
}

/** Le regole come le vuole l'API; con fallback, le espressioni di riserva. */
const forApi = (rules, fallback = false) =>
  rules.map(({ riserva, ...rule }) => (fallback && riserva ? { ...rule, expression: riserva } : rule));

const sorted = (v) =>
  Array.isArray(v)
    ? v.map(sorted)
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sorted(v[k])]))
      : v;
/** Ciò che conta di una lista di regole, per capire se sono già quelle giuste. */
const essence = (rules) =>
  JSON.stringify(
    sorted(rules.map(({ description, expression, action, action_parameters, enabled }) => ({ description, expression, action, action_parameters, enabled: enabled !== false }))),
  );

async function syncRules() {
  const wanted = await wantedRules();
  const path = `/zones/${ZONE}/rulesets/phases/${PHASE}/entrypoint`;
  let current = [];
  try {
    current = (await cf('GET', path))?.rules ?? [];
  } catch (e) {
    if (e.status !== 404) throw e; // 404: la zona non ha ancora regole di cache
  }
  const foreign = current.filter((r) => !(r.description ?? '').startsWith(PREFIX));
  if (foreign.length && env.CLOUDFLARE_REGOLE !== 'sovrascrivi') {
    warn(
      `sulla zona ci sono regole di cache non create da qui, e non le tocco:\n${foreign
        .map((r) => `    · ${r.description || r.expression}`)
        .join('\n')}\n  Per sostituirle tutte: CLOUDFLARE_REGOLE=sovrascrivi in cloudflare.env.`,
    );
    return;
  }
  const full = forApi(wanted);
  const lite = forApi(wanted, true);
  if (current.length && (essence(current) === essence(full) || essence(current) === essence(lite))) {
    log('regole di cache: già a posto');
    return;
  }
  try {
    await cf('PUT', path, { rules: full });
    log(`regole di cache: ${PROVA ? 'da aggiornare' : 'aggiornate'} (${full.length})`);
  } catch (e) {
    if (essence(full) === essence(lite)) throw e;
    // Se il piano non ammette le intestazioni nelle regole, si ripiega su
    // una variante che lascia fuori dalla cache tutti i cambi pagina.
    warn(`Cloudflare ha rifiutato le regole (${e.message}): uso la variante senza intestazioni`);
    await cf('PUT', path, { rules: lite });
    log('regole di cache: aggiornate (variante senza intestazioni: i cambi pagina restano fuori dalla cache)');
  }
}

/* ── Impostazioni della zona ──────────────────────────────────────── */
async function syncSettings() {
  for (const [id, value] of SETTINGS) {
    try {
      const now = (await cf('GET', `/zones/${ZONE}/settings/${id}`))?.value;
      if (now === value) continue;
      await cf('PATCH', `/zones/${ZONE}/settings/${id}`, { value });
      log(`impostazione ${id}: ${now ?? '?'} → ${value}`);
    } catch (e) {
      warn(`impostazione ${id}: ${e.message}${e.status === 403 ? ' (al token manca Zone Settings: Edit)' : ''}`);
    }
  }
}

/* ── Cache ────────────────────────────────────────────────────────── */
async function purge() {
  await cf('POST', `/zones/${ZONE}/purge_cache`, { purge_everything: true });
  log(PROVA ? 'cache: da svuotare' : 'cache svuotata: la prossima visita prende la versione nuova');
}

/* ── Deploy ───────────────────────────────────────────────────────── */
async function page(url) {
  try {
    const res = await fetch(url, { headers: { 'cache-control': 'no-cache' }, signal: AbortSignal.timeout(10_000) });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

async function waitFor(url, ok, ms) {
  const until = Date.now() + ms;
  for (;;) {
    const text = await page(url);
    if (text !== null && ok(text)) return text;
    if (Date.now() > until) return null;
    await sleep(2000);
  }
}

/** Il build ID di Next dentro l'HTML (nei dati RSC della pagina). */
const buildOf = (html) => html.match(/\\"b\\":\\"([\w-]{6,})\\"/)?.[1] ?? null;

async function readState() {
  try {
    return (await readFile(STATE, 'utf8')).trim() || null;
  } catch {
    return null;
  }
}

async function writeState(build) {
  try {
    await mkdir(dirname(STATE), { recursive: true });
    await writeFile(STATE, `${build}\n`);
  } catch (e) {
    warn(`non riesco a segnarmi la build svuotata (${e.message})`);
  }
}

/** Regole e impostazioni non fermano mai il deploy: si avvisa e si va avanti. */
async function softly(name, fn) {
  try {
    await fn();
  } catch (e) {
    warn(`${name}: ${e.message}${e.status === 403 ? ' (permesso mancante nel token)' : ''}`);
  }
}

async function deploy() {
  if (!TOKEN || !ZONE) {
    log('non configurato (manca deploy/cloudflare/cloudflare.env): niente da fare');
    return;
  }
  log(`aspetto il sito nuovo su ${ORIGIN} …`);
  const html = await waitFor(`${ORIGIN}/`, () => true, 180_000);
  if (!html) throw new Error(`il sito non risponde su ${ORIGIN}: la cache resta com'è`);
  const build = buildOf(html);

  await softly('regole di cache', syncRules);
  await softly('impostazioni della zona', syncSettings);

  if (build && build === (await readState())) {
    log(`build ${build} già pubblicata: niente da svuotare`);
    return;
  }
  // Caddy deve aver già girato il traffico sul container nuovo: lo si
  // chiede al dominio pubblico (un indirizzo che non è in cache).
  if (PUBLIC && build) {
    log(`aspetto che ${PUBLIC} serva la build nuova …`);
    const seen = await waitFor(`${PUBLIC}/?cf-sync=${build}`, (t) => buildOf(t) === build, 120_000);
    if (!seen) warn('dal dominio pubblico non vedo ancora la build nuova: svuoto lo stesso');
  } else {
    await sleep(10_000);
  }
  await purge();
  if (build && !PROVA) await writeState(build);
}

/* ── Verifica ─────────────────────────────────────────────────────── */
async function check() {
  if (!PUBLIC) throw new Error('manca SITE_DOMAIN');
  const html = (await page(`${PUBLIC}/`)) ?? '';
  const chunk = html.match(/\/_next\/static\/chunks\/[\w.~-]+\.js/)?.[0];
  const image = html.match(/\/_next\/image\?url=[^"\s,]+/)?.[0]?.replaceAll('&amp;', '&');
  const urls = ['/', '/approccio', chunk, image, '/api/richiesta', '/approccio?_rsc=verifica'].filter(Boolean);
  console.log(`${'INDIRIZZO'.padEnd(46)}${'CLOUDFLARE'.padEnd(12)}CACHE-CONTROL DEL SITO`);
  for (const url of urls) {
    // La prima richiesta riempie la cache, la seconda dice cosa fa Cloudflare.
    await fetch(PUBLIC + url)
      .then((r) => r.body?.cancel())
      .catch(() => {});
    const res = await fetch(PUBLIC + url).catch(() => null);
    await res?.body?.cancel();
    const status = res?.headers.get('cf-cache-status') ?? '-';
    console.log(`${url.slice(0, 44).padEnd(46)}${status.padEnd(12)}${res?.headers.get('cache-control') ?? '-'}`);
  }
  console.log('\nAtteso: HIT su /, /approccio e sul file di Next; BYPASS o DYNAMIC su');
  console.log('immagine, API e _rsc senza intestazione rsc.');
}

/* ── Comandi ──────────────────────────────────────────────────────── */
const COMMANDS = {
  deploy,
  regole: async () => {
    await syncRules();
    await syncSettings();
  },
  svuota: purge,
  verifica: check,
};

const run = COMMANDS[COMMAND];
if (!run) {
  console.error(`Comando sconosciuto: ${COMMAND}. Comandi: deploy, regole, svuota, verifica (con --prova per provare).`);
  process.exit(2);
}
if ((COMMAND === 'regole' || COMMAND === 'svuota') && (!ZONE || (!TOKEN && !PROVA))) {
  console.error('[cloudflare] ✗ mancano CLOUDFLARE_API_TOKEN e CLOUDFLARE_ZONE_ID (deploy/cloudflare/cloudflare.env)');
  process.exit(1);
}
run().catch((e) => {
  console.error(`[cloudflare] ✗ ${e.message}`);
  process.exit(1);
});
