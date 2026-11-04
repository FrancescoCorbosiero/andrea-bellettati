/* =====================================================================
   Motore delle animazioni — il nucleo condiviso.
   GSAP (ScrollTrigger + SplitText) con Lenis per lo scroll morbido,
   portato dal sito Astro (src/scripts/motion.ts), che resta la spec.

   Qui vive ciò che dura per tutta la visita: lo scroll morbido, il
   livello dei coriandoli e i piccoli effetti che usano anche i
   questionari. Gli effetti delle pagine sono in ./page.ts.

   Tutto è sicuro sul server (niente window al caricamento del modulo) e
   con "riduci movimento" diventa un no-op.
   ===================================================================== */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

const matches = (query: string): boolean => typeof window !== 'undefined' && window.matchMedia(query).matches;
/** L'utente ha chiesto meno movimento: niente Lenis, niente animazioni. */
export const reduced = (): boolean => matches('(prefers-reduced-motion: reduce)');
/** Tilt, scodinzolii e simili hanno senso solo con un mouse. */
export const fine = (): boolean => matches('(hover: hover) and (pointer: fine)');

/** Sezioni pinnate "grandi" solo dove c'è spazio per raccontarle (lg di Tailwind). */
export const DESKTOP = '(min-width: 1024px)';
export const MOBILE = '(max-width: 1023px)';
export const EASE = 'power4.out';

/* ── Forme (zampa, cuore, osso) ───────────────────────────────────── */
export const PAW =
  '<svg viewBox="0 0 50 44" fill="currentColor" aria-hidden="true"><ellipse cx="12" cy="15" rx="4.3" ry="5.8"/><ellipse cx="21" cy="10" rx="4.3" ry="6"/><ellipse cx="30" cy="11" rx="4.3" ry="6"/><ellipse cx="38.5" cy="16" rx="4.3" ry="5.6"/><ellipse cx="25" cy="29" rx="9.5" ry="8"/></svg>';
export const HEART =
  '<svg viewBox="0 0 24 22" fill="currentColor" aria-hidden="true"><path d="M12 21.5S1.5 15 1.5 7.6C1.5 4 4.2 1.5 7.3 1.5c2 0 3.7 1 4.7 2.6 1-1.6 2.7-2.6 4.7-2.6 3.1 0 5.8 2.5 5.8 6.1C22.5 15 12 21.5 12 21.5Z"/></svg>';
export const BONE =
  '<svg viewBox="0 0 44 20" fill="currentColor" aria-hidden="true"><path d="M9 1.5a5 5 0 0 0-4.6 6.9A5 5 0 1 0 9.6 16H34.4a5 5 0 1 0 5.2-7.6A5 5 0 1 0 31 5.2H13A5 5 0 0 0 9 1.5Z"/></svg>';
const CONFETTI_COLORS = [
  'var(--color-peach)',
  'var(--color-peach-deep)',
  'var(--color-sage)',
  'var(--color-ochre)',
  'var(--color-olive)',
];

/* ── Lenis ─────────────────────────────────────────────────────────── */
let lenis: Lenis | null = null;
const raf = (time: number): void => lenis?.raf(time * 1000);

/** Accende lo scroll morbido (una volta per visita). */
export function startLenis(): void {
  if (lenis || reduced()) return;
  lenis = new Lenis({
    lerp: 0.1,
    // Fogli, menu e liste scrollabili scorrono nativi sotto il puntatore.
    allowNestedScroll: true,
    prevent: (node) => node.matches('[role="dialog"], [data-lenis-prevent]'),
    // Un link verso un'altra pagina ferma l'inerzia: Next riparte dall'alto.
    stopInertiaOnNavigate: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
}

export function stopLenis(): void {
  gsap.ticker.remove(raf);
  lenis?.destroy();
  lenis = null;
}

/** Ferma/riprende lo scroll della pagina (foglio o menu aperti). */
export function lockScroll(locked: boolean): void {
  if (locked) lenis?.stop();
  else lenis?.start();
}

/** Allinea Lenis alla posizione vera (dopo uno scroll fatto da altri, es.
 *  Next che riparte dall'alto): fermarlo e riavviarlo azzera l'inerzia. */
export function syncScroll(): void {
  if (!lenis || lenis.isStopped) return;
  lenis.stop();
  lenis.start();
}

/** Scorre fino a un elemento, morbido quando Lenis gira. Lenis toglie già lo
 *  scroll-margin del bersaglio e lo scroll-padding della pagina (lo spazio
 *  per l'header): scendendo l'header si nasconde, e quello spazio si rende. */
export function scrollToTarget(target: HTMLElement): void {
  if (lenis) {
    const headerRoom = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const offset = target.getBoundingClientRect().top > 0 ? headerRoom : 0;
    lenis.scrollTo(target, { offset, duration: 1.3 });
    return;
  }
  target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
}

/* ── Coriandoli ───────────────────────────────────────────────────── */
function fxLayer(): HTMLElement {
  let layer = document.querySelector<HTMLElement>('.fx-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'fx-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
  }
  return layer;
}

/** Esplosione di zampe, cuori e ossa dal centro di un elemento. */
export function celebrate(origin: Element, opts: { count?: number; shapes?: string[]; spread?: number } = {}): void {
  if (reduced()) return;
  const { count = 26, shapes = [PAW, HEART, BONE], spread = 1 } = opts;
  const r = origin.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const layer = fxLayer();
  for (let i = 0; i < count; i++) {
    const bit = document.createElement('span');
    bit.className = 'fx-bit';
    bit.innerHTML = shapes[i % shapes.length] ?? PAW;
    bit.style.color = CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? 'var(--color-peach)';
    layer.appendChild(bit);
    const angle = (i / count) * Math.PI * 2 + gsap.utils.random(-0.3, 0.3);
    const dist = gsap.utils.random(90, 220) * spread;
    const size = gsap.utils.random(14, 30);
    gsap.set(bit, { left: cx, top: cy, width: size, height: size, xPercent: -50, yPercent: -50, scale: 0 });
    gsap
      .timeline({ onComplete: () => bit.remove() })
      .to(bit, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 60 * spread,
        scale: 1,
        rotation: gsap.utils.random(-140, 140),
        duration: gsap.utils.random(0.55, 0.85),
        ease: 'power3.out',
      })
      .to(bit, {
        y: `+=${gsap.utils.random(160, 320)}`,
        rotation: `+=${gsap.utils.random(-90, 90)}`,
        opacity: 0,
        duration: gsap.utils.random(0.9, 1.4),
        ease: 'power1.in',
      });
  }
}

/** Svuota il livello dei coriandoli (cambio pagina). */
export function clearFx(): void {
  document.querySelector('.fx-layer')?.replaceChildren();
}

/** Un'oscillazione da medaglietta appesa al collare. */
export function swing(el: Element | null): void {
  if (!el || reduced()) return;
  gsap.fromTo(el, { scale: 0.94 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)', overwrite: 'auto', clearProps: 'transform' });
}

/** Scossa "no-no" sui campi che non vanno. */
export function nudge(fields: Element[]): void {
  if (reduced() || !fields.length) return;
  gsap.fromTo(fields, { x: 0 }, { keyframes: { x: [-10, 9, -6, 4, 0] }, duration: 0.45, ease: 'none', clearProps: 'transform' });
}

/* ── Questionari ──────────────────────────────────────────────────── */
/** Il passo entra dal lato giusto (dir: 1 avanti, -1 indietro, 0 sul
 *  posto) e i suoi blocchi arrivano a cascata. */
export function stepEnter(panel: HTMLElement | null, dir: number): void {
  if (!panel || reduced()) return;
  gsap.fromTo(panel, { x: 44 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform,opacity' });
  const blocks = Array.from(panel.children).filter((c) => !(c instanceof HTMLInputElement));
  gsap.fromTo(
    blocks,
    { y: 16, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.06, delay: 0.08, overwrite: 'auto', clearProps: 'transform,opacity' },
  );
}

/** Conferma di invio: la spunta ([data-success-check]) si disegna, poi festa. */
export function successBurst(panel: HTMLElement | null): void {
  if (!panel || reduced()) return;
  const check = panel.querySelector<HTMLElement>('[data-success-check]');
  const path = check?.querySelector<SVGPathElement>('path');
  if (check) gsap.fromTo(check, { scale: 0 }, { scale: 1, duration: 0.9, ease: 'back.out(2.2)', clearProps: 'transform' });
  if (path) {
    let len = 0;
    try {
      len = path.getTotalLength();
    } catch {
      len = 0;
    }
    if (len) {
      gsap.fromTo(
        path,
        { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 0.6, delay: 0.35, ease: 'power2.out', clearProps: 'strokeDasharray,strokeDashoffset' },
      );
    }
  }
  gsap.delayedCall(0.4, () => celebrate(check ?? panel));
}
