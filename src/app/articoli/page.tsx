import Link from 'next/link';
import BlogIndex from '@/components/blog/BlogIndex';
import { ArrowIcon, InstagramIcon, WhatsAppIcon } from '@/components/icons';
import SectionHead from '@/components/ui/SectionHead';
import JsonLd from '@/components/seo/JsonLd';
import { categories, getArticles } from '@/lib/content';
import { breadcrumbLd, pageMetadata } from '@/lib/seo';
import { CONSULENZA_HREF, IG_URL, absoluteUrl, waLink } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Blog — alimentazione e comportamento',
  description:
    'Spunti pratici su alimentazione e benessere di cani e gatti, nati dalle domande che mi fanno più spesso famiglie e proprietari. Senza slogan, con metodo.',
  path: '/articoli',
});

export default function ArticoliPage() {
  const articles = getArticles();
  const featured = articles.find((a) => a.featured && a.onSite);
  const listLd = {
    '@type': 'ItemList',
    itemListElement: articles
      .filter((a) => a.onSite)
      .map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(`/articoli/${a.slug}`), name: a.title })),
  };

  return (
    <>
      <section className="pb-10 pt-10 lg:pt-16" aria-labelledby="blog-title">
        <div className="wrap">
          <SectionHead
            as="h1"
            id="blog-title"
            size="xl"
            eyebrow="Il blog"
            title={
              <>
                Senza slogan.
                <br />
                Con
              </>
            }
            script="metodo."
            lead="Spunti pratici su alimentazione e benessere, nati dalle domande che mi fanno più spesso famiglie e proprietari. Niente promesse facili: solo informazione che aiuta a scegliere."
            className="intro"
          />
        </div>
      </section>

      {featured && (
        <section className="pb-10" aria-label="In evidenza">
          <div className="wrap">
            <Link href={`/articoli/${featured.slug}`} className="slab slab-peach slab-lift flex flex-col items-start gap-3 p-7 sm:p-10" data-reveal>
              <span className="eyebrow eyebrow-light">In evidenza · {featured.category}</span>
              <h2 className="max-w-[18em] font-[family-name:var(--font-sans)] text-[clamp(28px,3.4vw,44px)] font-[800] normal-case leading-[1.02] tracking-[-0.03em]">
                {featured.title}
              </h2>
              <p className="max-w-[44em] text-[17px] leading-relaxed">{featured.excerpt}</p>
              <span className="mt-1 inline-flex items-center gap-2 font-[750]">
                Leggi l&apos;articolo · {featured.minutes} min <ArrowIcon size={16} />
              </span>
            </Link>
          </div>
        </section>
      )}

      <section className="pb-[clamp(64px,8vw,110px)]" aria-label="Tutti gli articoli">
        <div className="wrap">
          <BlogIndex articles={articles} categories={categories(articles)} />
          <p className="mt-10 flex flex-wrap items-center gap-2 text-[15.5px] text-ink-soft">
            Pubblico nuovi contenuti prima su Instagram. Seguimi su{' '}
            <a className="text-link" href={IG_URL} target="_blank" rel="noopener">
              <InstagramIcon size={15} /> @comunicazionecinofila
            </a>
          </p>
        </div>
      </section>

      <section className="on-dark section-tight" style={{ background: 'radial-gradient(60% 70% at 85% 0%, rgb(255 255 255 / 0.14), rgb(255 255 255 / 0) 70%), var(--color-sage)' }}>
        <div className="wrap flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="display-md">
              Hai una domanda
              <br />
              sul tuo animale?
            </h2>
            <p className="text-[17px] text-cream-ink/85">Spesso la risposta più utile arriva da un confronto diretto. Il primo è gratuito.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-lg" href={CONSULENZA_HREF}>
              Consulenza gratuita <ArrowIcon size={16} />
            </Link>
            <a className="btn btn-ghost btn-lg" href={waLink('Ciao Andrea! Ho una domanda sul mio animale.')} target="_blank" rel="noopener">
              <WhatsAppIcon size={16} /> Chiedi a me
            </a>
          </div>
        </div>
      </section>
      <JsonLd
        data={[
          listLd,
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/articoli' },
          ]),
        ]}
      />
    </>
  );
}
