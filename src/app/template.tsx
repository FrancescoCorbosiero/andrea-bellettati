import type { ReactNode } from 'react';
import MotionPage from '@/components/motion/MotionPage';

/**
 * Il template si rimonta a ogni cambio pagina (il layout no): è il punto
 * giusto per far nascere e morire le animazioni di ogni pagina.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <MotionPage>{children}</MotionPage>;
}
