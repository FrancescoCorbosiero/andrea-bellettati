'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { Chip, Segmented, SegmentedButton } from 'konsta/react';
import { Check } from 'lucide-react';
import { PawIcon } from '@/components/icons';
import { gsap, reduced, swing } from '@/lib/motion/core';

/* Pezzi condivisi dai due questionari: campi in stile Konsta (iOS), scelte
   a tocco e la medaglietta col nome dell'animale. */

/** Un input normale con l'aspetto del campo di ListInput (passato come `input`). */
export const inputClass =
  'block h-11 w-full appearance-none bg-transparent text-[16.5px] text-ink placeholder:text-ink-mute/55 focus:outline-none';

/** Le liste Konsta dentro i flussi: niente margini esterni, righe più compatte. */
export const listClass = '!my-0 !mx-0 [&_.k-list-input]:!py-0';

/** L'etichetta di un ListInput legata al suo campo (Konsta disegna un div, che non nomina niente). */
export function FieldLabel({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="inline-flex items-center gap-1.5">
      {children}
      {optional && <span className="font-normal text-ink-mute/80">· facoltativo</span>}
    </label>
  );
}

/** Il messaggio d'errore sotto un campo, collegato all'input con aria-describedby. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <span id={id} role="alert" className="text-peach-deep">
      {message}
    </span>
  ) : undefined;
}

/** Titolo di un gruppo di scelte, con la nota facoltativa. */
export function GroupTitle({ id, children, hint }: { id: string; children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3 px-1">
      <h4 id={id} className="text-[15px] font-[750] tracking-[-0.01em] text-ink">
        {children}
      </h4>
      {hint && <span className="text-[12.5px] text-ink-mute">{hint}</span>}
    </div>
  );
}

/**
 * Segmenti iOS per una scelta singola (età, taglia, orario): un tocco
 * sceglie, un secondo tocco sulla stessa voce la toglie.
 */
export function SegmentedChoice<T extends string>({
  labelledBy,
  options,
  value,
  onChange,
  deselect = true,
}: {
  labelledBy: string;
  options: readonly { value: T; label: string; hint?: string }[];
  value: T | '';
  onChange: (v: T | '') => void;
  deselect?: boolean;
}) {
  const current = options.find((o) => o.value === value);
  return (
    <div>
      <Segmented strong rounded role="radiogroup" aria-labelledby={labelledBy}>
        {options.map((o) => (
          <SegmentedButton
            key={o.value}
            active={value === o.value}
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(value === o.value && deselect ? '' : o.value)}
          >
            {o.label}
          </SegmentedButton>
        ))}
      </Segmented>
      {options.some((o) => o.hint) && (
        <p className="mt-1.5 min-h-[1.2em] px-1 text-[12.5px] text-ink-mute" aria-live="polite">
          {current?.hint ?? ' '}
        </p>
      )}
    </div>
  );
}

/** Chip a scelta multipla (o singola con `single`): si accendono al tocco. */
export function ChipGroup({
  labelledBy,
  options,
  values,
  onToggle,
  single = false,
}: {
  labelledBy: string;
  options: readonly string[];
  values: string[];
  onToggle: (v: string) => void;
  single?: boolean;
}) {
  return (
    <div role="group" aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = values.includes(o);
        return (
          <Chip
            key={o}
            component="button"
            outline={!on}
            role={single ? 'radio' : undefined}
            aria-checked={single ? on : undefined}
            aria-pressed={single ? undefined : on}
            onClick={() => onToggle(o)}
            media={on ? <Check size={15} strokeWidth={2.6} aria-hidden /> : undefined}
            className={`!m-0 !h-9 !px-3.5 !text-[14.5px] !font-[650] transition-[background-color,box-shadow,color] duration-200 ${
              on
                ? '!bg-peach !text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_6px_14px_-8px_rgb(208_103_63/0.7)]'
                : '!border-ink/15 !bg-white/70 !text-ink'
            }`}
          >
            {o}
          </Chip>
        );
      })}
    </div>
  );
}

/**
 * Scelta a schede grandi (cane o gatto): due lastre di vetro con
 * l'illustrazione, la scelta si accende di pesca.
 */
export function ChoiceCards<T extends string>({
  labelledBy,
  options,
  value,
  onChange,
}: {
  labelledBy: string;
  options: readonly { value: T; label: string; icon: ReactNode }[];
  value: T | '';
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="grid grid-cols-2 gap-3">
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`group relative flex flex-col items-center gap-2 rounded-[22px] border px-3 py-5 text-[17px] font-[750] transition-[transform,background-color,box-shadow] duration-300 ease-[var(--ease-soft)] active:scale-[0.97] ${
              on
                ? 'border-white/80 bg-peach text-ink shadow-[var(--shadow-peach-l)]'
                : 'border-white/90 bg-white/75 text-ink shadow-[var(--shadow-glass-s)] hover:bg-white'
            }`}
          >
            <span
              className={`grid h-14 w-14 place-items-center rounded-full transition-colors ${
                on ? 'bg-white/55 text-ink' : 'bg-sage-mist text-olive'
              }`}
            >
              {o.icon}
            </span>
            {o.label}
            {on && (
              <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-ink text-peach">
                <Check size={14} strokeWidth={3} aria-hidden />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * La medaglietta: il nome dell'animale inciso mentre lo scrivi. Un disco
 * di vetro pesca con l'anellino in alto, come quelle vere al collare.
 */
export function PetTag({ name, species }: { name: string; species: string }) {
  const shown = name.trim() || (species === 'gatto' ? 'Micio' : 'Birba');
  const empty = !name.trim();
  const tag = useRef<HTMLDivElement>(null);
  const typed = useRef(false);
  // Mentre scrivi il nome la medaglietta oscilla, come appesa al collare.
  useEffect(() => {
    if (!typed.current) {
      typed.current = true;
      return;
    }
    swing(tag.current);
  }, [name]);
  return (
    <div ref={tag} className="relative mx-auto flex w-[136px] flex-col items-center pt-5" aria-hidden>
      <span className="absolute top-0 h-7 w-7 rounded-full border-[3px] border-ink-mute/45 bg-transparent" />
      <div
        className="relative grid h-[118px] w-[118px] place-items-center rounded-full border border-white/80 text-center"
        style={{
          backgroundColor: 'var(--color-peach)',
          backgroundImage:
            'radial-gradient(120% 85% at 25% 15%, rgb(255 255 255 / 0.55), rgb(255 255 255 / 0) 55%), linear-gradient(315deg, rgb(208 103 63 / 0.35), rgb(208 103 63 / 0) 50%)',
          boxShadow:
            'inset 0 1px 0 rgb(255 255 255 / 0.9), inset 0 -8px 18px -10px rgb(208 103 63 / 0.7), 0 18px 34px -16px rgb(208 103 63 / 0.75)',
        }}
      >
        <span className="absolute top-[13px] h-3 w-3 rounded-full bg-cream shadow-[inset_0_1px_2px_rgb(21_25_15/0.35)]" />
        <span
          className={`max-w-[96px] break-words px-1 pt-2 font-[family-name:var(--font-script)] text-[30px] leading-[0.95] ${
            empty ? 'text-ink/35' : 'text-ink'
          }`}
        >
          {shown}
        </span>
      </div>
    </div>
  );
}

/**
 * La barra dei passi: un segmento per passo e una zampina che salta da un
 * passo all'altro (GSAP). La posizione la mette solo l'animazione, così un
 * nuovo render non la teletrasporta.
 */
export function StepBar({ count, step, done }: { count: number; step: number; done: boolean }) {
  const runner = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);
  const at = done ? count - 1 : step;
  useLayoutEffect(() => {
    const el = runner.current;
    if (!el) return;
    const left = `${(((at + 0.5) / count) * 100).toFixed(2)}%`;
    if (!placed.current || reduced()) {
      placed.current = true;
      gsap.set(el, { left });
      return;
    }
    gsap.to(el, { left, duration: 0.7, ease: 'power2.inOut', overwrite: 'auto' });
    gsap.fromTo(el, { y: 0 }, { keyframes: { y: [0, -14, 0] }, duration: 0.7, ease: 'none' });
  }, [at, count]);
  return (
    <div className="relative mt-6" aria-hidden>
      <span ref={runner} className="pointer-events-none absolute -top-[21px] left-0 h-[14px] w-4 -translate-x-1/2 text-peach-deep">
        <PawIcon size={16} />
      </span>
      <ol className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
        {Array.from({ length: count }, (_, i) => (
          <li
            key={i}
            className={`h-1.5 rounded-full transition-colors duration-500 ${
              done || i <= step ? 'bg-peach shadow-[0_2px_6px_-2px_rgb(208_103_63/0.7)]' : 'bg-ink/10'
            }`}
          />
        ))}
      </ol>
    </div>
  );
}
