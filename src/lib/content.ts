import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import matter from 'gray-matter';
import { z } from 'zod';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';

/* =====================================================================
   Contenuti in Markdown: Andrea aggiunge articoli ed eventi senza toccare
   codice. src/content/articoli/*.md e src/content/eventi/*.md; il nome del
   file è lo slug della pagina. Lo schema è quello del sito Astro.
   Gira solo sul server (legge il disco al build).
   ===================================================================== */

const ROOT = path.join(process.cwd(), 'src/content');

const articleSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  excerpt: z.string(),
  category: z.string(),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  placeholderLabel: z.string().optional(),
  featured: z.boolean().default(false),
  /** published = pagina sul sito; coming-soon = card "In arrivo". */
  status: z.enum(['published', 'coming-soon']).default('published'),
  /** Se presente, i link puntano qui (es. Instagram) invece che alla pagina. */
  externalUrl: z.url().optional(),
});

const eventSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  subtitle: z.string().optional(),
  date: z.coerce.date().optional(),
  /** Etichetta quando non c'è una data ("Su richiesta", "In arrivo"). */
  whenLabel: z.string().optional(),
  category: z.string().optional(),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  placeholderLabel: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['upcoming', 'on-request', 'coming-soon', 'past']).default('upcoming'),
  statusLabel: z.string().optional(),
  free: z.boolean().default(true),
  duration: z.string().optional(),
  locationLabel: z.string().optional(),
  collab: z.string().optional(),
  tags: z.array(z.string()).default([]),
  /** Testo WhatsApp precompilato per "Riserva il tuo posto". */
  reserveWaText: z.string().optional(),
  externalUrl: z.url().optional(),
  internalUrl: z.string().optional(),
});

export type ArticleData = z.infer<typeof articleSchema>;
export type EventData = z.infer<typeof eventSchema>;
export type Heading = { id: string; text: string };

export type Article = ArticleData & {
  slug: string;
  body: string;
  minutes: number;
  words: number;
  /** Ha una pagina sul sito (pubblicato e senza link esterno). */
  onSite: boolean;
};
export type EventEntry = EventData & { slug: string; body: string; onSite: boolean };

function readDir<T>(dir: string, schema: z.ZodType<T>): (T & { slug: string; body: string })[] {
  const full = path.join(ROOT, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), 'utf8');
      const { data, content } = matter(raw);
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`Frontmatter non valido in src/content/${dir}/${file}: ${parsed.error.message}`);
      }
      return { ...parsed.data, slug: file.replace(/\.md$/, ''), body: content };
    });
}

export const getArticles = cache((): Article[] =>
  readDir('articoli', articleSchema)
    .map((a) => {
      const words = a.body.trim().split(/\s+/).length;
      return {
        ...a,
        words,
        minutes: Math.max(1, Math.round(words / 200)),
        onSite: a.status === 'published' && !a.externalUrl,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime()),
);

export const getArticle = (slug: string) => getArticles().find((a) => a.slug === slug && a.onSite);

/** Eventi: prima quelli in programma (per data), poi gli altri. */
export const getEvents = cache((): EventEntry[] =>
  readDir('eventi', eventSchema)
    .map((e) => ({ ...e, onSite: !e.externalUrl && !e.internalUrl }))
    .sort((a, b) => {
      const rank = (e: EventEntry) => ({ upcoming: 0, 'coming-soon': 1, 'on-request': 2, past: 3 })[e.status];
      return rank(a) - rank(b) || (a.date?.getTime() ?? Infinity) - (b.date?.getTime() ?? Infinity);
    }),
);

export const getEvent = (slug: string) => getEvents().find((e) => e.slug === slug && e.onSite);

/** Il prossimo incontro: il primo in programma con data futura, altrimenti "in arrivo" o "su richiesta". */
export function nextEvent(now = Date.now()): EventEntry | undefined {
  const all = getEvents();
  return (
    all.find((e) => e.status === 'upcoming' && e.date && e.date.getTime() >= now) ??
    all.find((e) => e.status === 'coming-soon') ??
    all.find((e) => e.status === 'on-request')
  );
}

/** Dove porta un evento: la sua pagina, un link esterno o interno. */
export function eventHref(e: EventEntry): { href: string; external: boolean } {
  if (e.externalUrl) return { href: e.externalUrl, external: true };
  if (e.internalUrl) return { href: e.internalUrl, external: false };
  return { href: `/eventi/${e.slug}`, external: false };
}

/* ── Markdown → HTML, con l'indice dei titoli di secondo livello ────── */

type HastNode = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: HastNode[]; value?: string };

const textOf = (n: HastNode): string => (n.type === 'text' ? (n.value ?? '') : (n.children ?? []).map(textOf).join(''));

export async function renderMarkdown(md: string): Promise<{ html: string; headings: Heading[] }> {
  const headings: Heading[] = [];
  const collect = () => (tree: HastNode) => {
    for (const node of tree.children ?? []) {
      if (node.type === 'element' && node.tagName === 'h2') {
        headings.push({ id: String(node.properties?.id ?? ''), text: textOf(node) });
      }
    }
  };
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(collect)
    .use(rehypeStringify)
    .process(md);
  return { html: String(file), headings };
}

/** Le categorie del blog, nell'ordine in cui compaiono. */
export function categories(articles: Article[]): string[] {
  return [...new Set(articles.map((a) => a.category))];
}

/** Ogni categoria ha il suo colore: nel blog si riconoscono a colpo d'occhio. */
export const CATEGORY_TONE: Record<string, 'peach' | 'sage' | 'mist' | 'ink'> = {
  Alimentazione: 'peach',
  Comportamento: 'sage',
  Osservazione: 'ink',
  Gatto: 'mist',
  Benessere: 'mist',
};
