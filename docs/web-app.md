# La web app (fasi 2 e 3)

Idee messe in forma, non ancora costruite. Il sito di oggi (fase 1) è già
pensato per diventare questa app senza cambiare stack né repository.

## Perché

Dare ai clienti di Andrea un motivo per **tenere l'app sulla schermata Home**:
la scheda del loro animale, il piano firmato sempre a portata, un check-in
veloce sull'andamento, le notifiche quando c'è qualcosa di nuovo. E dare ad
Andrea **un posto solo** dove arrivano richieste, schede e progressi, invece di
email e chat sparse.

Senza qualcosa che si usa ogni settimana l'app la installa chi è curioso e poi
la toglie: il check-in è il cuore.

## Le fasi

**Fase 1 — fatta.** Sito con parti da app (Konsta), manifest per aggiungerlo
alla schermata Home, questionari che mandano email.

**Fase 2 — area clienti** (`/area-clienti`)
- Accesso con **link via email** (niente password), come in `ls-web`.
- Il questionario della consulenza, se la persona vuole, crea l'account: la
  scheda dell'animale nasce dalle risposte che ha già dato.
- **Schede degli animali** (più di uno per famiglia): specie, nome, età, taglia,
  alimentazione, preoccupazioni, foto.
- **Il piano firmato**: Andrea lo carica (PDF) o lo compone nel pannello; il
  cliente lo ritrova nella scheda.
- **Check-in** settimanale a tocchi sui cinque punti che la consulenza già
  promette di seguire: adattamento, appetito, feci, digestione, abitudini (scala
  semplice + nota libera + foto facoltativa). Andrea vede l'andamento.
- **Eventi**: iscrizione con un tocco, promemoria, aggiunta al calendario.
- **Notifiche push**: nuovo articolo, evento, promemoria del check-in, messaggio
  di Andrea.
- Installazione guidata: su iPhone non esiste il bottone "installa", serve un
  foglio che spieghi Condividi → "Aggiungi alla schermata Home" (Konsta è
  perfetta per questo). Su Android/Chrome c'è il prompt di sistema.

**Fase 3 — il pannello di Andrea** (`/gestione`)
- Richieste in arrivo (consulenza e Team) come lista con stato: nuova, chiamata
  fissata, in percorso, chiusa.
- Clienti e animali, piani, check-in con l'andamento nel tempo.
- Eventi e articoli modificabili da browser (oggi sono Markdown).
- Invio di notifiche a tutti o a gruppi (es. chi ha un gatto).
- Ruoli: Andrea (admin); domani altri consulenti del Team, ognuno con i suoi
  clienti.

## Stack in più (sopra quello di oggi)

| Bisogno | Scelta proposta |
|---|---|
| Database | PostgreSQL + **Drizzle** (migrazioni versionate) |
| Accesso | **Better Auth** con link via email (e passkey più avanti), ruoli cliente/admin |
| Email | AWS SES, come oggi |
| Notifiche | Web Push (VAPID) + service worker (Serwist) |
| File (piani, foto) | S3 o volume sul server, con URL firmati |
| Test | Playwright end-to-end sui flussi principali |

## Bozza dei dati

```
famiglia (id, nome, email, telefono, consenso_notifiche, creata_il)
animale (id, famiglia_id, specie, nome, nascita, taglia, alimentazione[], preoccupazioni[], note)
richiesta (id, tipo consulenza|team, dati_json, stato, creata_il)      ← oggi è l'email
piano (id, animale_id, file_url | contenuto, firmato_il, versione)
checkin (id, animale_id, data, adattamento, appetito, feci, digestione, abitudini, nota, foto_url)
evento (id, titolo, data, …)  iscrizione (evento_id, famiglia_id)
iscrizione_push (famiglia_id, endpoint, chiavi, dispositivo)
```

## Vincoli da tenere a mente

- **Notifiche su iPhone**: solo con l'app aggiunta alla schermata Home (iOS 16.4
  e successivi), e il permesso va chiesto dopo un tocco dell'utente.
- **Privacy**: account, schede e notifiche sono dati personali: servono
  informativa aggiornata, consensi separati (servizio e notifiche/marketing) e
  la cancellazione dell'account da app.
- **Non è una cartella clinica**: i check-in sono osservazioni della famiglia;
  diagnosi e terapie restano del veterinario (stessa linea del sito).
