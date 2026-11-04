import Link from 'next/link';
import { BookOpen, CalendarDays, Compass, Image as ImageIcon, MessageCircle, Sparkles, UserRound } from 'lucide-react';
import { ArrowIcon, PawIcon } from '@/components/icons';
import SectionHead from '@/components/ui/SectionHead';
import { CONSULENZA_HREF, TEAM_HREF, WA_LINK } from '@/lib/site';

type Door = {
  href: string;
  eyebrow: string;
  title: string;
  text: string;
  ticks: string[];
  go: string;
  tone: 'care' | 'work';
};

const DOORS: Door[] = [
  {
    href: CONSULENZA_HREF,
    eyebrow: 'Per il tuo cane o gatto',
    title: 'Consulenza gratuita di 45 minuti',
    text: 'Compili il questionario, ti richiamo e analizziamo insieme alimentazione e comportamento del tuo animale.',
    ticks: ['Un piano di lavoro scritto e firmato', 'Su misura, non un menu uguale per tutti', 'In accordo con il tuo veterinario'],
    go: 'Compila il questionario',
    tone: 'care',
  },
  {
    href: TEAM_HREF,
    eyebrow: 'Per chi vuole farne un lavoro',
    title: 'Colloquio conoscitivo',
    text: 'Ami gli animali e ti interessa la nutrizione pet? Ti racconto come funziona il Team e se fa per te.',
    ticks: ['Formazione e affiancamento', 'Cosa si fa e come si guadagna, detto chiaro'],
    go: 'Richiedi il colloquio',
    tone: 'work',
  },
];

/** Le due porte del sito: il bivio di conversione, subito dopo la promessa. */
export default function Doors({ articleCount }: { articleCount: number }) {
  const paths = [
    { href: '/approccio', icon: Compass, title: 'Il mio approccio', text: 'Non parto dal prodotto, parto dall’animale.' },
    { href: '/chi-sono', icon: UserRound, title: 'Chi sono', text: 'La mia storia, dal primo cane a un metodo condiviso.' },
    { href: '#storie', icon: ImageIcon, title: 'Le vostre storie', text: 'Prima e dopo, con tempi e punto di partenza.' },
    { href: '/articoli', icon: BookOpen, title: 'Blog', text: `${articleCount} articoli su alimentazione e comportamento.` },
    { href: '/eventi', icon: CalendarDays, title: 'Eventi e webinar', text: 'Gli incontri dal vivo e online.' },
    { href: '/servizi', icon: Sparkles, title: 'I servizi', text: 'Consulenze, percorsi e monitoraggio.' },
    { href: WA_LINK, icon: MessageCircle, title: 'Scrivimi su WhatsApp', text: 'Una domanda veloce, senza questionario.', external: true },
  ];

  return (
    <section
      className="section"
      aria-labelledby="doors-title"
      style={{
        background:
          'radial-gradient(34% 46% at 22% 62%, rgb(111 139 96 / 0.22), rgb(111 139 96 / 0) 72%), radial-gradient(34% 46% at 80% 52%, rgb(244 169 138 / 0.3), rgb(244 169 138 / 0) 72%), var(--color-cream)',
      }}
    >
      <div className="wrap">
        <SectionHead id="doors-title" eyebrow="Da dove vuoi iniziare?" title="Dimmi perché" script="sei qui." />
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
          {DOORS.map((d, i) => (
            <Link
              key={d.href}
              href={d.href}
              data-reveal
              style={{ ['--d' as string]: `${i * 0.08}s` }}
              className={`slab slab-lift group relative isolate flex flex-col items-start gap-5 overflow-hidden p-8 sm:p-11 lg:min-h-[450px] ${
                d.tone === 'care' ? 'slab-deep on-dark' : 'slab-peach'
              }`}
            >
              <span className={`eyebrow no-paw ${d.tone === 'care' ? '' : 'eyebrow-light'}`}>{d.eyebrow}</span>
              <h3 className="max-w-[11em] text-[clamp(32px,3.5vw,50px)] leading-[0.98]">{d.title}</h3>
              <p className="max-w-[34em] text-[17.5px] leading-relaxed opacity-90">{d.text}</p>
              <ul className="ticks text-[16.5px]">
                {d.ticks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <span className="mt-auto inline-flex items-center gap-3.5 pt-3 text-[18px] font-[750]">
                {d.go}
                <b
                  className={`grid h-[54px] w-[54px] place-items-center rounded-full border transition-[transform,background-color,color] duration-500 ease-[var(--ease-spring)] group-hover:translate-x-1 ${
                    d.tone === 'care'
                      ? 'border-white/40 bg-white/10 group-hover:bg-peach group-hover:text-ink'
                      : 'border-white/80 bg-white/40 group-hover:bg-ink group-hover:text-peach'
                  }`}
                  style={{ boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.5)' }}
                >
                  <ArrowIcon size={22} />
                </b>
              </span>
              <PawIcon
                size={230}
                className="pointer-events-none absolute -bottom-10 -right-11 -z-10 opacity-10 transition-[scale] duration-[1.2s] ease-[var(--ease-soft)] group-hover:scale-110"
              />
            </Link>
          ))}
        </div>

        <nav aria-labelledby="paths-title" className="mt-14 grid items-start gap-6 lg:grid-cols-[0.7fr_2fr] lg:gap-10" data-reveal>
          <div className="flex flex-col gap-2.5 lg:sticky lg:top-28">
            <h3 id="paths-title" className="text-[clamp(26px,2.6vw,34px)]">
              Oppure esplora
            </h3>
            <p className="max-w-[24em] text-[16px] text-ink-mute">Tutto quello che trovi sul sito, a un tocco da qui.</p>
          </div>
          <ul className="slab grid overflow-hidden !rounded-[24px] p-1.5 sm:grid-cols-2">
            {paths.map((p) => (
              <li key={p.href}>
                <a
                  href={p.href}
                  {...(p.external ? { target: '_blank', rel: 'noopener' } : {})}
                  className="group grid grid-cols-[44px_1fr_auto] items-center gap-3.5 rounded-[18px] px-3.5 py-3.5 transition-colors hover:bg-sage-mist/60"
                >
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full border border-white/80 shadow-[var(--shadow-glass-s)] ${
                      p.external ? 'bg-peach-soft text-peach-deep' : 'bg-sage-mist text-olive'
                    }`}
                  >
                    <p.icon size={19} strokeWidth={1.9} aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <b className="text-[16.5px] font-[750] tracking-[-0.01em]">{p.title}</b>
                    <span className="text-[13.5px] text-ink-mute">{p.text}</span>
                  </span>
                  <ArrowIcon size={17} className="arrow text-ink transition-transform group-hover:translate-x-1" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
