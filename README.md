# Andrea Bellettati — sito (versione 2)

Sito di **Andrea Bellettati**, consulente in comportamento e nutrizione per cani e
gatti. Due pubblici, un'identità: le famiglie (questionario per la **consulenza
gratuita** di 45 minuti) e chi vuole lavorare nel benessere animale con
**TeamNutrizione** ("Lavora con noi").

È la versione 2 del sito statico Astro
[`comunicazionecinofila`](https://github.com/FrancescoCorbosiero/comunicazionecinofila),
usato come **specifica**: stessi testi (ripuliti), stessa struttura, stesso brand
("Branco", in materiale vetro). Cambia il modo in cui si usa: è un sito **ibrido**,
pagine editoriali + parti da **app** costruite con [Konsta UI](https://konstaui.com)
(questionari a passi con widget pensati per cani e gatti, barra in basso e menu a
foglio su telefono, ricerca del blog). È anche la base della futura **web app**
con area clienti: vedi [`docs/web-app.md`](docs/web-app.md).

## Comandi

> **Node ≥ 22.12** (`.nvmrc`).

```bash
npm install          # dipendenze
npm run dev          # sviluppo su http://localhost:3000
npm run build        # build di produzione (.next/standalone)
npm run start        # avvia la build
npm run check        # tipi (next typegen + tsc) + ESLint
```

Per provare i questionari senza mandare email vere:

```bash
SES_DRY_RUN=true npm run dev
```

## Stack

| | |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) + **React 19** + TypeScript |
| Stile | **Tailwind 4** con il Brand System in `src/app/globals.css` (palette, font, materiale vetro) |
| Parti "app" | **Konsta UI 5** (tema iOS, anche lo stile vetro di iOS 26) · `react-modal-sheet` per i fogli · `sonner` per gli avvisi |
| Movimento | **GSAP** (ScrollTrigger + SplitText) e **Lenis** per lo scroll morbido: il motore del sito Astro, con la stessa API ad attributi, caricato dopo la pagina (`src/lib/motion`) · CSS per le entrate del primo schermo · Web Animations per i questionari · `motion` per il pannello desktop |
| Contenuti | Markdown in `src/content/` (gray-matter + unified), schema zod |
| Email | AWS SES v2 da `/api/richiesta` |
| Deploy | Docker (Next standalone) dietro **Caddy** (caddy-docker-proxy) |

## Struttura

```
src/
  app/
    layout.tsx               # html, font, AppProvider, JSON-LD del sito
    template.tsx             # accende le animazioni di ogni pagina (si rimonta a ogni cambio pagina)
    globals.css              # ⭐ Brand System: token, vetro, bottoni, lastre, testo lungo, tema Konsta, stati delle animazioni
    (sito)/                  # le pagine del sito; layout.tsx: header, footer, barra in basso
      page.tsx               # home
      consulenza-gratuita/   # pagina della consulenza con il questionario in pagina
      lavora-con-noi/        # pagina del Team con il flusso "Entra nel Team"
      approccio/ chi-sono/ servizi/
      articoli/ [slug]/      # blog (ricerca + categorie) e articolo
      eventi/ [slug]/        # eventi, pagina evento, calendario.ics
      not-found.tsx          # 404 dentro il sito
    (campagne)/              # pagine per gli annunci, senza menu: consulenza/ e partner/
    api/richiesta/route.ts   # invio dei questionari (SES)
    sitemap.ts robots.ts manifest.ts rss.xml/ not-found.tsx (404 leggera, solo il marchio)
  components/
    app/                     # guscio da app: AppProvider (fogli, cronologia), MenuSheet
    motion/                  # MotionPage (per pagina) e SmoothScroll (Lenis, ancore, per tutta la visita)
    flows/                   # i due questionari Konsta: useFlow, ConsultFlow, TeamFlow, fields (widget)
    layout/                  # SiteHeader, MobileTabbar (Konsta), SiteFooter, Logo
    home/ blog/ events/ team/ ui/ seo/
  content/articoli/*.md      # articoli (lo slug è il nome del file)
  content/eventi/*.md        # eventi
  lib/
    site.ts                  # ⭐ contatti, numeri (STATS), link
    forms.ts                 # campi, opzioni e regole dei questionari (condivisi browser/server)
    content.ts               # lettura dei Markdown
    motion/                  # ⭐ animazioni: engine.ts (GSAP + Lenis, caricato dopo la pagina), fx.ts (effetti senza librerie), scroll.ts (Lenis per il resto del sito)
    emails.ts mail.ts rateLimit.ts seo.ts dates.ts
  assets/                    # foto (next/image) · fonts/ font self-hosted
docs/                        # spec, decisioni, Cloudflare, web app futura
deploy/cloudflare/           # Cloudflare: regole di cache e sync.mjs (gira da solo a ogni deploy)
```

## Contenuti: articoli ed eventi

Un file Markdown per articolo in `src/content/articoli/` (lo slug è il nome del
file). Campi del frontmatter:

```yaml
title: "Umido o crocchette? Come leggere davvero una dieta"
date: 2026-07-05
excerpt: "Una frase che compare nelle card e nei motori di ricerca."
category: "Alimentazione"          # Alimentazione · Comportamento · Osservazione · Gatto · Benessere
status: "published"                # oppure "coming-soon" (card "In arrivo")
featured: false                    # in evidenza in cima al blog
externalUrl: "https://…"           # facoltativo: la card porta lì (es. Instagram)
cover: "/foto/nome.jpg"            # facoltativo: foto in /public; senza, blocco colorato
```

Eventi in `src/content/eventi/`: `title`, `excerpt`, `date` (con ora e fuso, es.
`2026-02-11T21:00:00+01:00`) oppure `whenLabel` ("Su richiesta"), `status`
(`upcoming`, `coming-soon`, `on-request`, `past`), `statusLabel`, `duration`,
`locationLabel`, `collab`, `tags`, `reserveWaText` (testo WhatsApp di "Riserva il
tuo posto"), `externalUrl` / `internalUrl`. Un evento `upcoming` con la data
passata diventa "già svolto" da solo; le pagine con le date si rigenerano ogni 12
ore.

## Questionari ed email

- **Consulenza gratuita** (`ConsultFlow`): animale (cane o gatto, nome sulla
  medaglietta, età, taglia) → ciotola e preoccupazioni a chip → contatti, orario
  preferito, WhatsApp sì/no → scheda riepilogo → invio. Su telefono si apre come
  foglio dal basso da qualsiasi link a `/consulenza-gratuita#questionario`, su
  desktop come pannello; in `/consulenza-gratuita` è dentro la pagina.
- **Entra nel Team** (`TeamFlow`): chi sei → percorso → progetto → riepilogo.
- Invio: `POST /api/richiesta` → email ad Andrea (testo + HTML, con il link
  WhatsApp per rispondere) e conferma a chi ha scritto, se ha lasciato l'email.
  Due caselle: le consulenze a `consulenze@`, il Team a `partners@`
  (`SES_TO_CONSULENZE`, `SES_TO_PARTNER`). Se chi ha scritto risponde alla
  conferma, la risposta torna alla stessa casella.
- **Provenienza**: l'email dice da quale pagina arriva la richiesta e, se la
  visita è partita da una campagna, i suoi `utm_*`, il clic da Google Ads
  (`gclid`) o Meta (`fbclid`) e il sito di provenienza (`src/lib/source.ts`,
  nella scheda del browser, niente cookie).
  Chi sceglie "mandala su WhatsApp" la invia comunque anche per email, in silenzio:
  il contatto non si perde.
- Protezioni: limite di richieste per IP, campo trappola, tempo minimo di
  compilazione, convalida zod uguale in browser e server.
- Senza SES configurato la richiesta non parte e il questionario offre WhatsApp,
  l'app di posta (testo già scritto) e il telefono. `GET /api/richiesta` dice se
  l'invio è configurato.

Variabili in [`.env.example`](.env.example): `AWS_REGION`, `AWS_ACCESS_KEY_ID`,
`AWS_SECRET_ACCESS_KEY`, `SES_FROM` (mittente verificato), `SES_TO_CONSULENZE`,
`SES_TO_PARTNER`, `SES_CONFIGURATION_SET`, `SES_DRY_RUN`.

## Pagine per le campagne

Due pagine senza menu, senza piè di pagina pieno di link e senza barra in
basso, per annunci, link in bio e QR: il questionario subito, poco intorno.

| Pagina | Questionario | Casella |
|---|---|---|
| `/consulenza` | consulenza gratuita | `consulenze@` |
| `/partner` | Entra nel Team (con il modello di lavoro dichiarato) | `partners@` |

- Stanno nel gruppo `src/app/(campagne)`, con un layout che ha solo il marchio
  (non porta alla home) e WhatsApp. Le pagine del sito sono in `src/app/(sito)`.
- Fuori dai motori di ricerca (`noindex`) e dalla sitemap: le pagine del sito
  restano `/consulenza-gratuita` e `/lavora-con-noi`.
- L'hero (`components/campaign/CampaignHero.tsx`): il titolo che sale riga per
  riga, la foto nel titolo da coccolare (scodinzola, cuori al tocco), la
  sottolineatura a mano dell'ultima riga, le pillole che saltano fuori dai
  bordi del questionario, un bagliore che respira, qualche riflesso sul bottone
  principale. Tutto CSS (`globals.css`, "Pagine delle campagne"): parte prima
  del motore, non sposta il questionario sul telefono, con "riduci movimento"
  è fermo.
- Sul telefono il bottone fisso in basso riporta al questionario.
- Negli annunci si usano i parametri `utm_*` (es.
  `/consulenza?utm_source=meta&utm_campaign=autunno`): finiscono nell'email.

## Privacy e dati legali

- `/privacy`: informativa (artt. 13 GDPR) e cookie, scritta su come funziona
  davvero il sito: questionari, caselle, provenienza, fornitori (server,
  Cloudflare, Amazon SES, caselle email, WhatsApp se lo si sceglie), tempi di
  conservazione, diritti. Se cambia uno di questi, si aggiorna la pagina e la
  data in `LEGAL.aggiornata`.
- Titolare, email per la privacy, partita IVA e indirizzo stanno in `LEGAL`
  (`src/lib/site.ts`). La partita IVA arriva dal `.env`
  (`NEXT_PUBLIC_PARTITA_IVA`, entra al build: poi `docker compose up -d --build`)
  e compare da sola nei piè di pagina (obbligatoria per chi ne ha una),
  nell'informativa e nelle email.
- **Email** (`src/lib/emails.ts`): stessa veste del sito (marchio, lastra
  bianca, pesca). Ad Andrea: bottoni Chiama / WhatsApp (primo messaggio già
  scritto) / Email, la provenienza, l'ora di arrivo e il promemoria dei 24 mesi.
  A chi ha scritto: breve, i tre passi, il riepilogo; in fondo perché arriva
  l'email (servizio, non newsletter), titolare, partita IVA e informativa.
  Per vederle con dati di prova basta chiamare le funzioni con un payload.
- Accanto a ogni invio dei questionari c'è l'avviso con il link all'informativa;
  il link è anche nei piè di pagina del sito e delle campagne.
- Niente banner: il sito non usa cookie di profilazione o di statistica, solo
  `sessionStorage` (bozze e provenienza) e i cookie tecnici di Cloudflare. Un
  pixel di Meta o un tag di Google vorrebbero il consenso prima: banner e
  informativa da aggiornare insieme.
- L'informativa dice che SES invia da un centro dati UE: `AWS_REGION` resta
  europea (es. `eu-west-1`, `eu-south-1`).

## Deploy

Come il sito Astro: un container dietro Caddy, che prende i certificati da solo.

```bash
docker network create caddy        # una volta sola, se non esiste
cp .env.example .env               # dominio + credenziali SES
docker compose up -d --build
```

`NEXT_PUBLIC_SITE_URL` (URL assoluti, sitemap, Open Graph) entra al build come
argomento: cambiarlo richiede `--build`.

**Con Cloudflare davanti** (guida in [`docs/cloudflare.md`](docs/cloudflare.md))
non c'è niente in più da lanciare. Una volta sola si mette il token in
`deploy/cloudflare/cloudflare.env`. Da lì il servizio `cloudflare`, a ogni
`docker compose up -d --build`:

- allinea regole di cache e impostazioni della zona;
- svuota la cache quando la build è cambiata.

Il log si legge con `docker compose logs cloudflare`.

## Animazioni

Il motore è quello del sito Astro (`src/scripts/motion.ts`), portato in
`src/lib/motion`: GSAP con ScrollTrigger e SplitText, Lenis per lo scroll
morbido. Si usa dal markup, con attributi (l'elenco completo è in testa a
`src/lib/motion/engine.ts`):

- `data-split` sui titoli (righe, parole, tendina, sfocatura, a turno) e la
  parola `.script` che arriva per ultima con la sua sottolineatura a mano;
- `data-reveal` (o `data-reveal="stagger"` per i figli a cascata), `data-clip`
  sulle foto, `data-speed` / `data-parallax`, `data-count`, `data-hl`,
  `data-stamp`, `data-scrub`;
- le sezioni raccontate dallo scroll: `data-stories` (consulenza),
  `data-strike` e `data-stack` (lavora con noi), `data-venn` (approccio),
  `data-trail` e `data-fan` (chi sono), `data-rail` (home e consulenza);
- da toccare: `data-tilt`, `data-pet`, il testo dei `.btn` che rotola.

Le animazioni nascono a ogni pagina (`app/template.tsx`) e vengono smontate
prima che React tolga la pagina. Senza JavaScript, o con "riduci movimento",
la pagina è completa e ferma.

Per tenerlo leggero (le misure sono in `docs/decisioni.md`):

- `engine.ts` arriva con un import dinamico, dopo la pagina; con "riduci
  movimento" non si scarica nemmeno. Nessun componente lo importa in modo
  statico: chi ha bisogno di Lenis usa `scroll.ts`, i questionari usano `fx.ts`.
- Le rivelazioni partono da un IntersectionObserver (niente ScrollTrigger):
  i titoli vengono divisi solo quando si avvicinano.
- Le sezioni ferme usano `position: sticky`, non i pin di ScrollTrigger:
  `data-pin-stage` sul primo figlio della sezione (e `data-story-dock`
  intorno al telefono delle stories).
- Il codice dei fogli (questionario, menu) arriva al primo segno di
  intenzione: puntatore sopra il link, dito che tocca, focus.

**In sviluppo le animazioni partono tardi, ed è normale.** `npm run dev`
compila ogni pagina alla prima visita, manda circa 5 MB di JavaScript non
minificato (la build 0,8 MB) e usa React di sviluppo. Il motore aspetta che la
pagina sia idratata, quindi arriva dopo tutto questo. Misurato sulla home:
1,2 s dall'apertura con il server già caldo, 11 s alla prima compilazione,
0,5 s con la build. Animazioni e velocità si giudicano sulla build:

```bash
npm run build && npm run start
```

`next start` avvisa che con `output: 'standalone'` andrebbe usato
`node .next/standalone/server.js`: in locale funziona lo stesso.

## Brand e vetro, in breve

- Palette, font e materiali sono in `src/app/globals.css`: `.btn` (lastra lucida
  col lampo al passaggio, varianti `btn-dark`, `btn-cream`, `btn-ghost`),
  `.slab` (card di vetro, varianti di colore), `.eyebrow`, `.pill`, `.ticks`,
  `.icon-btn`, `.prose-ab` (articoli). Sui fondi scuri si aggiunge `.on-dark`: i
  bottoni ghost e le icone diventano vetro fumé.
- Titoli `h1`/`h2` in Anton maiuscolo, `h3` in Bricolage, la parola a mano in
  `.script` (Caveat).
- Konsta prende il font e il verde del brand da `--font-ios` e
  `--color-brand-primary`.

Altro: [`docs/spec.md`](docs/spec.md) (pagine e regole dei testi),
[`docs/decisioni.md`](docs/decisioni.md) (perché queste scelte),
[`docs/web-app.md`](docs/web-app.md) (area clienti e pannello, il futuro).
