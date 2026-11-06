# Specifica del sito

Ricavata dal sito statico Astro
[`comunicazionecinofila`](https://github.com/FrancescoCorbosiero/comunicazionecinofila)
(branch `claude/admiring-babbage-orxm3k`, superfici "vetro"), che resta il
riferimento visivo. Qui: a chi parla il sito, cosa contiene ogni pagina, le
regole dei testi e dei componenti. Quando la versione 2 si discosta dalla spec,
è scritto in [`decisioni.md`](decisioni.md).

## A chi parla

1. **Famiglie con un cane o un gatto** → obiettivo: il questionario della
   **consulenza gratuita** (45 minuti al telefono, piano di lavoro scritto e
   firmato, senza impegno). È il flusso principale.
2. **Chi vuole lavorare nel benessere animale** → obiettivo: "Entra nel Team"
   (TeamNutrizione, colloquio conoscitivo).

I due flussi sono sempre a un tocco: header (desktop), barra in basso
(telefono: "Consulenza" al centro, "Lavora con noi" nel menu), fine di ogni pagina.

## Voce e regole dei testi

- **Prima persona, Andrea parla.** "Ti richiamo io", "Lavoro al fianco del tuo
  veterinario, mai al suo posto".
- **Niente slogan da agenzia.** Il copy entrato con l'artifact della home v4 è
  stato ripulito ("Cani veri, ciotole vere" → "Chi ha già iniziato", ecc.).
  Frasi semplici, concrete, una cosa per frase.
- **Mai "candidatura"**: troppo formale. Si dice "Entra nel Team", "Raccontami chi
  sei", "messaggio".
- **Il veterinario resta il riferimento** per sintomi, farmaci e diagnosi. Le
  storie dei clienti sono "esperienze individuali, non promesse".
- **Trasparenza sul modello del Team**: TeamNutrizione è un Multi Level
  Marketing, si dice subito; "nessuna promessa di guadagni facili".
- Titoli: una parte in Anton maiuscolo + la parola finale a mano (Caveat), es.
  "Dimmi perché *sei qui.*"

## Pagine

| Percorso | Contenuto |
|---|---|
| `/` | Hero marrone ("Il cibo è il primo passo.", foto di Andrea in cornice di vetro, ciotola) · le due porte ("Dimmi perché sei qui") + indice dei percorsi · Chi sono (numeri: anno nel Team, contenuti, follower) · la frase dell'approccio che si accende · come funziona (4 passi sul binario) · le vostre storie (Zoe prima/dopo, pastore australiano 6 mesi, Brownie e la giardia) · Instagram · prossimo incontro · blog (3 articoli + totale) · FAQ · CTA pesca |
| `/consulenza-gratuita` | Hero con il questionario in pagina · cosa guardiamo nella call · i tre passi nel telefono · dopo il primo incontro (monitoraggio: adattamento, appetito, feci, digestione, abitudini) · tutti i modi per scrivermi |
| `/lavora-con-noi` | Copertina TeamNutrizione · hero · "Stiamo creando ~~una rete di venditori~~ un Team" · il metodo (01–03) · a chi è rivolto (parete dei profili che sceglie l'ambito) · flessibilità e formazione · trasparenza sul modello · il flusso "Entra nel Team" (`#unisciti`) |
| `/consulenza` (campagne, `noindex`) | Senza menu né piè di pagina: hero animato (titolo che sale, foto di Andrea da coccolare, pillole sui bordi) con il questionario subito · le tre promesse e chi sono · cosa succede dopo · Zoe, prima e dopo · domande · chiusura con il questionario o WhatsApp · bottone fisso sul telefono |
| `/partner` (campagne, `noindex`) | Senza menu né piè di pagina: hero animato con "Entra nel Team" subito · trasparenza sul modello · a chi è rivolto · flessibilità e formazione · domande · chiusura |
| `/privacy` | Informativa privacy e cookie, in prima persona e parole semplici: chi tratta i dati, quali e perché, chi altro li vede, fuori UE, per quanto tempo, diritti, cookie e memoria del browser |
| `/approccio` | Hero ("Non parto dal prodotto. Parto dall'animale.") · tre principi non negoziabili · tre fonti, una direzione (scienza, animale, famiglia) · proverbio ayurvedico · CTA |
| `/chi-sono` | Hero da biglietto da visita (ritratto, numeri, "Nel Team dal 2021", firma) · vivo con una bassotta (tre polaroid, citazione) · il percorso (4 tappe) · CTA con la scheda Instagram |
| `/servizi` | Tre strade (alimentazione naturale, consulenza 1:1, opportunità lavorative) · come funziona · CTA |
| `/articoli`, `/articoli/[slug]` | Blog con ricerca e categorie · articolo con indice, condivisione, correlati |
| `/eventi`, `/eventi/[slug]` | Prossimo incontro in evidenza, altri appuntamenti · pagina evento con "Riserva il tuo posto" e "Aggiungi al calendario" |

## Brand System "Branco", materiale vetro

- **Colori**: sabbia `#f1ebdf` (fondo), salvia `#6f8b60`, pesca `#f4a98a` (accento
  e CTA), pesca scuro `#d0673f` (testo pesca su chiaro), verde notte `#1f2818`,
  marrone `#4a3426` (hero), inchiostro `#15190f`.
- **Font**: Anton (titoli grandi, numeri), Bricolage Grotesque (testo, titoli
  piccoli), Caveat (note a mano). Self-hosted.
- **Vetro**: niente bordo d'inchiostro e ombra piena "a timbro". Ogni superficie
  ha un filo di luce, un riflesso in alto, un'ombra morbida tinta del suo colore;
  trasparenza vera solo dove dietro c'è qualcosa (cornici in hero, header, fogli).
  Bottoni: lastre lucide che si sollevano al passaggio con un lampo di luce.
- **Niente rotazioni, sticker scontornati, nastri** (richiesta del cliente).

## Movimento

Le animazioni sono quelle del sito Astro (`src/scripts/motion.ts`), con lo
stesso motore (GSAP + Lenis, vedi `src/lib/motion`):

- **Ovunque**: titoli che entrano a varianti (righe, parole, tendina,
  sfocatura) con la parola a mano che si sottolinea per ultima; blocchi che
  salgono, griglie a cascata con un rimbalzo; foto che si aprono da un
  ritaglio e derivano piano; testo dei bottoni che rotola; header che si
  toglie di mezzo leggendo verso il basso; wordmark del footer che sale.
- **Home**: la frase dell'approccio che si accende parola per parola, i numeri
  che contano, il binario dei quattro passi con la zampina, FAQ morbide.
- **Consulenza**: i tre passi come stories nel telefono (sezione ferma, barre
  che si riempiono), il binario del monitoraggio.
- **Lavora con noi**: lo striscione che si allontana, "una rete di venditori"
  barrata a mano mentre si scrive "un Team", le card del metodo che si
  impilano, l'evidenziatore sulle frasi della trasparenza, card che si
  inclinano verso il puntatore.
- **Approccio**: i timbri "Non negoziabile", i tre cerchi che convergono in
  una direzione (sezione ferma su desktop), il proverbio che si accende con lo
  zig-zag su "sbagliata" e l'evidenziatore su "corretta".
- **Chi sono**: le polaroid che si aprono a ventaglio, il sentiero di impronte
  che accende le tappe, il cuore che manda cuori.
- **Questionari**: passo che entra dal lato giusto, zampina sulla barra,
  scossa sugli errori, medaglietta che oscilla, spunta e coriandoli all'invio.

Senza JavaScript o con "riduci movimento" tutto è visibile e fermo.

## I questionari

Campi, opzioni e regole sono in `src/lib/forms.ts` (stessi controlli in browser
e server).

**Consulenza gratuita** — 4 passi:
1. *Il tuo animale*: cane/gatto (obbligatorio), nome (obbligatorio, inciso sulla
   medaglietta mentre lo scrivi), età (cucciolo/adulto/anziano), taglia (solo cane).
2. *La ciotola*: cosa mangia (crocchette, umido, casalinga, crudo, un po' di
   tutto) e cosa preoccupa (pelle e pelo, prurito, intestino e feci, appetito,
   peso, comportamento, energia, "voglio solo farlo mangiare meglio"), più due
   righe libere. Serve almeno una preoccupazione o le due righe.
3. *Contatti*: nome, telefono (obbligatori), email (facoltativa, per il
   riepilogo), quando chiamare (mattina/pomeriggio/sera), WhatsApp sì/no.
4. *Riepilogo*: la scheda dell'animale, modificabile, poi "Invia ad Andrea" o
   "Mandala da WhatsApp" (che la manda comunque anche per email).

**Entra nel Team** — 4 passi: chi sei (nome, email, telefono) → percorso
(occupazione, già nel settore sì/no, ambito) → progetto (perché, tempo,
Instagram/sito facoltativo) → riepilogo e invio.

**Dove arrivano**: la consulenza a `consulenze@`, Entra nel Team a `partners@`
(sul dominio del sito). L'email dice anche da quale pagina e campagna arriva la
richiesta (`utm_*`, clic da Google Ads o Meta, sito di provenienza).
