'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * Telefono: il bottone fisso in basso che riporta al questionario. Compare
 * quando il questionario non è a schermo e sparisce sopra la chiamata finale
 * (sarebbe un doppione). Senza JavaScript non c'è: la pagina basta da sola.
 */
export default function StickyCta({ target, until, children }: { target: string; until?: string; children: ReactNode }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const form = document.getElementById(target);
    const end = until ? document.getElementById(until) : null;
    if (!form || !('IntersectionObserver' in window)) return;
    const seen = new Map<Element, boolean>([[form, true]]);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target, e.isIntersecting);
        setShow(!seen.get(form) && !(end && seen.get(end)));
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(form);
    if (end) io.observe(end);
    return () => io.disconnect();
  }, [target, until]);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-cream/90 to-transparent px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-6 transition-[translate,opacity] duration-500 ease-[var(--ease-soft)] lg:hidden ${
        show ? '' : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <a className="btn btn-lg btn-block" href={`#${target}`} tabIndex={show ? undefined : -1}>
        {children}
      </a>
    </div>
  );
}
