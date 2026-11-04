'use client';

import { useEffect, useRef } from 'react';
import { Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { WhatsAppIcon } from '@/components/icons';

/** La barra di lettura sotto l'header: quanto manca alla fine dell'articolo. */
export function ReadingProgress() {
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.current?.style.setProperty('transform', `scaleX(${p})`);
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
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-[66px] z-40 h-[3px] lg:top-[72px]">
      <span ref={bar} className="block h-full origin-left scale-x-0 bg-peach shadow-[0_0_8px_rgb(208_103_63/0.6)]" />
    </div>
  );
}

/** Condivisione: il foglio di sistema dove c'è, altrimenti WhatsApp e "copia link". */
export function ShareRow({ title, url }: { title: string; url: string }) {
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* annullato: si prosegue con la copia */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copiato: incollalo dove vuoi.');
    } catch {
      toast.error('Non sono riuscito a copiarlo: tieni premuto sull’indirizzo in alto.');
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[15px] font-[650] text-ink-soft">Ti è stato utile? Condividilo:</span>
      <a className="btn btn-sm" href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`} target="_blank" rel="noopener">
        <WhatsAppIcon size={15} /> WhatsApp
      </a>
      <button type="button" className="btn btn-ghost btn-sm" onClick={share}>
        <Link2 size={15} aria-hidden /> Condividi
      </button>
    </div>
  );
}
