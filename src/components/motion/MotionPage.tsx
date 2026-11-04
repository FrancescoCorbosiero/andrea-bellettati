'use client';

import { useLayoutEffect, type ReactNode } from 'react';
import { reduced } from '@/lib/motion/fx';
import { syncScroll } from '@/lib/motion/scroll';

/**
 * Accende il motore delle animazioni per la pagina appena montata (vive in
 * app/template.tsx, che Next rimonta a ogni cambio pagina). Il motore arriva
 * con un import dinamico, dopo la pagina: GSAP non pesa sull'idratazione e
 * chi chiede "riduci movimento" non lo scarica nemmeno. La pulizia è in un
 * layout effect: gira prima che React tolga la pagina dal DOM, così i pin di
 * ScrollTrigger e i titoli divisi tornano com'erano e React trova ogni nodo
 * al suo posto.
 */
export default function MotionPage({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    // Next ha appena riportato la pagina in cima: Lenis riparte da lì.
    syncScroll();
    if (reduced()) return;
    let stop: (() => void) | undefined;
    let gone = false;
    void import('@/lib/motion/engine').then((engine) => {
      if (!gone) stop = engine.startPage();
    });
    return () => {
      gone = true;
      stop?.();
    };
  }, []);
  return children;
}
