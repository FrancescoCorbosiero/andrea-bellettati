import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/logo.jpg';
import { WhatsAppIcon } from '@/components/icons';
import { CONSULENZA_HREF, EMAIL, IG_HANDLE, IG_URL, PHONE, PHONE_DISPLAY, TEAM_HREF, WA_LINK } from '@/lib/site';

const COLS = [
  {
    title: 'Sito',
    links: [
      { href: '/', label: 'Home' },
      { href: '/approccio', label: 'Il mio approccio' },
      { href: '/chi-sono', label: 'Chi sono' },
      { href: '/servizi', label: 'Servizi' },
      { href: '/eventi', label: 'Eventi' },
      { href: '/articoli', label: 'Blog' },
      { href: '/rss.xml', label: 'Feed RSS' },
    ],
  },
  {
    title: 'Inizia',
    links: [
      { href: CONSULENZA_HREF, label: 'La consulenza gratuita' },
      { href: TEAM_HREF, label: 'Lavora con noi' },
      { href: WA_LINK, label: 'WhatsApp', external: true },
    ],
  },
  {
    title: 'Contatti',
    links: [
      { href: `mailto:${EMAIL}`, label: EMAIL },
      { href: `tel:${PHONE}`, label: PHONE_DISPLAY },
      { href: IG_URL, label: IG_HANDLE, external: true },
    ],
  },
] as const;

/** Footer verde notte: il marchio, le tre colonne, il nome gigante. */
export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-deep pb-[calc(env(safe-area-inset-bottom)+104px)] pt-16 text-cream-ink lg:pb-8">
      <div className="wrap grid gap-12 lg:grid-cols-[1.1fr_1.9fr]">
        <div className="flex flex-col items-start gap-5">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="h-[52px] w-[52px] overflow-hidden rounded-full border border-white/70 shadow-[var(--shadow-night-s)]">
              <Image src={logo} alt="" width={104} height={104} className="h-full w-full object-cover" />
            </span>
            <span className="font-[family-name:var(--font-poster)] text-[22px] uppercase tracking-[0.02em]">Andrea Bellettati</span>
          </Link>
          <p className="max-w-[26em] text-[15.5px] text-cream-ink/75">
            Consulenza in comportamento e alimentazione naturale per cani e gatti, sempre al fianco del tuo veterinario.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link className="btn btn-cream btn-sm" href={CONSULENZA_HREF}>
              Consulenza gratuita
            </Link>
            <Link className="btn btn-sm" href={TEAM_HREF}>
              Lavora con noi
            </Link>
            <a className="btn btn-ghost btn-sm" href={WA_LINK} target="_blank" rel="noopener">
              <WhatsAppIcon size={15} /> WhatsApp
            </a>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {COLS.map((col) => (
            <div key={col.title} className="flex flex-col gap-2.5">
              <h2 className="mb-1 font-[family-name:var(--font-script)] text-[24px] normal-case tracking-normal text-peach">
                {col.title}
              </h2>
              {col.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  {...('external' in l && l.external ? { target: '_blank', rel: 'noopener' } : {})}
                  className="w-fit text-[15px] text-cream-ink/80 transition-colors hover:text-peach"
                >
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p
        aria-hidden
        className="mt-16 select-none text-center font-[family-name:var(--font-poster)] text-[clamp(44px,11vw,176px)] uppercase leading-[0.82] tracking-[0.01em]"
      >
        <span className="block text-peach">Comunicazione</span>
        <span className="block text-cream-ink">Cinofila</span>
      </p>

      <div className="wrap mt-8 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-5 text-[13px] text-cream-ink/60">
        <span>© {year} Andrea Bellettati · Comunicazione Cinofila</span>
        <span>Comportamento e nutrizione · cane e gatto</span>
      </div>
    </footer>
  );
}
