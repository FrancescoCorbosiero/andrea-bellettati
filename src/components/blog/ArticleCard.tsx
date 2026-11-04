import Link from 'next/link';
import { ArrowIcon, PawIcon } from '@/components/icons';
import { CATEGORY_TONE, type Article } from '@/lib/content-shared';

const TONE_CLASS = {
  peach: 'bg-peach text-ink',
  sage: 'bg-sage text-cream-ink',
  mist: 'bg-sage-mist text-olive',
  ink: 'bg-olive-dark text-peach',
} as const;

/**
 * Card di un articolo. Senza foto è un blocco colorato con la categoria:
 * ogni categoria ha il suo colore, nel blog si riconoscono a colpo d'occhio.
 */
export default function ArticleCard({ article, headingLevel = 'h3' }: { article: Article; headingLevel?: 'h2' | 'h3' }) {
  const tone = TONE_CLASS[CATEGORY_TONE[article.category] ?? 'mist'];
  const comingSoon = article.status === 'coming-soon';
  const href = article.externalUrl ?? (comingSoon ? null : `/articoli/${article.slug}`);
  const H = headingLevel;

  const inner = (
    <>
      {article.cover ? (
        // eslint-disable-next-line @next/next/no-img-element -- cover libera dal frontmatter (percorso in /public)
        <img src={article.cover} alt={article.coverAlt ?? ''} loading="lazy" className="aspect-[16/10] w-full border-b border-ink/10 object-cover" />
      ) : (
        <div aria-hidden className={`relative flex aspect-[16/10] items-end overflow-hidden border-b border-ink/10 p-5 ${tone}`}>
          <span className="relative z-10 font-[family-name:var(--font-poster)] text-[clamp(30px,3.2vw,40px)] uppercase leading-[0.9]">{article.category}</span>
          <PawIcon size={130} className="absolute -right-3 -top-4 opacity-25" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2.5 p-5 pb-6">
        <p className="text-[13px] font-[700] text-ink-mute">
          {article.category} · {comingSoon ? <span className="text-peach-deep">In arrivo</span> : `${article.minutes} min`}
        </p>
        <H className="font-[family-name:var(--font-sans)] text-[22px] font-[800] normal-case leading-[1.08] tracking-[-0.02em]">{article.title}</H>
        <p className="text-[15.5px] leading-relaxed text-ink-soft">{article.excerpt}</p>
        {href && (
          <span className="text-link mt-auto w-fit !text-[15px]">
            {article.externalUrl ? 'Apri su Instagram' : 'Approfondisci'} <ArrowIcon size={14} />
          </span>
        )}
      </div>
    </>
  );

  const cls = 'slab slab-lift flex h-full flex-col overflow-hidden !rounded-[24px]';
  if (!href) return <div className={`${cls} opacity-80`}>{inner}</div>;
  return article.externalUrl ? (
    <a href={href} target="_blank" rel="noopener" className={cls} data-tilt>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls} data-tilt>
      {inner}
    </Link>
  );
}
