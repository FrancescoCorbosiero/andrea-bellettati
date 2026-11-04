'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import zoeAfter from '@/assets/storia-zoe-dopo.jpg';
import zoeBefore from '@/assets/storia-zoe-prima.jpg';
import skin from '@/assets/storia-pelle.jpg';
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react';
import { ArrowIcon, PawIcon } from '@/components/icons';
import { CONSULENZA_HREF } from '@/lib/site';

/** Prima e dopo: la foto "prima" si ritaglia fino alla linea, che si trascina. */
function Compare() {
  const [x, setX] = useState(50);
  return (
    <div className="relative h-full min-h-[300px] flex-1 touch-pan-y overflow-hidden" style={{ ['--x' as string]: `${x}%` }}>
      <Image src={zoeAfter} alt="Zoe dopo un mese di nuova alimentazione" fill sizes="(min-width: 820px) 480px, 86vw" className="object-cover object-[50%_28%]" />
      <Image
        src={zoeBefore}
        alt="Zoe all'inizio del percorso"
        fill
        sizes="(min-width: 820px) 480px, 86vw"
        className="object-cover object-[50%_28%]"
        style={{ clipPath: 'inset(0 calc(100% - var(--x)) 0 0)' }}
      />
      <span className="pointer-events-none absolute left-3.5 top-3.5 z-10 rounded-full border border-white/30 bg-ink/45 px-3 py-1.5 text-[12.5px] font-[700] text-cream-ink backdrop-blur-md">
        Prima
      </span>
      <span className="pointer-events-none absolute right-3.5 top-3.5 z-10 rounded-full border border-white/30 bg-ink/45 px-3 py-1.5 text-[12.5px] font-[700] text-cream-ink backdrop-blur-md">
        Dopo un mese
      </span>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 z-10 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(255_255_255/0.4),0_0_18px_rgb(0_0_0/0.35)]" style={{ left: 'var(--x)' }}>
        <b className="absolute left-1/2 top-1/2 grid h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/75 bg-peach/90 text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_10px_24px_-8px_rgb(0_0_0/0.55)] backdrop-blur-md">
          <MoveHorizontal size={22} aria-hidden />
        </b>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={x}
        onChange={(e) => setX(Number(e.target.value))}
        aria-label="Confronta prima e dopo: trascina"
        className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

/** La chat: i messaggi arrivano uno alla volta quando la card è a schermo. */
function Chat() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && (setShown(true), io.disconnect()), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const bubbles = [
    ['Dimenticavo…', '22:11'],
    ['Brownie negativo al test giardia', '22:11'],
    ['Eseguito qualche settimana fa', '22:12'],
  ];
  return (
    <div
      ref={ref}
      className="flex flex-1 flex-col justify-center gap-2.5 p-7"
      style={{ background: '#e8eee1 radial-gradient(rgb(52 64 42 / 0.12) 1.2px, transparent 1.2px) 0 0 / 16px 16px' }}
    >
      <p className="mb-1.5 flex items-center gap-2.5 font-[750] text-ink">
        <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-ink text-peach">
          <PawIcon size={20} />
        </span>
        La famiglia di Brownie
      </p>
      {bubbles.map(([t, time], i) => (
        <p
          key={t}
          className="flex max-w-[88%] items-end gap-2.5 self-start rounded-[4px_18px_18px_18px] border border-white bg-white/80 px-3.5 py-2.5 text-[16.5px] leading-snug text-ink shadow-[var(--shadow-glass-s)] backdrop-blur-md transition-[opacity,translate] duration-500 ease-[var(--ease-spring)] motion-reduce:transition-none"
          style={{ opacity: shown ? 1 : 0, translate: shown ? '0 0' : '0 14px', transitionDelay: `${i * 450 + 150}ms` }}
        >
          {t} <time className="shrink-0 text-[11.5px] text-ink-mute">{time}</time>
        </p>
      ))}
    </div>
  );
}

type Story = { id: string; media: ReactNode; pill: string; title: string; text: string; facts: [string, string][]; note: string };

const STORIES: Story[] = [
  {
    id: 'zoe',
    media: <Compare />,
    pill: 'Prima e dopo',
    title: 'Zoe, un mese dopo',
    text: "Cucciola dal pelo riccio, con l'alimentazione appena cambiata. Dopo trenta giorni il mantello è già diverso.",
    facts: [
      ['Durata', '1 mese'],
      ['Percorso', 'Nuova alimentazione'],
    ],
    note: 'Esperienza individuale. Trascina la linea per confrontare.',
  },
  {
    id: 'pelle',
    media: (
      <div className="relative min-h-[300px] flex-1 overflow-hidden">
        <Image src={skin} alt="Un pastore australiano su un prato dopo sei mesi di percorso" fill sizes="(min-width: 820px) 480px, 86vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-soft)] group-hover:scale-105" />
        <span className="absolute bottom-4 left-4 flex items-baseline gap-1.5 rounded-[18px] border border-white/90 bg-white/75 px-4 pb-2.5 pt-2 font-[750] shadow-[var(--shadow-glass-s)] backdrop-blur-md">
          <b className="font-[family-name:var(--font-poster)] text-[46px] font-normal leading-[0.85] text-peach-deep">6</b> mesi
        </span>
      </div>
    ),
    pill: 'Prima e dopo',
    title: 'Sei mesi dopo',
    text: "Sei mesi di percorso, seguiti con costanza dalla sua famiglia. Il cambiamento si vede nel pelo, nella pelle e nell'energia.",
    facts: [
      ['Durata', '6 mesi'],
      ['Focus', 'Pelle e mantello'],
    ],
    note: 'Esperienza individuale.',
  },
  {
    id: 'brownie',
    media: <Chat />,
    pill: 'La vostra esperienza',
    title: 'Brownie e la giardia',
    text: 'Un messaggio arrivato una sera, a percorso avviato: test negativo al controllo dopo due mesi.',
    facts: [
      ['Durata', '2 mesi'],
      ['Profilo', 'Cane adulto, asintomatico'],
    ],
    note: 'Esperienza individuale, non prova di efficacia terapeutica. La giardia si gestisce sempre con il veterinario.',
  },
];

/**
 * Le vostre storie: un carosello nativo (scorre col dito, frecce e
 * pallini), tre card con prima/dopo, foto e chat.
 */
export default function Stories() {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setIndex(cards.indexOf(e.target as HTMLElement));
      },
      { root: el, threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).scrollPaddingLeft || '0'), behavior: 'smooth' });
  };

  return (
    <section id="storie" className="relative scroll-mt-16 overflow-hidden border-y border-ink/10 bg-sand py-[clamp(70px,9vw,120px)]" aria-labelledby="stories-title">
      <div className="wrap mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div className="flex max-w-[660px] flex-col items-start gap-4">
          <span className="eyebrow">Le vostre storie</span>
          <h2 id="stories-title" className="display-lg">
            Chi ha già <span className="script">iniziato.</span>
          </h2>
          <p className="lead">
            Per ogni storia ti dico quanto è durato il percorso e da dove si partiva: sono esperienze individuali, non promesse.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="min-w-14 font-[family-name:var(--font-poster)] text-[24px] tabular-nums" aria-live="polite">
            {index + 1} / {STORIES.length}
          </span>
          <button type="button" className="icon-btn !h-[52px] !w-[52px] disabled:opacity-35" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Storia precedente">
            <ChevronLeft size={22} aria-hidden />
          </button>
          <button type="button" className="icon-btn !h-[52px] !w-[52px] disabled:opacity-35" onClick={() => goTo(index + 1)} disabled={index === STORIES.length - 1} aria-label="Storia successiva">
            <ChevronRight size={22} aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={track}
        tabIndex={0}
        aria-label="Le vostre storie: scorri per vederle tutte"
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-[max(22px,calc((100vw-1200px)/2+22px))] pb-7 pt-1.5 [scroll-padding-inline:max(22px,calc((100vw-1200px)/2+22px))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {STORIES.map((s) => (
          <article key={s.id} className="slab group grid w-[min(1000px,86vw)] flex-none snap-start overflow-hidden md:grid-cols-[0.95fr_1.05fr]" aria-labelledby={`sv-${s.id}`}>
            <div className="flex min-h-[300px] border-b border-ink/10 bg-deep md:min-h-[460px] md:border-b-0 md:border-r">{s.media}</div>
            <div className="flex flex-col items-start justify-center gap-3.5 p-[clamp(24px,3.6vw,46px)]">
              <span className={`pill ${s.id === 'brownie' ? '' : 'pill-peach'}`}>{s.pill}</span>
              <h3 id={`sv-${s.id}`} className="text-[clamp(30px,3.2vw,44px)]">
                {s.title}
              </h3>
              <p className="max-w-[40ch] text-[17px] leading-relaxed text-ink-soft">{s.text}</p>
              <dl className="mt-1 grid w-full grid-cols-2 gap-2.5">
                {s.facts.map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-white/90 bg-sand px-3.5 py-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.85)]">
                    <dt className="text-[13px] font-[700] text-ink-mute">{k}</dt>
                    <dd className="mt-0.5 text-[19px] font-[800] leading-tight tracking-[-0.02em] text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-[13.5px] leading-snug text-ink-mute">{s.note}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="wrap mt-1.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2" aria-hidden>
          {STORIES.map((s, i) => (
            <i
              key={s.id}
              className={`block h-[11px] rounded-full border transition-[width,background-color] duration-400 ${
                i === index ? 'w-8 border-white/80 bg-peach shadow-[0_4px_10px_-4px_rgb(208_103_63/0.7)]' : 'w-[11px] border-ink/25 bg-paper'
              }`}
            />
          ))}
        </div>
        <Link className="text-link" href={CONSULENZA_HREF}>
          Inizia anche tu dal questionario <ArrowIcon size={14} />
        </Link>
      </div>
    </section>
  );
}
