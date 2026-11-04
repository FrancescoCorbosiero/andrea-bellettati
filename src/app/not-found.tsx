import Link from 'next/link';
import { ArrowIcon, PawIcon } from '@/components/icons';
import { CONSULENZA_HREF } from '@/lib/site';

export const metadata = { title: 'Pagina non trovata' };

/** 404: la zampina ha perso la pista. */
export default function NotFound() {
  return (
    <section
      className="on-dark relative overflow-hidden py-[clamp(90px,14vw,180px)]"
      style={{ background: 'radial-gradient(48% 62% at 76% 42%, rgb(244 169 138 / 0.3), rgb(244 169 138 / 0) 72%), var(--color-bark)' }}
    >
      <div className="wrap relative z-10 flex flex-col items-start gap-6">
        <span className="eyebrow">Errore 404</span>
        <h1 className="text-[clamp(56px,9vw,120px)] leading-[0.9]">
          Qui la pista <span className="script">si perde.</span>
        </h1>
        <p className="lead max-w-[30em]">
          La pagina che cerchi non c&apos;è più, o forse non c&apos;è mai stata. Ripartiamo da qualcosa di sicuro.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link className="btn btn-lg" href="/">
            Torna alla home <ArrowIcon size={16} />
          </Link>
          <Link className="btn btn-ghost btn-lg" href={CONSULENZA_HREF}>
            Consulenza gratuita
          </Link>
          <Link className="btn btn-ghost btn-lg" href="/articoli">
            Il blog
          </Link>
        </div>
      </div>
      <PawIcon size={420} className="pointer-events-none absolute -bottom-16 -right-10 text-peach opacity-[0.12]" />
    </section>
  );
}
