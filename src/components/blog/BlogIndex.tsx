'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { Searchbar } from 'konsta/react';
import ArticleCard from './ArticleCard';
import type { Article } from '@/lib/content-shared';

/** Minuscolo e senza accenti: "Comportamento" e "comportamènto" si trovano uguali. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/**
 * L'indice del blog come in un'app: barra di ricerca iOS e categorie a
 * chip. Filtra mentre scrivi, senza ricaricare niente.
 */
export default function BlogIndex({ articles, categories }: { articles: Article[]; categories: string[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const q = useDeferredValue(query);

  const shown = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    return articles.filter((a) => {
      if (category && a.category !== category) return false;
      if (!words.length) return true;
      const hay = norm(`${a.title} ${a.excerpt} ${a.category}`);
      return words.every((w) => hay.includes(w));
    });
  }, [articles, category, q]);

  const chip = (value: string | null, label: string) => {
    const on = category === value;
    return (
      <button
        key={label}
        type="button"
        aria-pressed={on}
        onClick={() => setCategory(value)}
        className={`h-10 rounded-full border px-4 text-[14.5px] font-[650] transition-[background-color,color,box-shadow] duration-200 ${
          on
            ? 'border-white/30 bg-ink text-cream-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.24),0_10px_22px_-10px_rgb(208_103_63/0.7)]'
            : 'border-white/90 bg-white/75 text-ink shadow-[var(--shadow-glass-s)] hover:bg-white'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div>
      <div className="k-ios flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-[440px] [&_.k-searchbar]:!bg-transparent [&_.k-searchbar]:!p-0">
          <Searchbar
            value={query}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Cerca: prurito, etichette, crocchette…"
            disableButton={false}
            inputId="blog-search"
          />
        </div>
        <div role="group" aria-label="Categorie" className="flex flex-wrap gap-2">
          {chip(null, 'Tutti')}
          {categories.map((c) => chip(c, c))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {shown.length} articoli
      </p>

      {shown.length ? (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal="stagger">
          {shown.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 flex flex-col items-start gap-4 rounded-[24px] border-[1.5px] border-dashed border-ink/25 p-8">
          <p className="text-[17px] text-ink-soft">
            Nessun articolo trovato. Prova con un&apos;altra parola (es. “prurito”, “etichette”, “crocchette”)…
          </p>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setQuery('');
              setCategory(null);
            }}
          >
            Mostra tutti gli articoli
          </button>
        </div>
      )}
    </div>
  );
}
