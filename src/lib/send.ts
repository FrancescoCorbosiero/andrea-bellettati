'use client';

import type { RequestInput } from './forms';
import { describeSource } from './source';

export type SendResult = { ok: true } | { ok: false; reason: string };

/**
 * Manda la richiesta al server (/api/richiesta → email ad Andrea via SES).
 * `elapsedMs` e `company` sono le due trappole per i bot (tempo minimo di
 * compilazione e campo nascosto): il server le controlla. `source` dice ad
 * Andrea da quale pagina e campagna arriva la richiesta.
 */
export async function sendRequest(payload: RequestInput, extra: { elapsedMs: number; company: string }): Promise<SendResult> {
  try {
    const res = await fetch('/api/richiesta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, source: describeSource(), ...extra }),
      keepalive: true,
    });
    if (res.ok) {
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      return data.ok === false ? { ok: false, reason: data.error ?? 'error' } : { ok: true };
    }
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, reason: data.error ?? `http-${res.status}` };
  } catch {
    return { ok: false, reason: 'network' };
  }
}

/** Bozza salvata per la scheda del browser: chiudere e riaprire non perde niente. */
export function readDraft<T>(key: string): Partial<T> | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Partial<T>) : null;
  } catch {
    return null;
  }
}

export function writeDraft<T>(key: string, value: T): void {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* modalità privata o spazio pieno: la bozza semplicemente non si salva */
  }
}

export function clearDraft(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    /* niente da fare */
  }
}
