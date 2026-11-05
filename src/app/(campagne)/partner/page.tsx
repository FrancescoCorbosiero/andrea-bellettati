import type { Metadata } from 'next';
import Image from 'next/image';
import { GraduationCap, Laptop } from 'lucide-react';
import ritratto from '@/assets/ritratto.jpg';
import StickyCta from '@/components/campaign/StickyCta';
import TeamFlow from '@/components/flows/TeamFlow';
import { ArrowIcon, WhatsAppIcon } from '@/components/icons';
import FaqList from '@/components/ui/FaqList';
import { AMBITI } from '@/lib/forms';
import { pageMetadata } from '@/lib/seo';
import { STATS, TEAM_NAME, waLink } from '@/lib/site';

/* Pagina per le campagne di TeamNutrizione: il messaggio subito, il modello
   di lavoro dichiarato in chiaro. Fuori dai motori di ricerca (la pagina del
   sito è /lavora-con-noi). */
export const metadata: Metadata = {
  ...pageMetadata({
    title: { absolute: 'Entra in TeamNutrizione · Andrea Bellettati' },
    description:
      'Il benessere animale può diventare anche il tuo lavoro: formazione, affiancamento e un modello di lavoro dichiarato con trasparenza. Raccontami chi sei.',
    path: '/partner',
    image: '/og/lavora-con-noi.jpg',
    imageAlt: 'TeamNutrizione — Al tuo fianco per il benessere del tuo pet',
  }),
  robots: { index: false, follow: false },
};

const PROMISES = [
  'Primo confronto conoscitivo, senza impegno',
  'Formazione e affiancamento dal primo giorno',
  'Modello di lavoro dichiarato con trasparenza',
];

const FAQS = [
  {
    q: 'Devo già lavorare con gli animali?',
    a: 'No. Non serve sapere già tutto: servono ascolto, serietà, sensibilità e una reale volontà di formarsi.',
  },
  {
    q: 'Quanto tempo devo dedicarci?',
    a: 'Lo decidi tu. Può affiancare il lavoro che fai già oppure crescere fino a diventare la tua attività principale, di persona o a distanza.',
  },
  {
    q: 'Che modello di lavoro è?',
    a: 'Multi Level Marketing applicato al benessere animale. È un’attività indipendente, costruita sulla consulenza e sulla relazione con il cliente. La crescita è legata al lavoro reale: nessuna promessa di guadagni facili.',
  },
  {
    q: 'Cosa succede dopo il messaggio?',
    a: 'Ti ricontatto io per un primo confronto, senza impegno: ti racconto come funziona il Team e capiamo insieme se fa per te.',
  },
];

export default function PartnerCampagna() {
  return (
    <>
      <section className="relative pb-16 pt-2 lg:pb-24 lg:pt-8" aria-labelledby="lp-title">
        <div className="wrap grid items-start gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-x-16">
          <div className="flex flex-col items-start gap-5 lg:col-start-1 lg:row-start-1">
            <span className="eyebrow intro">Lavora con noi · {TEAM_NAME}</span>
            <h1 id="lp-title" className="text-[clamp(40px,10vw,88px)] leading-[0.92] lg:text-[clamp(56px,5.4vw,84px)]">
              <span className="intro block" style={{ ['--d' as string]: '0.1s' }}>
                Il benessere animale
              </span>
              <span className="intro block" style={{ ['--d' as string]: '0.2s' }}>
                può diventare
              </span>
              <span className="intro block text-peach-deep" style={{ ['--d' as string]: '0.3s' }}>
                il tuo lavoro.
              </span>
            </h1>
            <p className="lead intro max-w-[30em]" style={{ ['--d' as string]: '0.45s' }}>
              Non cerco venditori: cerco persone e professionisti che vogliono imparare l&apos;alimentazione e il benessere di
              cani e gatti. Raccontami chi sei, ti ricontatto io.
            </p>
          </div>

          <div id="questionario" className="intro lg:col-start-2 lg:row-span-2 lg:row-start-1" style={{ ['--d' as string]: '0.3s' }}>
            <TeamFlow />
          </div>

          <div className="flex flex-col gap-8 lg:col-start-1 lg:row-start-2">
            <ul className="ticks intro text-[17px]" style={{ ['--d' as string]: '0.6s' }}>
              {PROMISES.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <figure className="flex items-center gap-4">
              <Image
                src={ritratto}
                alt="Andrea Bellettati"
                width={144}
                height={144}
                className="h-[72px] w-[72px] shrink-0 rounded-full border-2 border-white object-cover shadow-[var(--shadow-glass-s)]"
              />
              <figcaption className="text-[15.5px] leading-snug text-ink-soft">
                <strong className="text-ink">Andrea Bellettati</strong>, nel {TEAM_NAME} dal {STATS.teamSince}. Ti rispondo io,
                personalmente: nessun automatismo, nessuna lista d&apos;attesa.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Il modello, detto subito */}
      <section className="section-tight border-y border-ink/10 bg-sage-soft" aria-labelledby="model-title">
        <div className="wrap-narrow">
          <article className="slab flex flex-col items-start gap-5 bg-[#fffdf8] p-8 sm:p-12" data-reveal>
            <span className="eyebrow">Trasparenza, prima di tutto</span>
            <h2 id="model-title" className="display-md">
              Il nostro modello di lavoro.
            </h2>
            <p className="text-[17.5px] leading-relaxed text-ink-soft">
              {TEAM_NAME} lavora con un modello di{' '}
              <mark className="hl" data-hl>
                Multi Level Marketing
              </mark>{' '}
              applicato al benessere animale, e preferiamo dirlo subito. È un&apos;attività indipendente, costruita sulla consulenza
              e sulla relazione con il cliente, con la possibilità di creare e formare un proprio Team.
            </p>
            <p className="text-[17.5px] leading-relaxed text-ink-soft">
              La crescita è legata al lavoro reale:{' '}
              <mark className="hl" data-hl>
                nessuna promessa di guadagni facili
              </mark>
              . Quello che offriamo è un metodo, formazione, esperienza e affiancamento.
            </p>
          </article>
        </div>
      </section>

      {/* A chi è rivolto e come si lavora */}
      <section className="section-tight" aria-labelledby="who-title">
        <div className="wrap flex flex-col gap-10">
          <div className="flex max-w-[40em] flex-col items-start gap-4">
            <span className="eyebrow">A chi è rivolto</span>
            <h2 id="who-title" className="display-md" data-split>
              Persone diverse, <span className="script">stessa serietà.</span>
            </h2>
            <ul className="flex flex-wrap gap-2" aria-label="Da dove arriva chi entra nel Team">
              {AMBITI.filter((a) => a !== 'Altro').map((a) => (
                <li key={a} className="pill">
                  {a}
                </li>
              ))}
              <li className="pill pill-peach">…o tutt&apos;altro</li>
            </ul>
          </div>
          <div className="grid gap-4 md:grid-cols-2" data-reveal="stagger">
            <div className="slab slab-frost flex flex-col gap-3 p-7 sm:p-9">
              <Laptop size={36} strokeWidth={1.6} aria-hidden className="text-peach-deep" />
              <h3 className="text-[23px] leading-tight tracking-[-0.02em]">Attività flessibile, online e offline</h3>
              <p className="text-[16.5px] leading-relaxed text-ink-soft">
                Sviluppi l&apos;attività sui tuoi tempi e sui tuoi obiettivi: può affiancare il lavoro che fai già oppure crescere
                fino a diventare la tua attività principale, di persona o a distanza.
              </p>
            </div>
            <div className="slab slab-frost flex flex-col gap-3 p-7 sm:p-9">
              <GraduationCap size={36} strokeWidth={1.6} aria-hidden className="text-peach-deep" />
              <h3 className="text-[23px] leading-tight tracking-[-0.02em]">Formazione e affiancamento</h3>
              <p className="text-[16.5px] leading-relaxed text-ink-soft">
                Hai accesso a formazione, materiali e confronto costante con il Team. Ti accompagniamo dal primo contatto fino alla
                costruzione della tua rete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Domande */}
      <section className="section-tight pt-0" aria-labelledby="faq-title">
        <div className="wrap grid items-start gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="flex flex-col items-start gap-4">
            <span className="eyebrow">Domande</span>
            <h2 id="faq-title" className="display-md" data-split>
              Prima di <span className="script">scrivermi.</span>
            </h2>
          </div>
          <FaqList items={FAQS} />
        </div>
      </section>

      {/* Chiusura */}
      <section id="fine" className="pb-16 lg:pb-24" aria-labelledby="end-title">
        <div className="wrap">
          <div
            className="on-dark slab slab-deep flex flex-col items-start gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between"
            data-reveal
          >
            <div className="flex flex-col gap-3">
              <h2 id="end-title" className="display-md">
                Raccontami <span className="script">chi sei.</span>
              </h2>
              <p className="lead max-w-[28em]">Tre passaggi, un paio di minuti. Poi ti ricontatto io, senza impegno.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="btn btn-lg" href="#questionario">
                Scrivimi qui <ArrowIcon size={16} />
              </a>
              <a
                className="btn btn-ghost btn-lg"
                href={waLink('Ciao Andrea! Vorrei sapere di più su TeamNutrizione.')}
                target="_blank"
                rel="noopener"
              >
                <WhatsAppIcon size={16} /> Su WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <StickyCta target="questionario" until="fine">
        Raccontami chi sei <ArrowIcon size={16} />
      </StickyCta>
    </>
  );
}
