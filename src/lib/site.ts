/**
 * Configurazione centrale: contatti, link, numeri. Unica fonte di verità,
 * importabile sia dai server component sia dal codice client.
 */

/** Dominio di produzione (sitemap, canonical, Open Graph). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andreabellettati.it').replace(/\/$/, '');

export const SITE_NAME = 'Andrea Bellettati';
export const SITE_TAGLINE = 'Comportamento e nutrizione per cani e gatti';
export const SITE_DESCRIPTION =
  'Nutrizione e comportamento per cani e gatti: consulenza gratuita di 45 minuti al telefono e un piano di lavoro scritto e firmato, sempre al fianco del tuo veterinario.';

/** Contatti reali. */
export const WA_NUMBER = '393476780938';
export const WA_LINK = `https://wa.me/${WA_NUMBER}`;
export const EMAIL = 'andrebellettati@gmail.com';
/** Le due caselle dei questionari, sul dominio del sito: le richieste di
 *  consulenza e chi vuole entrare nel Team. Il server può cambiarle con
 *  SES_TO_CONSULENZE e SES_TO_PARTNER (vedi .env.example). */
const SITE_HOST = new URL(SITE_URL).hostname.replace(/^www\./, '');
export const EMAIL_CONSULENZE = `consulenze@${SITE_HOST}`;
export const EMAIL_PARTNER = `partners@${SITE_HOST}`;
export const PHONE = '+393476780938';
export const PHONE_DISPLAY = '+39 347 678 0938';
export const IG_HANDLE = '@comunicazionecinofila';
export const IG_URL = 'https://www.instagram.com/comunicazionecinofila';

/** Il Team di cui Andrea fa parte. */
export const TEAM_NAME = 'TeamNutrizione';

/**
 * Numeri di fiducia (home e Chi sono). Contenuti e follower vengono dal
 * profilo Instagram: da ritoccare ogni tanto, un numero vecchio non fa danni,
 * uno gonfiato sì.
 */
export const STATS = {
  teamSince: 2021,
  posts: 385,
  followers: 4760,
} as const;

/** Numero all'italiana, con il punto delle migliaia anche a 4 cifre (4.760). */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('it-IT', { useGrouping: 'always' }).format(n);
}

/** Link WhatsApp con il testo già scritto. */
export function waLink(text: string): string {
  return `${WA_LINK}?text=${encodeURIComponent(text)}`;
}

/** Link mailto con oggetto e testo già scritti (di base all'indirizzo generale). */
export function mailtoLink(subject: string, body: string, to: string = EMAIL): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Indirizzo assoluto di un percorso del sito. */
export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE_URL}/`).href;
}

/** Voci principali di navigazione (header desktop, menu, footer). */
export const NAV = [
  { href: '/approccio', label: 'Approccio' },
  { href: '/chi-sono', label: 'Chi sono' },
  { href: '/servizi', label: 'Servizi' },
  { href: '/articoli', label: 'Blog' },
  { href: '/eventi', label: 'Eventi' },
] as const;

/** Dove portano i due flussi del sito. */
export const CONSULENZA_HREF = '/consulenza-gratuita#questionario';
export const TEAM_HREF = '/lavora-con-noi#unisciti';
