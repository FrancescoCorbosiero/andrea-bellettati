'use client';

import { useEffect } from 'react';

/**
 * Comparsa allo scroll per ogni elemento con [data-reveal]: quando entra a
 * schermo riceve .is-in (la transizione è nel CSS). Un solo osservatore
 * per tutto il sito; i nuovi elementi (cambio pagina) vengono agganciati
 * da un MutationObserver. Senza JavaScript o con "riduci movimento" il
 * contenuto è semplicemente visibile.
 */
export default function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('has-reveal');
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    const watch = (scope: ParentNode) =>
      scope.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    watch(document);
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof HTMLElement && (n.matches('[data-reveal]') ? io.observe(n) : watch(n)));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
