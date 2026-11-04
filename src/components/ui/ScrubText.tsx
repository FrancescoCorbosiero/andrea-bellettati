'use client';

import { useEffect, useRef } from 'react';

/**
 * Una frase che si accende parola per parola mentre scorri: ogni parola
 * passa da spenta ad accesa quando la "luce" (l'avanzamento della frase
 * sullo schermo) la raggiunge. Senza JavaScript o con "riduci movimento"
 * è tutta accesa.
 */
export default function ScrubText({ text, className = '', id }: { text: string; className?: string; id?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.dataset.scrub = 'on';
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quando la frase entra dal basso, 1 quando il suo fondo arriva a metà schermo.
      const p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (r.height + vh * 0.4)));
      el.style.setProperty('--lit', String(p * words.length));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [words.length]);

  return (
    <h2 ref={ref} id={id} className={`scrub ${className}`}>
      {words.map((w, i) => (
        <span key={i} style={{ ['--i' as string]: i }}>
          {w}{' '}
        </span>
      ))}
    </h2>
  );
}
