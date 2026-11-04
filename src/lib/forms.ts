import { z } from 'zod';

/* =====================================================================
   I due questionari del sito: campi, opzioni, controlli e testi.
   Condiviso tra il browser (i flussi Konsta) e il server (/api/richiesta):
   le stesse regole valgono da entrambe le parti.
   ===================================================================== */

/* ── Opzioni ──────────────────────────────────────────────────────── */

export const SPECIES = [
  { value: 'cane', label: 'Cane' },
  { value: 'gatto', label: 'Gatto' },
] as const;
export type Species = (typeof SPECIES)[number]['value'];

export const AGES = [
  { value: 'cucciolo', label: 'Cucciolo', hint: 'meno di un anno' },
  { value: 'adulto', label: 'Adulto', hint: 'da 1 a 7 anni' },
  { value: 'anziano', label: 'Anziano', hint: 'da 8 anni in su' },
] as const;
export type Age = (typeof AGES)[number]['value'];

export const SIZES = [
  { value: 'piccola', label: 'Piccola', hint: 'fino a 10 kg' },
  { value: 'media', label: 'Media', hint: '10–25 kg' },
  { value: 'grande', label: 'Grande', hint: 'oltre 25 kg' },
] as const;
export type Size = (typeof SIZES)[number]['value'];

/** Cosa mangia oggi (si può scegliere più di una voce). */
export const DIETS = ['Crocchette', 'Umido', 'Casalinga', 'Crudo (BARF)', 'Un po’ di tutto'] as const;

/** Cosa preoccupa la famiglia (più di una voce). */
export const CONCERNS = [
  'Pelle e pelo',
  'Prurito',
  'Intestino e feci',
  'Appetito',
  'Peso',
  'Comportamento',
  'Energia',
  'Voglio solo farlo mangiare meglio',
] as const;

export const CALL_TIMES = [
  { value: 'mattina', label: 'Mattina' },
  { value: 'pomeriggio', label: 'Pomeriggio' },
  { value: 'sera', label: 'Sera' },
] as const;
export type CallTime = (typeof CALL_TIMES)[number]['value'];

/** "Lavora con noi": gli ambiti e il tempo da dedicare. */
export const AMBITI = [
  'Educazione cinofila',
  'Toelettatura',
  'Allevamento',
  'Pet sitting',
  'Naturopatia',
  'Veterinaria',
  'Altro',
] as const;

export const TEMPI = ['Qualche ora a settimana', 'Part-time', 'Attività principale', 'Non lo so ancora'] as const;

/* ── Bozze (lo stato dei flussi) ──────────────────────────────────── */

export type ConsultDraft = {
  species: Species | '';
  petName: string;
  age: Age | '';
  size: Size | '';
  diet: string[];
  concerns: string[];
  story: string;
  name: string;
  phone: string;
  email: string;
  callTime: CallTime | '';
  whatsappOk: boolean;
};

export const EMPTY_CONSULT: ConsultDraft = {
  species: '',
  petName: '',
  age: '',
  size: '',
  diet: [],
  concerns: [],
  story: '',
  name: '',
  phone: '',
  email: '',
  callTime: '',
  whatsappOk: true,
};

export type TeamDraft = {
  name: string;
  email: string;
  phone: string;
  occupation: string;
  inSector: 'Sì' | 'No' | '';
  ambito: string;
  why: string;
  time: string;
  social: string;
};

export const EMPTY_TEAM: TeamDraft = {
  name: '',
  email: '',
  phone: '',
  occupation: '',
  inSector: '',
  ambito: '',
  why: '',
  time: '',
  social: '',
};

/* ── Controlli ────────────────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Un numero di telefono plausibile: almeno 8 cifre, al massimo 15. */
export function isPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

const text = (max: number) => z.string().trim().max(max);

/** Payload della richiesta di consulenza (lato server). */
export const consultSchema = z.object({
  kind: z.literal('consulenza'),
  species: z.enum(['cane', 'gatto']),
  petName: text(60).min(1),
  age: z.enum(['cucciolo', 'adulto', 'anziano', '']).default(''),
  size: z.enum(['piccola', 'media', 'grande', '']).default(''),
  diet: z.array(text(40)).max(DIETS.length).default([]),
  concerns: z.array(text(60)).max(CONCERNS.length).default([]),
  story: text(2000).default(''),
  name: text(80).min(2),
  phone: text(30).refine(isPhone),
  email: text(120)
    .default('')
    .refine((v) => v === '' || isEmail(v)),
  callTime: z.enum(['mattina', 'pomeriggio', 'sera', '']).default(''),
  whatsappOk: z.boolean().default(true),
});

/** Payload della richiesta per entrare nel Team (lato server). */
export const teamSchema = z.object({
  kind: z.literal('team'),
  name: text(80).min(2),
  email: text(120).refine(isEmail),
  phone: text(30).refine(isPhone),
  occupation: text(160).min(2),
  inSector: z.enum(['Sì', 'No']),
  ambito: text(60).min(1),
  why: text(3000).min(5),
  time: text(60).min(1),
  social: text(200).default(''),
});

export const requestSchema = z.discriminatedUnion('kind', [consultSchema, teamSchema]);
export type ConsultPayload = z.infer<typeof consultSchema>;
export type TeamPayload = z.infer<typeof teamSchema>;
export type RequestPayload = z.infer<typeof requestSchema>;

/* ── Testi: WhatsApp ed email ─────────────────────────────────────── */

const labelOf = <T extends { value: string; label: string }>(list: readonly T[], value: string) =>
  list.find((o) => o.value === value)?.label ?? '';

/** "Birba, cane adulto di taglia media" — la scheda in una riga. */
export function petSummary(d: Pick<ConsultDraft, 'species' | 'petName' | 'age' | 'size'>): string {
  const who = d.species ? labelOf(SPECIES, d.species).toLowerCase() : 'animale';
  const age = d.age ? ` ${d.age}` : '';
  const size = d.species === 'cane' && d.size ? ` di taglia ${d.size}` : '';
  const name = d.petName.trim();
  return `${name ? `${name}, ` : ''}${who}${age}${size}`;
}

/** Le righe del riepilogo, uguali in WhatsApp, nell'email e nella scheda. */
export function consultLines(d: ConsultDraft): [string, string][] {
  const rows: [string, string][] = [
    ['Animale', petSummary(d)],
    ['Mangia', d.diet.join(', ')],
    ['Mi preoccupa', d.concerns.join(', ')],
    ['In due righe', d.story.trim()],
    ['Nome', d.name.trim()],
    ['Telefono', d.phone.trim()],
    ['Email', d.email.trim()],
    ['Quando chiamarmi', labelOf(CALL_TIMES, d.callTime)],
    ['WhatsApp', d.whatsappOk ? 'Va bene anche un messaggio' : 'Preferisco una chiamata'],
  ];
  return rows.filter(([, v]) => v !== '');
}

export function consultWhatsAppText(d: ConsultDraft): string {
  const lines = consultLines(d)
    .filter(([k]) => k !== 'WhatsApp')
    .map(([k, v]) => `${k}: ${v}`);
  return ['Ciao Andrea, vorrei prenotare la consulenza gratuita.', '', ...lines].join('\n');
}

export function consultSubject(d: Pick<ConsultDraft, 'name' | 'petName'>): string {
  const pet = d.petName.trim();
  return `Consulenza gratuita — ${d.name.trim() || 'nuovo contatto'}${pet ? ` (${pet})` : ''}`;
}

export function teamLines(d: TeamDraft): [string, string][] {
  const rows: [string, string][] = [
    ['Nome', d.name.trim()],
    ['Email', d.email.trim()],
    ['Telefono', d.phone.trim()],
    ['Di cosa si occupa', d.occupation.trim()],
    ['Già nel settore animale', d.inSector],
    ['Ambito', d.ambito],
    ['Tempo da dedicare', d.time],
    ['Instagram / sito', d.social.trim()],
    ['Perché le interessa', d.why.trim()],
  ];
  return rows.filter(([, v]) => v !== '');
}

export function teamWhatsAppText(d: TeamDraft): string {
  return [
    'Ciao Andrea, mi piacerebbe entrare in TeamNutrizione. Ecco chi sono.',
    '',
    ...teamLines(d).map(([k, v]) => `${k}: ${v}`),
  ].join('\n');
}

export function teamSubject(d: Pick<TeamDraft, 'name'>): string {
  return `Entrare in TeamNutrizione — ${d.name.trim() || 'nuovo contatto'}`;
}

/** Numero italiano → link wa.me per rispondere (es. "347 678 0938" → 393476780938). */
export function waLinkFor(phone: string): string | null {
  let n = phone.replace(/[^\d+]/g, '');
  if (n.startsWith('+')) n = n.slice(1);
  else if (n.startsWith('00')) n = n.slice(2);
  else if (n.length === 10 && n.startsWith('3')) n = `39${n}`;
  return n.length >= 8 ? `https://wa.me/${n}` : null;
}
