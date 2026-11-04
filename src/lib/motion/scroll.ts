/* =====================================================================
   Lo scroll morbido visto dal resto del sito: fermarlo con un foglio
   aperto, scivolare fino a un'ancora, riallinearlo dopo un cambio pagina.
   Lenis lo crea il motore (./engine.ts, caricato dopo la pagina): qui c'è
   solo il riferimento, così chi usa queste funzioni non scarica GSAP.
   Finché Lenis non c'è, si usa lo scroll del browser.
   ===================================================================== */
import type Lenis from 'lenis';

let lenis: Lenis | null = null;
let locked = false;

/** Il motore registra (o toglie) la sua istanza di Lenis. */
export function setLenis(next: Lenis | null): void {
  lenis = next;
  // Un foglio aperto prima che Lenis arrivasse: si parte già fermi.
  if (lenis && locked) lenis.stop();
}

/** Ferma/riprende lo scroll della pagina (foglio o menu aperti). */
export function lockScroll(lock: boolean): void {
  locked = lock;
  if (lock) lenis?.stop();
  else lenis?.start();
}

/** Allinea Lenis alla posizione vera (dopo uno scroll fatto da altri, es.
 *  Next che riparte dall'alto): fermarlo e riavviarlo azzera l'inerzia. */
export function syncScroll(): void {
  if (!lenis || lenis.isStopped) return;
  lenis.stop();
  lenis.start();
}

/** Scorre fino a un elemento, morbido. Lenis toglie già lo scroll-margin
 *  del bersaglio e lo scroll-padding della pagina (lo spazio per l'header):
 *  scendendo l'header si nasconde, e quello spazio si rende. */
export function scrollToTarget(target: HTMLElement): void {
  if (lenis) {
    // Uno scroll appena fatto senza Lenis (es. un salto nello stesso
    // fotogramma del clic) non l'ha ancora visto: si riparte da dove si è.
    if (!lenis.isScrolling && Math.abs(lenis.animatedScroll - window.scrollY) > 1) {
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    }
    const headerRoom = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const offset = target.getBoundingClientRect().top > 0 ? headerRoom : 0;
    lenis.scrollTo(target, { offset, duration: 1.3 });
    return;
  }
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: still ? 'auto' : 'smooth' });
}
