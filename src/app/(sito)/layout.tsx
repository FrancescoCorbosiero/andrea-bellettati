import type { ReactNode } from 'react';
import EventBar from '@/components/events/EventBar';
import MobileTabbar from '@/components/layout/MobileTabbar';
import SiteFooter from '@/components/layout/SiteFooter';
import SiteHeader from '@/components/layout/SiteHeader';
import { openEvent } from '@/lib/content';
import { capitalize, eventDay, eventLong, eventMonth, eventTime } from '@/lib/dates';

/** La striscia dell'evento sparisce da sola quando la data passa: rigenerato ogni 12 ore. */
export const revalidate = 43200;

/** Le pagine del sito: striscia del prossimo evento, header, menu, piè di pagina e barra in basso. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  const event = openEvent();
  return (
    <>
      {event?.onSite && (
        <EventBar
          href={`/eventi/${event.slug}`}
          when={capitalize(eventLong(event.date))}
          whenShort={`${eventDay(event.date)} ${eventMonth(event.date).slice(0, 3).toLowerCase()}, ${eventTime(event.date)}`}
          title={event.title}
          free={event.free}
        />
      )}
      <SiteHeader />
      <main id="contenuto">{children}</main>
      <SiteFooter />
      <MobileTabbar />
    </>
  );
}
