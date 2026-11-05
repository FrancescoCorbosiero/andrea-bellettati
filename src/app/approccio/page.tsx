import Image from 'next/image';
import Link from 'next/link';
import riverPhoto from '@/assets/consulenza.jpg';
import { ArrowIcon, HandUnderline } from '@/components/icons';
import SectionHead from '@/components/ui/SectionHead';
import { pageMetadata } from '@/lib/seo';
import { CONSULENZA_HREF, TEAM_HREF } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Il mio approccio',
  description:
    "Non parto dal prodotto, parto dall'animale: osservazione del soggetto, letteratura scientifica e contesto reale della famiglia. Il metodo dietro ogni consulenza.",
  path: '/approccio',
  image: riverPhoto.src,
  imageAlt: 'Andrea Bellettati seduto su una roccia con la sua bassotta, lungo un fiume di montagna',
});

const PRINCIPLES = [
  {
    n: '01',
    title: 'Cibo e comportamento sono la stessa storia',
    body: 'Un cane irrequieto, un gatto che si gratta, una digestione difficile: spesso la risposta è nella ciotola tanto quanto nelle abitudini. Li guardo insieme, mai separati.',
    slab: '',
    num: 'text-peach-deep',
  },
  {
    n: '02',
    title: 'La scienza prima delle mode',
    body: 'Niente slogan, niente “grain free” perché fa tendenza. Parto dalla letteratura, leggo le etichette riga per riga e spiego il perché di ogni scelta.',
    slab: 'slab-peach',
    num: 'text-ink',
  },
  {
    n: '03',
    title: 'Il piano deve entrare nella vita vera',
    body: "La dieta perfetta sulla carta non serve a niente se la famiglia non riesce a seguirla. Costruisco qualcosa di sostenibile, per l'animale e per chi se ne prende cura.",
    slab: 'slab-ink',
    num: 'text-peach',
  },
];

const SOURCES = [
  { title: 'La scienza', sub: 'ciò che dice la letteratura', from: '-62 -34', pos: 'left-[3%] top-[5%]', bg: 'rgb(124 148 116 / 0.62)', align: 'items-start text-left pl-[16%] pt-[22%]' },
  { title: "L'animale", sub: 'ciò che osservo in lui', from: '62 -34', pos: 'right-[3%] top-[5%]', bg: 'rgb(244 169 138 / 0.72)', align: 'items-end text-right pr-[16%] pt-[22%]' },
  { title: 'La famiglia', sub: 'la vita di tutti i giorni', from: '0 64', pos: 'bottom-[2%] left-1/2 -translate-x-1/2', bg: 'rgb(201 169 106 / 0.66)', align: 'items-center text-center justify-end pb-[16%]' },
];

export default function ApproccioPage() {
  return (
    <>
      {/* HERO */}
      <section
        className="on-dark relative overflow-hidden"
        aria-labelledby="a-title"
        style={{
          background:
            'radial-gradient(50% 64% at 80% 36%, rgb(111 139 96 / 0.34), rgb(111 139 96 / 0) 72%), radial-gradient(40% 50% at 0% 100%, rgb(111 139 96 / 0.18), rgb(111 139 96 / 0) 70%), var(--color-deep)',
        }}
      >
        <div className="wrap grid items-center gap-12 pb-20 pt-10 lg:min-h-[calc(100svh-72px)] lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="flex flex-col items-start gap-6">
            <span className="eyebrow intro">Il mio approccio</span>
            <h1 id="a-title" className="text-[clamp(54px,12vw,100px)] leading-[0.9] lg:text-[clamp(62px,6vw,96px)]">
              <span className="intro block" style={{ ['--d' as string]: '0.1s' }}>
                Non parto
              </span>
              <span className="intro block text-cream-ink/40" style={{ ['--d' as string]: '0.2s' }}>
                dal prodotto.
              </span>
              <span className="intro block" style={{ ['--d' as string]: '0.3s' }}>
                Parto
              </span>
              <span className="intro relative block w-fit text-peach" style={{ ['--d' as string]: '0.4s' }}>
                dall&apos;animale.
                <HandUnderline className="draw absolute -bottom-[0.18em] left-[-1%] h-[0.28em] w-[102%] overflow-visible text-peach-soft" />
              </span>
            </h1>
            <p className="lead intro max-w-[31em]" style={{ ['--d' as string]: '0.6s' }}>
              Alimentazione, comportamento e stile di vita fanno parte dello stesso equilibrio. Il mio lavoro è osservare il
              soggetto nella sua globalità e costruire un percorso sostenibile per lui e per la sua famiglia.
            </p>
            <Link className="btn btn-lg intro" style={{ ['--d' as string]: '0.75s' }} href={CONSULENZA_HREF}>
              Richiedi la tua consulenza gratuita <ArrowIcon size={16} />
            </Link>
          </div>
          <figure className="relative mx-auto w-full max-w-[470px]" data-speed="0.08">
            <div
              className="intro-photo relative aspect-square rounded-[28px] border border-white/55"
              style={{
                ['--d' as string]: '0.25s',
                backgroundColor: 'rgb(255 246 240 / 0.13)',
                backgroundImage:
                  'radial-gradient(120% 85% at 0% 0%, rgb(255 255 255 / 0.34), rgb(255 255 255 / 0) 52%), linear-gradient(315deg, rgb(244 169 138 / 0.28), rgb(244 169 138 / 0) 45%)',
                WebkitBackdropFilter: 'blur(22px) saturate(1.5)',
                backdropFilter: 'blur(22px) saturate(1.5)',
                boxShadow:
                  'inset 0 1px 0 rgb(255 255 255 / 0.6), inset 0 0 0 1px rgb(255 255 255 / 0.14), inset 0 -18px 40px -26px rgb(244 169 138 / 0.6), 0 50px 90px -40px rgb(0 0 0 / 0.7), 0 12px 28px -12px rgb(0 0 0 / 0.4)',
              }}
            >
              <div className="absolute inset-[6%] overflow-hidden rounded-[18px] border border-white/55 shadow-[0_0_0_1px_rgb(0_0_0/0.12),0_22px_44px_-20px_rgb(0_0_0/0.6)]">
                <Image src={riverPhoto} alt="Andrea Bellettati seduto su una roccia con la sua bassotta, lungo un fiume di montagna" fill priority sizes="(min-width: 1024px) 420px, 80vw" className="object-cover" />
              </div>
            </div>
            <figcaption className="intro mt-5 text-center font-[family-name:var(--font-script)] text-[24px] text-cream-ink/85" style={{ ['--d' as string]: '0.9s' }}>
              lei, per esempio: la mia bassotta, al fiume
            </figcaption>
          </figure>
        </div>
      </section>

      {/* IL METODO: tre principi */}
      <section
        className="on-dark section"
        aria-labelledby="rules-title"
        style={{ background: 'radial-gradient(60% 70% at 85% 0%, rgb(255 255 255 / 0.14), rgb(255 255 255 / 0) 70%), var(--color-sage)' }}
      >
        <div className="wrap">
          <SectionHead id="rules-title" eyebrow="Il metodo" title="Tre principi che" script="non negozio." />
          <div className="mt-12 grid gap-6 md:grid-cols-3 md:items-start" data-reveal="stagger">
            {PRINCIPLES.map((p, i) => (
              <div key={p.n} className="md:mt-[calc(var(--i)*36px)]" style={{ ['--i' as string]: i === 1 ? 1 : i === 2 ? 0.4 : 0 }}>
                <article className={`slab ${p.slab} relative flex flex-col gap-3 p-7 pt-9 ${i < 2 ? 'text-ink' : ''}`}>
                  <span
                    data-stamp={String(i * 0.28)}
                    className={`absolute -top-3.5 right-5 rounded-full border px-3 py-1 font-[family-name:var(--font-poster)] text-[14px] uppercase tracking-[0.04em] shadow-[var(--shadow-glass-s)] ${
                      i === 2 ? 'border-white/30 bg-ink text-peach' : 'border-white/90 bg-white text-peach-deep'
                    }`}
                  >
                    Non negoziabile
                  </span>
                  <span className={`font-[family-name:var(--font-poster)] text-[64px] leading-[0.85] ${p.num}`}>{p.n}</span>
                  <h3 className="text-[25px]">{p.title}</h3>
                  <p className="text-[15.5px] leading-relaxed opacity-90">{p.body}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRE FONTI, UNA DIREZIONE */}
      <section className="section overflow-clip lg:flex lg:min-h-svh lg:items-center" aria-labelledby="sources-title" data-venn>
        <div data-pin-stage className="w-full">
          <div className="wrap grid items-center gap-14 lg:grid-cols-2">
            <div className="flex flex-col items-start gap-5">
              <SectionHead id="sources-title" eyebrow="Come lavoro" title="Tre fonti," script="una direzione." />
              <p className="text-[17.5px] leading-relaxed text-ink-soft">
                Lavoro sull&apos;equilibrio interno dell&apos;animale mettendo insieme tre cose: ciò che la letteratura scientifica
                dice, ciò che osservo nel singolo soggetto, e il contesto reale della famiglia. Una dieta perfetta sulla carta non
                serve a nulla se non entra nella vita di tutti i giorni.
              </p>
              <p className="text-[17.5px] leading-relaxed text-ink-soft">
                E il percorso non si chiude con la consulenza: seguo personalmente ogni caso nel tempo, e dietro ogni scelta c&apos;è
                il confronto con TeamNutrizione, il Team di professionisti con cui condivido un metodo di lavoro comune.
              </p>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-[min(520px,78svh)]" data-venn-stage aria-label="La scienza, l'animale e la famiglia si incontrano in una direzione" role="img">
              {/* Due strati con la stessa geometria: prima i cerchi, poi le
                  etichette. Mentre convergono (data-venn) ogni cerchio è un
                  livello a sé: così nessun cerchio copre le etichette. */}
              {SOURCES.map((s) => (
                <div
                  key={s.title}
                  data-venn-circle
                  data-from={s.from}
                  className={`absolute h-[60%] w-[60%] rounded-full border border-white/70 ${s.pos}`}
                  style={{ background: s.bg, boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.7), inset 0 0 40px rgb(255 255 255 / 0.2)' }}
                />
              ))}
              {SOURCES.map((s) => (
                <div key={s.title} data-venn-circle data-from={s.from} className={`pointer-events-none absolute flex h-[60%] w-[60%] flex-col ${s.pos} ${s.align}`}>
                  <b className="text-[clamp(22px,2.6vw,30px)] font-[800] leading-none tracking-[-0.03em] text-ink">{s.title}</b>
                  <span className="mt-1 max-w-[9em] text-[13.5px] font-[600] leading-tight text-ink-soft">{s.sub}</span>
                </div>
              ))}
              <div data-venn-core className="absolute left-1/2 top-[52%] z-20 grid h-[27%] w-[27%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-ink text-center shadow-[inset_0_1px_0_rgb(255_255_255/0.24),0_14px_30px_-12px_rgb(208_103_63/0.7)]">
                <span className="font-[family-name:var(--font-script)] text-[clamp(20px,2.4vw,28px)] leading-[0.95] text-peach">
                  una
                  <br />
                  direzione
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IL CUORE DEL MIO LAVORO */}
      <section
        className="relative isolate overflow-hidden border-y border-ink/10 py-[clamp(80px,11vw,140px)]"
        aria-labelledby="proverb-title"
        style={{
          background:
            'radial-gradient(55% 80% at 0% 0%, rgb(255 255 255 / 0.4), rgb(255 255 255 / 0) 65%), radial-gradient(50% 70% at 100% 100%, rgb(208 103 63 / 0.28), rgb(208 103 63 / 0) 70%), var(--color-peach)',
        }}
      >
        <div className="wrap flex flex-col items-start gap-7">
          <span className="eyebrow">Il cuore del mio lavoro</span>
          <blockquote id="proverb-title" className="m-0">
            <p className="m-0 max-w-[17em] text-[clamp(32px,4.6vw,64px)] font-[800] leading-[1.16] tracking-[-0.035em] text-ink" data-scrub>
              Se l&apos;alimentazione è{' '}
              <mark className="pv-bad" data-hl="scrub">
                sbagliata
              </mark>{' '}
              la medicina è inutile; se l&apos;alimentazione è{' '}
              <mark className="pv-good" data-hl="scrub">
                corretta
              </mark>{' '}
              la medicina non è necessaria.
            </p>
          </blockquote>
          <p className="font-[family-name:var(--font-script)] text-[clamp(24px,2.6vw,32px)] text-ink">— Proverbio ayurvedico</p>
        </div>
      </section>

      {/* CTA */}
      <section
        className="on-dark section"
        aria-labelledby="a-cta-title"
        style={{ background: 'radial-gradient(60% 70% at 85% 0%, rgb(255 255 255 / 0.14), rgb(255 255 255 / 0) 70%), var(--color-sage)' }}
      >
        <div className="wrap flex flex-col items-start gap-6">
          <span className="eyebrow">Consulenza gratuita · 45 minuti</span>
          <h2 id="a-cta-title" className="text-[clamp(48px,6.4vw,92px)] leading-[0.9]" data-split="lines">
            Raccontami il <span className="script">tuo animale.</span>
          </h2>
          <p className="lead">Il primo passo è gratuito e senza impegno.</p>
          <div className="flex flex-wrap gap-3">
            <Link className="btn btn-lg" href={CONSULENZA_HREF}>
              Richiedi la tua consulenza gratuita <ArrowIcon size={16} />
            </Link>
            <Link className="btn btn-ghost btn-lg" href={TEAM_HREF}>
              Lavora con noi
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
