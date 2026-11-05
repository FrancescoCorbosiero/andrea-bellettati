# Cloudflare davanti al sito

Quasi tutto il sito è statico: Cloudflare può tenere in cache l'HTML, i dati dei
cambi pagina (RSC) e i file di Next, e il server lavora solo per le API e le
immagini. Qui trovi:

- cosa va in cache e cosa no;
- le regole;
- le impostazioni della zona;
- lo svuotamento a ogni deploy.

Le regole sono in [`deploy/cloudflare/regole-cache.json`](../deploy/cloudflare/regole-cache.json)
e si applicano con [`deploy/cloudflare/cloudflare.sh`](../deploy/cloudflare/cloudflare.sh)
(o a mano dal pannello, sotto).

> Preparato sulla documentazione di Cloudflare e sugli header che la build manda
> davvero, ma non provato su una zona vera: dopo la prima attivazione lancia
> `deploy/cloudflare/cloudflare.sh verifica` (in fondo, cosa aspettarsi).

## In breve

| Cosa | Dove | Su Cloudflare | Perché |
|---|---|---|---|
| Pagine e cambi pagina (HTML e RSC) | tutto il sito | in cache come dice il sito: un anno le pagine statiche, 12 ore home ed eventi | sono statiche; si svuota a ogni deploy |
| File di Next con hash | `/_next/static/` | un anno | il nome cambia a ogni build |
| Icone, favicon, immagine per i social | `/icons/`, `/og/`, `/favicon.ico` | un giorno | Next li manda con `max-age=0` |
| Immagini ottimizzate | `/_next/image` | mai | vedi «Perché così»; il browser le tiene comunque 10 anni |
| API dei questionari | `/api/` | mai | sono richieste personali |
| Richieste RSC incoerenti | `?_rsc=` senza intestazione `rsc`, o il contrario | mai | l'HTML finirebbe in cache al posto dell'RSC |
| 404, errori, risposte senza `Cache-Control` | — | mai | Next le manda `no-store` |

## Prima di accendere il proxy (nuvola arancione)

Dal pannello della zona:

- **SSL/TLS → Full (strict).** Caddy ha un certificato vero (Let's Encrypt).
- **SSL/TLS → Edge Certificates → Always Use HTTPS: spento.**
  - Caddy rinnova i certificati con la sfida HTTP sulla porta 80. Se Cloudflare reindirizza a HTTPS prima, i rinnovi falliscono.
  - Il passaggio a HTTPS lo fa già Caddy, con HSTS.
- **Speed → Rocket Loader: spento.** Riscrive i tag `<script>`: la pagina diventerebbe interattiva tardi o male.
- **Scrape Shield → Email Address Obfuscation: spento.** Cambia i link `mailto:` nell'HTML, e React trova un HTML diverso da quello che si aspetta (errori di idratazione). L'email di Andrea è nel footer, nella pagina della consulenza e nei questionari.
- **Caching → Configuration → Browser Cache TTL: Respect Existing Headers.**
- Consigliati: **Caching → Tiered Cache → Smart Tiered Cache** (meno richieste al server). HTTP/3 e Brotli sono già accesi.

Rocket Loader, offuscamento delle email e Browser Cache TTL li imposta anche lo
script, insieme alle regole.

## Le regole di cache

Si creano in **Caching → Cache Rules**, in quest'ordine. Se più regole valgono
per la stessa richiesta, si sommano, e per le impostazioni in conflitto vince
l'ultima: per questo le eccezioni stanno in fondo. Al posto di `DOMINIO` va il
dominio del sito (`SITE_DOMAIN` nel `.env`).

**1. Sito secondo il suo Cache-Control**

```
(http.host eq "DOMINIO")
```

- **Cache eligibility:** Eligible for cache.
- **Edge TTL:** *Use cache-control header if present, bypass cache if not*.
- **Browser TTL:** *Respect origin*.
- **Cache key:** Cache deception armor acceso; la query string resta tutta nella chiave (è il default, e serve per `_rsc`).

**2. File di public/: un giorno**

```
(http.host eq "DOMINIO" and (starts_with(http.request.uri.path, "/icons/") or starts_with(http.request.uri.path, "/og/") or http.request.uri.path eq "/favicon.ico"))
```

- **Cache eligibility:** Eligible for cache.
- **Edge TTL:** *Ignore cache-control header and use this TTL*, 1 giorno.
- **Browser TTL:** *Respect origin*.

**3. Mai in cache: API, immagini ottimizzate, certificati**

```
(http.host eq "DOMINIO" and (starts_with(http.request.uri.path, "/api/") or http.request.uri.path eq "/_next/image" or starts_with(http.request.uri.path, "/.well-known/")))
```

- **Cache eligibility:** Bypass cache.

**4. Mai in cache: richieste RSC incoerenti**

```
(http.host eq "DOMINIO" and ((http.request.uri.query contains "_rsc" and not any(http.request.headers["rsc"][*] eq "1")) or (any(http.request.headers["rsc"][*] eq "1") and not (http.request.uri.query contains "_rsc"))))
```

- **Cache eligibility:** Bypass cache.

**Via API**, le stesse quattro regole più le impostazioni della zona:

```bash
deploy/cloudflare/cloudflare.sh regole --prova   # mostra le richieste, non manda niente
```

```bash
deploy/cloudflare/cloudflare.sh regole           # chiede conferma, poi applica
```

Attenzione: le regole dello script **sostituiscono tutte** le regole di cache
della zona. Se sulla zona ci sono altri siti con regole loro, aggiungi queste a
mano dal pannello.

## Il token per lo script

Cloudflare → My Profile → API Tokens → Create Token → *Custom token*:

- **Permessi:**
  - Zone · Cache Rules · Edit
  - Zone · Zone Settings · Edit
  - Zone · Cache Purge · Purge
- **Zone Resources:** solo la zona del sito.

Token e Zone ID vanno in `deploy/cloudflare/cloudflare.env` (modello in
`cloudflare.env.example`, il file resta fuori da git). Non vanno nel `.env` del
sito, così il token non finisce nel container.

## A ogni deploy: svuota la cache

Le pagine restano su Cloudflare fino a un anno. Dopo un deploy l'HTML vecchio
punterebbe ai file della build vecchia, che il nuovo container non ha più.
Quindi, appena il nuovo container risponde:

```bash
docker compose up -d --build
```

```bash
deploy/cloudflare/cloudflare.sh svuota --si
```

Vale anche per articoli ed eventi nuovi: entrano con la build, quindi con un deploy.

## Verifica

```bash
deploy/cloudflare/cloudflare.sh verifica
```

Fa due richieste per ogni indirizzo chiave e mostra `cf-cache-status` (cosa ha
fatto Cloudflare) accanto al `Cache-Control` del sito. Cosa aspettarsi:

| Indirizzo | `cf-cache-status` alla seconda richiesta |
|---|---|
| `/`, `/approccio`, un file in `/_next/static/` | `HIT` |
| un'immagine in `/_next/image` | `BYPASS` (o `DYNAMIC`) |
| `/api/richiesta` | `BYPASS` (o `DYNAMIC`) |
| `/approccio?_rsc=verifica` (senza intestazione `rsc`) | `BYPASS` |

Se l'ultima riga dice `HIT`, la regola 4 non è attiva. Se Cloudflare rifiuta
l'espressione con `http.request.headers` sul tuo piano, sostituiscila con la
versione senza intestazioni:

```
(http.host eq "DOMINIO" and http.request.uri.query contains "_rsc")
```

Funziona sempre, ma lascia fuori dalla cache tutti i cambi pagina.

## Perché così

- **Cloudflare non distingue le risposte con `Vary`** (tranne la compressione).
  Next distingue HTML e RSC con l'intestazione `rsc`, ma mette anche
  `_rsc=<hash>` nell'indirizzo: con la query string nella chiave di cache, ogni
  variante ha la sua voce. Resta un caso: chi chiede `?_rsc=…` **senza**
  intestazione (un bot) riceve l'HTML con `s-maxage` di un anno. La regola 4 lo
  tiene fuori dalla cache, altrimenti l'HTML finirebbe al posto dell'RSC e i
  cambi pagina diventerebbero ricaricamenti completi. Se l'intestazione c'è ma
  `_rsc` manca o è sbagliato, Next risponde 307 senza `Cache-Control`, quindi
  nemmeno quello va in cache.
- **Immagini.** `/_next/image` dà AVIF, WebP o JPEG allo stesso indirizzo, a
  seconda del browser (`Vary: Accept`).
  - «Vary for Images» di Cloudflare (Pro e sopra) vuole l'estensione nel percorso, e qui sta nella query.
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
