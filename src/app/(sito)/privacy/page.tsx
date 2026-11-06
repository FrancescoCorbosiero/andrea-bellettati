import { pageMetadata } from '@/lib/seo';
import { EMAIL_CONSULENZE, EMAIL_PARTNER, LEGAL } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Privacy e cookie',
  description:
    'Quali dati raccoglie il sito di Andrea Bellettati, perché, per quanto tempo e come chiederne la cancellazione. Niente cookie di profilazione.',
  path: '/privacy',
});

/* Informativa ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679 (GDPR)
   e delle linee guida del Garante sui cookie (2021). Scritta su come
   funziona davvero il sito: questionari (src/lib/forms.ts), invio
   (api/richiesta, SES), provenienza (src/lib/source.ts), memoria del browser
   (bozze). Se cambia uno di questi, va aggiornata anche qui, con la data. */
export default function PrivacyPage() {
  const mail = (
    <a href={`mailto:${LEGAL.email}`}>
      {LEGAL.email}
    </a>
  );
  return (
    <article className="section">
      <div className="wrap-narrow flex flex-col gap-8">
        <header className="flex flex-col items-start gap-4">
          <span className="eyebrow">Privacy e cookie</span>
          <h1 className="display-lg">I tuoi dati, detti semplici.</h1>
          <p className="lead">
            Raccolgo solo ciò che serve per risponderti. Non vendo i tuoi dati, non li uso per la pubblicità e il sito non usa
            cookie di profilazione.
          </p>
          <p className="text-[14px] text-ink-mute">Ultimo aggiornamento: {LEGAL.aggiornata}</p>
        </header>

        <div className="prose-ab">
          <h2>Chi tratta i tuoi dati</h2>
          <p>
            Il titolare del trattamento sono io, <strong>{LEGAL.titolare}</strong>
            {LEGAL.indirizzo ? `, ${LEGAL.indirizzo}` : ''}
            {LEGAL.partitaIva ? `, P.IVA ${LEGAL.partitaIva}` : ''}. Per qualsiasi domanda sui tuoi dati scrivimi a {mail}.
          </p>

          <h2>Quali dati, e perché</h2>
          <h3>Il questionario della consulenza gratuita</h3>
          <p>
            Nome e cognome, telefono, email (se la lasci), quando preferisci essere chiamato e se va bene WhatsApp. Poi ciò che mi
            racconti del tuo animale: cane o gatto, nome, età, taglia, cosa mangia, cosa ti preoccupa e le righe che scrivi tu.
          </p>
          <p>
            Mi servono per richiamarti, preparare e fare la consulenza, e mandarti il riepilogo se hai lasciato l&apos;email. La
            base giuridica è la tua richiesta: sono misure precontrattuali prese su tua iniziativa (art. 6, par. 1, lett. b del
            GDPR). La richiesta arriva alla casella {EMAIL_CONSULENZE}.
          </p>
          <p>
            Nelle righe libere non serve scrivere dati sulla tua salute o su quella di altre persone: ti chiedo solo del tuo
            animale.
          </p>

          <h3>Il messaggio per entrare nel Team</h3>
          <p>
            Nome e cognome, email, telefono, di cosa ti occupi, se lavori già nel settore animale, il tuo ambito, perché ti
            interessa, quanto tempo vorresti dedicare e, se lo indichi, il tuo profilo social o sito.
          </p>
          <p>
            Mi servono per ricontattarti e fare un primo confronto su TeamNutrizione, come mi chiedi tu (art. 6, par. 1, lett. b
            del GDPR). Il messaggio arriva alla casella {EMAIL_PARTNER}.
          </p>

          <h3>Da dove arriva la richiesta</h3>
          <p>
            Insieme al questionario mi arrivano la pagina da cui l&apos;hai inviato e, se sei arrivato da un annuncio o da un
            link di una campagna, i suoi parametri (per esempio &quot;campagna di autunno su Instagram&quot;), se hai cliccato
            un annuncio di Google o di Meta e il sito da cui sei arrivato. Non contiene il tuo indirizzo IP e non serve a
            profilarti: mi dice solo quali pagine e quali annunci funzionano. Si basa sul mio legittimo interesse a capire come
            mi trovano le persone (art. 6, par. 1, lett. f del GDPR).
          </p>

          <h3>Se mi scrivi direttamente</h3>
          <p>
            Se mi scrivi su WhatsApp, per email o mi telefoni, uso i dati che mi dai solo per risponderti (art. 6, par. 1, lett. b
            del GDPR).
          </p>

          <h3>Dati tecnici</h3>
          <p>
            Come ogni sito, il server riceve l&apos;indirizzo IP e i dati tecnici della connessione. Li uso solo per far
            funzionare il sito e proteggerlo da abusi: per esempio si possono inviare al massimo 6 questionari in 10 minuti
            dallo stesso indirizzo, e questo conteggio resta nella memoria del server per circa 10 minuti, poi sparisce. Base
            giuridica: il mio legittimo interesse alla sicurezza del sito (art. 6, par. 1, lett. f del GDPR). I log del sito
            non contengono il tuo indirizzo IP né le risposte dei questionari.
          </p>

          <h2>Cosa è obbligatorio</h2>
          <p>
            Nei questionari alcuni campi sono obbligatori (per la consulenza: nome, telefono e qualcosa sul tuo animale; per il
            Team: nome, email, telefono e qualche riga su di te). Senza, non posso ricontattarti. Tutto il resto è facoltativo.
          </p>

          <h2>Chi altro vede i dati</h2>
          <p>
            Le richieste le leggo io. Per far funzionare il sito mi appoggio ad alcuni fornitori, che trattano i dati solo per
            mio conto e secondo le mie istruzioni (responsabili del trattamento):
          </p>
          <ul>
            <li>il fornitore del server che ospita il sito;</li>
            <li>Cloudflare, Inc., che distribuisce le pagine del sito e lo protegge da attacchi e bot;</li>
            <li>Amazon Web Services EMEA SARL (Amazon SES), che invia le email dei questionari da un centro dati nell&apos;Unione europea;</li>
            <li>il fornitore delle caselle email in cui arrivano le richieste.</li>
          </ul>
          <p>
            Se scegli di scrivermi su WhatsApp, il messaggio passa da WhatsApp Ireland Limited (gruppo Meta), che lo tratta come
            titolare autonomo, secondo la propria informativa. I dati possono essere comunicati alle autorità solo se la legge
            lo impone. Non li vendo, non li cedo e non li uso per la pubblicità.
          </p>

          <h2>Fuori dall&apos;Unione europea</h2>
          <p>
            Cloudflare e Amazon appartengono a gruppi con sede negli Stati Uniti: alcuni dati, come l&apos;indirizzo IP che passa
            dalla rete di Cloudflare, possono essere trattati fuori dall&apos;Unione europea. Questi trasferimenti sono coperti
            dal Data Privacy Framework UE-USA e dalle clausole contrattuali standard approvate dalla Commissione europea.
          </p>

          <h2>Per quanto tempo</h2>
          <ul>
            <li>
              <strong>Richieste</strong> (consulenza e Team): per il tempo che serve a risponderti e seguirti, e al massimo 24 mesi
              dall&apos;ultimo contatto se non nasce una collaborazione. Poi le cancello.
            </li>
            <li>
              <strong>Se nasce un rapporto di lavoro</strong>: per tutta la sua durata. I documenti fiscali, come le fatture, per
              10 anni, come chiede la legge (art. 6, par. 1, lett. c del GDPR).
            </li>
            <li>
              <strong>Conteggio degli invii</strong>: circa 10 minuti, nella memoria del server.
            </li>
            <li>
              <strong>Bozza del questionario</strong>: nel tuo browser, finché non chiudi la scheda (vedi sotto).
            </li>
          </ul>

          <h2>Niente decisioni automatiche</h2>
          <p>
            Nessuna decisione che ti riguarda viene presa da un algoritmo e nessuno ti profila: ogni richiesta la leggo e la
            valuto io. I questionari sono pensati per persone maggiorenni.
          </p>

          <h2>I tuoi diritti</h2>
          <p>
            Puoi chiedermi in qualsiasi momento di vedere i dati che ho su di te, di correggerli, di cancellarli, di limitarne
            l&apos;uso o di riceverli in un formato leggibile (artt. 15–20 del GDPR). Puoi anche opporti ai trattamenti basati
            sul legittimo interesse (art. 21). Basta scrivermi a {mail}: rispondo entro un mese, di solito molto prima.
          </p>
          <p>
            Se pensi che i tuoi dati siano trattati in modo scorretto, puoi presentare reclamo al Garante per la protezione dei
            dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">garanteprivacy.it</a>).
          </p>

          <h2 id="cookie">Cookie e memoria del browser</h2>
          <p>
            Il sito <strong>non usa cookie di profilazione, di pubblicità o di statistica</strong>, né miei né di altri. Per
            questo non ti chiede di accettare niente.
          </p>
          <p>
            Usa solo la memoria della scheda del browser (sessionStorage), che resta sul tuo dispositivo, non arriva a nessun
            altro e si svuota da sola quando chiudi la scheda:
          </p>
          <ul>
            <li>
              <strong>la bozza dei questionari</strong> (<code>ab:consulenza</code>, <code>ab:team</code>): se chiudi il
              questionario e lo riapri, ritrovi quello che avevi scritto;
            </li>
            <li>
              <strong>la pagina da cui sei entrato e la campagna</strong> (<code>ab:arrivo</code>): mi arriva solo se invii un
              questionario, come descritto sopra.
            </li>
          </ul>
          <p>
            Cloudflare può impostare cookie tecnici di sicurezza (per esempio <code>__cf_bm</code> o <code>cf_clearance</code>)
            per distinguere le persone dai bot. Servono a proteggere il sito e non richiedono il consenso.
          </p>
          <p>
            Puoi cancellare questa memoria e i cookie dalle impostazioni del browser. Se un giorno userò strumenti per misurare
            gli annunci (come il pixel di Meta o i tag di Google), ti chiederò prima il consenso e aggiornerò questa pagina.
          </p>

          <h2>Modifiche</h2>
          <p>
            Se cambia qualcosa nel modo in cui tratto i dati, aggiorno questa pagina e la data in alto. Per dubbi o richieste:{' '}
            {mail}.
          </p>
        </div>
      </div>
    </article>
  );
}
