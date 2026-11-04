import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowIcon, PawIcon, WhatsAppIcon } from '@/components/icons';
import { CONSULENZA_HREF, TEAM_HREF, waLink } from '@/lib/site';

/**
 * Il foglio pesca in fondo alle pagine: i due flussi un'ultima volta. Luce
 * bianca dall'alto a sinistra, pesca più denso nell'angolo opposto.
 */
export default function CtaBand({
  eyebrow = 'Il primo passo è gratuito',
  title = (
    <>
      Parliamo del tuo animale, <span className="script !text-white [text-shadow:0_1px_0_rgb(208_103_63/0.55),0_4px_14px_rgb(140_60_30/0.3)]">davvero.</span>
    </>
  ),
  lead = '45 minuti insieme per analizzare alimentazione e comportamento. Al termine ricevi un piano di lavoro scritto e firmato. Senza impegno.',
  waText = 'Ciao Andrea! Vorrei informazioni sulla consulenza gratuita.',
  showTeam = true,
  children,
}: {
  eyebrow?: string;
  title?: ReactNode;
  lead?: string;
  waText?: string;
  showTeam?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      className="relative isolate overflow-hidden border-t border-ink/10 py-[clamp(80px,11vw,140px)]"
      style={{
        background:
          'radial-gradient(55% 80% at 0% 0%, rgb(255 255 255 / 0.4), rgb(255 255 255 / 0) 65%), radial-gradient(50% 70% at 100% 100%, rgb(208 103 63 / 0.28), rgb(208 103 63 / 0) 70%), var(--color-peach)',
      }}
    >
      <div className="wrap relative z-10 grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="flex flex-col items-start gap-6">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="max-w-[10.5em] text-[clamp(46px,6.2vw,92px)] leading-[0.9] text-ink">{title}</h2>
          <p className="max-w-[33em] text-[clamp(17px,1.7vw,20px)] leading-relaxed text-ink">{lead}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link className="btn btn-dark btn-lg" href={CONSULENZA_HREF}>
              Compila il questionario <ArrowIcon size={16} />
            </Link>
            {showTeam && (
              <Link className="btn btn-ghost btn-lg" href={TEAM_HREF}>
                Lavora con noi
              </Link>
            )}
            <a className="text-link !border-ink/40" href={waLink(waText)} target="_blank" rel="noopener">
              <WhatsAppIcon size={15} /> Oppure scrivimi su WhatsApp
            </a>
          </div>
        </div>
        {children}
      </div>
      <PawIcon
        size={420}
        className="pointer-events-none absolute -bottom-[14%] -right-[3%] z-0 w-[clamp(220px,30vw,440px)] text-ink opacity-[0.07]"
      />
    </section>
  );
}
