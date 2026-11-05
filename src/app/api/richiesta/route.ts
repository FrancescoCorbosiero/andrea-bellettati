import { NextResponse } from 'next/server';
import { requestSchema } from '@/lib/forms';
import { consultConfirmation, consultToAndrea, teamConfirmation, teamToAndrea } from '@/lib/emails';
import { isMailConfigured, recipientsFor, sendMail } from '@/lib/mail';
import { clientIp, rateLimit } from '@/lib/rateLimit';

/* Manda email vere: gira sul server Node, mai in cache. */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Una persona impiega almeno qualche secondo a compilare: sotto, è un bot. */
const MIN_ELAPSED_MS = 2500;

/** Una riga di log per ogni richiesta rifiutata, solo il motivo (niente dati personali). */
const refused = (reason: string) => console.warn(`[richiesta] rifiutata: ${reason}`);

/** Diagnostica: GET /api/richiesta dice se l'invio email è configurato (nessun segreto). */
export function GET() {
  return NextResponse.json({ mailConfigured: isMailConfigured() });
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = rateLimit(`richiesta:${ip}`);
  if (!limit.ok) {
    refused('troppe richieste');
    return NextResponse.json({ ok: false, error: 'rate-limited' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } });
  }

  let data: Record<string, unknown>;
  try {
    data = ((await req.json()) ?? {}) as Record<string, unknown>;
  } catch {
    refused('json non valido');
    return NextResponse.json({ ok: false, error: 'invalid-json' }, { status: 400 });
  }

  // Trappole per i bot: si finge successo, non si manda niente.
  if (typeof data.company === 'string' && data.company.trim() !== '') {
    refused('campo trappola compilato');
    return NextResponse.json({ ok: true });
  }
  if (typeof data.elapsedMs === 'number' && data.elapsedMs < MIN_ELAPSED_MS) {
    refused('compilato troppo in fretta');
    return NextResponse.json({ ok: true });
  }

  const parsed = requestSchema.safeParse(data);
  if (!parsed.success) {
    refused('dati non validi');
    return NextResponse.json({ ok: false, error: 'invalid-payload' }, { status: 422 });
  }
  if (!isMailConfigured()) {
    refused('email non configurata (variabili SES mancanti)');
    return NextResponse.json({ ok: false, error: 'unconfigured' }, { status: 503 });
  }

  const p = parsed.data;
  const box = recipientsFor(p.kind);
  const toAndrea = p.kind === 'consulenza' ? consultToAndrea(p) : teamToAndrea(p);
  const result = await sendMail({ ...toAndrea, to: box });
  if (!result.ok) {
    refused(`invio fallito: ${result.reason}`);
    return NextResponse.json({ ok: false, error: result.reason }, { status: result.reason === 'unconfigured' ? 503 : 502 });
  }

  // Conferma a chi ha scritto (se c'è un'email): best effort, non fa fallire la richiesta.
  if (p.email) {
    // Se risponde alla conferma, la risposta torna alla casella giusta.
    const confirmation = p.kind === 'consulenza' ? consultConfirmation(p) : teamConfirmation(p);
    await sendMail({ ...confirmation, to: [p.email], replyTo: box[0] });
  }

  return NextResponse.json({ ok: true });
}
