# Decisioni

Le scelte che non si capiscono dal codice, con il perché. Una per paragrafo,
le più recenti in fondo.

## Un repository per sito e web app futura

La versione 2 (sito + parti da app in Konsta) e la futura web app (area clienti,
pannello di Andrea) vivono **nello stesso progetto**. Il ponte è il questionario:
oggi manda un'email, domani apre la scheda del cliente. Con due repository
questionario, design system e contenuti andrebbero scritti due volte e il
cliente passerebbe da un sito all'altro. Le aree future saranno `/area-clienti`
e `/gestione` (vedi [`web-app.md`](web-app.md)).

## Next.js 16 + React 19

Konsta UI esiste per React, Vue e Svelte: non per i template lato server. Next è
lo stesso stack del progetto
[`transfer-luxury-driver`](https://github.com/FrancescoCorbosiero/transfer-luxury-driver)
(stessi schemi: flusso a passi, foglio dal basso, invio SES), regge pagine
statiche veloci (Server Components, quasi niente JavaScript sulle pagine di
contenuto) e domani autenticazione, database e notifiche senza cambiare stack.

## Konsta solo dove serve l'app

Le pagine editoriali sono Tailwind + il Brand System: Konsta da solo sembra
"Impostazioni di iOS". Konsta entra dove l'interazione conta: i due
questionari (liste di campi, segmenti, chip, interruttori), la barra in basso
su telefono (Tabbar + ToolbarPane, lo stile vetro di iOS 26), il menu a foglio,
la ricerca del blog. Font e verde del brand arrivano a Konsta da
`--font-ios` e `--color-brand-primary`.

## Il vetro al posto dell'ombra a timbro

Il cliente non amava il bordo spesso con l'ombra piena "cartoon". La versione
tutta piatta (v5 "editoriale" del sito Astro) era stata scartata perché
appiattiva il sito: il vetro tiene gli stessi volumi con un materiale diverso.
Konsta 5 parla la stessa lingua (vetro di iOS 26), quindi parti da sito e parti
da app si somigliano.

## Questionario: email prima, WhatsApp come scelta

Nel sito Astro il questionario apriva WhatsApp con il testo pronto e mandava
l'email come rete di sicurezza. Qui il bottone principale è "Invia ad Andrea"
(nessun cambio di app, funziona anche da desktop); WhatsApp resta a un tocco,
sia prima ("Mandala da WhatsApp", che invia comunque anche l'email) sia dopo
l'invio ("Scrivimi subito su WhatsApp"). Il contatto non si perde in nessun caso.

## Niente prenotazione dello slot (CallModal)

Il sito Astro aveva un modale-segnaposto per scegliere uno slot (cal.com mai
collegato). Il questionario ora chiede "quando preferisci la chiamata"
(mattina, pomeriggio, sera) e Andrea richiama: un passaggio in meno. Se servirà
un vero calendario, entrerà nella web app.

## Eventi che scadono da soli

Un evento `upcoming` con la data passata diventa "già svolto" senza toccare il
Markdown, e non mostra più "Riserva il tuo posto". Le pagine con date (home,
eventi) si rigenerano ogni 12 ore (`revalidate`), così il "prossimo incontro"
resta vero anche senza un nuovo deploy.

## Fogli e cronologia

Aprire il questionario o il menu aggiunge un passo alla cronologia: il gesto
"indietro" del telefono chiude il foglio invece di lasciare la pagina. Andando a
un'altra pagina dal menu, il passo viene sostituito, mai "tornato indietro"
(un "indietro" mentre parte la navigazione la annullerebbe).

## Contenuti in Markdown, per ora

Articoli ed eventi restano file Markdown con lo schema del sito Astro: Andrea li
può aggiungere senza codice e il passaggio dalla versione Astro è stato una
copia. Nel pannello della web app diventeranno modificabili da browser.

## Le animazioni: lo stesso motore GSAP del sito Astro

Nella prima stesura della versione 2 le animazioni erano state semplificate
(comparse in CSS e pochi effetti scritti a mano). Era una scelta, non un limite
di Next, e toglieva proprio una parte del carattere del sito Astro. Ora c'è lo
stesso motore: GSAP (ScrollTrigger, SplitText) e Lenis, con la stessa API ad
attributi (`src/lib/motion`). Le pagine restano Server Component e il markup
dice cosa si muove; un solo componente client (`MotionPage`, in
`app/template.tsx`) accende gli effetti a ogni pagina e li smonta prima che
React tolga la pagina, così i titoli divisi tornano com'erano.

La regola per non litigare con React: i cambi di struttura (titoli divisi da
SplitText, nodi aggiunti) solo sul markup dei Server Component o su elementi
che non cambiano mai tra un render e l'altro. Nei questionari (Konsta) si
anima solo posizione e opacità: il passo entra dal lato giusto, la zampina
salta sulla barra, i campi sbagliati fanno "no-no", all'invio partono i
coriandoli. Lo scroll morbido si ferma quando c'è un foglio aperto. Con
"riduci movimento" il motore non parte e Lenis resta spento.

## Leggerezza: misurata, non a occhio

Next + React + Konsta + GSAP sulla stessa pagina hanno un costo, e una CDN non
lo toglie: la CDN accorcia la strada dei file (cache vicina, brotli, file con
hash tenuti in cache per sempre), ma il JavaScript va comunque compilato ed
eseguito sul telefono. Per questo si misura il tempo in cui il thread
principale resta bloccato (TBT, come Lighthouse): telefono medio simulato
(412×823, CPU 4× più lenta), build di produzione, mediana di 3 caricamenti.

| Pagina | Motore GSAP alla prima versione | Ora | v2 senza GSAP |
|---|---|---|---|
| Home | 510 ms | 197 ms | 73–239 ms |
| Approccio | 278 ms | 61 ms | 54 ms |
| Consulenza | 484 ms | 154 ms | 22 ms |
| Lavora con noi | 279 ms | 82 ms | 67 ms |
| Chi sono | 424 ms | 58 ms | 59 ms |

FCP e LCP non cambiano (la pagina è HTML statico e si vede subito). Le scelte
che hanno fatto la differenza:

- **Il motore arriva dopo la pagina** (import dinamico in `MotionPage` e
  `SmoothScroll`): GSAP non si compila insieme all'idratazione. JavaScript
  iniziale della home: circa 155 KB brotli invece di 205 (i polyfill `core-js`
  li scaricano solo i browser vecchi). Con "riduci movimento" GSAP non si
  scarica proprio.
- **Rivelazioni con IntersectionObserver**, non ScrollTrigger: niente letture
  di layout all'avvio, e SplitText divide un titolo solo quando si avvicina
  (prima: tutti i titoli all'avvio, 80–137 ms da soli).
- **Sezioni ferme con `position: sticky`**, non i pin di ScrollTrigger: un pin
  creato a pagina caricata fa ricalcolare tutta la pagina (circa 150 ms) e
  aggiunge un nodo intorno alla sezione.
- **Avvio a tappe**: le sezioni legate allo scroll nascono una per task.
- **Questionari senza GSAP**: gli effetti piccoli sono Web Animations del
  browser (`fx.ts`).
- **Il codice dei fogli al primo segno di intenzione**: prima si precaricava
  a pagina ferma, ed erano 180–300 KB da compilare anche per chi legge e
  basta (e sulla pagina della consulenza, che ha il questionario in pagina).

Il sito Astro, per confronto, compilava il suo motore GSAP all'avvio: 287–475
ms di TBT sulle stesse pagine.

Dietro la CDN (header verificati sulla build, vedi `cdn-caching.md` nella
documentazione di Next 16; per Cloudflare regole e script sono in
[`cloudflare.md`](cloudflare.md)):

- Pagine statiche `s-maxage=31536000`; home ed eventi `s-maxage=43200,
  stale-while-revalidate` (si rigenerano ogni 12 ore); `/_next/static` e le
  immagini ottimizzate `max-age=…, immutable`. La CDN deve rispettare
  `Cache-Control`.
- **A ogni deploy si svuota la cache dell'HTML** sulla CDN: l'HTML vecchio
  punta ai file della build vecchia.
- I cambi pagina chiedono l'RSC con l'header `rsc` e il parametro `_rsc`
  (senza, Next risponde 307 verso l'URL giusto): la CDN deve inoltrare
  l'header e tenere i parametri nella chiave di cache, o servirebbe l'HTML al
  posto dell'RSC.
- `/_next/image` sceglie AVIF, WebP o JPEG dall'header `Accept` e risponde
  `Vary: Accept`: la CDN deve variare su `Accept` (o normalizzarlo), altrimenti
  un browser senza AVIF potrebbe ricevere un AVIF.

## Cloudflare: cosa sta in cache

Cloudflare tiene in cache HTML, RSC e file di Next seguendo il `Cache-Control`
del sito (e niente cache dove il sito non lo dice). Restano fuori:

- le API;
- le richieste RSC incoerenti, che metterebbero l'HTML al posto dell'RSC;
- `/_next/image`.

Le immagini restano fuori perché lo stesso indirizzo dà AVIF, WebP o JPEG
secondo il browser, e sui piani Free e Pro Cloudflare non può tenerne le
varianti separate. Il browser le conserva comunque per 10 anni.

Tutto questo è automatico. Il servizio `cloudflare` di `docker-compose.yml`
parte a ogni deploy e, quando il dominio pubblico serve la build nuova:

- allinea regole e impostazioni della zona;
- svuota la cache solo se la build è cambiata.

Senza token non fa nulla. Le regole create da altri non le tocca. Se il piano
rifiuta l'intestazione nella regola RSC, ripiega da solo.

Il limite di invii dei questionari legge l'IP da `CF-Connecting-IP`. Dettagli e
perché in [`cloudflare.md`](cloudflare.md).
