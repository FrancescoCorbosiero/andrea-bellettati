/* =====================================================================
   Piccoli effetti senza librerie (Web Animations del browser): coriandoli,
   medaglietta che oscilla, campi che fanno "no-no", passi dei questionari.
   Li usano i questionari, che così non si portano dietro GSAP, e il
   motore delle pagine (./engine.ts).

   Sicuro sul server (niente window al caricamento del modulo); con
   "riduci movimento" ogni funzione è un no-op. Le animazioni WAAPI non
   lasciano stili in linea: finite, il controllo torna al CSS e a React.
   ===================================================================== */

const matches = (query: string): boolean => typeof window !== 'undefined' && window.matchMedia(query).matches;
/** L'utente ha chiesto meno movimento. */
export const reduced = (): boolean => matches('(prefers-reduced-motion: reduce)');
/** Tilt, scodinzolii e simili hanno senso solo con un mouse. */
export const fine = (): boolean => matches('(hover: hover) and (pointer: fine)');

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

const rand = (min: number, max: number): number => min + Math.random() * (max - min);
/** Le curve di GSAP che usava il sito Astro, in cubic-bezier. */
const OUT = 'cubic-bezier(0.22, 1, 0.36, 1)'; // ~ power3.out
const IN = 'cubic-bezier(0.55, 0.06, 0.68, 0.19)'; // ~ power1.in
const BACK = 'cubic-bezier(0.34, 1.7, 0.64, 1)'; // ~ back.out

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
    const size = rand(14, 30);
    Object.assign(bit.style, {
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? 'var(--color-peach)',
      left: `${cx}px`,
      top: `${cy}px`,
      width: `${size}px`,
      height: `${size}px`,
    });
    layer.appendChild(bit);
    const angle = (i / count) * Math.PI * 2 + rand(-0.3, 0.3);
    const dist = rand(90, 220) * spread;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist - 60 * spread;
    const spin = rand(-140, 140);
    const burst = rand(550, 850);
    const fall = rand(900, 1400);
    const at = (dx: number, dy: number, s: number, rot: number) => `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${s}) rotate(${rot}deg)`;
    const anim = bit.animate(
      [
        { transform: at(0, 0, 0, 0), opacity: 1, easing: OUT },
        { transform: at(x, y, 1, spin), opacity: 1, offset: burst / (burst + fall), easing: IN },
        { transform: at(x, y + rand(160, 320), 1, spin + rand(-90, 90)), opacity: 0 },
      ],
      { duration: burst + fall, fill: 'forwards' },
    );
    anim.onfinish = () => bit.remove();
  }
}

/** Svuota il livello dei coriandoli (cambio pagina). */
export function clearFx(): void {
  document.querySelector('.fx-layer')?.replaceChildren();
}

/* ── Questionari ──────────────────────────────────────────────────── */
/** Un'oscillazione da medaglietta appesa al collare. */
export function swing(el: Element | null): void {
  if (!el || reduced()) return;
  el.animate([{ scale: '0.94' }, { scale: '1.04', offset: 0.45 }, { scale: '1' }], { duration: 650, easing: 'ease-out' });
}

/** Scossa "no-no" sui campi che non vanno. */
export function nudge(fields: Element[]): void {
  if (reduced()) return;
  for (const el of fields) {
    el.animate({ translate: ['0 0', '-10px 0', '9px 0', '-6px 0', '4px 0', '0 0'] }, { duration: 450, easing: 'linear' });
  }
}

/** Il passo entra dal lato giusto (dir: 1 avanti, -1 indietro, 0 sul posto)
 *  e i suoi blocchi arrivano a cascata. */
export function stepEnter(panel: HTMLElement | null, dir: number): void {
  if (!panel || reduced()) return;
  panel.animate([{ transform: `translateX(${44 * dir}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 550, easing: OUT });
  Array.from(panel.children)
    .filter((c) => !(c instanceof HTMLInputElement))
    .forEach((c, i) => {
      c.animate([{ transform: 'translateY(16px)', opacity: 0 }, { transform: 'none', opacity: 1 }], {
        duration: 500,
        delay: 80 + i * 60,
        easing: OUT,
        fill: 'backwards',
      });
    });
}

/** Conferma di invio: la spunta ([data-success-check]) si disegna, poi festa. */
export function successBurst(panel: HTMLElement | null): void {
  if (!panel || reduced()) return;
  const check = panel.querySelector<HTMLElement>('[data-success-check]');
  const path = check?.querySelector<SVGPathElement>('path');
  check?.animate([{ scale: '0' }, { scale: '1' }], { duration: 900, easing: BACK });
  if (path) {
    let len = 0;
    try {
      len = path.getTotalLength();
    } catch {
      len = 0;
    }
    if (len) {
      path.animate(
        [
          { strokeDasharray: `${len}`, strokeDashoffset: `${len}` },
          { strokeDasharray: `${len}`, strokeDashoffset: '0' },
        ],
        { duration: 600, delay: 350, easing: OUT, fill: 'backwards' },
      );
    }
  }
  window.setTimeout(() => celebrate(check ?? panel), 400);
}
