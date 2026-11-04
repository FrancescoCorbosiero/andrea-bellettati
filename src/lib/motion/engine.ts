/* =====================================================================
   Motore delle animazioni — il sito Astro (src/scripts/motion.ts) dentro
   Next: GSAP (ScrollTrigger + SplitText) e Lenis, stessa API ad attributi.
   Le pagine restano Server Component: il markup dice cosa si muove.

   ─ Rivelazioni (una volta sola, quando arrivano a schermo)
     data-reveal            blocco — sale e appare
     data-reveal="stagger"  … i figli entrano a cascata, con un rimbalzo
     data-split[="var"]     titolo — lines, pop, wipe, blur (default: a
                            turno); la parola .script arriva per ultima,
                            con la sua sottolineatura a mano
     data-clip              foto — si apre da un ritaglio
     data-count="2021"      numero — conta fino al valore (data-count-from;
                            data-count-plain: senza separatore delle migliaia)
     data-hl                <mark> — l'evidenziatore passa
     data-stamp[="0.2"]     timbro — sbatte sul foglio (ritardo in secondi)
     data-draw              svg — i tracciati si disegnano da soli
     data-wordmark          wordmark del footer: le lettere (.foot-char) salgono
   ─ Guidate dallo scroll
     data-scrub             testo — le parole si accendono
     data-hl="scrub"        l'evidenziatore al passo con lo scroll
     data-stories           le stories nel telefono: [data-story-phone],
                            [data-story-slide], [data-story-bar], [data-story-piece]
     data-strike            titolo fermo: il <del> viene barrato a mano
                            ([data-strike-path]) e l'<ins> si scrive
     data-stack             card che si impilano ([data-stack-card])
     data-rail              binario che si riempie ([data-rail-step])
     data-venn              tre cerchi che convergono: [data-venn-circle]
                            con data-from="x y" (% della loro misura),
                            [data-venn-core], [data-venn-stage]
     data-trail             sentiero di impronte: [data-trail-svg],
                            [data-trail-path], [data-trail-paws],
                            [data-trail-step] con il suo [data-trail-stop]
     data-fan               polaroid impilate che si aprono ([data-fan-item])
     data-parallax[="40"]   deriva verticale in px; data-parallax-cover per
                            le foto di copertina (pre-scalate)
     data-speed="0.2"       deriva in frazione della propria altezza
     data-hero-away="12"    contenuto hero che si allontana (data-hero-fade)
   ─ Da toccare
     data-tilt              carta in 3D verso il puntatore
     data-pet               scodinzola al passaggio, cuori al click
     details[data-accordion] si apre e si chiude morbido ([data-accordion-body])
     .btn                   l'etichetta rotola al passaggio

   Regole della casa:
   - Niente è nascosto dal CSS. Lo stato di partenza lo mette questo
     script, solo a ciò che sta sotto la piega e non è ancora mai stato
     visto: senza JS la pagina è statica e completa.
   - A fine rivelazione il controllo torna al CSS (clearProps).
   - Tutto nasce per pagina (app/template.tsx) e viene revertito prima che
     React smonti la pagina: i titoli divisi tornano interi.
   - Le sezioni ferme usano CSS sticky, non i pin di ScrollTrigger: nessun
     nodo aggiunto intorno alla sezione, nessun ricalcolo di tutta la pagina.
   - React: cambi di struttura (SplitText, nodi aggiunti) solo sul markup
     dei Server Component o su elementi che non cambiano mai.

   Leggerezza (un telefono medio deve restare reattivo):
   - Questo modulo si carica dopo la pagina (import dinamico): GSAP non
     pesa sull'idratazione e chi chiede "riduci movimento" non lo scarica.
   - Le rivelazioni non usano ScrollTrigger: un IntersectionObserver le
     "arma" quando si avvicinano (solo allora i titoli vengono divisi) e
     le fa partire quando entrano. Nessuna lettura di layout all'avvio.
   - Le sezioni legate allo scroll nascono a tappe, un task per tappa:
     niente blocchi lunghi sul thread principale.
   Le sezioni ferme vogliono un palco: data-pin-stage sul primo figlio
   (data-strike, data-venn, data-stories) e data-story-dock intorno al
   telefono delle stories.
   ===================================================================== */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { HEART, PAW, celebrate, clearFx, fine, reduced } from './fx';
import { setLenis } from './scroll';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Sezioni ferme "grandi" solo dove c'è spazio per raccontarle (lg di Tailwind). */
const DESKTOP = '(min-width: 1024px)';
const MOBILE = '(max-width: 1023px)';
const EASE = 'power4.out';

/** Gli elementi con l'intro CSS (primo schermo) si sono già mossi: giù le mani. */
const skipIntro = (el: Element): boolean => !!el.closest('.intro, .intro-photo, [data-intro]');

/* ── Per tutta la visita: Lenis, focus, altezza della pagina ───────── */
let lenis: Lenis | null = null;
/** Altezza della pagina all'ultima misura dei trigger. */
let measured = 0;
/** Il motore sta ancora creando le sezioni della pagina: niente refresh a metà. */
let staging = false;
const raf = (time: number): void => lenis?.raf(time * 1000);

/**
 * Accende ciò che dura per tutta la visita: lo scroll morbido, i blocchi
 * in attesa che compaiono appena ci arriva il focus da tastiera, il
 * ricalcolo dei trigger quando l'altezza della pagina cambia.
 */
export function startSite(): () => void {
  if (reduced() || lenis) return () => {};
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
  setLenis(lenis);

  // Ciò che aspetta ancora di comparire si mostra subito se ci arriva il focus.
  const onFocus = (e: FocusEvent) => {
    const pending = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-motion-pending]') : null;
    if (pending) revealNow(pending);
  };
  document.addEventListener('focusin', onFocus);

  // Immagini, font e filtri cambiano l'altezza dopo l'avvio: i trigger restano
  // onesti. Ma solo se l'altezza è davvero diversa da quella che ScrollTrigger
  // ha misurato l'ultima volta (un pin appena creato lo ha già fatto rimisurare).
  let timer = 0;
  measured = document.documentElement.scrollHeight;
  const onRefresh = () => void (measured = document.documentElement.scrollHeight);
  ScrollTrigger.addEventListener('refresh', onRefresh);
  const ro = new ResizeObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (!staging && Math.abs(document.documentElement.scrollHeight - measured) >= 2) ScrollTrigger.refresh();
    }, 200);
  });
  ro.observe(document.documentElement);

  return () => {
    document.removeEventListener('focusin', onFocus);
    ro.disconnect();
    ScrollTrigger.removeEventListener('refresh', onRefresh);
    window.clearTimeout(timer);
    gsap.ticker.remove(raf);
    setLenis(null);
    lenis?.destroy();
    lenis = null;
  };
}

/* ── Stato della pagina corrente ──────────────────────────────────── */
let ctx: gsap.Context | null = null;
let mm: gsap.MatchMedia | null = null;
let cleanups: (() => void)[] = [];
/** Ogni pagina ha il suo numero: le tappe di una pagina già smontata si fermano. */
let run = 0;

/** Listener con pulizia automatica al cambio pagina. */
function on<E extends Event>(target: EventTarget, type: string, fn: (e: E) => void, opts?: AddEventListenerOptions): void {
  const handler = fn as EventListener;
  target.addEventListener(type, handler, opts);
  cleanups.push(() => target.removeEventListener(type, handler, opts));
}

/* ── Rivelazioni: IntersectionObserver, non ScrollTrigger ─────────────
   Ogni elemento passa da due osservatori. Il primo lo "arma" quando è a
   meno di uno schermo di distanza (stato di partenza, titolo diviso):
   se invece è già a schermo, o sopra, resta com'è. Il secondo lo fa
   partire quando entra; quelli che entrano insieme si passano la cascata. */
type Shot = {
  el: Element;
  kind: string;
  /** Margine in basso dell'osservatore che lo fa partire: '-12%' ≈ "top 88%". */
  at: string;
  arm: () => void;
  play: (delay: number) => void;
  armed: boolean;
};
const shots = new Map<Element, Shot>();
let armer: IntersectionObserver | null = null;
const players = new Map<string, IntersectionObserver>();

const cascade = (i: number, n: number): number => (n > 5 ? (i / n) * 0.5 : i * 0.1);

function player(at: string): IntersectionObserver {
  const known = players.get(at);
  if (known) return known;
  const io: IntersectionObserver = new IntersectionObserver(
    (entries) => {
      const ready: Shot[] = [];
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const shot = shots.get(e.target);
        if (!shot?.armed) continue;
        shots.delete(e.target);
        ready.push(shot);
      }
      ready.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      const byKind = new Map<string, Shot[]>();
      for (const s of ready) byKind.set(s.kind, [...(byKind.get(s.kind) ?? []), s]);
      byKind.forEach((list) => list.forEach((s, i) => ctx?.add(() => s.play(cascade(i, list.length)))));
    },
    { rootMargin: `0px 0px ${at} 0px` },
  );
  players.set(at, io);
  return io;
}

function shoot(el: Element, kind: string, at: string, arm: () => void, play: (delay: number) => void): void {
  if (!armer || skipIntro(el) || shots.has(el)) return;
  shots.set(el, { el, kind, at, arm, play, armed: false });
  armer.observe(el);
}

/** Mostra subito un blocco in attesa (focus da tastiera). */
function revealNow(el: HTMLElement): void {
  const shot = shots.get(el);
  if (shot) {
    shots.delete(el);
    players.get(shot.at)?.unobserve(el);
  }
  el.removeAttribute('data-motion-pending');
  gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.3, overwrite: true, clearProps: 'opacity,transform,transition' });
}

function startShots(): void {
  armer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const shot = shots.get(e.target);
        if (!shot || shot.armed) {
          armer?.unobserve(e.target);
          continue;
        }
        if (!e.isIntersecting) {
          // Sopra lo schermo (scroll ripristinato, salto): resta com'è.
          if (e.boundingClientRect.bottom <= 0) {
            shots.delete(e.target);
            armer?.unobserve(e.target);
          }
          continue; // sotto e lontano: si arma quando si avvicina
        }
        armer?.unobserve(e.target);
        // Già a schermo: è stato visto così, resta fermo.
        if (e.boundingClientRect.top < window.innerHeight) {
          shots.delete(e.target);
          continue;
        }
        ctx?.add(() => shot.arm());
        shot.armed = true;
        player(shot.at).observe(shot.el);
      }
    },
    { rootMargin: '0px 0px 60% 0px' },
  );
  headings();
  blocks();
  images();
  counters();
  stamps();
  highlights();
  draws();
  wordmark();
}

/* Titoli. Non entrano tutti allo stesso modo: ognuno riceve una variante,
   richiesta (data-split="pop") o distribuita a turno lungo la pagina,
   così due sezioni vicine non ripetono la stessa mossa.
     lines  ogni riga sale dalla sua maschera
     pop    le parole saltano su con un rimbalzo
     wipe   ogni riga si scopre da sinistra a destra
     blur   le righe vanno a fuoco salendo
   SplitText divide il titolo solo quando si avvicina. */
type HeadingVariant = 'lines' | 'pop' | 'wipe' | 'blur';
const CYCLE: HeadingVariant[] = ['lines', 'pop', 'wipe', 'blur'];

function headingVariant(el: HTMLElement, index: number): HeadingVariant {
  const asked = el.dataset.split as HeadingVariant | undefined;
  return asked && CYCLE.includes(asked) ? asked : (CYCLE[index % CYCLE.length] ?? 'lines');
}

function hideHeading(self: SplitText, v: HeadingVariant): void {
  if (v === 'pop') gsap.set(self.words, { opacity: 0, y: 46, scale: 0.6 });
  else if (v === 'wipe') gsap.set(self.lines, { clipPath: 'inset(-20% 100% -20% 0%)' });
  else if (v === 'blur') gsap.set(self.lines, { opacity: 0, y: 28, filter: 'blur(14px)' });
  else gsap.set(self.lines, { yPercent: 115 });
}

function showHeading(self: SplitText, v: HeadingVariant): void {
  if (v === 'pop') gsap.to(self.words, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(2.2)', stagger: 0.05 });
  else if (v === 'wipe') gsap.to(self.lines, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 1.2, ease: 'power3.inOut', stagger: 0.12, clearProps: 'clipPath' });
  else if (v === 'blur') gsap.to(self.lines, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out', stagger: 0.1, clearProps: 'filter' });
  else gsap.to(self.lines, { yPercent: 0, duration: 1.15, ease: EASE, stagger: 0.09 });
}

function headings(): void {
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el, i) => {
    const v = headingVariant(el, i);
    let split: SplitText | null = null;
    let played = false;
    shoot(
      el,
      'heading',
      '-12%',
      () => {
        split = SplitText.create(el, {
          type: v === 'pop' ? 'words,lines' : 'lines',
          mask: v === 'lines' ? 'lines' : undefined,
          linesClass: 'split-line',
          wordsClass: 'split-word',
          autoSplit: true,
          onSplit: (self) => {
            if (played) return;
            hideHeading(self, v);
            // La parola scritta a mano aspetta il suo turno.
            const scripts = el.querySelectorAll('.script');
            if (scripts.length) gsap.set(scripts, { '--draw': 0, scale: 0.7 });
          },
        });
      },
      () => {
        played = true;
        if (split) showHeading(split, v);
        const scripts = el.querySelectorAll('.script');
        if (scripts.length) {
          gsap.to(scripts, { '--draw': 1, scale: 1, duration: 1.2, delay: 0.45, ease: 'elastic.out(1, 0.5)', clearProps: 'transform' });
        }
      },
    );
  });
}

/* Blocchi che salgono; i figli delle griglie atterrano con un piccolo rimbalzo. */
function blocks(): void {
  const done = { overwrite: true, clearProps: 'opacity,transform,transition' } as const;
  gsap.utils.toArray<HTMLElement>('[data-reveal]:not([data-reveal="stagger"])').forEach((el) =>
    shoot(
      el,
      'block',
      '-10%',
      () => {
        gsap.set(el, { opacity: 0, y: 44, transition: 'none' });
        el.setAttribute('data-motion-pending', '');
      },
      (delay) => {
        el.removeAttribute('data-motion-pending');
        gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay, ...done });
      },
    ),
  );
  gsap.utils.toArray<HTMLElement>('[data-reveal="stagger"] > *').forEach((el) =>
    shoot(
      el,
      'child',
      '-10%',
      () => {
        gsap.set(el, { opacity: 0, y: 54, scale: 0.94, transition: 'none' });
        el.setAttribute('data-motion-pending', '');
      },
      (delay) => {
        el.removeAttribute('data-motion-pending');
        gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.6)', delay, ...done });
      },
    ),
  );
  cleanups.push(() => document.querySelectorAll('[data-motion-pending]').forEach((el) => el.removeAttribute('data-motion-pending')));
}

/* Le foto si aprono da un ritaglio. */
function images(): void {
  gsap.utils.toArray<HTMLElement>('[data-clip]').forEach((box) =>
    shoot(
      box,
      'clip',
      '-12%',
      () => gsap.set(box, { clipPath: 'inset(14% 8% 14% 8% round 24px)' }),
      () => gsap.to(box, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.5, ease: EASE, clearProps: 'clipPath' }),
    ),
  );
}

/* Numeri che contano fino al valore (il testo statico resta quello giusto). */
function counters(): void {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const to = parseFloat(el.dataset.count ?? '');
    if (Number.isNaN(to)) return;
    const from = parseFloat(el.dataset.countFrom ?? '0') || 0;
    const plain = el.hasAttribute('data-count-plain');
    const original = el.textContent ?? '';
    const suffix = original.replace(/^[\d.,\s]+/, '');
    const show = (v: number): string => `${plain ? Math.round(v) : Math.round(v).toLocaleString('it-IT')}${suffix}`;
    shoot(
      el,
      'count',
      '-15%',
      () => {
        el.textContent = show(from);
        cleanups.push(() => void (el.textContent = original));
      },
      () => {
        const state = { v: from };
        gsap.to(state, {
          v: to,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => void (el.textContent = show(state.v)),
          onComplete: () => void (el.textContent = original),
        });
      },
    );
  });
}

/* Timbri che sbattono sul foglio; data-stamp="0.25" li fa arrivare in fila. */
function stamps(): void {
  gsap.utils.toArray<HTMLElement>('[data-stamp]').forEach((el) => {
    const host = el.parentElement ?? el;
    const delay = parseFloat(el.dataset.stamp ?? '') || 0;
    shoot(
      el,
      'stamp',
      '-30%',
      () => gsap.set(el, { scale: 2.2, opacity: 0 }),
      () =>
        gsap
          .timeline({ delay })
          .to(el, { scale: 1, opacity: 1, duration: 0.45, ease: 'power4.in', clearProps: 'transform,opacity' })
          .fromTo(host, { x: 0 }, { keyframes: { x: [-6, 5, -3, 0] }, duration: 0.3, ease: 'none', clearProps: 'transform' }),
    );
  });
}

/* L'evidenziatore passa sulle parole importanti (data-hl="scrub" è più sotto). */
function highlights(): void {
  gsap.utils.toArray<HTMLElement>('[data-hl]:not([data-hl="scrub"])').forEach((m) =>
    shoot(
      m,
      'hl',
      '-22%',
      () => gsap.set(m, { '--hl': '0%' }),
      () => gsap.to(m, { '--hl': '100%', duration: 1.1, ease: 'power2.inOut' }),
    ),
  );
}

/* Scarabocchi SVG che si disegnano da soli. */
function draws(): void {
  gsap.utils.toArray<SVGSVGElement>('[data-draw]').forEach((svg) => {
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path'))
      .map((p) => {
        try {
          return { p, len: p.getTotalLength() };
        } catch {
          return { p, len: 0 }; // tracciato non disegnato (es. display:none su telefono)
        }
      })
      .filter((x) => x.len > 0);
    if (!paths.length) return;
    shoot(
      svg,
      'draw',
      '-15%',
      () => paths.forEach(({ p, len }) => gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })),
      () => {
        const tl = gsap.timeline();
        paths.forEach(({ p }) => tl.to(p, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', clearProps: 'strokeDasharray,strokeDashoffset' }, '>-0.15'));
      },
    );
  });
}

/* Il wordmark del footer: le lettere salgono dalla loro maschera. */
function wordmark(): void {
  const wm = document.querySelector<HTMLElement>('[data-wordmark]');
  if (!wm) return;
  const chars = wm.querySelectorAll<HTMLElement>('.foot-char');
  shoot(
    wm,
    'wordmark',
    '-4%',
    () => gsap.set(chars, { yPercent: 115 }),
    () => gsap.to(chars, { yPercent: 0, duration: 1, ease: 'back.out(1.7)', stagger: 0.028 }),
  );
}

/* ── Guidate dallo scroll ─────────────────────────────────────────── */
/* L'evidenziatore al passo con lo scroll: dentro un testo data-scrub
   arriva insieme alla parola. */
function highlightsScrub(): void {
  gsap.utils.toArray<HTMLElement>('[data-hl="scrub"]').forEach((m) => {
    gsap.fromTo(m, { '--hl': '0%' }, { '--hl': '100%', ease: 'none', scrollTrigger: { trigger: m, start: 'top 66%', end: 'top 50%', scrub: 0.6 } });
  });
}

/* Le parole si accendono con lo scroll. */
function scrubStatements(): void {
  gsap.utils.toArray<HTMLElement>('[data-scrub]').forEach((el) => {
    SplitText.create(el, {
      type: 'words',
      wordsClass: 'scrub-word',
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: 0.6 },
          },
        ),
    });
  });
}

/* Parallax: [data-parallax="N"] deriva di ±N/1.3 px attraverso lo schermo;
   [data-parallax-cover] (foto di copertina) di ±10% su una scala di 1.24,
   così i bordi non si scoprono mai; [data-speed="0.2"] di una frazione
   della propria altezza. */
function parallax(): void {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const scrollTrigger = { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true };
    if (el.hasAttribute('data-parallax-cover')) {
      gsap.fromTo(el, { yPercent: -10, scale: 1.24 }, { yPercent: 10, scale: 1.24, ease: 'none', scrollTrigger });
      return;
    }
    const s = (parseFloat(el.dataset.parallax ?? '') || 40) / 1.3;
    gsap.fromTo(el, { y: -s }, { y: s, ease: 'none', scrollTrigger });
  });
  gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed ?? '0.15') || 0.15;
    gsap.fromTo(
      el,
      { yPercent: -speed * 50 },
      { yPercent: speed * 50, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
}

/* Il contenuto dell'hero si allontana e sfuma mentre la pagina sale. */
function heroAway(): void {
  gsap.utils.toArray<HTMLElement>('[data-hero-away]').forEach((el) => {
    const section = el.closest('section') ?? el;
    gsap.to(el, {
      yPercent: Number(el.dataset.heroAway) || 14,
      opacity: Number(el.dataset.heroFade ?? 0.2),
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
    });
  });
}

/* ── Sezioni ferme: CSS sticky, non i pin di ScrollTrigger ───────────
   Un pin creato a pagina caricata fa ricalcolare tutta la pagina (e
   aggiunge un nodo intorno alla sezione). Qui la sezione si allunga della
   corsa (--pin-run) e il suo palco ([data-pin-stage]) resta attaccato allo
   schermo con position: sticky; ScrollTrigger guida solo lo scrub. Le
   misure seguono lo schermo a ogni refresh (rotazione, barra degli indirizzi). */
function stick(sec: HTMLElement, run: () => number, extra?: () => void): () => void {
  const set = (): void => {
    sec.style.setProperty('--pin-run', `${Math.round(run())}px`);
    extra?.();
  };
  set();
  if (!extra) sec.classList.add('is-pinned');
  ScrollTrigger.addEventListener('refreshInit', set);
  return () => {
    ScrollTrigger.removeEventListener('refreshInit', set);
    sec.classList.remove('is-pinned', 'is-story-phone');
    sec.style.removeProperty('--pin-run');
    sec.style.removeProperty('--phone-top');
  };
}

/* ── Stories: come su Instagram, ma guidate dallo scroll ─────────────
   Le barre in alto si riempiono, ogni slide entra da destra e spinge via
   la precedente. Senza script le slide sono una lista di card. */
function storiesScroll(media: gsap.MatchMedia): void {
  gsap.utils.toArray<HTMLElement>('[data-stories]').forEach((sec) => {
    const phone = sec.querySelector<HTMLElement>('[data-story-phone]');
    const dock = sec.querySelector<HTMLElement>('[data-story-dock]') ?? phone?.parentElement;
    const slides = gsap.utils.toArray<HTMLElement>(sec.querySelectorAll('[data-story-slide]'));
    const bars = gsap.utils.toArray<HTMLElement>(sec.querySelectorAll('[data-story-bar]'));
    if (!phone || !dock || slides.length < 2) return;
    media.add({ desk: DESKTOP, mob: MOBILE }, (c) => {
      const desk = Boolean(c.conditions?.desk);
      const run = (): number => window.innerHeight * slides.length * 0.75;
      // Su telefono resta fermo solo il telefono, al centro dello schermo.
      const phoneTop = (): number => Math.max(12, (window.innerHeight - phone.offsetHeight) / 2);
      sec.classList.add('is-story');
      const unstick = desk
        ? stick(sec, run)
        : stick(sec, run, () => {
            sec.classList.add('is-story-phone');
            sec.style.setProperty('--phone-top', `${Math.round(phoneTop())}px`);
          });
      gsap.set(slides.slice(1), { xPercent: 104 });
      gsap.set(bars, { scaleX: 0, transformOrigin: 'left center' });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: desk
          ? { trigger: sec, start: 'top top', end: () => `+=${run()}`, scrub: 0.5, invalidateOnRefresh: true }
          : { trigger: dock, start: () => `top ${phoneTop()}px`, end: () => `+=${run()}`, scrub: 0.5, invalidateOnRefresh: true },
      });
      slides.forEach((slide, i) => {
        const bar = bars[i];
        if (bar) tl.to(bar, { scaleX: 1, duration: 1 }, i);
        // I pezzi di ogni slide entrano mentre la slide scorre dentro.
        const pieces = slide.querySelectorAll('[data-story-piece]');
        if (i > 0 && pieces.length) {
          tl.from(pieces, { y: 40, opacity: 0, stagger: 0.05, duration: 0.25, ease: 'power2.out' }, i - 1 + 0.82);
        }
        // Tutto resta dentro lo schermo del telefono: la slide che esce
        // arretra, si rimpicciolisce e si spegne mentre la nuova la copre.
        const next = slides[i + 1];
        if (next) {
          tl.to(slide, { xPercent: -32, scale: 0.9, opacity: 0.2, duration: 0.3, ease: 'power2.inOut' }, i + 0.75).to(
            next,
            { xPercent: 0, duration: 0.3, ease: 'power2.inOut' },
            i + 0.75,
          );
        }
      });
      return () => {
        unstick();
        sec.classList.remove('is-story');
      };
    });
  });
}

/* ── Titolo barrato a mano ───────────────────────────────────────────
   "Stiamo creando ~~una rete di venditori~~ un Team." La sezione resta
   ferma mentre lo scarabocchio cancella la parola vecchia e quella nuova
   si scrive a mano. Senza script: già barrato e già scritto. */
function strikes(): void {
  gsap.utils.toArray<HTMLElement>('[data-strike]').forEach((sec) => {
    const path = sec.querySelector<SVGPathElement>('[data-strike-path]');
    const old = sec.querySelector<HTMLElement>('del');
    const neu = sec.querySelector<HTMLElement>('ins');
    if (!path || !old || !neu) return;
    const len = path.getTotalLength();
    const run = (): number => window.innerHeight * 1.1;
    cleanups.push(stick(sec, run));
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(neu, { clipPath: 'inset(-30% 100% -40% -6%)' });
    gsap.set(old, { opacity: 1 });
    gsap
      .timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: () => `+=${run()}`, scrub: 0.6, invalidateOnRefresh: true } })
      .to(path, { strokeDashoffset: 0, duration: 1, ease: 'power1.inOut' })
      .to(old, { opacity: 0.38, duration: 0.5 }, 0.5)
      .to(neu, { clipPath: 'inset(-30% -6% -40% -6%)', duration: 1, ease: 'power1.inOut' }, 0.95)
      .fromTo(neu, { scale: 0.85 }, { scale: 1, duration: 0.6, ease: 'back.out(2.4)' }, 1.1)
      .to({}, { duration: 0.35 });
  });
}

/* ── Card che si impilano ────────────────────────────────────────────
   Le card sono sticky in CSS (si impilano anche senza script); qui la card
   sotto si rimpicciolisce e si scurisce mentre la prossima la copre. */
function stackCards(): void {
  gsap.utils.toArray<HTMLElement>('[data-stack]').forEach((stack) => {
    const cards = gsap.utils.toArray<HTMLElement>(stack.querySelectorAll('[data-stack-card]'));
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      gsap.to(card, {
        scale: 0.9 + i * 0.02,
        '--dim': 0.16,
        ease: 'none',
        scrollTrigger: {
          trigger: next,
          start: 'top bottom',
          end: () => `top ${parseFloat(getComputedStyle(next).top) || 100}px`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
  });
}

/* ── Venn: tre fonti che convergono in una direzione ────────────────
   I cerchi partono lontani e scorrono fino a sovrapporsi; al centro
   compare il punto d'incontro. Su desktop la sezione resta ferma mentre
   succede, su telefono accade mentre attraversa lo schermo. */
function venns(media: gsap.MatchMedia): void {
  gsap.utils.toArray<HTMLElement>('[data-venn]').forEach((sec) => {
    const circles = gsap.utils.toArray<HTMLElement>(sec.querySelectorAll('[data-venn-circle]'));
    const core = sec.querySelector<HTMLElement>('[data-venn-core]');
    const stage = sec.querySelector<HTMLElement>('[data-venn-stage]') ?? sec;
    if (circles.length < 2) return;
    const build = (pinned: boolean): (() => void) | undefined => {
      const run = (): number => window.innerHeight * 0.95;
      const unstick = pinned ? stick(sec, run) : undefined;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: pinned
          ? { trigger: sec, start: 'top top', end: () => `+=${run()}`, scrub: 0.6, invalidateOnRefresh: true }
          : { trigger: stage, start: 'top 88%', end: 'center 45%', scrub: 0.6 },
      });
      circles.forEach((c) => {
        const [fx, fy] = (c.dataset.from ?? '0 0').split(' ').map(Number);
        tl.fromTo(c, { xPercent: fx, yPercent: fy, scale: 0.78 }, { xPercent: 0, yPercent: 0, scale: 1, duration: 1, ease: 'power2.inOut' }, 0);
      });
      if (core) tl.fromTo(core, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.4)' }, 0.86);
      tl.to({}, { duration: 0.25 });
      return unstick;
    };
    media.add(DESKTOP, () => build(true));
    media.add(MOBILE, () => build(false));
  });
}

/* ── Il sentiero (chi sono) ──────────────────────────────────────────
   Un sentiero tratteggiato passa per i pallini delle tappe; scrollando,
   le impronte lo percorrono tenendo il passo con chi legge (la punta resta
   al 62% dello schermo) e ogni tappa raggiunta si accende. Le impronte si
   alternano destra/sinistra e guardano nel verso del cammino. La geometria
   si ricalcola a ogni refresh (resize, font, immagini). */
function trails(): void {
  gsap.utils.toArray<HTMLElement>('[data-trail]').forEach((root) => {
    const svg = root.querySelector<SVGSVGElement>('[data-trail-svg]');
    const path = root.querySelector<SVGPathElement>('[data-trail-path]');
    const layer = root.querySelector<HTMLElement>('[data-trail-paws]');
    const steps = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-trail-step]'));
    const stops = steps.map((s) => s.querySelector<HTMLElement>('[data-trail-stop]') ?? s);
    if (!svg || !path || !layer || stops.length < 2) return;
    // Con lo script i pallini si sfalsano (sinistra/destra): il sentiero serpeggia.
    root.classList.add('has-trail');
    // Centro di un elemento nel sistema di root, trasformazioni escluse.
    const center = (el: HTMLElement): { x: number; y: number } => {
      let x = el.offsetWidth / 2;
      let y = el.offsetHeight / 2;
      for (let n: HTMLElement | null = el; n && n !== root; n = n.offsetParent as HTMLElement | null) {
        x += n.offsetLeft;
        y += n.offsetTop;
      }
      return { x, y };
    };
    let stopY: number[] = [];
    let prints: { el: HTMLElement; y: number }[] = [];
    const build = (): void => {
      const pts = stops.map(center);
      stopY = pts.map((p) => p.y);
      svg.setAttribute('viewBox', `0 0 ${root.clientWidth} ${root.clientHeight}`);
      const first = pts[0];
      if (!first) return;
      // Curve con tangenti verticali: il sentiero scende sempre, mai indietro.
      let d = `M${first.x.toFixed(1)} ${first.y.toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        if (!a || !b) continue;
        const my = (b.y - a.y) / 2;
        d += ` C${a.x.toFixed(1)} ${(a.y + my).toFixed(1)} ${b.x.toFixed(1)} ${(b.y - my).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      }
      path.setAttribute('d', d);
      const len = path.getTotalLength();
      const count = Math.max(2, Math.round(len / (window.innerWidth < 1024 ? 44 : 56)));
      const frag = document.createDocumentFragment();
      prints = [];
      for (let i = 1; i < count; i++) {
        const at = (len * i) / count;
        const p = path.getPointAtLength(at);
        const q = path.getPointAtLength(Math.min(len, at + 1));
        const ang = Math.atan2(q.y - p.y, q.x - p.x);
        const off = i % 2 ? 9 : -9;
        const el = document.createElement('span');
        el.className = 'trail-paw';
        el.innerHTML = PAW;
        el.style.left = `${(p.x + Math.cos(ang + Math.PI / 2) * off).toFixed(1)}px`;
        el.style.top = `${(p.y + Math.sin(ang + Math.PI / 2) * off).toFixed(1)}px`;
        // Le dita guardano avanti: l'SVG punta in alto, quindi +90°.
        el.style.setProperty('--a', `${((ang * 180) / Math.PI + 90).toFixed(1)}deg`);
        frag.appendChild(el);
        prints.push({ el, y: p.y });
      }
      layer.replaceChildren(frag);
    };
    const render = (): void => {
      const tip = window.innerHeight * 0.62 - root.getBoundingClientRect().top;
      prints.forEach(({ el, y }) => el.classList.toggle('is-on', y <= tip));
      steps.forEach((s, i) => s.classList.toggle('is-reached', (stopY[i] ?? Infinity) <= tip + 1));
    };
    build();
    render();
    ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: render,
      onRefresh: () => {
        build();
        render();
      },
    });
    cleanups.push(() => {
      layer.replaceChildren();
      path.removeAttribute('d');
      root.classList.remove('has-trail');
      steps.forEach((s) => s.classList.remove('is-reached'));
    });
  });
}

/* ── Foto a ventaglio ────────────────────────────────────────────────
   Le polaroid partono impilate al centro e si aprono nelle loro posizioni
   mentre la sezione entra. Le distanze si misurano sul layout (offset),
   non sui rettangoli già trasformati. */
function fans(): void {
  gsap.utils.toArray<HTMLElement>('[data-fan]').forEach((root) => {
    const items = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-fan-item]'));
    if (!items.length) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top 88%', end: 'center 52%', scrub: 0.7, invalidateOnRefresh: true },
    });
    items.forEach((it) => {
      tl.fromTo(
        it,
        {
          x: () => root.clientWidth / 2 - (it.offsetLeft + it.offsetWidth / 2),
          y: () => root.clientHeight / 2 - (it.offsetTop + it.offsetHeight / 2),
        },
        { x: 0, y: 0, ease: 'power2.out' },
        0,
      );
    });
  });
}

/* Binario che si riempie con lo scroll; le tappe si accendono al passaggio. */
function rails(): void {
  gsap.utils.toArray<HTMLElement>('[data-rail]').forEach((root) => {
    const steps = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-rail-step]'));
    root.style.setProperty('--p', '0');
    cleanups.push(() => {
      root.style.removeProperty('--p');
      steps.forEach((s) => s.classList.remove('is-reached'));
    });
    ScrollTrigger.create({
      trigger: root,
      start: 'top 72%',
      end: 'bottom 45%',
      scrub: true,
      onUpdate: (self) => {
        root.style.setProperty('--p', self.progress.toFixed(4));
        steps.forEach((s, i) => s.classList.toggle('is-reached', self.progress >= i / Math.max(1, steps.length - 1) - 0.001));
      },
    });
  });
}

/* ── Da toccare ───────────────────────────────────────────────────── */
/* ── Accordion morbido (FAQ) ─────────────────────────────────────────
   Il <details> nativo funziona già senza script; qui apertura e chiusura
   diventano un'animazione d'altezza. Durante la chiusura [data-closing]
   riporta subito l'icona a "+" (il CSS la guarda). */
function accordions(): void {
  gsap.utils.toArray<HTMLDetailsElement>('details[data-accordion]').forEach((d) => {
    const summary = d.querySelector<HTMLElement>('summary');
    const body = d.querySelector<HTMLElement>('[data-accordion-body]');
    if (!summary || !body) return;
    on<MouseEvent>(summary, 'click', (e) => {
      e.preventDefault();
      if (d.open && !d.hasAttribute('data-closing')) {
        d.setAttribute('data-closing', '');
        gsap.fromTo(
          body,
          { height: body.offsetHeight, opacity: 1 },
          {
            height: 0,
            opacity: 0,
            duration: 0.42,
            ease: 'power2.inOut',
            overwrite: true,
            onComplete: () => {
              d.open = false;
              d.removeAttribute('data-closing');
              gsap.set(body, { clearProps: 'height,opacity' });
            },
          },
        );
        return;
      }
      // Riaperto mentre si chiudeva: riparte dall'altezza a cui era arrivato.
      const fromH = d.hasAttribute('data-closing') ? body.offsetHeight : 0;
      d.removeAttribute('data-closing');
      d.open = true;
      gsap.fromTo(
        body,
        { height: fromH, opacity: fromH ? 1 : 0 },
        {
          height: () => body.scrollHeight,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.out',
          overwrite: true,
          onComplete: () => void gsap.set(body, { clearProps: 'height,opacity' }),
        },
      );
    });
    cleanups.push(() => d.removeAttribute('data-closing'));
  });
}

/* Carte che si inclinano verso il puntatore. Un solo ascoltatore per la
   pagina (delega): funziona anche per le card montate dopo, come i
   risultati della ricerca del blog. */
function tiltCards(): void {
  if (!fine()) return;
  let card: HTMLElement | null = null;
  let rx: ((v: number) => void) | null = null;
  let ry: ((v: number) => void) | null = null;
  const leave = (el: HTMLElement): void => {
    gsap.to(el, {
      rotationX: 0,
      rotationY: 0,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: 'elastic.out(1, 0.6)',
      overwrite: 'auto',
      clearProps: 'transform,transition',
    });
  };
  const enter = (el: HTMLElement): void => {
    // La transizione CSS su transform litigherebbe con GSAP: via finché si gioca.
    gsap.set(el, { transformPerspective: 900, transition: 'box-shadow .45s ease, opacity .45s ease' });
    gsap.to(el, { y: -8, scale: 1.015, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
    rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
  };
  on<PointerEvent>(document, 'pointerover', (e) => {
    if (e.pointerType !== 'mouse') return;
    const next = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-tilt]') : null;
    if (next === card) return;
    if (card) leave(card);
    card = next;
    if (card) enter(card);
  });
  on<PointerEvent>(document, 'pointerout', (e) => {
    if (!card) return;
    const to = e.relatedTarget instanceof Node ? e.relatedTarget : null;
    if (to && card.contains(to)) return;
    leave(card);
    card = null;
  });
  on<PointerEvent>(document, 'pointermove', (e) => {
    if (!card || !rx || !ry) return;
    const r = card.getBoundingClientRect();
    rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
    ry(((e.clientX - r.left) / r.width - 0.5) * 12);
  });
  cleanups.push(() => {
    if (card) gsap.set(card, { clearProps: 'transform,transition' });
    card = null;
  });
}

/* Ritratto da coccolare: scodinzola al passaggio, cuori al click. */
function petPortraits(): void {
  gsap.utils.toArray<HTMLElement>('[data-pet]').forEach((el) => {
    const wag = (): void => {
      gsap.fromTo(el, { rotation: 0 }, { keyframes: { rotation: [-7, 6, -4, 2, 0] }, duration: 0.7, ease: 'none', overwrite: 'auto', clearProps: 'transform' });
    };
    on(el, 'pointerenter', wag);
    on(el, 'click', () => {
      wag();
      celebrate(el, { count: 12, shapes: [HEART], spread: 0.7 });
    });
  });
}

/* Testo dei bottoni che "rotola" al passaggio (solo con un mouse): la
   stessa etichetta esce in alto e rientra dal basso. Solo bottoni con
   un'etichetta fissa: niente questionari, fogli o bottoni che cambiano
   testo. Al cambio pagina il testo originale torna al suo posto. */
function rollButtons(): void {
  if (!fine()) return;
  document.querySelectorAll<HTMLElement>('.btn:not([data-roll]):not([data-no-roll])').forEach((btn) => {
    if (btn.closest('[data-flow-root], [role="dialog"], [data-no-roll]')) return;
    const texts = Array.from(btn.childNodes).filter((n): n is Text => n.nodeType === Node.TEXT_NODE && !!n.textContent?.trim());
    const text = texts[0];
    if (texts.length !== 1 || !text) return;
    const label = text.textContent?.trim() ?? '';
    const wrap = document.createElement('span');
    wrap.className = 'btn-roll';
    wrap.dataset.label = label;
    const inner = document.createElement('span');
    inner.textContent = label;
    wrap.appendChild(inner);
    btn.replaceChild(wrap, text);
    btn.setAttribute('data-roll', '');
    // Rimette il nodo di testo originale: è quello che React conosce.
    cleanups.push(() => {
      if (wrap.parentNode === btn) btn.replaceChild(text, wrap);
      btn.removeAttribute('data-roll');
    });
  });
}

/* ── Ciclo della pagina ───────────────────────────────────────────── */
function stopPage(): void {
  run++;
  staging = false;
  armer?.disconnect();
  armer = null;
  players.forEach((io) => io.disconnect());
  players.clear();
  shots.clear();
  cleanups.forEach((fn) => fn());
  cleanups = [];
  mm?.revert();
  mm = null;
  ctx?.revert();
  ctx = null;
  clearFx();
}

/** Un task alla volta: il thread principale respira tra una tappa e l'altra. */
const nextTask = (): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, 0));

/**
 * Accende gli effetti della pagina appena montata. Restituisce la funzione
 * che li spegne tutti (va chiamata prima che React smonti la pagina).
 */
export function startPage(): () => void {
  stopPage();
  if (reduced()) return () => {};
  const id = ++run;
  document.documentElement.classList.add('has-motion');
  const media = gsap.matchMedia();
  mm = media;
  const page = gsap.context(() => {});
  ctx = page;
  // Subito, e leggero: osservatori e ascoltatori, nessuna lettura di layout.
  rollButtons();
  page.add(() => {
    startShots();
    accordions();
    tiltCards();
    petPortraits();
  });
  // Poi le sezioni legate allo scroll, una tappa per task. Prima quelle
  // ferme: allungano la pagina, e ciò che sta sotto si misura dopo.
  const stages: (() => void)[] = [
    () => storiesScroll(media),
    () => strikes(),
    () => venns(media),
    () => {
      stackCards();
      heroAway();
    },
    () => {
      parallax();
      rails();
      fans();
    },
    () => {
      scrubStatements();
      highlightsScrub();
    },
    () => trails(),
  ];
  staging = true;
  void (async () => {
    // Le sezioni ferme allungano la pagina: ciò che nasce dopo si misura già
    // sull'altezza giusta, quindi a fine giro serve un refresh solo se
    // qualcosa ha cambiato l'altezza dopo di loro.
    let afterPins = 0;
    for (const [i, stage] of stages.entries()) {
      await nextTask();
      if (id !== run) return;
      page.add(stage);
      if (i === 2) afterPins = document.documentElement.scrollHeight;
    }
    staging = false;
    const h = document.documentElement.scrollHeight;
    if (Math.abs(h - afterPins) >= 2) ScrollTrigger.refresh();
    else measured = h;
    ScrollTrigger.sort();
    // I font cambiano a capo e altezze: se non sono ancora pronti, si rimisura dopo.
    if (document.fonts && document.fonts.status !== 'loaded') {
      void document.fonts.ready.then(() => {
        if (id === run) ScrollTrigger.refresh();
      });
    }
  })();
  return () => {
    if (id === run) stopPage();
  };
}
