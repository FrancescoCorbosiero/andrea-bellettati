import { getEvent, getEvents } from '@/lib/content';
import { SITE_URL, absoluteUrl } from '@/lib/site';

/* "Aggiungi al calendario": un file .ics per ogni evento con una data, generato al build. */
export const dynamic = 'force-static';

export function generateStaticParams() {
  return getEvents()
    .filter((e) => e.onSite && e.date)
    .map((e) => ({ slug: e.slug }));
}

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

/** Durata dall'etichetta (es. "~60 min", "1 ora e mezza"): se non si capisce, un'ora. */
function minutesOf(label?: string): number {
  const m = label?.match(/(\d+)\s*min/i);
  if (m) return Number(m[1]);
  const h = label?.match(/(\d+)\s*or/i);
  return h ? Number(h[1]) * 60 : 60;
}

export async function GET(_req: Request, ctx: RouteContext<'/eventi/[slug]/calendario.ics'>) {
  const { slug } = await ctx.params;
  const e = getEvent(slug);
  if (!e?.date) return new Response('Evento senza data', { status: 404 });
  const end = new Date(e.date.getTime() + minutesOf(e.duration) * 60_000);
  const url = absoluteUrl(`/eventi/${e.slug}`);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Andrea Bellettati//Eventi//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${e.slug}@${new URL(SITE_URL).host}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(e.date)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc(`${e.excerpt}\n\n${url}`)}`,
    `LOCATION:${esc(e.locationLabel ?? 'Online')}`,
    `URL:${url}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(e.title)} tra 30 minuti`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return new Response(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${e.slug}.ics"`,
    },
  });
}
