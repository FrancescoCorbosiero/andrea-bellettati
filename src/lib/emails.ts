import {
  consultLines,
  consultSubject,
  teamLines,
  teamSubject,
  waLinkFor,
  type ConsultPayload,
  type TeamPayload,
} from './forms';

/* =====================================================================
   I testi delle email: quella ad Andrea (leggibile al volo dal telefono,
   con il link WhatsApp già pronto per rispondere) e la conferma a chi
   ha scritto, se ha lasciato l'email.
   ===================================================================== */

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const C = { ink: '#15190f', mute: '#5d6653', peach: '#f4a98a', peachDeep: '#d0673f', cream: '#f1ebdf', line: '#e6dac6' };

function layout(title: string, inner: string): string {
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;padding:24px 12px;background:${C.cream};font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${C.ink};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:22px;border:1px solid ${C.line};">
<tr><td style="padding:28px 28px 8px;">${inner}</td></tr>
<tr><td style="padding:8px 28px 26px;color:${C.mute};font-size:12px;">Andrea Bellettati · Comunicazione Cinofila</td></tr>
</table></td></tr></table></body></html>`;
}

function rowsHtml(rows: [string, string][]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:14px 0;">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:9px 12px 9px 0;border-top:1px solid ${C.line};color:${C.mute};font-size:14px;width:38%;vertical-align:top;">${esc(k)}</td><td style="padding:9px 0;border-top:1px solid ${C.line};font-size:15px;font-weight:600;vertical-align:top;white-space:pre-wrap;">${esc(v)}</td></tr>`,
    )
    .join('')}</table>`;
}

function button(href: string, label: string): string {
  return `<a href="${esc(href)}" style="display:inline-block;margin:6px 8px 6px 0;padding:12px 20px;border-radius:999px;background:${C.peach};color:${C.ink};font-weight:700;font-size:15px;text-decoration:none;">${esc(label)}</a>`;
}

const asConsultDraft = (p: ConsultPayload) => ({ ...p, species: p.species, petName: p.petName });

/** Email ad Andrea: nuova richiesta di consulenza. */
export function consultToAndrea(p: ConsultPayload) {
  const rows = consultLines(asConsultDraft(p));
  const wa = waLinkFor(p.phone);
  const subject = consultSubject(p);
  const text = [`Nuova richiesta di consulenza gratuita`, '', ...rows.map(([k, v]) => `${k}: ${v}`), '', wa ? `Rispondi su WhatsApp: ${wa}` : ''].join('\n');
  const html = layout(
    subject,
    `<p style="margin:0 0 4px;color:${C.peachDeep};font-weight:700;font-size:13px;letter-spacing:.04em;text-transform:uppercase;">Consulenza gratuita</p>
<h1 style="margin:0;font-size:24px;line-height:1.15;">${esc(p.petName)} e ${esc(p.name)}</h1>
${rowsHtml(rows)}
<p style="margin:16px 0 6px;">${wa ? button(wa, 'Rispondi su WhatsApp') : ''}${button(`tel:${p.phone.replace(/[^\d+]/g, '')}`, 'Chiama')}</p>`,
  );
  return { subject, text, html, replyTo: p.email || undefined };
}

/** Email ad Andrea: qualcuno vuole entrare nel Team. */
export function teamToAndrea(p: TeamPayload) {
  const rows = teamLines(p);
  const wa = waLinkFor(p.phone);
  const subject = teamSubject(p);
  const text = ['Qualcuno vuole entrare nel Team', '', ...rows.map(([k, v]) => `${k}: ${v}`), '', wa ? `Rispondi su WhatsApp: ${wa}` : ''].join('\n');
  const html = layout(
    subject,
    `<p style="margin:0 0 4px;color:${C.peachDeep};font-weight:700;font-size:13px;letter-spacing:.04em;text-transform:uppercase;">Lavora con noi</p>
<h1 style="margin:0;font-size:24px;line-height:1.15;">${esc(p.name)}</h1>
${rowsHtml(rows)}
<p style="margin:16px 0 6px;">${button(`mailto:${p.email}`, 'Rispondi per email')}${wa ? button(wa, 'WhatsApp') : ''}</p>`,
  );
  return { subject, text, html, replyTo: p.email };
}

/** Conferma a chi ha chiesto la consulenza (se ha lasciato l'email). */
export function consultConfirmation(p: ConsultPayload) {
  const subject = `Ho ricevuto la tua richiesta per ${p.petName}`;
  const first = p.name.split(' ')[0] ?? p.name;
  const lines = consultLines(asConsultDraft(p)).filter(([k]) => !['Nome', 'Email', 'WhatsApp'].includes(k));
  const text = [
    `Ciao ${first},`,
    '',
    `ho ricevuto la richiesta di consulenza gratuita per ${p.petName}. Ti richiamo io, di solito entro 24–48 ore, per fissare i 45 minuti insieme.`,
    '',
    'Il riepilogo:',
    ...lines.map(([k, v]) => `${k}: ${v}`),
    '',
    'A presto,',
    'Andrea',
  ].join('\n');
  const html = layout(
    subject,
    `<h1 style="margin:0 0 10px;font-size:23px;line-height:1.2;">Ciao ${esc(first)}, ho ricevuto la tua richiesta.</h1>
<p style="margin:0;font-size:16px;line-height:1.55;color:${C.ink};">Ti richiamo io, di solito entro 24–48 ore, per fissare i 45 minuti insieme e parlare di <strong>${esc(p.petName)}</strong>.</p>
${rowsHtml(lines)}
<p style="margin:14px 0 0;font-size:16px;">A presto,<br><strong>Andrea</strong></p>`,
  );
  return { subject, text, html };
}

/** Conferma a chi vuole entrare nel Team. */
export function teamConfirmation(p: TeamPayload) {
  const first = p.name.split(' ')[0] ?? p.name;
  const subject = 'Ho ricevuto il tuo messaggio';
  const text = [
    `Ciao ${first},`,
    '',
    'grazie per avermi scritto. Ti ricontatto personalmente per un primo confronto, senza impegno: ti racconto come funziona il Team e capiamo insieme se fa per te.',
    '',
    'A presto,',
    'Andrea',
  ].join('\n');
  const html = layout(
    subject,
    `<h1 style="margin:0 0 10px;font-size:23px;line-height:1.2;">Ciao ${esc(first)}, grazie per avermi scritto.</h1>
<p style="margin:0;font-size:16px;line-height:1.55;">Ti ricontatto personalmente per un primo confronto, senza impegno: ti racconto come funziona il Team e capiamo insieme se fa per te.</p>
<p style="margin:16px 0 0;font-size:16px;">A presto,<br><strong>Andrea</strong></p>`,
  );
  return { subject, text, html };
}
