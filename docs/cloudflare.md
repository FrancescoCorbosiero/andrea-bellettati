# Cloudflare davanti al sito

Quasi tutto il sito è statico: Cloudflare può tenere in cache l'HTML, i dati dei
cambi pagina (RSC) e i file di Next, e il server lavora solo per le API e le
immagini. La zona è sul piano **Free** ed è dedicata a questo sito.

**Funziona da sé a ogni deploy.** Il servizio `cloudflare` di
`docker-compose.yml` parte con il solito `docker compose up -d --build`. Quando
il sito nuovo risponde anche dal dominio pubblico:

1. allinea le regole di cache ([`deploy/cloudflare/regole-cache.json`](../deploy/cloudflare/regole-cache.json));
2. allinea le impostazioni della zona;
3. svuota la cache, solo se la build è cambiata.

Il codice è in [`deploy/cloudflare/sync.mjs`](../deploy/cloudflare/sync.mjs), Node
senza dipendenze, nella stessa immagine `node:22-alpine` del Dockerfile. Senza
il file con il token il servizio non fa nulla, e il deploy funziona come prima.

> Provato contro una finta API di Cloudflare e il sito vero in locale. Non è
> provato su una zona vera: dopo il primo deploy guarda i log e lancia la
> verifica (in fondo).

## Da fare una volta sola

1. **Il token.** Cloudflare → My Profile → API Tokens → Create Token → *Custom token*.
   - **Permessi:**
     - Zone · Cache Rules · Edit
     - Zone · Zone Settings · Edit
     - Zone · Cache Purge · Purge
   - **Zone Resources:** solo la zona del sito.

   Con il solo Cache Purge il deploy svuota la cache e salta il resto (lo dice nel log).
2. **Il file.** `cp deploy/cloudflare/cloudflare.env.example deploy/cloudflare/cloudflare.env`, poi compila token e Zone ID (Panoramica del dominio, colonna di destra). Il file resta fuori da git e fuori dall'immagine del sito: il token non finisce nel container del sito.
3. **Il proxy.** Nei DNS della zona, i record del dominio e del `www` in arancione (*Proxied*).

Poi il solito deploy:

```bash
docker compose up -d --build
```

```bash
docker compose logs cloudflare
```

Nel log ci sono i passi del deploy: le regole («già a posto» o «aggiornate»), le
impostazioni cambiate, «cache svuotata» oppure «build … già pubblicata».

## Cosa sta in cache

| Cosa | Dove | Su Cloudflare | Perché |
|---|---|---|---|
| Pagine e cambi pagina (HTML e RSC) | tutto il sito | come dice il sito: un anno le pagine statiche, 12 ore home ed eventi | sono statiche; si svuota a ogni deploy |
| File di Next con hash | `/_next/static/` | un anno | il nome cambia a ogni build |
| Icone, favicon, immagine per i social | `/icons/`, `/og/`, `/favicon.ico` | un giorno | Next li manda con `max-age=0` |
| Immagini ottimizzate | `/_next/image` | mai | vedi «Perché così»; il browser le tiene comunque 10 anni |
| API dei questionari | `/api/` | mai | sono richieste personali |
| Richieste RSC incoerenti | `?_rsc=` senza intestazione `rsc`, o il contrario | mai | l'HTML finirebbe in cache al posto dell'RSC |
| 404, errori, risposte senza `Cache-Control` | — | mai | Next le manda `no-store` |

## Le regole

Quattro regole in **Caching → Cache Rules** (il piano Free ne ammette 10).
Quando più regole valgono per la stessa richiesta si sommano, e per le
impostazioni in conflitto vince l'ultima: per questo le eccezioni stanno in fondo.

1. **Sito secondo il suo Cache-Control.**
   - Espressione: `(http.host eq "DOMINIO")`
   - Eligible for cache.
   - Edge TTL: *Use cache-control header if present, bypass cache if not*.
   - Browser TTL: *Respect origin*.
   - Cache deception armor acceso. La query string resta nella chiave di cache (serve per `_rsc`).
2. **File di public/.**
   - Espressione: `/icons/`, `/og/`, `/favicon.ico`.
   - Eligible for cache.
   - Edge TTL di 1 giorno, ignorando il `Cache-Control`.
3. **Mai in cache.** `/api/`, `/_next/image` e `/.well-known/` (i certificati di Caddy): *Bypass cache*.
4. **Mai in cache: RSC incoerenti.** Le richieste con `_rsc` ma senza intestazione `rsc: 1`, o il contrario: *Bypass cache*.

Le espressioni complete sono nel JSON. Tutte le regole hanno la descrizione che
comincia con `andrea-bellettati ·`. Se sulla zona trova regole di cache create
da altri, il deploy **non le tocca** e lo scrive nel log (per sostituirle:
`CLOUDFLARE_REGOLE=sovrascrivi`).

Sul piano Free la regola 4 usa un'intestazione della richiesta. Se Cloudflare
la rifiutasse, il deploy ripiega da solo sulla variante di riserva, scritta nel
JSON: tutte le richieste con `_rsc` restano fuori dalla cache. Funziona sempre,
ma i cambi pagina passano dal server.

## Le impostazioni della zona

Il deploy le controlla e cambia solo quelle diverse:

| Impostazione | Valore | Perché |
|---|---|---|
| SSL/TLS | Full (strict) | Caddy ha un certificato vero. Con «Flexible» Cloudflare parlerebbe al sito in HTTP, Caddy rimanderebbe a HTTPS, all'infinito. |
| Always Use HTTPS | spento | Caddy ottiene e rinnova i certificati con la sfida HTTP sulla porta 80, e fa già da sé il passaggio a HTTPS, con HSTS. |
| Rocket Loader | spento | riscrive i tag `<script>`: la pagina diventerebbe interattiva tardi o male |
| Email Address Obfuscation | spento | cambia i link `mailto:` nell'HTML: React trova un HTML diverso da quello che si aspetta (errori di idratazione) |
| Browser Cache TTL | Respect Existing Headers | il browser segue le intestazioni del sito |

Consigliato a mano: **Caching → Tiered Cache → Smart Tiered Cache** (meno
richieste al server). HTTP/3 e Brotli sono già accesi.

## A mano

Dalla cartella del sito, sul server:

```bash
docker compose run --rm cloudflare verifica   # cosa risponde Cloudflare sulle pagine chiave
```

```bash
docker compose run --rm cloudflare svuota     # svuota la cache adesso
```

```bash
docker compose run --rm cloudflare regole --prova   # mostra cosa cambierebbe, senza cambiare
```

`verifica` fa due richieste per ogni indirizzo e mostra `cf-cache-status`:

| Indirizzo | Alla seconda richiesta |
|---|---|
| `/`, `/approccio`, un file in `/_next/static/` | `HIT` |
| un'immagine in `/_next/image` | `BYPASS` (o `DYNAMIC`) |
| `/api/richiesta` | `BYPASS` (o `DYNAMIC`) |
| `/approccio?_rsc=verifica` (senza intestazione `rsc`) | `BYPASS` |

## Come lavora il deploy

1. Aspetta che il container nuovo risponda (`http://web:3000`) e ne legge il build ID dall'HTML.
2. Allinea regole e impostazioni. Un errore qui (per esempio un permesso che manca al token) si scrive nel log ma non ferma niente.
3. Se il build ID è lo stesso dell'ultimo svuotamento (salvato nel volume `cloudflare-stato`), si ferma: un `docker compose up -d` senza build nuova non svuota.
4. Aspetta che il dominio pubblico serva la build nuova, chiedendo un indirizzo che non è in cache (`/?cf-sync=<build>`). Così sa che Caddy ha già girato il traffico sul container nuovo.
5. Svuota tutta la cache e si segna la build.

Perché svuotare: le pagine restano su Cloudflare fino a un anno. Dopo un deploy
l'HTML vecchio punterebbe ai file della build vecchia, che il container nuovo
non ha più. Vale anche per articoli ed eventi nuovi, che entrano con la build.

## Perché così

- **Cloudflare non distingue le risposte con `Vary`** (tranne la compressione).
  Next distingue HTML e RSC con l'intestazione `rsc`, ma mette anche
  `_rsc=<hash>` nell'indirizzo: con la query string nella chiave di cache, ogni
  variante ha la sua voce. Resta un caso: chi chiede `?_rsc=…` **senza**
  intestazione (un bot) riceve l'HTML con `s-maxage` di un anno. La regola 4 lo
  tiene fuori, altrimenti l'HTML finirebbe al posto dell'RSC e i cambi pagina
  diventerebbero ricaricamenti completi. Se l'intestazione c'è ma `_rsc` manca o
  è sbagliato, Next risponde 307 senza `Cache-Control`, quindi nemmeno quello va
  in cache.
- **Immagini.** `/_next/image` dà AVIF, WebP o JPEG allo stesso indirizzo, a
  seconda del browser (`Vary: Accept`).
  - «Vary for Images» di Cloudflare (dal piano Pro) vuole l'estensione nel percorso, e qui sta nella query.
  - Aggiungere `Accept` alla chiave di cache è solo per Enterprise.
  - Messe in cache così com'è, un iPhone vecchio potrebbe ricevere un AVIF che non sa mostrare.
  - Le immagini hanno `max-age` di 10 anni e `immutable`: dopo la prima visita le serve il browser.
- **Home ed eventi** si rigenerano ogni 12 ore (`s-maxage=43200`). Con
  `s-maxage` Cloudflare non serve la copia scaduta mentre aggiorna: dopo 12 ore la
  prima visita aspetta il server, che risponde subito dalla sua cache e rigenera
  dietro le quinte.
- **404 ed errori** arrivano `private, no-store`: con la regola 1 non vanno mai in
  cache, così un file mancante durante un deploy non resta «mancante» sulla CDN.

## L'IP dei visitatori

Il limite di invii dei questionari (6 ogni 10 minuti per IP) legge
`CF-Connecting-IP`. Senza, dietro Cloudflare userebbe l'IP del nodo di
Cloudflare: Caddy non si fida degli `X-Forwarded-For` che arrivano da fuori, e
tutti i visitatori di quel nodo finirebbero nello stesso conteggio.

Consigliato: sul server accetta le porte 80 e 443 solo dagli [IP di Cloudflare](https://www.cloudflare.com/ips/).
Così nessuno chiama il server direttamente falsando l'intestazione. Il danno
sarebbe comunque piccolo: le API hanno anche la trappola per i bot e il tempo
minimo di compilazione.

## Più avanti: le immagini sulla CDN

Se il traffico crescerà, si può usare Cloudflare Images (le trasformazioni) con
un *loader* per `next/image`:

- gli indirizzi diventano `/cdn-cgi/image/width=…,quality=…,format=auto/…`;
- Cloudflare sceglie il formato per ogni browser e tiene le varianti in cache;
- prima va attivato sulla zona, e il piano gratuito ha un tetto di trasformazioni al mese.
