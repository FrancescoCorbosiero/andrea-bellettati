import Image from 'next/image';
import Link from 'next/link';
import cover from '@/assets/lavora-con-noi.jpg';
import { GraduationCap, Laptop } from 'lucide-react';
import TeamFlow from '@/components/flows/TeamFlow';
import ProfileWall from '@/components/team/ProfileWall';
import { ArrowIcon } from '@/components/icons';
import SectionHead from '@/components/ui/SectionHead';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Lavora con noi — TeamNutrizione',
  description:
    'Il benessere animale può diventare anche il tuo lavoro. TeamNutrizione: formazione, affiancamento e un modello di lavoro dichiarato con trasparenza. Raccontami chi sei.',
  path: '/lavora-con-noi',
  image: '/og/lavora-con-noi.jpg',
  imageAlt: 'TeamNutrizione — Al tuo fianco per il benessere del tuo pet',
});

const METHOD = [
  {
    n: '01',
    title: "Si parte dall'ascolto",
    body: "Il lavoro non parte da un listino: parte dall'ascolto delle persone e dei loro animali. Prima capire, poi proporre.",
    slab: 'slab-peach',
    num: 'text-ink',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M10 26c0-12 9-20 22-20s22 8 22 20c0 9-6 13-11 17-4 3-5 6-6 10-1 5-5 8-10 8" />
        <path d="M22 28c0-7 4-11 10-11s10 4 10 10c0 4-3 6-5 8" />
        <path d="M48 52l6 6M52 44l8 2" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Analisi, non catalogo',
    body: 'Analizziamo abitudini, stile di vita ed esigenze reali di ogni soggetto. È da lì che nasce ogni proposta, mai dal prodotto.',
    slab: 'slab-sage',
    num: 'text-cream-ink',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
        <circle cx="27" cy="27" r="17" />
        <path d="M40 40l16 16" />
        <path d="M19 27a8 8 0 0 1 8-8" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Supporto nel tempo',
    body: 'Consulenza, formazione e supporto continuo sono la base del metodo: il cliente non viene lasciato solo dopo la prima ciotola.',
    slab: 'slab-ink',
    num: 'text-peach',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M52 30a20 20 0 1 1-6-14" />
        <path d="M48 6v12H36" />
        <path d="M32 20v13l8 5" />
      </svg>
    ),
  },
];

const PROMISES = [
  'Primo confronto conoscitivo, senza impegno',
  'Formazione e affiancamento dal primo giorno',
  'Modello di lavoro dichiarato con trasparenza',
];

export default function LavoraConNoiPage() {
  return (
    <>
      {/* COPERTINA: lo striscione TeamNutrizione */}
      <section className="bg-sage-soft" aria-hidden>
        <Image src={cover} alt="" priority sizes="100vw" className="mx-auto h-auto w-full max-w-[1600px] object-cover" />
      </section>

      {/* HERO */}
      <section
        className="on-dark section"
        aria-labelledby="l-title"
        style={{
          background:
            'radial-gradient(50% 64% at 80% 36%, rgb(111 139 96 / 0.34), rgb(111 139 96 / 0) 72%), radial-gradient(40% 50% at 0% 100%, rgb(111 139 96 / 0.18), rgb(111 139 96 / 0) 70%), var(--color-deep)',
        }}
      >
        <div className="wrap flex flex-col items-start gap-6">
          <span className="eyebrow intro">Lavora con noi · TeamNutrizione</span>
          <h1 id="l-title" className="max-w-[12em] text-[clamp(48px,7vw,96px)] leading-[0.92]">
            <span className="intro block" style={{ ['--d' as string]: '0.1s' }}>
              Il benessere animale
            </span>
            <span className="intro block" style={{ ['--d' as string]: '0.2s' }}>
              può diventare anche
            </span>
            <span className="intro block" style={{ ['--d' as string]: '0.3s' }}>
              il tuo <span className="text-peach">lavoro.</span>
            </span>
          </h1>
          <div className="intro flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:gap-12" style={{ ['--d' as string]: '0.5s' }}>
            <p className="lead max-w-[34em]">
              Non stiamo costruendo una rete di venditori. Stiamo creando un Team di persone e professionisti che vogliono
              sviluppare competenze nell&apos;alimentazione e nel benessere animale.
            </p>
            <Link className="btn btn-lg shrink-0" href="#unisciti">
              Raccontami chi sei <ArrowIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* COME LAVORIAMO: la parola sbagliata barrata a mano */}
      <section className="section" aria-labelledby="strike-title">
        <div className="wrap flex flex-col items-start gap-6">
          <span className="eyebrow">Come lavoriamo</span>
          <h2 id="strike-title" className="text-[clamp(44px,6.4vw,92px)] leading-[0.92]">
            <span className="block">Stiamo creando</span>
            <span className="relative block w-fit text-ink-mute/60" data-reveal>
              una rete di venditori
              <svg aria-hidden viewBox="0 0 400 40" preserveAspectRatio="none" className="draw absolute left-[-2%] top-[46%] h-[0.32em] w-[104%] overflow-visible text-peach-deep" style={{ ['--d' as string]: '0.4s' }}>
                <path d="M4 26C80 12 180 30 260 16S360 10 396 18" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" pathLength={1} />
              </svg>
            </span>
            <span className="script block !text-[1.15em]">un Team.</span>
          </h2>
          <p className="lead max-w-[30em]">
            Non cerchiamo semplici venditori: cerchiamo persone e professionisti che vogliono sviluppare competenze
            nell&apos;alimentazione e nel benessere animale.
          </p>
        </div>
      </section>

      {/* IL METODO */}
      <section className="section-tight pb-[clamp(72px,9vw,128px)]" aria-labelledby="method-title">
        <div className="wrap">
          <SectionHead id="method-title" eyebrow="Il metodo" title="Prima capire," script="poi proporre." />
          <div className="mt-10 grid gap-5">
            {METHOD.map((m, i) => (
              <article
                key={m.n}
                className={`slab ${m.slab} grid items-center gap-6 overflow-hidden p-7 sm:p-10 md:grid-cols-[1fr_1.2fr] md:p-12`}
                data-reveal
                style={{ ['--d' as string]: `${i * 0.08}s` }}
              >
                <span className={`font-[family-name:var(--font-poster)] text-[clamp(110px,16vw,200px)] leading-[0.8] ${m.num}`}>{m.n}</span>
                <div className="flex flex-col items-start gap-3">
                  <span className="h-11 w-11">{m.icon}</span>
                  <h3 className="text-[clamp(30px,3.2vw,42px)]">{m.title}</h3>
                  <p className="max-w-[28em] text-[16.5px] leading-relaxed opacity-90">{m.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* A CHI È RIVOLTO */}
      <section
        className="on-dark section border-y border-white/15"
        aria-labelledby="who-title"
        style={{ background: 'radial-gradient(60% 70% at 85% 0%, rgb(255 255 255 / 0.14), rgb(255 255 255 / 0) 70%), var(--color-sage)' }}
      >
        <div className="wrap">
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_0.8fr]">
            <SectionHead id="who-title" eyebrow="A chi è rivolto" title="Persone diverse," script="stessa serietà." />
            <p className="text-[17px] leading-relaxed text-cream-ink/90">
              Non serve sapere già tutto: servono ascolto, serietà, sensibilità e una reale volontà di formarsi.{' '}
              <strong className="text-cream-ink">Ti riconosci? Tocca il tuo profilo.</strong>
            </p>
          </div>
          <ProfileWall />
        </div>
      </section>

      {/* FLESSIBILITÀ + FORMAZIONE */}
      <section className="section" aria-label="Come si lavora nel Team">
        <div className="wrap grid gap-5 md:grid-cols-2">
          <article className="slab flex flex-col gap-4 p-8 sm:p-10" data-reveal>
            <Laptop size={40} strokeWidth={1.6} aria-hidden className="text-olive" />
            <h3 className="text-[clamp(26px,2.6vw,34px)]">Attività flessibile, online e offline</h3>
            <p className="text-[16.5px] leading-relaxed text-ink-soft">
              Sviluppi l&apos;attività sui tuoi tempi e sui tuoi obiettivi: può affiancare il lavoro che fai già oppure crescere
              fino a diventare la tua attività principale, di persona o a distanza.
            </p>
          </article>
          <article className="slab slab-peach flex flex-col gap-4 p-8 sm:p-10" data-reveal style={{ ['--d' as string]: '0.08s' }}>
            <GraduationCap size={40} strokeWidth={1.6} aria-hidden />
            <h3 className="text-[clamp(26px,2.6vw,34px)]">Formazione e affiancamento</h3>
            <p className="text-[16.5px] leading-relaxed">
              Hai accesso a formazione, materiali e confronto costante con il Team. Ti accompagniamo dal primo contatto fino
              alla costruzione della tua rete.
            </p>
          </article>
        </div>
      </section>

      {/* TRASPARENZA */}
      <section className="section-tight pb-[clamp(72px,9vw,128px)]" aria-labelledby="model-title">
        <div className="wrap-narrow">
          <article className="slab flex flex-col items-start gap-5 bg-[#fffdf8] p-8 sm:p-12" data-reveal>
            <span className="eyebrow">Trasparenza, prima di tutto</span>
            <h2 id="model-title" className="display-md">
              Il nostro modello di lavoro.
            </h2>
            <p className="text-[17.5px] leading-relaxed text-ink-soft">
              TeamNutrizione lavora con un modello di{' '}
              <mark className="rounded-[4px] bg-peach/70 px-1 font-[700] text-ink">Multi Level Marketing</mark> applicato al
              benessere animale — e preferiamo dirlo subito, con trasparenza. È un&apos;attività indipendente, costruita sulla
              consulenza e sulla relazione con il cliente, con la possibilità di creare e formare un proprio Team.
            </p>
            <p className="text-[17.5px] leading-relaxed text-ink-soft">
              La crescita è legata al lavoro reale:{' '}
              <mark className="rounded-[4px] bg-peach/70 px-1 font-[700] text-ink">nessuna promessa di guadagni facili</mark>.
              Quello che offriamo è un metodo, formazione, esperienza e affiancamento.
            </p>
            <div className="mt-2 flex w-full flex-wrap items-center justify-between gap-4">
              <span className="font-[family-name:var(--font-script)] text-[30px] text-peach-deep">— Andrea</span>
              <Link className="btn" href="#unisciti">
                Raccontami chi sei <ArrowIcon size={15} />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* IL MODULO */}
      <section id="unisciti" className="section scroll-mt-20 border-t border-ink/10 bg-cream" aria-labelledby="join-title">
        <div className="wrap grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="flex flex-col items-start gap-5 lg:sticky lg:top-28">
            <span className="eyebrow">Entra nel Team</span>
            <h2 id="join-title" className="display-lg">
              Raccontami <span className="script">chi sei.</span>
            </h2>
            <p className="lead">
              Tre passaggi, un paio di minuti. Ti ricontatto personalmente per un primo confronto senza impegno: nessun
              automatismo, nessuna lista d&apos;attesa.
            </p>
            <ul className="ticks text-[16.5px]">
              {PROMISES.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <TeamFlow />
        </div>
      </section>
    </>
  );
}
