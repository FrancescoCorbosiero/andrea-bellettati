import {
  CALL_TIMES,
  consultLines,
  consultSubject,
  petSummary,
  teamLines,
  teamSubject,
  waLinkFor,
  type ConsultPayload,
  type TeamPayload,
} from './forms';
import { LEGAL, PRIVACY_HREF, SITE_NAME, absoluteUrl, waLink } from './site';

/* =====================================================================
   Le email dei questionari, tutte con la stessa veste: marchio in alto,
   una lastra bianca, il piè di pagina.
   - Ad Andrea: si legge al volo dal telefono, con i bottoni per chiamare,
     scrivere su WhatsApp (primo messaggio già pronto) o rispondere.
   - A chi ha scritto (se ha lasciato l'email): breve, dice cosa succede
     adesso; in fondo il perché dell'email, il titolare del trattamento e
     l'informativa. È un messaggio di servizio, mai una newsletter.
   Le email non caricano font: titoli nel grassetto di sistema, uguale ovunque.
   ===================================================================== */

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const C = {
  ink: '#15190f',
  soft: '#3b4232',
  mute: '#5d6653',
  peach: '#f4a98a',
  peachSoft: '#fbe3d7',
  peachDeep: '#c75a32',
  cream: '#f1ebdf',
  line: '#e6dac6',
  mist: '#e3ebd8',
  olive: '#2f3a26',
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const SIGN = "Georgia,'Times New Roman',serif";

/** Data e ora italiane: quando è arrivata una richiesta. */
const when = (d = new Date()) =>
  new Intl.DateTimeFormat('it-IT', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Rome' })
    .format(d)
    .replace(',', ' alle');

const legalLine = () =>
  [`Titolare del trattamento: ${LEGAL.titolare}`, LEGAL.partitaIva ? `P.IVA ${LEGAL.partitaIva}` : '', LEGAL.indirizzo]
    .filter(Boolean)
    .join(' · ');

/* ── Mattoni ──────────────────────────────────────────────────────── */

function layout({ title, preheader, body, footer }: { title: string; preheader: string; body: string; footer: string }): string {
  // Il riempitivo dopo l'anteprima evita che il client mostri pezzi del corpo.
  const filler = '&#8199;&#65279;&#847; '.repeat(60);
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.cream};font-family:${FONT};color:${C.ink};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}${filler}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};"><tr><td align="center" style="padding:28px 12px 36px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="padding:0 6px 16px;">
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="vertical-align:middle;padding-right:12px;"><img src="${absoluteUrl('/icons/icon-192.png')}" width="44" height="44" alt="" style="display:block;border-radius:50%;border:2px solid #ffffff;"></td>
    <td style="vertical-align:middle;">
      <div style="font-size:15px;font-weight:800;line-height:1;letter-spacing:.08em;text-transform:uppercase;color:${C.ink};">${esc(SITE_NAME)}</div>
      <div style="margin-top:3px;font-size:12px;color:${C.mute};">Comunicazione Cinofila</div>
    </td>
  </tr></table>
</td></tr>
<tr><td style="background:#ffffff;border-radius:24px;border:1px solid ${C.line};border-top:6px solid ${C.peach};padding:24px 26px 28px;">${body}</td></tr>
<tr><td style="padding:18px 10px 0;font-size:12px;line-height:1.55;color:${C.mute};">${footer}</td></tr>
</table></td></tr></table></body></html>`;
}

const pill = (text: string, bg = C.peachSoft, color = C.peachDeep) =>
  `<span style="display:inline-block;padding:5px 11px;border-radius:999px;background:${bg};color:${color};font-size:12px;font-weight:700;letter-spacing:.02em;">${esc(text)}</span>`;

const title = (text: string) =>
  `<h1 style="margin:14px 0 10px;font-size:27px;font-weight:800;line-height:1.12;letter-spacing:-.02em;color:${C.ink};">${esc(text)}</h1>`;

const para = (html: string, extra = '') =>
  `<p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:${C.soft};${extra}">${html}</p>`;

function button(href: string, label: string, kind: 'main' | 'soft' = 'main'): string {
  const look =
    kind === 'main'
      ? `background:${C.peach};color:${C.ink};border:1px solid ${C.peach};`
      : `background:#ffffff;color:${C.ink};border:1px solid ${C.line};`;
  return `<a href="${esc(href)}" style="display:inline-block;margin:4px 6px 4px 0;padding:12px 20px;border-radius:999px;${look}font-weight:700;font-size:15px;line-height:1.2;text-decoration:none;">${esc(label)}</a>`;
}

function rows(list: [string, string][]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:6px 0 18px;">${list
    .map(
      ([k, v]) =>
        `<tr><td style="padding:9px 12px 9px 0;border-top:1px solid ${C.line};color:${C.mute};font-size:13.5px;width:36%;vertical-align:top;">${esc(k)}</td><td style="padding:9px 0;border-top:1px solid ${C.line};font-size:15px;font-weight:600;color:${C.ink};vertical-align:top;white-space:pre-wrap;">${esc(v)}</td></tr>`,
    )
    .join('')}</table>`;
}

/** I passi dopo la richiesta, con i numeri nei cerchi. */
function steps(list: [string, string][]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 18px;">${list
    .map(
      ([head, text], i) =>
        `<tr><td style="width:42px;padding:7px 0;vertical-align:top;"><div style="width:30px;height:30px;border-radius:50%;background:${i === 0 ? C.peach : C.mist};color:${C.ink};font-size:15px;font-weight:800;line-height:30px;text-align:center;">${i + 1}</div></td><td style="padding:7px 0;vertical-align:top;"><div style="font-size:15.5px;font-weight:700;color:${C.ink};">${esc(head)}</div><div style="font-size:14px;line-height:1.45;color:${C.mute};">${esc(text)}</div></td></tr>`,
    )
    .join('')}</table>`;
}

const label = (text: string) =>
  `<div style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${C.mute};">${esc(text)}</div>`;

const signature = () =>
  `<p style="margin:18px 0 0;font-size:16px;color:${C.soft};">A presto,<br><span style="font-family:${SIGN};font-style:italic;font-size:24px;color:${C.peachDeep};">Andrea</span></p>`;

/** Il piè di pagina delle conferme: perché arriva, chi tratta i dati, l'informativa. */
function legalFooter(reason: string): string {
  const privacy = absoluteUrl(PRIVACY_HREF);
  return [
    esc(reason),
    `${esc(legalLine())} · <a href="${privacy}" style="color:${C.mute};text-decoration:underline;">Informativa privacy</a>`,
    'Il veterinario resta il riferimento per diagnosi e terapie.',
  ]
    .map((t) => `<p style="margin:0 0 8px;">${t}</p>`)
    .join('');
}

function legalText(reason: string): string {
  return [
    '—',
    reason,
    `${legalLine()} · Informativa privacy: ${absoluteUrl(PRIVACY_HREF)}`,
    'Il veterinario resta il riferimento per diagnosi e terapie.',
  ].join('\n');
}

/** Il promemoria in fondo alle email ad Andrea (lo stesso tempo dell'informativa). */
const KEEP_NOTE = "Contiene dati personali: rispondi da questa casella e, se non nasce una collaborazione, cancellala entro 24 mesi dall'ultimo contatto.";

function internalFooter(): string {
  return `<p style="margin:0 0 8px;">Arrivata dal sito il ${esc(when())}.</p><p style="margin:0;">${esc(KEEP_NOTE)} <a href="${absoluteUrl(PRIVACY_HREF)}" style="color:${C.mute};text-decoration:underline;">Informativa</a></p>`;
}

/** Da dove arriva la richiesta (pagina e campagna): solo nell'email ad Andrea. */
const withSource = (list: [string, string][], source: string): [string, string][] =>
  source ? [...list, ['Arrivata da', source]] : list;

const asConsultDraft = (p: ConsultPayload) => ({ ...p, species: p.species, petName: p.petName });
const firstName = (name: string) => name.trim().split(/\s+/)[0] || name.trim();
const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

/** Link WhatsApp verso chi ha scritto, con il primo messaggio già pronto. */
const waReply = (phone: string, text: string) => {
  const wa = waLinkFor(phone);
  return wa ? `${wa}?text=${encodeURIComponent(text)}` : null;
};

/* ── Ad Andrea ────────────────────────────────────────────────────── */

/** Nuova richiesta di consulenza. */
export function consultToAndrea(p: ConsultPayload) {
  const list = withSource(consultLines(asConsultDraft(p)), p.source);
  const subject = consultSubject(p);
  const pet = petSummary(asConsultDraft(p));
  const callTime = CALL_TIMES.find((c) => c.value === p.callTime)?.label.toLowerCase();
  const wa = waReply(p.phone, `Ciao ${firstName(p.name)}, sono Andrea: ho ricevuto la tua richiesta per ${p.petName}.`);
  const text = [
    'Nuova richiesta di consulenza gratuita',
    '',
    ...list.map(([k, v]) => `${k}: ${v}`),
    '',
    wa ? `WhatsApp: ${wa}` : '',
    `Chiama: ${p.phone}`,
    '',
    `Arrivata dal sito il ${when()}. ${KEEP_NOTE}`,
  ].join('\n');
  const html = layout({
    title: subject,
    preheader: [pet, callTime ? `da chiamare di ${callTime}` : '', p.phone].filter(Boolean).join(' · '),
    body: `${pill('Nuova consulenza gratuita')}
${title(`${p.petName} e ${p.name}`)}
${para(esc(pet) + (callTime ? ` · da chiamare di ${esc(callTime)}` : ''), `color:${C.mute};font-size:15px;`)}
<div style="margin:6px 0 16px;">${button(telLink(p.phone), 'Chiama')}${wa ? button(wa, 'WhatsApp', 'soft') : ''}${p.email ? button(`mailto:${p.email}`, 'Email', 'soft') : ''}</div>
${rows(list)}`,
    footer: internalFooter(),
  });
  return { subject, text, html, replyTo: p.email || undefined };
}

/** Qualcuno vuole entrare nel Team. */
export function teamToAndrea(p: TeamPayload) {
  const list = withSource(teamLines(p), p.source);
  const subject = teamSubject(p);
  const wa = waReply(p.phone, `Ciao ${firstName(p.name)}, sono Andrea: ho ricevuto il tuo messaggio per entrare nel Team.`);
  const text = [
    'Qualcuno vuole entrare nel Team',
    '',
    ...list.map(([k, v]) => `${k}: ${v}`),
    '',
    wa ? `WhatsApp: ${wa}` : '',
    '',
    `Arrivata dal sito il ${when()}. ${KEEP_NOTE}`,
  ].join('\n');
  const html = layout({
    title: subject,
    preheader: [p.ambito, p.time, p.occupation].filter(Boolean).join(' · '),
    body: `${pill('Entra nel Team', C.mist, C.olive)}
${title(p.name)}
${para(`${esc(p.occupation)} · ${esc(p.ambito)}`, `color:${C.mute};font-size:15px;`)}
<div style="margin:6px 0 16px;">${button(`mailto:${p.email}`, 'Rispondi per email')}${wa ? button(wa, 'WhatsApp', 'soft') : ''}${button(telLink(p.phone), 'Chiama', 'soft')}</div>
${rows(list)}`,
    footer: internalFooter(),
  });
  return { subject, text, html, replyTo: p.email };
}

/* ── A chi ha scritto ─────────────────────────────────────────────── */

const CALL_WHEN: Record<string, string> = { mattina: 'di mattina', pomeriggio: 'nel pomeriggio', sera: 'di sera' };

/** Conferma a chi ha chiesto la consulenza (se ha lasciato l'email). */
export function consultConfirmation(p: ConsultPayload) {
  const name = firstName(p.name);
  const subject = `Ho ricevuto la richiesta per ${p.petName}`;
  const callTime = CALL_WHEN[p.callTime] ?? '';
  const promise = `Ti chiamo io entro 24–48 ore${callTime ? `, ${callTime}` : ''}, per fissare i 45 minuti insieme.`;
  const summary = consultLines(asConsultDraft(p)).filter(([k]) => !['Nome', 'Email', 'WhatsApp'].includes(k));
  const nextSteps: [string, string][] = [
    ['Ti chiamo io', callTime ? `Entro 24–48 ore, ${callTime}.` : 'Entro 24–48 ore.'],
    ['45 minuti insieme', 'Cosa mangia, come si comporta, come vive.'],
    ['Il piano, scritto e firmato', `Su misura per ${p.petName}. Poi decidi tu se proseguire.`],
  ];
  const reason =
    'Ricevi questa email perché hai chiesto la consulenza gratuita su andreabellettati.it. È un messaggio di servizio, non una newsletter: non ti scriverò per altro.';
  const wa = waLink(`Ciao Andrea, ti scrivo per la richiesta di consulenza di ${p.petName}.`);
  const text = [
    `Ciao ${name},`,
    '',
    `la richiesta per ${p.petName} è arrivata. ${promise}`,
    '',
    ...nextSteps.map(([t, d], i) => `${i + 1}. ${t}: ${d}`),
    '',
    'Il riepilogo:',
    ...summary.map(([k, v]) => `${k}: ${v}`),
    '',
    `Vuoi aggiungere qualcosa? Rispondi a questa email o scrivimi su WhatsApp: ${wa}`,
    '',
    'A presto,',
    'Andrea',
    '',
    legalText(reason),
  ].join('\n');
  const html = layout({
    title: subject,
    preheader: `${promise} Qui sotto il riepilogo.`,
    body: `${pill('Consulenza gratuita')}
${title(`Ciao ${name}, è arrivata!`)}
${para(`La richiesta per <strong style="color:${C.ink};">${esc(p.petName)}</strong> è nelle mie mani. ${esc(promise)}`)}
${steps(nextSteps)}
${label('Il riepilogo')}
${rows(summary)}
${para('Vuoi aggiungere qualcosa? Rispondi a questa email, oppure:')}
<div>${button(wa, 'Scrivimi su WhatsApp')}</div>
${signature()}`,
    footer: legalFooter(reason),
  });
  return { subject, text, html };
}

/** Conferma a chi vuole entrare nel Team. */
export function teamConfirmation(p: TeamPayload) {
  const name = firstName(p.name);
  const subject = `Ho ricevuto il tuo messaggio, ${name}`;
  const how = absoluteUrl('/lavora-con-noi');
  const reason =
    'Ricevi questa email perché mi hai scritto da andreabellettati.it per entrare nel Team. È un messaggio di servizio, non una newsletter: non ti scriverò per altro.';
  const wa = waLink('Ciao Andrea, ti ho appena scritto dal sito per entrare nel Team.');
  const text = [
    `Ciao ${name},`,
    '',
    'grazie, il tuo messaggio è arrivato. Ti ricontatto io per un primo confronto, senza impegno: ti racconto come funziona il Team e capiamo insieme se fa per te.',
    '',
    `Per trasparenza: TeamNutrizione lavora con un modello di Multi Level Marketing applicato al benessere animale, senza promesse di guadagni facili. Come funziona: ${how}`,
    '',
    `Se preferisci, scrivimi su WhatsApp: ${wa}`,
    '',
    'A presto,',
    'Andrea',
    '',
    legalText(reason),
  ].join('\n');
  const html = layout({
    title: subject,
    preheader: 'Ti ricontatto io per un primo confronto, senza impegno.',
    body: `${pill('Entra nel Team', C.mist, C.olive)}
${title(`Grazie ${name}, è arrivato!`)}
${para('Ti ricontatto io per un primo confronto, senza impegno: ti racconto come funziona il Team e capiamo insieme se fa per te.')}
<div style="margin:4px 0 18px;padding:14px 16px;border-radius:16px;background:${C.mist};font-size:14px;line-height:1.5;color:${C.olive};"><strong>Per trasparenza:</strong> TeamNutrizione lavora con un modello di Multi Level Marketing applicato al benessere animale, senza promesse di guadagni facili. <a href="${how}" style="color:${C.olive};font-weight:700;">Come funziona</a></div>
<div>${button(wa, 'Scrivimi su WhatsApp')}</div>
${signature()}`,
    footer: legalFooter(reason),
  });
  return { subject, text, html };
}
