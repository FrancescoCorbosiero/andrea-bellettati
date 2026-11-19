'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowIcon } from '@/components/icons';

/**
 * Striscia sopra l'header con il prossimo evento, su tutte le pagine del
 * sito tranne la home (lì l'evento è già nel primo schermo) e la pagina
 * dell'evento stesso. Solo testo e un link: niente animazioni.
 */
export default function EventBar({ href, when, whenShort, title, free }: { href: string; when: string; whenShort: string; title: string; free: boolean }) {
  const pathname = usePathname();
  if (pathname === '/' || pathname === href) return null;
  return (
    <Link
      href={href}
      className="on-dark group block bg-bark text-cream-ink"
      style={{ background: 'radial-gradient(40% 140% at 85% 50%, rgb(244 169 138 / 0.28), rgb(244 169 138 / 0) 70%), var(--color-bark)' }}
    >
      <span className="wrap flex min-h-[40px] items-center justify-center gap-x-2.5 py-2 text-center text-[13.5px] font-[650] leading-snug sm:text-[14.5px]">
        <span className="hidden shrink-0 rounded-full bg-peach px-2.5 py-0.5 text-[12.5px] font-[750] text-ink sm:inline">
          {free ? 'Evento gratuito' : 'Prossimo evento'}
        </span>
        <span className="min-w-0">
          <span className="text-peach">
            <span className="sm:hidden">{whenShort}</span>
            <span className="hidden sm:inline">{when}</span>
          </span>{' '}
          · {title}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 underline decoration-peach decoration-2 underline-offset-4">
          Iscriviti <ArrowIcon size={13} />
        </span>
      </span>
    </Link>
  );
}
