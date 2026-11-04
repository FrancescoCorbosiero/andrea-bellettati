'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ClipboardList, MessagesSquare, Phone, ScrollText } from 'lucide-react';
import { ArrowIcon, PawIcon } from '@/components/icons';
import { CONSULENZA_HREF } from '@/lib/site';

const STEPS = [
  { title: 'Compili il questionario', body: 'Mi racconti il tuo animale: due minuti, quasi tutto a tocchi.', icon: ClipboardList },
  { title: 'Ti richiamo', body: 'Al numero che mi lasci, per fissare la chiamata.', icon: Phone },
  { title: 'Parliamo 45 minuti', body: 'Alimentazione e comportamento, insieme.', icon: MessagesSquare },
  { title: 'Ricevi il piano', body: 'Scritto, firmato e su misura per lui.', icon: ScrollText },
];

/**
 * Come funziona: quattro passi su un binario che si riempie mentre scorri,
 * con la zampina che lo percorre. Senza JavaScript il binario è pieno.
 */
export default function HowRail() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.dataset.rail = 'on';
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height * 0.9 || 1)));
      el.style.setProperty('--p', p.toFixed(4));
      el.querySelectorAll<HTMLElement>('[data-step]').forEach((s, i, all) => {
        s.classList.toggle('is-reached', p >= i / Math.max(1, all.length - 1) - 0.02);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      className="on-dark section"
      aria-labelledby="how-title"
      style={{ background: 'radial-gradient(60% 70% at 50% 0%, rgb(244 169 138 / 0.16), rgb(244 169 138 / 0) 70%), var(--color-bark)' }}
    >
      <div className="wrap">
        <div className="flex max-w-[780px] flex-col items-start gap-4">
          <span className="eyebrow">Come funziona la consulenza</span>
          <h2 id="how-title" className="display-lg">
            Dal questionario al piano, <span className="script">passo dopo passo.</span>
          </h2>
        </div>

        <div ref={ref} className="rail relative mt-12" style={{ ['--p' as string]: 1 }}>
          {/* Il binario: verticale su telefono, orizzontale da desktop. */}
          <span aria-hidden className="absolute bottom-[29px] left-[27px] top-[29px] w-1 rounded-full bg-white/15 lg:bottom-auto lg:left-[12.5%] lg:right-[12.5%] lg:top-[27px] lg:h-1 lg:w-auto">
            <span className="absolute inset-0 origin-top scale-y-[var(--p)] rounded-full bg-peach lg:origin-left lg:scale-x-[var(--p)] lg:scale-y-100" />
            <span className="absolute left-1/2 top-[calc(var(--p)*100%)] h-[23px] w-[26px] -translate-x-1/2 -translate-y-1/2 rotate-180 text-peach lg:left-[calc(var(--p)*100%)] lg:top-1/2 lg:rotate-90">
              <PawIcon size={26} />
            </span>
          </span>
          <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s, i) => (
              <li key={s.title} data-step className="rail-step grid grid-cols-[58px_1fr] items-start gap-4 lg:grid-cols-1 lg:justify-items-center lg:text-center">
                <span className="rail-dot relative z-10 grid h-[58px] w-[58px] place-items-center rounded-full border border-white/70 bg-peach text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.8),inset_0_-6px_14px_-8px_rgb(208_103_63/0.6),0_14px_28px_-12px_rgb(0_0_0/0.6)]">
                  <s.icon size={25} strokeWidth={1.9} aria-hidden />
                </span>
                <div className="flex flex-col gap-1 pt-1 lg:items-center">
                  <span className="font-[family-name:var(--font-poster)] text-[20px] leading-none text-peach">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-[clamp(23px,2.1vw,29px)]">{s.title}</h3>
                  <p className="max-w-[22em] text-[16.5px] text-cream-ink/85">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-[clamp(36px,5vw,56px)] flex flex-wrap items-center gap-x-6 gap-y-3 lg:justify-center">
          <Link className="btn btn-lg" href={CONSULENZA_HREF}>
            Compila il questionario <ArrowIcon size={16} />
          </Link>
          <span className="text-[15px] font-[650] text-cream-ink/80">Gratuita · senza impegno · per cane e gatto</span>
        </div>
      </div>
    </section>
  );
}
