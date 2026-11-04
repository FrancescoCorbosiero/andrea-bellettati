'use client';

import { useEffect } from 'react';
import { reduced } from '@/lib/motion/fx';
import { scrollToTarget } from '@/lib/motion/scroll';

/**
 * Ciò che dura per tutta la visita: lo scroll morbido (Lenis, dal motore
 * caricato dopo la pagina) e le ancore della stessa pagina che scivolano
 * invece di saltare. Con "riduci movimento" non fa nulla.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (reduced()) return;
    let stop: (() => void) | undefined;
    let gone = false;
    void import('@/lib/motion/engine').then((engine) => {
      if (!gone) stop = engine.startSite();
    });

    // In cattura, così il <Link> di Next trova defaultPrevented e non salta.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href*="#"]') : null;
      if (!a || a.target === '_blank') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      history.replaceState(history.state, '', url.hash);
    };
    document.addEventListener('click', onClick, true);

    return () => {
      gone = true;
      document.removeEventListener('click', onClick, true);
      stop?.();
    };
  }, []);
  return null;
}
