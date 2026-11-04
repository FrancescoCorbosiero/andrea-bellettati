/* Tipi e costanti dei contenuti senza dipendenze dal disco: si possono
   usare anche nei componenti client (es. il filtro del blog). */

export type Heading = { id: string; text: string };

export type Article = {
  slug: string;
  title: string;
  date: Date;
  excerpt: string;
  category: string;
  cover?: string;
  coverAlt?: string;
  placeholderLabel?: string;
  featured: boolean;
  status: 'published' | 'coming-soon';
  externalUrl?: string;
  body: string;
  minutes: number;
  words: number;
  /** Ha una pagina sul sito (pubblicato e senza link esterno). */
  onSite: boolean;
};

export type EventEntry = {
  slug: string;
  title: string;
  excerpt: string;
  subtitle?: string;
  date?: Date;
  whenLabel?: string;
  category?: string;
  cover?: string;
  coverAlt?: string;
  placeholderLabel?: string;
  featured: boolean;
  status: 'upcoming' | 'on-request' | 'coming-soon' | 'past';
  statusLabel?: string;
  free: boolean;
  duration?: string;
  locationLabel?: string;
  collab?: string;
  tags: string[];
  reserveWaText?: string;
  externalUrl?: string;
  internalUrl?: string;
  body: string;
  onSite: boolean;
};

/** Ogni categoria ha il suo colore: nel blog si riconoscono a colpo d'occhio. */
export const CATEGORY_TONE: Record<string, 'peach' | 'sage' | 'mist' | 'ink'> = {
  Alimentazione: 'peach',
  Comportamento: 'sage',
  Osservazione: 'ink',
  Gatto: 'mist',
  Benessere: 'mist',
};
