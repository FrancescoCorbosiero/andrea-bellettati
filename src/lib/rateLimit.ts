/**
 * Limite di richieste in memoria, a finestra fissa, per /api/richiesta.
 * Una sola istanza (il server Node autonomo) e si azzera al riavvio: a
 * questa scala è una protezione di base insieme alle trappole per i bot,
 * non una quota distribuita.
 */

type Window = { count: number; resetAt: number };

const store = new Map<string, Window>();
let lastSweep = 0;

export function rateLimit(key: string, limit = 6, windowMs = 10 * 60 * 1000): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  if (now - lastSweep > windowMs) {
    for (const [k, w] of store) if (w.resetAt <= now) store.delete(k);
    lastSweep = now;
  }
  const win = store.get(key);
  if (!win || win.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  if (win.count >= limit) return { ok: false, retryAfterSec: Math.ceil((win.resetAt - now) / 1000) };
  win.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/** IP del visitatore, dalle intestazioni del proxy (Caddy). */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}
