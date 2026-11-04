'use client';

import { useEffect } from 'react';
import { ScrollTrigger, gsap, reduced, scrollToTarget, startLenis, stopLenis } from '@/lib/motion/core';

/**
 * Ciò che dura per tutta la visita: lo scroll morbido (Lenis), le ancore
 * della stessa pagina che scivolano invece di saltare, i blocchi in attesa
 * che compaiono appena ci arriva il focus da tastiera e il ricalcolo dei
 * trigger quando l'altezza della pagina cambia (immagini, filtri del blog).
 * Con "riduci movimento" non fa nulla.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (reduced()) return;
    startLenis();

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

    // Ciò che aspetta ancora di comparire si mostra subito se ci arriva il focus.
    const onFocus = (e: FocusEvent) => {
      const pending = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-motion-pending]') : null;
      if (!pending) return;
      pending.removeAttribute('data-motion-pending');
      gsap.to(pending, { opacity: 1, y: 0, scale: 1, duration: 0.3, overwrite: true, clearProps: 'opacity,transform,transition' });
    };
    document.addEventListener('focusin', onFocus);

    // Immagini, font e filtri cambiano l'altezza dopo l'avvio: i trigger restano onesti.
    let timer = 0;
    let lastHeight = 0;
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastHeight) < 2) return;
      lastHeight = h;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(document.documentElement);

    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('focusin', onFocus);
      ro.disconnect();
      window.clearTimeout(timer);
      stopLenis();
    };
  }, []);
  return null;
}
