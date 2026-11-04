import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DateTile, EventActions, EventMeta } from '@/components/events/EventCard';
import { ArrowIcon } from '@/components/icons';
import JsonLd from '@/components/seo/JsonLd';
import { getEvent, getEvents, renderMarkdown } from '@/lib/content';
import { eventLong } from '@/lib/dates';
import { breadcrumbLd, pageMetadata } from '@/lib/seo';
import { CONSULENZA_HREF, SITE_URL, absoluteUrl } from '@/lib/site';

export const dynamicParams = false;
/** Le date passano: rigenerata ogni 12 ore. */
export const revalidate = 43200;

export function generateStaticParams() {
  return getEvents()
    .filter((e) => e.onSite)
    .map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(props: PageProps<'/eventi/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const e = getEvent(slug);
  if (!e) return {};
  return pageMetadata({ title: e.title, description: e.excerpt, path: `/eventi/${e.slug}`, image: e.cover, imageAlt: e.coverAlt });
}

export default async function EventoPage(props: PageProps<'/eventi/[slug]'>) {
  const { slug } = await props.params;
  const e = getEvent(slug);
  if (!e) notFound();
  const { html } = await renderMarkdown(e.body);
  const online = /online|webinar/i.test(`${e.locationLabel ?? ''} ${e.category ?? ''}`);

  const eventLd = e.date
    ? {
        '@type': 'Event',
        name: e.title,
        description: e.excerpt,
        startDate: e.date.toISOString(),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: online ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
        location: online ? { '@type': 'VirtualLocation', url: absoluteUrl(`/eventi/${e.slug}`) } : { '@type': 'Place', name: e.locationLabel ?? 'Da definire' },
        organizer: { '@id': `${SITE_URL}/#andrea` },
        ...(e.free ? { isAccessibleForFree: true, offers: { '@type': 'Offer', price: 0, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: absoluteUrl(`/eventi/${e.slug}`) } } : {}),
      }
    : null;

  return (
    <>
      <article className="pb-[clamp(56px,7vw,96px)] pt-8 lg:pt-12">
        <div className="wrap-narrow flex flex-col items-start gap-6">
          <Link href="/eventi" className="text-link !border-transparent !text-[15px] text-ink-mute hover:!border-peach">
            <ArrowIcon size={14} className="rotate-180" /> Tutti gli eventi
          </Link>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <DateTile event={e} />
            <div className="flex flex-col items-start gap-2.5">
              {e.statusLabel && <span className="pill pill-peach">{e.statusLabel}</span>}
              {e.category && <p className="text-[14px] font-[700] text-ink-mute">{e.category}</p>}
              {e.date && <p className="text-[15.5px] font-[650] text-ink">{eventLong(e.date)}</p>}
            </div>
          </div>
          <h1 className="font-[family-name:var(--font-sans)] text-[clamp(38px,5.4vw,64px)] font-[800] normal-case leading-[1] tracking-[-0.035em]">{e.title}</h1>
          {e.subtitle && <p className="text-[20px] font-[700] leading-snug text-ink">{e.subtitle}</p>}
          <p className="lead">{e.excerpt}</p>
          {e.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {e.tags.map((t) => (
                <li key={t} className="pill">
                  {t}
                </li>
              ))}
            </ul>
          )}
          <EventMeta event={e} />
          <EventActions event={e} withDetails={false} />
        </div>
        <div className="wrap-narrow mt-10">
          <div className="prose-ab" dangerouslySetInnerHTML={{ __html: html }} />
          {e.collab && <p className="mt-8 text-[16px] text-ink-mute">In collaborazione con {e.collab}.</p>}
        </div>
      </article>

      <section className="on-dark section-tight" style={{ background: 'radial-gradient(60% 70% at 85% 0%, rgb(255 255 255 / 0.14), rgb(255 255 255 / 0) 70%), var(--color-sage)' }}>
        <div className="wrap flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="display-md">
              Preferisci un confronto
              <br />
              tutto tuo?
            </h2>
            <p className="text-[17px] text-cream-ink/85">La consulenza 1:1 parte da un primo incontro gratuito di 45 minuti.</p>
          </div>
          <Link className="btn btn-lg" href={CONSULENZA_HREF}>
            Consulenza gratuita <ArrowIcon size={16} />
          </Link>
        </div>
      </section>
      <JsonLd
        data={[
          ...(eventLd ? [eventLd] : []),
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Eventi', path: '/eventi' },
            { name: e.title, path: `/eventi/${e.slug}` },
          ]),
        ]}
      />
    </>
  );
}
