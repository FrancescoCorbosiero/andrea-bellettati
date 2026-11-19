import Link from 'next/link';
import { CalendarCheck, CalendarPlus, Clock3, MapPin, UsersRound } from 'lucide-react';
import { ArrowIcon, InstagramIcon, WhatsAppIcon } from '@/components/icons';
import { eventDay, eventMonth, eventTime } from '@/lib/dates';
import { eventHref, type EventEntry } from '@/lib/content';
import { waLink } from '@/lib/site';

/** La data in una piastrella marrone: giorno grande, mese, ora. */
export function DateTile({ event, size = 'md' }: { event: EventEntry; size?: 'md' | 'sm' }) {
  const scheduled = event.status === 'upcoming' && event.date;
  return (
    <div
      aria-hidden
      className={`flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-[20px] border border-white/15 bg-bark text-center text-cream-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.24),0_18px_36px_-16px_rgb(208_103_63/0.7)] ${
        size === 'md' ? 'aspect-[0.9] w-[150px] p-3.5' : 'aspect-square w-[92px] p-2'
      }`}
    >
      {scheduled && event.date ? (
        <>
          <span className="text-[12px] font-[700] uppercase tracking-[0.08em] text-peach">{eventMonth(event.date)}</span>
          <span className={`font-[family-name:var(--font-poster)] leading-none ${size === 'md' ? 'text-[64px]' : 'text-[38px]'}`}>{eventDay(event.date)}</span>
          {size === 'md' && <span className="min-w-[70%] border-t border-dashed border-white/30 pt-1.5 text-[13.5px] text-cream-ink/80">ore {eventTime(event.date)}</span>}
        </>
      ) : (
        <span className={`font-[family-name:var(--font-script)] leading-[1.05] ${size === 'md' ? 'text-[32px]' : 'text-[21px]'}`}>{event.whenLabel ?? 'In arrivo'}</span>
      )}
    </div>
  );
}

/** I dettagli pratici: dove, con chi, quanto dura, se è gratis. */
export function EventMeta({ event }: { event: EventEntry }) {
  const items = [
    event.locationLabel && { icon: MapPin, text: event.locationLabel },
    event.collab && { icon: UsersRound, text: event.collab },
    event.duration && { icon: Clock3, text: `Durata ${event.duration}` },
    event.free && { icon: CalendarCheck, text: 'Evento gratuito' },
  ].filter(Boolean) as { icon: typeof MapPin; text: string }[];
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[14.5px] font-[600] text-ink-mute">
      {items.map(({ icon: Icon, text }) => (
        <li key={text} className="inline-flex items-center gap-1.5">
          <Icon size={16} aria-hidden className="text-olive" /> {text}
        </li>
      ))}
    </ul>
  );
}

/**
 * Il pulsante per iscriversi: il modulo d'iscrizione se l'evento ne ha uno,
 * altrimenti WhatsApp con il messaggio già scritto.
 */
export function ReserveButton({ event, className = 'btn' }: { event: EventEntry; className?: string }) {
  if (event.reserveUrl) {
    return (
      <a className={className} href={event.reserveUrl} target="_blank" rel="noopener">
        {event.free ? 'Iscriviti gratis' : 'Iscriviti'} <ArrowIcon size={15} />
      </a>
    );
  }
  const text = event.reserveWaText ?? `Ciao Andrea! Vorrei informazioni sull'incontro "${event.title}".`;
  return (
    <a className={className} href={waLink(text)} target="_blank" rel="noopener">
      <WhatsAppIcon size={15} /> Riserva il tuo posto
    </a>
  );
}

/** Le azioni di un evento: riservare il posto, aggiungerlo al calendario, i dettagli. */
export function EventActions({ event, withDetails = true }: { event: EventEntry; withDetails?: boolean }) {
  const { href, external } = eventHref(event);
  const scheduled = event.status === 'upcoming' && event.date && event.onSite;
  return (
    <div className="flex flex-wrap items-center gap-3">
      {event.status === 'upcoming' && <ReserveButton event={event} />}
      {scheduled && (
        <a className="btn btn-ghost" href={`/eventi/${event.slug}/calendario.ics`} download>
          <CalendarPlus size={16} aria-hidden /> Aggiungi al calendario
        </a>
      )}
      {withDetails &&
        (external ? (
          <a className="btn btn-ghost" href={href} target="_blank" rel="noopener">
            <InstagramIcon size={15} /> Resta aggiornato
          </a>
        ) : (
          href !== '#' && (
            <Link className="text-link" href={href}>
              {event.onSite ? 'Tutti i dettagli' : 'Scopri di più'} <ArrowIcon size={14} />
            </Link>
          )
        ))}
    </div>
  );
}
