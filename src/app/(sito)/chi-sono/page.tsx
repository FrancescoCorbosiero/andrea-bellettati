import Image from 'next/image';
import Link from 'next/link';
import portrait from '@/assets/ritratto.jpg';
import winter from '@/assets/chi-sono.jpg';
import river from '@/assets/consulenza.jpg';
import bowls from '@/assets/hero.jpg';
import logo from '@/assets/logo.jpg';
import { Heart } from 'lucide-react';
import { ArrowIcon, PawIcon } from '@/components/icons';
import CtaBand from '@/components/ui/CtaBand';
import Polaroid from '@/components/ui/Polaroid';
import SectionHead from '@/components/ui/SectionHead';
import { pageMetadata } from '@/lib/seo';
import { CONSULENZA_HREF, IG_HANDLE, IG_URL, STATS, formatNumber } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Chi sono',
  description:
    'Mi chiamo Andrea Bellettati, consulente in comportamento e nutrizione per cani e gatti. Vivo con una bassotta: la teoria la verifico ogni giorno, a casa. La mia storia e il mio percorso.',
  path: '/chi-sono',
  image: winter.src,
  imageAlt: 'Andrea Bellettati con la sua bassotta in braccio, d’inverno',
});

// Le polaroid del ventaglio (data-fan): partono impilate al centro e si
// aprono fin qui. Posizioni a left/top: il motore misura il layout.
// L'ultima sta in cima alla pila.
const POLAROIDS = [
  { src: river, alt: 'Andrea Bellettati seduto su una roccia con la sua bassotta, lungo un fiume di montagna', caption: 'pausa al fiume', pos: 'left-0 top-[9%] md:left-[2%] md:top-[5%]' },
  { src: bowls, alt: 'Quattro ciotole con carne, verdure e crocchette: una razione preparata con cura', caption: 'cosa c’è nella ciotola', pos: 'left-[23%] top-0 md:left-[35.5%]' },
  { src: winter, alt: 'Andrea Bellettati con la sua bassotta in braccio, d’inverno, con il cappuccio', caption: 'guancia a guancia', pos: 'left-[46%] top-[11%] md:left-[69%] md:top-[7%]' },
];

const STEPS = [
  {
    when: "L'inizio",
    title: 'Dalla convivenza allo studio',
    body: 'La curiosità per ciò che metto nella ciotola del mio cane diventa studio serio: etichette, ingredienti, letteratura scientifica. Capisco quanto poco se ne parli davvero.',
    slab: '',
  },
  {
    when: '2021',
    title: 'Entro in un team multidisciplinare',
    body: 'Mi unisco a un gruppo di professionisti nato per portare consapevolezza su un argomento troppo spesso sottovalutato: il Team che oggi chiamiamo TeamNutrizione. Formazione continua, confronto e metodo condiviso.',
    slab: 'slab-mist',
  },
  {
    when: 'Oggi',
    title: 'Consulenze e divulgazione',
    body: 'Consulenze 1:1 per famiglie, webinar e contenuti come “Etichette a 4 Zampe” e l’antistaminico naturale. Sempre con lo stesso obiettivo: scelte consapevoli.',
    slab: 'slab-blush',
  },
  {
    when: 'Con te',
    title: 'Il prossimo passo',
    body: 'Una consulenza gratuita di 45 minuti per analizzare alimentazione e comportamento del tuo animale, e un piano di lavoro firmato su misura.',
    slab: 'slab-peach',
    link: { href: CONSULENZA_HREF, label: 'Richiedi la tua consulenza gratuita' },
  },
];

export default function ChiSonoPage() {
  return (
    <>
      {/* HERO: un biglietto da visita */}
      <section
        className="on-dark relative overflow-hidden"
        aria-labelledby="cs-title"
        style={{ background: 'radial-gradient(50% 60% at 78% 40%, rgb(244 169 138 / 0.2), rgb(244 169 138 / 0) 72%), var(--color-olive)' }}
      >
        <div className="wrap grid items-center gap-14 pb-20 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div className="flex flex-col items-start gap-5">
            <span className="eyebrow intro">Chi sono</span>
            <h1 id="cs-title" className="text-[clamp(60px,12vw,112px)] leading-[0.88]">
              <span className="intro block" style={{ ['--d' as string]: '0.1s' }}>
                Andrea
              </span>
              <span className="intro block text-peach" style={{ ['--d' as string]: '0.2s' }}>
                Bellettati
              </span>
            </h1>
            <p className="intro text-[clamp(20px,2vw,24px)] font-[750] leading-snug tracking-[-0.02em]" style={{ ['--d' as string]: '0.35s' }}>
              Consulente in comportamento e nutrizione per cani e gatti
            </p>
            <p className="lead intro max-w-[32em]" style={{ ['--d' as string]: '0.5s' }}>
              Studio da anni la relazione tra alimentazione e comportamento: non si può parlare di benessere animale senza
              tenerli insieme. E lavoro al fianco del tuo veterinario, mai al suo posto.
            </p>
            <ul className="intro grid w-full max-w-[34em] grid-cols-3 gap-3 border-t border-white/20 pt-5" style={{ ['--d' as string]: '0.65s' }}>
              {[
                { n: STATS.teamSince, from: 2000, plain: true, l: 'nel Team di professionisti' },
                { n: STATS.posts, l: 'contenuti divulgativi' },
                { n: STATS.followers, l: 'persone mi seguono' },
              ].map((s) => (
                <li key={s.l} className="flex flex-col gap-1">
                  <b
                    className="font-[family-name:var(--font-poster)] text-[clamp(34px,4vw,52px)] font-normal leading-[0.9] tabular-nums text-peach"
                    data-count={s.n}
                    data-count-from={s.from}
                    data-count-plain={s.plain ? '' : undefined}
                  >
                    {s.plain ? s.n : formatNumber(s.n)}
                  </b>
                  <span className="text-[13.5px] font-[650] leading-tight text-cream-ink/75">{s.l}</span>
                </li>
              ))}
            </ul>
            <div className="intro flex flex-wrap gap-3" style={{ ['--d' as string]: '0.8s' }}>
              <Link className="btn btn-lg" href={CONSULENZA_HREF}>
                Richiedi la tua consulenza gratuita <ArrowIcon size={16} />
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/approccio">
                Il mio approccio
              </Link>
            </div>
          </div>

          <figure className="relative mx-auto w-[min(84vw,430px)]" data-speed="0.06">
            <div className="intro-photo relative aspect-[4/5] overflow-hidden rounded-[26px] border border-white/55 shadow-[0_0_0_7px_rgb(255_255_255/0.14),0_0_0_8px_rgb(255_255_255/0.28),0_44px_84px_-34px_rgb(244_169_138/0.5),0_12px_28px_-12px_rgb(0_0_0/0.45)]" style={{ ['--d' as string]: '0.2s' }}>
              <Image src={portrait} alt="Andrea Bellettati, consulente in comportamento e nutrizione per cani e gatti" fill priority sizes="(min-width: 1024px) 430px, 84vw" className="object-cover" />
            </div>
            <span className="intro absolute -right-3 top-6 flex flex-col gap-1 rounded-[18px] border border-white/90 bg-white/85 px-4 py-3 text-ink shadow-[var(--shadow-glass-m)] backdrop-blur-xl sm:-right-8" style={{ ['--d' as string]: '0.7s' }}>
              <small className="text-[11px] font-[700] uppercase tracking-[0.06em] text-ink-mute">Nel Team dal</small>
              <b className="font-[family-name:var(--font-poster)] text-[38px] font-normal leading-[0.85] text-peach-deep">{STATS.teamSince}</b>
              <span className="border-t border-ink/10 pt-1.5 text-[12px] font-[650] leading-tight">
                TeamNutrizione ·<br />
                metodo condiviso
              </span>
            </span>
            <figcaption className="intro absolute -bottom-7 left-4 font-[family-name:var(--font-script)] text-[clamp(34px,4vw,46px)] text-cream-ink [text-shadow:0_2px_14px_rgb(0_0_0/0.45)]" style={{ ['--d' as string]: '1s' }}>
              Andrea Bellettati
            </figcaption>
          </figure>
        </div>
      </section>

      {/* VIVO CON UNA BASSOTTA */}
      <section className="section overflow-hidden" aria-labelledby="home-title">
        <div className="wrap">
          <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <SectionHead id="home-title" eyebrow="Vivo con una bassotta" title="La teoria la verifico ogni giorno," script="a casa." />
            <div className="flex flex-col gap-4 text-[17px] leading-relaxed text-ink-soft">
              <p>
                Convivo con una bassotta: ogni cosa che studio passa prima dalla nostra quotidianità. Le passeggiate, i pasti,
                le piccole intolleranze, gli inverni in montagna. È lì che la nutrizione smette di essere una tabella e diventa
                cura concreta.
              </p>
              <p>
                Questo è anche il modo in cui lavoro con te: con la pazienza e l&apos;onestà di chi sa che dall&apos;altra parte
                c&apos;è un compagno di vita, non un “caso”.
              </p>
            </div>
          </div>
          <div className="relative mx-auto mt-14 aspect-[1/0.92] w-full max-w-[580px] md:aspect-auto md:h-[clamp(430px,37vw,500px)] md:max-w-none" data-fan>
            {POLAROIDS.map((p) => (
              <div key={p.caption} className={`absolute w-[54%] md:w-[29%] ${p.pos}`} data-fan-item>
                <Polaroid src={p.src} alt={p.alt} caption={p.caption} sizes="(min-width: 768px) 340px, 54vw" />
              </div>
            ))}
          </div>
          <blockquote className="slab slab-blush mx-auto mt-14 max-w-[34em] p-7 text-center font-[family-name:var(--font-script)] text-[clamp(26px,2.8vw,32px)] leading-[1.25] text-ink" data-reveal>
            «Alimentare correttamente il proprio amico a quattro zampe è, insieme alla sua educazione, la più grande forma di
            amore.»
          </blockquote>
        </div>
      </section>

      {/* IL PERCORSO */}
      <section
        className="on-dark section"
        aria-labelledby="path-title"
        style={{ background: 'radial-gradient(60% 70% at 50% 0%, rgb(244 169 138 / 0.16), rgb(244 169 138 / 0) 70%), var(--color-bark)' }}
      >
        <div className="wrap">
          <SectionHead id="path-title" eyebrow="Il percorso" title="Da una passione" script="a un metodo." />
          {/* Il sentiero (data-trail): le impronte lo percorrono al passo con
              lo scroll e accendono le tappe. Senza script: un filo dritto. */}
          <div className="trail mt-12" data-trail>
            <svg className="trail-svg" data-trail-svg aria-hidden>
              <path data-trail-path />
            </svg>
            <div className="trail-paws" data-trail-paws aria-hidden />
            <ol className="trail-steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="trail-step" data-trail-step>
                  <span className="trail-dot" data-trail-stop aria-hidden>
                    {i === STEPS.length - 1 ? <Heart size={20} fill="currentColor" aria-hidden /> : <PawIcon size={22} />}
                  </span>
                  <article className={`trail-card slab ${s.slab} flex flex-col items-start gap-2 p-6 text-ink`}>
                    <span className="font-[family-name:var(--font-poster)] text-[30px] uppercase leading-none text-peach-deep">{s.when}</span>
                    <h3 className="text-[25px]">{s.title}</h3>
                    <p className="text-[15.5px] leading-relaxed text-ink-soft">{s.body}</p>
                    {s.link && (
                      <Link className="text-link mt-1 !border-ink/40 !text-ink" href={s.link.href}>
                        {s.link.label} <ArrowIcon size={14} />
                      </Link>
                    )}
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Consulenza gratuita · 45 minuti"
        title={
          <>
            Raccontami il <span className="script !text-white [text-shadow:0_1px_0_rgb(208_103_63/0.55),0_4px_14px_rgb(140_60_30/0.3)]">tuo animale.</span>
          </>
        }
        lead="Il primo passo è gratuito e senza impegno. Nel frattempo, ci vediamo su Instagram."
      >
        <aside className="relative mx-auto w-[min(100%,400px)]" aria-label="Il profilo Instagram di Andrea">
          <span aria-hidden className="absolute -top-9 right-4 font-[family-name:var(--font-script)] text-[27px] text-ink">
            seguimi!
          </span>
          <div className="slab slab-frost flex flex-col gap-3.5 !rounded-[26px] p-[18px]" data-tilt>
            <div className="flex items-center gap-3">
              <span className="h-[52px] w-[52px] overflow-hidden rounded-full border-2 border-peach">
                <Image src={logo} alt="" width={104} height={104} className="h-full w-full object-cover" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <b className="truncate text-[15.5px] font-[750]">{IG_HANDLE.replace(/^@/, '')}</b>
                <small className="text-[13px] text-ink-mute">Andrea Bellettati</small>
              </span>
              <a className="btn btn-sm" href={IG_URL} target="_blank" rel="noopener">
                Segui
              </a>
            </div>
            <p className="text-[13.5px] text-ink-soft">Comportamento e nutrizione · cane e gatto</p>
            <a className="grid grid-cols-3 gap-1 overflow-hidden rounded-[14px]" href={IG_URL} target="_blank" rel="noopener" aria-label={`Apri il profilo Instagram ${IG_HANDLE}`}>
              {[winter, bowls, river].map((src, i) => (
                <span key={i} className="relative aspect-square">
                  <Image src={src} alt="" fill sizes="128px" className="object-cover" />
                </span>
              ))}
            </a>
            <p className="flex items-center gap-2 text-[13.5px] font-[600]">
              <button
                type="button"
                data-pet
                aria-label="Mi piace"
                className="-m-1.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-peach-deep transition-colors hover:bg-peach-soft/70"
              >
                <Heart size={20} fill="currentColor" aria-hidden />
              </button>
              Alimentazione, comportamento e vita quotidiana con cani e gatti.
            </p>
          </div>
        </aside>
      </CtaBand>
    </>
  );
}
