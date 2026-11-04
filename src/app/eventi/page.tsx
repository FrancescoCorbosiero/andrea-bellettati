import Link from 'next/link';
import { DateTile, EventActions, EventMeta } from '@/components/events/EventCard';
import { ArrowIcon, WhatsAppIcon } from '@/components/icons';
import JsonLd from '@/components/seo/JsonLd';
import SectionHead from '@/components/ui/SectionHead';
import { getEvents, nextEvent } from '@/lib/content';
import { breadcrumbLd, pageMetadata } from '@/lib/seo';
import { CONSULENZA_HREF, IG_URL, waLink } from '@/lib/site';

/** Le date passano: la pagina si rigenera da sola ogni 12 ore. */
export const revalidate = 43200;

export const metadata = pageMetadata({
  title: 'Eventi e webinar',
  description:
    'Incontri online gratuiti per fare chiarezza su alimentazione e benessere di cani e gatti: etichette, ingredienti, scelte quotidiane, con spazio per le tue domande.',
  path: '/eventi',
});

export default function EventiPage() {
  const events = getEvents();
  // In evidenza: il prossimo incontro vero (mai uno già svolto).
  const featured = nextEvent() ?? events[0];
  const rest = events.filter((e) => e !== featured);

  return (
    <>
      <section className="pb-10 pt-10 lg:pt-16" aria-labelledby="ev-title">
        <div className="wrap">
          <SectionHead
            as="h1"
            id="ev-title"
            size="xl"
            eyebrow="Eventi e webinar"
            title="Impariamo insieme,"
            script="live."
            lead="Incontri online gratuiti per fare chiarezza su alimentazione e benessere. Si parla di etichette, ingredienti, scelte quotidiane — con spazio per le tue domande."
            className="intro"
          />
        </div>
      </section>

      {featured && (
        <section className="pb-12" aria-label="In evidenza">
          <div className="wrap">
            <article className="slab grid items-center gap-7 p-[clamp(22px,3.4vw,44px)] md:grid-cols-[auto_1fr] md:gap-12" data-reveal>
              <DateTile event={featured} />
              <div className="flex min-w-0 flex-col items-start gap-3">
                {featured.statusLabel && <span className="pill pill-peach">{featured.statusLabel}</span>}
                {featured.category && <p className="text-[14px] font-[700] text-ink-mute">{featured.category}</p>}
                <h2 className="font-[family-name:var(--font-sans)] text-[clamp(30px,3.6vw,46px)] font-[800] normal-case leading-[1] tracking-[-0.03em]">
                  {featured.title}
                </h2>
                {featured.subtitle && <p className="text-[18px] font-[700] text-ink">{featured.subtitle}</p>}
                <p className="max-w-[48em] text-[16.5px] leading-relaxed text-ink-soft">{featured.excerpt}</p>
                <EventMeta event={featured} />
                <div className="mt-2">
                  <EventActions event={featured} />
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="pb-[clamp(64px,8vw,110px)]" aria-labelledby="ev-more">
          <div className="wrap">
            <div className="mb-6 flex flex-col items-start gap-3">
              <span className="eyebrow">In programma e in replay</span>
              <h2 id="ev-more" className="display-md" data-split>
                Altri <span className="script">appuntamenti.</span>
              </h2>
            </div>
            <ul className="slab overflow-hidden !rounded-[24px]">
              {rest.map((e) => (
                <li key={e.slug} className="flex flex-col gap-4 border-b border-ink/10 p-5 last:border-b-0 sm:flex-row sm:items-center sm:gap-6">
                  <DateTile event={e} size="sm" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    {e.statusLabel && <span className="pill">{e.statusLabel}</span>}
                    <h3 className="text-[22px]">{e.title}</h3>
                    <p className="text-[15px] leading-relaxed text-ink-soft">{e.excerpt}</p>
                  </div>
                  <div className="shrink-0">
                    <EventActions event={e} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15.5px] text-ink-soft">
              I nuovi eventi vengono annunciati prima su{' '}
              <a className="text-link" href={IG_URL} target="_blank" rel="noopener">
                Instagram
              </a>
              . Vuoi essere avvisato?{' '}
              <a className="text-link" href={waLink('Ciao Andrea! Avvisami quando organizzi il prossimo incontro.')} target="_blank" rel="noopener">
                <WhatsAppIcon size={14} /> Scrivimi
              </a>
            </p>
          </div>
        </section>
      )}

      <section className="on-dark section-tight" style={{ background: 'radial-gradient(60% 70% at 85% 0%, rgb(255 255 255 / 0.14), rgb(255 255 255 / 0) 70%), var(--color-sage)' }}>
        <div className="wrap flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="display-md" data-split>
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
        data={breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: 'Eventi', path: '/eventi' },
        ])}
      />
    </>
  );
}
