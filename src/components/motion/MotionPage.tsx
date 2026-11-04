'use client';

import { useLayoutEffect, type ReactNode } from 'react';
import { syncScroll } from '@/lib/motion/core';
import { startPage } from '@/lib/motion/page';

/**
 * Accende il motore delle animazioni per la pagina appena montata (vive in
 * app/template.tsx, che Next rimonta a ogni cambio pagina). La pulizia è in
 * un layout effect: gira prima che React tolga la pagina dal DOM, così i pin
 * di ScrollTrigger e i titoli divisi tornano com'erano e React trova ogni
 * nodo al suo posto.
 */
export default function MotionPage({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    // Next ha appena riportato la pagina in cima: Lenis riparte da lì.
    syncScroll();
    return startPage();
  }, []);
  return children;
}
