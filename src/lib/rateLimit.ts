/**
 * Limite di richieste in memoria, a finestra fissa, per /api/richiesta.
 * Una sola istanza (il server Node autonomo) e si azzera al riavvio: a
 * questa scala è una protezione di base insieme alle trappole per i bot,
 * non una quota distribuita.
 */

type Window = { count: number; resetAt: number };

const store = new Map<string, Window>();
const WINDOW_MS = 10 * 60 * 1000;

// Gli indirizzi non restano in memoria oltre la loro finestra, anche se non
// arriva più nessuno (l'informativa privacy lo promette): pulizia ogni minuto.
const sweep = () => {
  const now = Date.now();
  for (const [k, w] of store) if (w.resetAt <= now) store.delete(k);
};
setInterval(sweep, 60_000).unref?.();

export function rateLimit(key: string, limit = 6, windowMs = WINDOW_MS): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const win = store.get(key);
  if (!win || win.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  if (win.count >= limit) return { ok: false, retryAfterSec: Math.ceil((win.resetAt - now) / 1000) };
  win.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/**
 * IP del visitatore. Dietro Cloudflare è in CF-Connecting-IP: Caddy non si fida
 * degli X-Forwarded-For che arrivano da fuori e lì metterebbe l'IP del nodo di
 * Cloudflare, così tutti i visitatori di quel nodo finirebbero nello stesso
 * conteggio. Senza Cloudflare: il primo X-Forwarded-For, messo da Caddy.
 */
export function clientIp(req: Request): string {
  const cf = req.headers.get('cf-connecting-ip');
  if (cf) return cf.trim();
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}
