import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

/**
 * Email via AWS SES (v2). Tutto da variabili d'ambiente (vedi .env.example):
 *   AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY  (catena credenziali dell'SDK)
 *   SES_FROM        mittente VERIFICATO, es. "Sito Andrea <sito@andreabellettati.it>"
 *   SES_TO          destinatari, separati da virgola o punto e virgola
 *   SES_DRY_RUN     "true": non invia, stampa l'email nei log (prove, staging)
 * Senza configurazione l'invio risponde `unconfigured` e il sito offre
 * WhatsApp, l'app di posta e il telefono.
 */

export type MailResult = { ok: true } | { ok: false; reason: 'unconfigured' | 'send-failed' };

type Config = { region: string; from: string; to: string[]; dryRun: boolean };

function config(): Config | null {
  const dryRun = process.env.SES_DRY_RUN === 'true';
  const region = process.env.AWS_REGION ?? (dryRun ? 'eu-west-1' : undefined);
  const from = process.env.SES_FROM ?? (dryRun ? 'Sito <sito@example.com>' : undefined);
  const to = (process.env.SES_TO ?? (dryRun ? 'andrea@example.com' : ''))
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!region || !from || !to.length) return null;
  return { region, from, to, dryRun };
}

export function isMailConfigured(): boolean {
  return config() !== null;
}

let client: SESv2Client | null = null;
const ses = (region: string) => (client ??= new SESv2Client({ region }));

export async function sendMail(msg: {
  to?: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}): Promise<MailResult> {
  const cfg = config();
  if (!cfg) return { ok: false, reason: 'unconfigured' };
  const to = msg.to ?? cfg.to;
  if (cfg.dryRun) {
    console.info(`[mail] DRY RUN → ${to.join(', ')} · ${msg.subject}\n${msg.text}`);
    return { ok: true };
  }
  try {
    await ses(cfg.region).send(
      new SendEmailCommand({
        FromEmailAddress: cfg.from,
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
