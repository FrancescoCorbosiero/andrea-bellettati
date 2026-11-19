import Link from 'next/link';
import { ArrowIcon } from '@/components/icons';
import { eventLong } from '@/lib/dates';
import type { EventEntry } from '@/lib/content';
import { DateTile, EventMeta, ReserveButton } from './EventCard';

/**
 * Il prossimo evento dentro una pagina che parla d'altro (un articolo):
 * data, titolo, cosa si guadagna a esserci e il pulsante per iscriversi.
 * `compact` è la versione in testa all'articolo collegato all'evento.
 */
export default function EventPromo({ event, compact = false }: { event: EventEntry & { date: Date }; compact?: boolean }) {
  if (compact) {
    return (
      <aside aria-label="Evento in programma" className="slab flex flex-col items-start gap-4 !rounded-[22px] p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
        <DateTile event={event} size="sm" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-[13.5px] font-[700] text-peach-deep">
            {event.free ? 'Serata gratuita' : 'Evento'} · {eventLong(event.date)}
          </p>
          <p className="text-[19px] font-[800] leading-tight tracking-[-0.02em] text-ink">{event.title}</p>
          {event.locationLabel && <p className="text-[14.5px] text-ink-soft">{event.locationLabel}</p>}
        </div>
        <ReserveButton event={event} className="btn shrink-0" />
      </aside>
    );
  }
  return (
    <aside aria-labelledby="promo-title" className="slab grid items-center gap-6 p-[clamp(22px,3.4vw,40px)] md:grid-cols-[auto_1fr] md:gap-10">
      <DateTile event={event} />
      <div className="flex min-w-0 flex-col items-start gap-3">
        {event.statusLabel && <span className="pill pill-peach">{event.statusLabel}</span>}
        <h2 id="promo-title" className="font-[family-name:var(--font-sans)] text-[clamp(26px,3vw,36px)] font-[800] normal-case leading-[1.02] tracking-[-0.03em]">
          {event.title}
        </h2>
        <p className="max-w-[46em] text-[16.5px] leading-relaxed text-ink-soft">{event.excerpt}</p>
        <EventMeta event={event} />
        <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ReserveButton event={event} className="btn btn-lg" />
          <Link className="text-link" href={`/eventi/${event.slug}`}>
            Tutti i dettagli <ArrowIcon size={14} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
