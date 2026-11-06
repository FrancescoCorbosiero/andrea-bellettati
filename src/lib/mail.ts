import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { EMAIL_CONSULENZE, EMAIL_PARTNER } from './site';

/**
 * Email via AWS SES (v2). Tutto da variabili d'ambiente (vedi .env.example):
 *   AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY  (catena credenziali dell'SDK)
 *   SES_FROM        mittente VERIFICATO, es. "Sito Andrea <sito@andreabellettati.it>"
 *   SES_TO_CONSULENZE  chi riceve le richieste di consulenza (di base consulenze@<dominio>)
 *   SES_TO_PARTNER     chi riceve "Entra nel Team" (di base partners@<dominio>)
 *                      più indirizzi separati da virgola o punto e virgola
 *   SES_CONFIGURATION_SET  facoltativo: metriche e rimbalzi in SES
 *   SES_DRY_RUN     "true": non invia, stampa l'email nei log (prove, staging)
 * Senza configurazione l'invio risponde `unconfigured` e il sito offre
 * WhatsApp, l'app di posta e il telefono.
 */

export type MailResult = { ok: true } | { ok: false; reason: 'unconfigured' | 'send-failed' };

type Config = { region: string; from: string; dryRun: boolean };

function config(): Config | null {
  const dryRun = process.env.SES_DRY_RUN === 'true';
  const region = process.env.AWS_REGION ?? (dryRun ? 'eu-west-1' : undefined);
  const from = process.env.SES_FROM ?? (dryRun ? 'Sito <sito@example.com>' : undefined);
  if (!region || !from) return null;
  return { region, from, dryRun };
}

const addresses = (raw: string) =>
  raw
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);

let warnedOldTo = false;

/** Chi riceve il questionario: le consulenze in una casella, il Team in un'altra. */
export function recipientsFor(kind: 'consulenza' | 'team'): string[] {
  if (process.env.SES_TO && !warnedOldTo) {
    warnedOldTo = true;
    console.warn('[mail] SES_TO non si usa più: i destinatari sono SES_TO_CONSULENZE e SES_TO_PARTNER');
  }
  const raw = kind === 'consulenza' ? process.env.SES_TO_CONSULENZE : process.env.SES_TO_PARTNER;
  const list = addresses(raw ?? '');
  return list.length ? list : [kind === 'consulenza' ? EMAIL_CONSULENZE : EMAIL_PARTNER];
}

export function isMailConfigured(): boolean {
  return config() !== null;
}

let client: SESv2Client | null = null;
const ses = (region: string) => (client ??= new SESv2Client({ region }));

export async function sendMail(msg: {
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}): Promise<MailResult> {
  const cfg = config();
  if (!cfg) return { ok: false, reason: 'unconfigured' };
  const to = msg.to;
  if (cfg.dryRun) {
    console.info(`[mail] DRY RUN → ${to.join(', ')} · ${msg.subject}\n${msg.text}`);
    return { ok: true };
  }
  try {
    await ses(cfg.region).send(
      new SendEmailCommand({
        FromEmailAddress: cfg.from,
        ConfigurationSetName: process.env.SES_CONFIGURATION_SET || undefined,
        Destination: { ToAddresses: to },
        ReplyToAddresses: msg.replyTo ? [msg.replyTo] : undefined,
        Content: {
          Simple: {
            Subject: { Data: msg.subject, Charset: 'UTF-8' },
            Body: { Text: { Data: msg.text, Charset: 'UTF-8' }, Html: { Data: msg.html, Charset: 'UTF-8' } },
          },
        },
      }),
    );
    return { ok: true };
  } catch (err) {
    console.error('[mail] invio fallito:', err);
    return { ok: false, reason: 'send-failed' };
  }
}
