import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleCard from '@/components/blog/ArticleCard';
import { ReadingProgress, ShareRow } from '@/components/blog/ArticleTools';
import { ArrowIcon, WhatsAppIcon } from '@/components/icons';
import JsonLd from '@/components/seo/JsonLd';
import { getArticle, getArticles, renderMarkdown } from '@/lib/content';
import { longDate } from '@/lib/dates';
import { breadcrumbLd, pageMetadata } from '@/lib/seo';
import { CONSULENZA_HREF, SITE_URL, absoluteUrl, waLink } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles()
    .filter((a) => a.onSite)
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<'/articoli/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const a = getArticle(slug);
  if (!a) return {};
  return pageMetadata({ title: a.title, description: a.excerpt, path: `/articoli/${a.slug}`, image: a.cover, imageAlt: a.coverAlt, type: 'article' });
}

export default async function ArticoloPage(props: PageProps<'/articoli/[slug]'>) {
  const { slug } = await props.params;
  const a = getArticle(slug);
  if (!a) notFound();
  const { html, headings } = await renderMarkdown(a.body);
  const url = absoluteUrl(`/articoli/${a.slug}`);

  const others = getArticles().filter((x) => x.slug !== a.slug && x.onSite);
  const related = [...others.filter((x) => x.category === a.category), ...others.filter((x) => x.category !== a.category)].slice(0, 3);

  const articleLd = {
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date.toISOString(),
    inLanguage: 'it',
    wordCount: a.words,
    timeRequired: `PT${a.minutes}M`,
    articleSection: a.category,
    ...(a.cover ? { image: absoluteUrl(a.cover) } : {}),
    author: { '@id': `${SITE_URL}/#andrea` },
    mainEntityOfPage: url,
  };

  return (
    <>
      <ReadingProgress />
      <article className="pb-[clamp(56px,7vw,96px)] pt-8 lg:pt-12">
        <header className="wrap-narrow flex flex-col items-start gap-5">
          <Link href="/articoli" className="text-link !border-transparent !text-[15px] text-ink-mute hover:!border-peach">
            <ArrowIcon size={14} className="rotate-180" /> Torna al blog
          </Link>
          <p className="flex flex-wrap items-center gap-2 text-[14px] font-[650] text-ink-mute">
            <span className="pill pill-peach">{a.category}</span>
            {a.minutes} min di lettura · {longDate(a.date)}
          </p>
          <h1 className="font-[family-name:var(--font-sans)] text-[clamp(36px,5vw,60px)] font-[800] normal-case leading-[1.02] tracking-[-0.035em]">{a.title}</h1>
          <p className="lead">{a.excerpt}</p>
        </header>

        {headings.length >= 3 && (
          <nav aria-label="Indice dell'articolo" className="wrap-narrow mt-8">
            <div className="slab slab-blush !rounded-[22px] p-6">
              <p className="font-[family-name:var(--font-script)] text-[24px] leading-none text-peach-deep">In questo articolo</p>
              <ol className="mt-3 grid gap-1.5 text-[15.5px] font-[650]">
                {headings.map((h, i) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="inline-flex gap-2.5 hover:text-peach-deep">
                      <span className="font-[family-name:var(--font-poster)] font-normal text-peach-deep">{String(i + 1).padStart(2, '0')}</span>
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        )}

        <div className="wrap-narrow mt-10">
          <div className="prose-ab" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="mt-12 border-t border-ink/12 pt-6">
            <ShareRow title={a.title} url={url} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section-tight border-t border-ink/10 bg-sand" aria-labelledby="related-title">
          <div className="wrap">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col items-start gap-4">
                <span className="eyebrow">Continua a leggere</span>
                <h2 id="related-title" className="display-md">
                  Potrebbero <span className="script">interessarti.</span>
                </h2>
              </div>
              <Link className="btn btn-ghost" href="/articoli">
                Tutti gli articoli <ArrowIcon size={15} />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ArticleCard key={r.slug} article={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="on-dark section-tight" style={{ background: 'radial-gradient(60% 70% at 85% 0%, rgb(255 255 255 / 0.14), rgb(255 255 255 / 0) 70%), var(--color-sage)' }}>
        <div className="wrap flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="display-md">
              Hai una domanda
              <br />
              sul tuo animale?
            </h2>
            <p className="text-[17px] text-cream-ink/85">Il primo confronto è gratuito e senza impegno.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-lg" href={CONSULENZA_HREF}>
              Consulenza gratuita <ArrowIcon size={16} />
            </Link>
            <a className="btn btn-ghost btn-lg" href={waLink(`Ciao Andrea! Ho letto "${a.title}" e avrei una domanda sul mio animale.`)} target="_blank" rel="noopener">
              <WhatsAppIcon size={16} /> Scrivimi su WhatsApp
            </a>
          </div>
        </div>
      </section>
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/articoli' },
            { name: a.title, path: `/articoli/${a.slug}` },
          ]),
        ]}
      />
    </>
  );
}
