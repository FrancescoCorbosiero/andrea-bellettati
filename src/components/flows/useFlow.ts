'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { clearDraft, readDraft, sendRequest, writeDraft } from '@/lib/send';
import type { RequestInput } from '@/lib/forms';
import { nudge, stepEnter, successBurst } from '@/lib/motion/fx';
import { scrollToTarget } from '@/lib/motion/scroll';

export type Variant = 'sheet' | 'inline';
export type Errors<K extends string> = Partial<Record<K, string>>;
export type Sent = 'email' | 'whatsapp' | null;

/**
 * Il motore comune dei questionari: la bozza (salvata per la scheda), il
 * passo, gli errori, l'invio e le due trappole per i bot. Ogni flusso
 * aggiunge i suoi campi e le sue regole.
 */
export function useFlow<D extends object, K extends string>({
  storageKey,
  empty,
  handoff,
  steps,
  variant,
  validate,
  toPayload,
}: {
  storageKey: string;
  empty: D;
  handoff?: Partial<D>;
  steps: number;
  variant: Variant;
  /** Gli errori di un passo (vuoto = si può andare avanti). */
  validate: (step: number, draft: D) => Errors<K>;
  toPayload: (draft: D) => RequestInput;
}) {
  const uid = useId();
  const [draft, setDraft] = useState<D>(empty);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors<K>>({});
  const [sent, setSent] = useState<Sent>(null);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [company, setCompany] = useState(''); // trappola: campo nascosto
  const startedAt = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const restored = useRef(false);
  const lastStep = useRef(0);

  // Bozza: si riprende da dove si era rimasti (stessa scheda del browser).
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    startedAt.current = Date.now();
    const saved = readDraft<D>(storageKey);
    setDraft((d) => ({ ...d, ...(saved ?? {}), ...(handoff ?? {}) }));
  }, [storageKey, handoff]);

  useEffect(() => {
    if (restored.current && !sent) writeDraft(storageKey, draft);
  }, [draft, sent, storageKey]);

  // Ogni passo parte dall'alto, con il focus sul suo titolo, ed entra dal
  // lato giusto; l'invio riuscito si festeggia.
  useEffect(() => {
    if (!moved.current) return;
    const body = bodyRef.current;
    if (variant === 'sheet') {
      body?.closest('.react-modal-sheet-content-scroller, [data-flow-scroll]')?.scrollTo({ top: 0 });
    } else {
      // In pagina: si riporta in vista tutta la scheda (testata e avanzamento compresi).
      const root = body?.closest<HTMLElement>('[data-flow-root]') ?? body;
      if (root && root.getBoundingClientRect().top < 90) scrollToTarget(root);
    }
    titleRef.current?.focus({ preventScroll: true });
    if (sent) {
      stepEnter(body, 0);
      successBurst(body);
    } else {
      stepEnter(body, step >= lastStep.current ? 1 : -1);
    }
    lastStep.current = step;
  }, [step, sent, variant]);

  /** I campi sbagliati fanno "no-no" con la testa. */
  const shake = (errs: Errors<K>) => {
    window.requestAnimationFrame(() => {
      const body = bodyRef.current;
      if (!body) return;
      const fields = Object.keys(errs)
        .map((key) => body.querySelector<HTMLElement>(`[data-field="${key}"]`))
        .filter((el): el is HTMLElement => !!el)
        .map((el) => el.closest<HTMLElement>('li') ?? el);
      nudge(fields);
    });
  };

  const set = useCallback(<F extends keyof D>(key: F, value: D[F]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => (e[key as unknown as K] ? { ...e, [key]: undefined } : e));
  }, []);

  /** Aggiunge o toglie una voce da un campo a scelta multipla. */
  const toggle = useCallback(<F extends keyof D>(key: F, item: string) => {
    setDraft((d) => {
      const list = (d[key] as unknown as string[]) ?? [];
      const next = list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
      return { ...d, [key]: next };
    });
  }, []);

  const go = (to: number) => {
    moved.current = true;
    setErrors({});
    setStep(Math.max(0, Math.min(steps - 1, to)));
  };

  /** Avanti, se il passo è a posto; altrimenti il focus va sul primo campo sbagliato. */
  const next = () => {
    const errs = validate(step, draft);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = Object.keys(errs)[0];
      window.requestAnimationFrame(() => {
        bodyRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      });
      shake(errs);
      return false;
    }
    go(step + 1);
    return true;
  };

  const back = () => go(step - 1);

  const submit = async () => {
    for (let s = 0; s < steps - 1; s++) {
      const errs = validate(s, draft);
      if (Object.keys(errs).length) {
        go(s);
        setErrors(errs);
        shake(errs);
        return;
      }
    }
    setSending(true);
    setFailed(null);
    const result = await sendRequest(toPayload(draft), { elapsedMs: Date.now() - startedAt.current, company });
    setSending(false);
    if (result.ok) {
      moved.current = true;
      setSent('email');
      clearDraft(storageKey);
    } else {
      setFailed(result.reason);
    }
  };

  /**
   * Chi sceglie WhatsApp: la richiesta parte comunque anche per email, in
   * silenzio. È la rete di sicurezza: se la persona non preme "invia" su
   * WhatsApp, il contatto arriva lo stesso ad Andrea.
   */
  const sendQuietly = () => {
    for (let s = 0; s < steps - 1; s++) if (Object.keys(validate(s, draft)).length) return;
    void sendRequest(toPayload(draft), { elapsedMs: Date.now() - startedAt.current, company });
    clearDraft(storageKey);
  };

  /** Dopo l'invio: si ricomincia da capo (stessa sessione). */
  const restart = () => {
    clearDraft(storageKey);
    setDraft({ ...empty, ...(handoff ?? {}) });
    setSent(null);
    setFailed(null);
    go(0);
  };

  /** id stabile per i campi di questo flusso. */
  const fid = (key: string) => `${uid}-${key}`;

  /** Attributi ARIA di un campo, collegati al suo errore. */
  const aria = (key: K) =>
    errors[key]
      ? { 'aria-invalid': true as const, 'aria-describedby': `${fid(key)}-error` }
      : ({} as Record<string, never>);

  const flow = {
    draft,
    set,
    toggle,
    step,
    steps,
    go,
    next,
    back,
    errors,
    setErrors,
    sent,
    setSent,
    sending,
    failed,
    submit,
    sendQuietly,
    restart,
    company,
    setCompany,
    fid,
    aria,
    variant,
  };
  // I ref viaggiano a parte: si usano solo come `ref={…}`, mai letti durante il render.
  return { flow, bodyRef, titleRef };
}
