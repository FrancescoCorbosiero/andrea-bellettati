'use client';

import { useState } from 'react';
import { ArrowIcon } from '@/components/icons';
import { AMBITO_EVENT } from '@/components/flows/TeamFlow';

const PROFILES = [
  { label: 'Educatori e istruttori cinofili', ambito: 'Educazione cinofila' },
  { label: 'Naturopati e operatori del benessere animale', ambito: 'Naturopatia' },
  { label: 'Toelettatori', ambito: 'Toelettatura' },
  { label: 'Allevatori', ambito: 'Allevamento' },
  { label: 'Pet sitter e dog sitter', ambito: 'Pet sitting' },
  { label: 'Professionisti del settore pet', ambito: 'Altro' },
  { label: 'Appassionati di alimentazione e benessere naturale', ambito: 'Altro' },
  { label: 'Chi vuole costruire una nuova attività nel mondo animale', ambito: 'Altro' },
] as const;

const TONES = ['bg-peach text-ink', 'bg-paper text-ink', 'bg-sage-mist text-ink', 'bg-olive-dark text-cream-ink'];

/**
 * "Ti riconosci?": ogni profilo è una pillola di vetro; toccarla la
 * accende e sceglie l'ambito nel modulo qui sotto, con un invito a
 * raggiungerlo.
 */
export default function ProfileWall() {
  const [picked, setPicked] = useState<number | null>(null);
  const pick = (i: number) => {
    const next = picked === i ? null : i;
    setPicked(next);
    window.dispatchEvent(new CustomEvent(AMBITO_EVENT, { detail: next === null ? '' : PROFILES[next]!.ambito }));
  };
  const current = picked === null ? null : PROFILES[picked]!;

  return (
    <div className="mt-10">
      <ul className="flex flex-wrap justify-center gap-3" aria-label="Profili" data-reveal="stagger">
        {PROFILES.map((p, i) => {
          const on = picked === i;
          return (
            <li key={p.label}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => pick(i)}
                className={`rounded-full border px-5 py-3 text-[16px] font-[700] transition-[transform,box-shadow] duration-300 ease-[var(--ease-soft)] hover:-translate-y-0.5 active:translate-y-px ${
                  TONES[i % TONES.length]
                } ${
                  on
                    ? 'border-white/90 shadow-[var(--shadow-glass-s),0_0_0_3px_rgb(244_169_138/0.9),0_16px_34px_-12px_rgb(208_103_63/0.75)]'
                    : 'border-white/70 shadow-[var(--shadow-night-s)]'
                }`}
                style={{ backgroundImage: 'linear-gradient(175deg, rgb(255 255 255 / 0.36) 0%, rgb(255 255 255 / 0.08) 46%, rgb(255 255 255 / 0) 64%)' }}
              >
                {p.label}
              </button>
            </li>
          );
        })}
      </ul>
      <div aria-live="polite" className="mx-auto mt-8 flex min-h-[64px] max-w-[46em] justify-center">
        {current && (
          <p className="slab slab-frost flex flex-wrap items-center justify-center gap-3 !rounded-[22px] px-5 py-3.5 text-center text-[15.5px] text-ink">
            <span>
              Ti riconosci in «{current.label}»: nel modulo ho già scelto l’ambito «{current.ambito}».
            </span>
            <a className="btn btn-sm" href="#unisciti">
              Raccontami chi sei <ArrowIcon size={14} />
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
