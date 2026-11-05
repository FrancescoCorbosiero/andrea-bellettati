import Image from 'next/image';
import Link from 'next/link';
import ciotola from '@/assets/home-ciotola.jpg';
import bowls from '@/assets/hero.jpg';
import van from '@/assets/home-approccio.jpg';
import winter from '@/assets/chi-sono.jpg';
import river from '@/assets/consulenza.jpg';
import sea from '@/assets/home-chi-sono.jpg';
import { CalendarCheck, Clock3, MapPin, UsersRound } from 'lucide-react';
import ArticleCard from '@/components/blog/ArticleCard';
import { ArrowIcon, InstagramIcon, WhatsAppIcon } from '@/components/icons';
import { eventDay, eventMonth, eventTime } from '@/lib/dates';
import { eventHref, type Article, type EventEntry } from '@/lib/content';
import { IG_HANDLE, IG_URL, waLink } from '@/lib/site';

const IG_TILES = [
  { src: ciotola, alt: 'La bassotta di Andrea che mangia dalla sua ciotola' },
  { src: bowls, alt: 'Quattro ciotole con carne, verdure e crocchette: una razione preparata con cura' },
  { src: van, alt: 'Andrea con il furgone aperto e i cani, pronti a partire in montagna' },
  { src: winter, alt: 'Andrea Bellettati con la sua bassotta in braccio, d’inverno, con il cappuccio' },
  { src: river, alt: 'Andrea Bellettati seduto su una roccia con la sua bassotta, lungo un fiume di montagna' },
  { src: sea, alt: 'Andrea Bellettati al mare con i suoi due cani in braccio' },
];

/** Dal profilo: una fila di foto vere che porta su Instagram. */
export function InstagramRow() {
  return (
    <section className="relative overflow-hidden pb-[clamp(40px,6vw,72px)] pt-[clamp(56px,8vw,100px)]" aria-labelledby="ig-title">
      <div className="wrap mb-7 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col items-start gap-4">
          <span className="eyebrow">Dal profilo</span>
          <h2 id="ig-title" className="display-md" data-split>
            Ogni giorno, <span className="script">su Instagram.</span>
          </h2>
        </div>
        <a className="btn btn-ghost" href={IG_URL} target="_blank" rel="noopener">
          <InstagramIcon size={16} /> {IG_HANDLE}
        </a>
      </div>
      <div
        className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-[max(22px,calc((100vw-1200px)/2+22px))] pb-5 pt-1.5 [scrollbar-width:none] lg:mx-auto lg:grid lg:max-w-[1200px] lg:grid-cols-6 lg:overflow-visible lg:px-[22px] [&::-webkit-scrollbar]:hidden"
        data-reveal="stagger"
      >
        {IG_TILES.map((t, i) => (
          <a
            key={i}
            href={IG_URL}
            target="_blank"
            rel="noopener"
            className="group relative aspect-square w-[min(44vw,220px)] flex-none snap-start overflow-hidden rounded-[14px] border border-white/70 shadow-[var(--shadow-glass-s)] transition-[transform,box-shadow] duration-400 hover:-translate-y-[3px] hover:shadow-[var(--shadow-glass-m)] lg:w-auto"
          >
            <Image src={t.src} alt={t.alt} fill sizes="(min-width: 1024px) 190px, 44vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-soft)] group-hover:scale-105" />
            <span className="absolute inset-x-2.5 bottom-2.5 flex translate-y-2 items-center justify-center gap-1.5 rounded-full border border-white/60 bg-white/65 px-2.5 py-2 text-[12.5px] font-[700] text-ink opacity-0 backdrop-blur-md transition-[opacity,translate] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              <InstagramIcon size={15} /> Apri su Instagram
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

/** Prossimo incontro: il primo evento in programma, dalla collection eventi. */
export function NextEvent({ event }: { event: EventEntry }) {
  const { href, external } = eventHref(event);
  const scheduled = event.status === 'upcoming' && event.date;
  return (
    <section className="section-tight" aria-labelledby="evt-title">
      <div className="wrap">
        <div className="mb-8 flex flex-col items-start gap-4">
          <span className="eyebrow">Dal vivo e online</span>
          <h2 id="evt-title" className="display-md" data-split>
            Prossimo <span className="script">incontro.</span>
          </h2>
        </div>
        <article className="slab grid items-center gap-7 p-[clamp(22px,3.4vw,40px)] md:grid-cols-[auto_1fr] md:gap-12" data-reveal>
          <div
            aria-hidden
            className="flex aspect-[0.9] w-[150px] flex-col items-center justify-center gap-0.5 rounded-[20px] border border-white/15 bg-bark p-3.5 text-center text-cream-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.24),0_18px_36px_-16px_rgb(208_103_63/0.7)]"
          >
            {scheduled && event.date ? (
              <>
                <span className="text-[12.5px] font-[700] uppercase tracking-[0.08em] text-peach">{eventMonth(event.date)}</span>
                <span className="font-[family-name:var(--font-poster)] text-[64px] leading-none">{eventDay(event.date)}</span>
                <span className="min-w-[70%] border-t border-dashed border-white/30 pt-1.5 text-[13.5px] text-cream-ink/80">ore {eventTime(event.date)}</span>
              </>
            ) : (
              <>
                <span className="text-[12.5px] font-[700] uppercase tracking-[0.08em] text-peach">Data</span>
                <span className="font-[family-name:var(--font-script)] text-[34px] leading-[1.1]">{event.whenLabel ?? 'In arrivo'}</span>
              </>
            )}
          </div>
          <div className="flex min-w-0 flex-col items-start gap-3">
            {event.statusLabel && <span className="pill pill-peach">{event.statusLabel}</span>}
            <h3 className="text-[clamp(26px,2.8vw,36px)]">{event.title}</h3>
            <p className="max-w-[48em] text-[16.5px] leading-relaxed text-ink-soft">{event.excerpt}</p>
            <ul className="mt-0.5 flex flex-wrap gap-x-5 gap-y-2 text-[14.5px] font-[600] text-ink-mute">
              {event.locationLabel && (
                <li className="inline-flex items-center gap-1.5">
                  <MapPin size={16} aria-hidden className="text-olive" /> {event.locationLabel}
                </li>
              )}
              {event.collab && (
                <li className="inline-flex items-center gap-1.5">
                  <UsersRound size={16} aria-hidden className="text-olive" /> {event.collab}
                </li>
              )}
              {event.duration && (
                <li className="inline-flex items-center gap-1.5">
                  <Clock3 size={16} aria-hidden className="text-olive" /> {event.duration}
                </li>
              )}
              {event.free && (
                <li className="inline-flex items-center gap-1.5">
                  <CalendarCheck size={16} aria-hidden className="text-olive" /> Gratuito
                </li>
              )}
            </ul>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
              {external ? (
                <a className="btn" href={href} target="_blank" rel="noopener">
                  Resta aggiornato <ArrowIcon size={15} />
                </a>
              ) : (
                <Link className="btn" href={href}>
                  Dettagli e prenotazione <ArrowIcon size={15} />
                </Link>
              )}
              <Link className="text-link" href="/eventi">
                Tutti gli eventi <ArrowIcon size={14} />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

/** Dal blog: gli ultimi tre articoli e il rimando all'indice. */
export function BlogGrid({ articles, total }: { articles: Article[]; total: number }) {
  return (
    <section className="relative overflow-hidden pb-[clamp(50px,7vw,90px)] pt-[clamp(80px,10vw,120px)]" aria-labelledby="blog-title">
      <div className="wrap mb-9 flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col items-start gap-4">
          <span className="eyebrow">Dal blog</span>
          <h2 id="blog-title" className="display-lg" data-split>
            Senza slogan.
            <br />
            Con <span className="script">metodo.</span>
          </h2>
        </div>
        <Link className="btn btn-ghost" href="/articoli">
          Tutti gli articoli <ArrowIcon size={15} />
        </Link>
      </div>
      <div
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(22px,calc((100vw-1200px)/2+22px))] pb-8 pt-2 [scrollbar-width:none] md:mx-auto md:grid md:max-w-[1200px] md:grid-cols-2 md:overflow-visible md:px-[22px] lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,0.72fr)] [&::-webkit-scrollbar]:hidden"
        data-reveal="stagger"
      >
        {articles.map((a) => (
          <div key={a.slug} className="w-[min(78vw,360px)] flex-none snap-center md:w-auto">
            <ArticleCard article={a} />
          </div>
        ))}
        <Link
          href="/articoli"
          className="slab slab-peach slab-lift flex min-h-[320px] w-[min(78vw,360px)] flex-none snap-center flex-col justify-between gap-4 !rounded-[24px] p-7 md:min-h-0 md:w-auto"
        >
          <span className="font-[family-name:var(--font-poster)] text-[clamp(96px,9vw,140px)] leading-[0.8]">{total}</span>
          <span className="text-[24px] font-[800] leading-none tracking-[-0.035em]">articoli per nutrire bene cane e gatto</span>
          <span className="inline-flex items-center gap-2 font-[750]">
            Vai al blog <ArrowIcon size={18} />
          </span>
        </Link>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: 'La consulenza è davvero gratuita?',
    a: 'Sì. Dura 45 minuti e alla fine ricevi un documento firmato con il piano di lavoro proposto. Decidi tu se e come proseguire: nessun impegno.',
  },
  {
    q: 'Sostituisce il veterinario?',
    a: 'No. Lavoro su alimentazione e comportamento, al fianco del tuo veterinario. Per sintomi, farmaci e diagnosi il riferimento resta sempre lui.',
  },
  { q: 'Vale anche per i gatti?', a: 'Sì, la consulenza è per cani e gatti, a ogni età.' },
  {
    q: 'Cosa succede dopo il questionario?',
    a: 'Ti ricontatto io al numero che hai indicato, per fissare la chiamata quando ti è più comodo.',
  },
  {
    q: 'Entrare nel Team ha un costo?',
    a: 'Al colloquio conoscitivo ricevi tutte le informazioni su attività, costi e guadagni, prima di decidere qualsiasi cosa.',
  },
];

export const faqLd = {
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

/** Domande frequenti: <details> nativi, si aprono anche senza JavaScript. */
export function Faq() {
  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="wrap grid items-start gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="flex flex-col items-start gap-4 lg:sticky lg:top-28">
          <span className="eyebrow">Domande frequenti</span>
          <h2 id="faq-title" className="display-lg" data-split>
            Quello che mi chiedete <span className="script">più spesso.</span>
          </h2>
          <p className="max-w-[26em] text-[17px] text-ink-soft">Non trovi la tua domanda? Scrivimi: ti rispondo io, di persona.</p>
          <a className="btn btn-ghost" href={waLink('Ciao Andrea! Ho una domanda sulla consulenza gratuita.')} target="_blank" rel="noopener">
            <WhatsAppIcon size={16} /> Fammi una domanda
          </a>
        </div>
        <div className="border-t border-ink/12" data-reveal>
          {FAQS.map((f) => (
            <details key={f.q} className="faq group border-b border-ink/12" data-accordion>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-0.5 py-[22px] text-[clamp(20px,2.1vw,26px)] font-[750] leading-[1.15] tracking-[-0.025em] text-ink transition-colors hover:text-peach-deep [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <i
                  aria-hidden
                  className="relative h-[42px] w-[42px] shrink-0 rounded-full border border-white/90 bg-white/75 shadow-[var(--shadow-glass-s)] transition-[rotate,background-color] duration-500 ease-[var(--ease-spring)] before:absolute before:left-1/2 before:top-1/2 before:h-[2.5px] before:w-[15px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded before:bg-ink after:absolute after:left-1/2 after:top-1/2 after:h-[15px] after:w-[2.5px] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded after:bg-ink group-open:rotate-45 group-open:bg-peach"
                />
              </summary>
              <div className="overflow-hidden" data-accordion-body>
                <p className="max-w-[60ch] px-0.5 pb-6 text-[17px] leading-relaxed text-ink-soft">{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
