/* =====================================================================
   Motore delle animazioni — gli effetti delle pagine.
   Porta il motore del sito Astro (src/scripts/motion.ts) dentro Next:
   stessa API ad attributi, così le pagine restano Server Component e il
   markup dice cosa si muove.

   ─ Rivelazioni
     data-reveal            blocco — sale e appare quando entra
     data-reveal="stagger"  … i figli entrano a cascata, con un rimbalzo
     data-split[="var"]     titolo — lines, pop, wipe, blur (default: a
                            turno); la parola .script arriva per ultima,
                            con la sua sottolineatura a mano
     data-scrub             testo — le parole si accendono con lo scroll
     data-hl[="scrub"]      <mark> — l'evidenziatore passa quando entra
     data-stamp[="0.2"]     timbro — sbatte sul foglio (ritardo in secondi)
     data-draw              svg — i tracciati si disegnano da soli
     data-count="2021"      numero — conta fino al valore (data-count-from;
                            data-count-plain: senza separatore delle migliaia)
     data-clip              foto — si apre da un ritaglio
   ─ Sezioni guidate dallo scroll
     data-stories           le stories nel telefono: [data-story-phone],
                            [data-story-slide], [data-story-bar], [data-story-piece]
     data-strike            titolo pinnato: il <del> viene barrato a mano
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
     data-wordmark          wordmark del footer: le lettere (.foot-char) salgono
     details[data-accordion] si apre e si chiude morbido ([data-accordion-body])
     .btn                   l'etichetta rotola al passaggio

   Regole della casa:
   - Niente è nascosto dal CSS. Lo stato di partenza lo mette questo
     script, solo sotto la piega: senza JS la pagina è statica e completa
     (le sezioni pinnate mostrano già lo stato finale).
   - A fine rivelazione il controllo torna al CSS (clearProps).
   - Tutto nasce per pagina (app/template.tsx) e viene revertito prima che
     React smonti la pagina: i pin tornano al loro posto, i titoli divisi
     tornano interi.
   - React: cambi di struttura (SplitText, pin, nodi aggiunti) solo sul
     markup dei Server Component, che il browser non ridisegna. Nei
     componenti client (questionari, fogli) niente attributi di questo motore.
   ===================================================================== */
import { DESKTOP, EASE, HEART, MOBILE, PAW, ScrollTrigger, SplitText, celebrate, clearFx, fine, gsap, reduced } from './core';

/* ── Helper ───────────────────────────────────────────────────────── */
/** Vero se l'elemento parte dentro (o sopra) il primo schermo: quelli si
 *  lasciano stare, nasconderli ora farebbe sparire contenuto già dipinto. */
const inFirstView = (el: Element): boolean => el.getBoundingClientRect().top < window.innerHeight * 0.92;

/** Gli elementi con l'intro CSS (primo schermo) si sono già mossi: giù le mani. */
const skipIntro = (el: Element): boolean => !!el.closest('.intro, .intro-photo, [data-intro]');

/* ── Stato della pagina corrente ──────────────────────────────────── */
let ctx: gsap.Context | null = null;
let mm: gsap.MatchMedia | null = null;
let cleanups: (() => void)[] = [];

/** Listener con pulizia automatica al cambio pagina. */
function on<E extends Event>(target: EventTarget, type: string, fn: (e: E) => void, opts?: AddEventListenerOptions): void {
  const handler = fn as EventListener;
  target.addEventListener(type, handler, opts);
  cleanups.push(() => target.removeEventListener(type, handler, opts));
}

/* ── Titoli ───────────────────────────────────────────────────────────
   Non entrano tutti allo stesso modo: ognuno riceve una variante,
   richiesta (data-split="pop") o distribuita a turno lungo la pagina,
   così due sezioni vicine non ripetono la stessa mossa.
     lines  ogni riga sale dalla sua maschera
     pop    le parole saltano su con un rimbalzo
     wipe   ogni riga si scopre da sinistra a destra
     blur   le righe vanno a fuoco salendo */
type HeadingVariant = 'lines' | 'pop' | 'wipe' | 'blur';
const CYCLE: HeadingVariant[] = ['lines', 'pop', 'wipe', 'blur'];

function headingVariant(el: HTMLElement, index: number): HeadingVariant {
  const asked = el.dataset.split as HeadingVariant | undefined;
  return asked && CYCLE.includes(asked) ? asked : (CYCLE[index % CYCLE.length] ?? 'lines');
}

function headingTween(self: SplitText, v: HeadingVariant, trigger: HTMLElement): gsap.core.Tween {
  const scrollTrigger = { trigger, start: 'top 88%', once: true };
  switch (v) {
    case 'pop':
      return gsap.from(self.words, { opacity: 0, y: 46, scale: 0.6, duration: 0.9, ease: 'back.out(2.2)', stagger: 0.05, scrollTrigger });
    case 'wipe':
      return gsap.fromTo(
        self.lines,
        { clipPath: 'inset(-20% 100% -20% 0%)' },
        { clipPath: 'inset(-20% 0% -20% 0%)', duration: 1.2, ease: 'power3.inOut', stagger: 0.12, clearProps: 'clipPath', scrollTrigger },
      );
    case 'blur':
      return gsap.from(self.lines, { opacity: 0, y: 28, filter: 'blur(14px)', duration: 1.2, ease: 'power2.out', stagger: 0.1, clearProps: 'filter', scrollTrigger });
    default:
      return gsap.from(self.lines, { yPercent: 115, duration: 1.15, ease: EASE, stagger: 0.09, scrollTrigger });
  }
}

function splitHeadings(): void {
  let n = 0;
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    if (skipIntro(el) || inFirstView(el)) return;
    const v = headingVariant(el, n++);
    SplitText.create(el, {
      type: v === 'pop' ? 'words,lines' : 'lines',
      mask: v === 'lines' ? 'lines' : undefined,
      linesClass: 'split-line',
      wordsClass: 'split-word',
      autoSplit: true,
      onSplit: (self) => headingTween(self, v, el),
    });
    // La parola scritta a mano arriva per ultima, con la sua sottolineatura.
    el.querySelectorAll<HTMLElement>('.script').forEach((s) => {
      gsap.fromTo(
        s,
        { '--draw': 0, scale: 0.7 },
        {
          '--draw': 1,
          scale: 1,
          duration: 1.2,
          delay: 0.45,
          ease: 'elastic.out(1, 0.5)',
          clearProps: 'transform',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      );
    });
  });
}

/* ── Blocchi ──────────────────────────────────────────────────────── */
const BLOCKS = '[data-reveal]:not([data-reveal="stagger"]), [data-reveal="stagger"] > *';

function revealBlocks(): void {
  const blocks = gsap.utils.toArray<HTMLElement>(BLOCKS).filter((el) => !skipIntro(el) && !inFirstView(el));
  if (!blocks.length) return;
  const isChild = (el: HTMLElement): boolean => !!el.parentElement?.matches('[data-reveal="stagger"]');
  blocks.forEach((el) => {
    gsap.set(el, isChild(el) ? { opacity: 0, y: 54, scale: 0.94, transition: 'none' } : { opacity: 0, y: 44, transition: 'none' });
    el.setAttribute('data-motion-pending', '');
  });
  cleanups.push(() => blocks.forEach((el) => el.removeAttribute('data-motion-pending')));
  ScrollTrigger.batch(blocks, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => {
      const els = batch as HTMLElement[];
      els.forEach((el) => el.removeAttribute('data-motion-pending'));
      // Un salto (ancora, ricerca nella pagina) consegna in un colpo tutti i
      // blocchi scavalcati: quelli già sopra lo schermo compaiono subito.
      const passed = els.filter((el) => el.getBoundingClientRect().bottom < 0);
      const entering = els.filter((el) => !passed.includes(el));
      const done = { overwrite: true, clearProps: 'opacity,transform,transition' } as const;
      if (passed.length) gsap.set(passed, done);
      if (!entering.length) return;
      const stagger = entering.length > 5 ? { amount: 0.5 } : 0.1;
      const blocksIn = entering.filter((el) => !isChild(el));
      const childrenIn = entering.filter(isChild);
      if (blocksIn.length) gsap.to(blocksIn, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger, ...done });
      // I figli delle griglie atterrano con un piccolo rimbalzo.
      if (childrenIn.length) gsap.to(childrenIn, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.6)', stagger, ...done });
    },
  });
}

/* Le foto si aprono da un ritaglio. */
function revealImages(): void {
  gsap.utils.toArray<HTMLElement>('[data-clip]').forEach((box) => {
    if (skipIntro(box) || inFirstView(box)) return;
    gsap.fromTo(
      box,
      { clipPath: 'inset(14% 8% 14% 8% round 24px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        duration: 1.5,
        ease: EASE,
        clearProps: 'clipPath',
        scrollTrigger: { trigger: box, start: 'top 88%', once: true },
      },
    );
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

/* Evidenziatore che passa sulle parole importanti. data-hl="scrub" lo lega
   allo scroll: dentro un testo data-scrub arriva insieme alla parola. */
function highlights(): void {
  gsap.utils.toArray<HTMLElement>('[data-hl]').forEach((m) => {
    if (inFirstView(m)) return;
    if (m.dataset.hl === 'scrub') {
      gsap.fromTo(m, { '--hl': '0%' }, { '--hl': '100%', ease: 'none', scrollTrigger: { trigger: m, start: 'top 66%', end: 'top 50%', scrub: 0.6 } });
      return;
    }
    gsap.fromTo(m, { '--hl': '0%' }, { '--hl': '100%', duration: 1.1, ease: 'power2.inOut', scrollTrigger: { trigger: m, start: 'top 78%', once: true } });
  });
}

/* Timbri che sbattono sul foglio; data-stamp="0.25" li fa arrivare in fila. */
function stamps(): void {
  gsap.utils.toArray<HTMLElement>('[data-stamp]').forEach((el) => {
    if (inFirstView(el)) return;
    const host = el.parentElement ?? el;
    const delay = parseFloat(el.dataset.stamp ?? '') || 0;
    gsap
      .timeline({ scrollTrigger: { trigger: host, start: 'top 70%', once: true } })
      .from(el, { scale: 2.2, opacity: 0, duration: 0.45, ease: 'power4.in' }, delay)
      .fromTo(host, { x: 0 }, { keyframes: { x: [-6, 5, -3, 0] }, duration: 0.3, ease: 'none', clearProps: 'transform' });
  });
}

/* Numeri che contano fino al valore (il testo statico resta quello giusto). */
function counters(): void {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    if (inFirstView(el)) return;
    const to = parseFloat(el.dataset.count ?? '');
    if (Number.isNaN(to)) return;
    const from = parseFloat(el.dataset.countFrom ?? '0') || 0;
    const plain = el.hasAttribute('data-count-plain');
    const original = el.textContent ?? '';
    const suffix = original.replace(/^[\d.,\s]+/, '');
    const show = (v: number): string => `${plain ? Math.round(v) : Math.round(v).toLocaleString('it-IT')}${suffix}`;
    const state = { v: from };
    el.textContent = show(from);
    cleanups.push(() => void (el.textContent = original));
    gsap.to(state, {
      v: to,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => void (el.textContent = show(state.v)),
      onComplete: () => void (el.textContent = original),
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

/* Scarabocchi SVG che si disegnano da soli. */
function drawPaths(): void {
  gsap.utils.toArray<SVGElement>('[data-draw]').forEach((svg) => {
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path'));
    if (!paths.length || inFirstView(svg)) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 85%', once: true } });
    paths.forEach((p) => {
      let len = 0;
      try {
        len = p.getTotalLength();
      } catch {
        return; // tracciato non disegnato (es. display:none su telefono)
      }
      tl.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', clearProps: 'strokeDasharray,strokeDashoffset' }, '>-0.15');
    });
  });
}

/* ── Stories: come su Instagram, ma guidate dallo scroll ─────────────
   Le barre in alto si riempiono, ogni slide entra da destra e spinge via
   la precedente. Senza script le slide sono una lista di card. */
function storiesScroll(media: gsap.MatchMedia): void {
  gsap.utils.toArray<HTMLElement>('[data-stories]').forEach((sec) => {
    const phone = sec.querySelector<HTMLElement>('[data-story-phone]');
    const slides = gsap.utils.toArray<HTMLElement>(sec.querySelectorAll('[data-story-slide]'));
    const bars = gsap.utils.toArray<HTMLElement>(sec.querySelectorAll('[data-story-bar]'));
    if (!phone || slides.length < 2) return;
    media.add({ desk: DESKTOP, mob: MOBILE }, (c) => {
      const desk = Boolean(c.conditions?.desk);
      sec.classList.add('is-story');
      gsap.set(slides.slice(1), { xPercent: 104 });
      gsap.set(bars, { scaleX: 0, transformOrigin: 'left center' });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: desk ? sec : phone,
          start: desk ? 'top top' : 'center center',
          end: `+=${slides.length * 75}%`,
          pin: desk ? sec : phone,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
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
      return () => sec.classList.remove('is-story');
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
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(neu, { clipPath: 'inset(-30% 100% -40% -6%)' });
    gsap.set(old, { opacity: 1 });
    gsap
      .timeline({ scrollTrigger: { trigger: sec, start: 'center center', end: '+=110%', pin: true, scrub: 0.6 } })
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
    const build = (pinned: boolean): void => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: pinned
          ? { trigger: sec, start: 'top top', end: '+=95%', pin: true, scrub: 0.6 }
          : { trigger: stage, start: 'top 88%', end: 'center 45%', scrub: 0.6 },
      });
      circles.forEach((c) => {
        const [fx, fy] = (c.dataset.from ?? '0 0').split(' ').map(Number);
        tl.fromTo(c, { xPercent: fx, yPercent: fy, scale: 0.78 }, { xPercent: 0, yPercent: 0, scale: 1, duration: 1, ease: 'power2.inOut' }, 0);
      });
      if (core) tl.fromTo(core, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.4)' }, 0.86);
      tl.to({}, { duration: 0.25 });
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

/* Il wordmark del footer: le lettere salgono dalla loro maschera. */
function footerWordmark(): void {
  const wm = document.querySelector<HTMLElement>('[data-wordmark]');
  if (!wm || inFirstView(wm)) return;
  gsap.from(wm.querySelectorAll('.foot-char'), {
    yPercent: 115,
    duration: 1,
    ease: 'back.out(1.7)',
    stagger: 0.028,
    scrollTrigger: { trigger: wm, start: 'top 96%', once: true },
  });
}

/* ── Da toccare ───────────────────────────────────────────────────── */
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
  cleanups.forEach((fn) => fn());
  cleanups = [];
  mm?.revert();
  mm = null;
  ctx?.revert();
  ctx = null;
  clearFx();
}

/**
 * Accende gli effetti della pagina appena montata. Restituisce la funzione
 * che li spegne tutti (va chiamata prima che React smonti la pagina).
 */
export function startPage(): () => void {
  stopPage();
  if (reduced()) return () => {};
  document.documentElement.classList.add('has-motion');
  rollButtons();
  const media = gsap.matchMedia();
  mm = media;
  ctx = gsap.context(() => {
    // Prima le sezioni pinnate, nell'ordine della pagina: i pin aggiungono
    // spazio e tutto ciò che sta sotto deve misurarsi dopo.
    storiesScroll(media);
    strikes();
    venns(media);
    stackCards();
    heroAway();
    splitHeadings();
    revealBlocks();
    revealImages();
    scrubStatements();
    parallax();
    highlights();
    rails();
    stamps();
    trails();
    fans();
    accordions();
    counters();
    drawPaths();
    footerWordmark();
    tiltCards();
    petPortraits();
  });
  ScrollTrigger.sort();
  let alive = true;
  // I font cambiano a capo e altezze: si rimisura quando sono pronti.
  document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());
  return () => {
    alive = false;
    stopPage();
  };
}
