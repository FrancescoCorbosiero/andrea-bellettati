import type { Metadata } from 'next';
import Image from 'next/image';
import { Clock3, Gift, PenLine } from 'lucide-react';
import consulenzaPhoto from '@/assets/consulenza.jpg';
import faceConsulenza from '@/assets/chi-sono.jpg';
import ritratto from '@/assets/ritratto.jpg';
import zoeAfter from '@/assets/storia-zoe-dopo.jpg';
import zoeBefore from '@/assets/storia-zoe-prima.jpg';
import CampaignHero from '@/components/campaign/CampaignHero';
import StickyCta from '@/components/campaign/StickyCta';
import ConsultInline from '@/components/flows/ConsultInline';
import { ArrowIcon, WhatsAppIcon } from '@/components/icons';
import FaqList from '@/components/ui/FaqList';
import { pageMetadata } from '@/lib/seo';
import { STATS, TEAM_NAME, formatNumber, waLink } from '@/lib/site';

/* Pagina per gli annunci della consulenza gratuita: il questionario subito,
   poco intorno. Fuori dai motori di ricerca (la pagina del sito è
   /consulenza-gratuita): serve a chi arriva da una campagna. */
export const metadata: Metadata = {
  ...pageMetadata({
    title: { absolute: 'Consulenza gratuita per il tuo cane o gatto · Andrea Bellettati' },
    description:
      '45 minuti al telefono su alimentazione e comportamento del tuo cane o gatto. Gratuita e senza impegno, con un piano di lavoro scritto e firmato.',
    path: '/consulenza',
    image: consulenzaPhoto.src,
    imageAlt: 'Andrea Bellettati seduto su una roccia con la sua bassotta, lungo un fiume di montagna',
  }),
  robots: { index: false, follow: false },
};

const PROMISES = [
  'Gratuita e senza impegno',
  'Ti richiamo io, nella fascia che scegli',
  'Al fianco del tuo veterinario, mai al suo posto',
];

const STEPS = [
  { title: 'Compili il questionario', text: 'Due minuti, quasi tutto a tocchi.' },
  { title: 'Ti richiamo io', text: 'Di solito entro 24–48 ore, quando preferisci tu.' },
  { title: 'Ricevi il piano', text: 'Scritto e firmato, su misura per lui. Poi decidi tu se proseguire.' },
];

const STEP_TONES = ['slab-peach', 'slab-sage', 'slab-ink'];
const NUM_TONES = ['text-ink', 'text-cream-ink', 'text-peach'];

const FAQS = [
  {
    q: 'È davvero gratuita?',
    a: 'Sì. Sono 45 minuti al telefono, senza costi e senza impegno. Alla fine ti lascio il piano di lavoro e decidi tu se e come proseguire.',
  },
  {
    q: 'E il mio veterinario?',
    a: 'Resta il riferimento per diagnosi e terapie. Io lavoro su alimentazione e abitudini, al suo fianco.',
  },
  {
    q: 'Per quali animali?',
    a: 'Cani e gatti, di ogni età: dal cucciolo appena arrivato all’anziano che mangia meno.',
  },
  {
    q: 'Quando mi chiami?',
    a: 'Di solito entro 24–48 ore, nella fascia che scegli nel questionario: mattina, pomeriggio o sera. Se preferisci, ci scriviamo su WhatsApp.',
  },
];

export default function ConsulenzaCampagna() {
  return (
    <>
      {/* Il pitch e il questionario nello stesso schermo (CampaignHero). */}
      <CampaignHero
        id="lp-title"
        eyebrow="Consulenza gratuita · 45 minuti"
        titleClass="text-[clamp(48px,12.5vw,104px)] leading-[0.9] lg:text-[clamp(60px,6vw,92px)]"
        lines={[{ text: '45 minuti' }, { text: 'per il tuo', face: true }, { text: 'cane o gatto.', accent: true }]}
        face={{ src: faceConsulenza, position: '62% 38%' }}
        lead="Mi racconti cosa mangia e come si comporta. Ascolto, faccio qualche domanda e alla fine ti lascio un piano di lavoro scritto e firmato."
        chips={[
          { icon: <Gift aria-hidden />, label: 'Gratis', tone: 'peach', className: '-top-5 left-5' },
          { icon: <Clock3 aria-hidden />, label: '45 minuti al telefono', className: '-top-5 right-5' },
          { icon: <PenLine aria-hidden />, label: 'Piano scritto e firmato', className: '-bottom-5 inset-x-0 mx-auto' },
        ]}
        form={<ConsultInline />}
        aside={
          <>
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
                <strong className="text-ink">Andrea Bellettati</strong>, comportamento e nutrizione per cani e gatti. Nel{' '}
                {TEAM_NAME} dal {STATS.teamSince}, {formatNumber(STATS.followers)} persone mi seguono su Instagram.
              </figcaption>
            </figure>
          </>
        }
      />

      {/* Cosa succede dopo */}
      <section className="section-tight border-y border-ink/10 bg-peach-soft" aria-labelledby="steps-title">
        <div className="wrap flex flex-col gap-9">
          <h2 id="steps-title" className="display-md max-w-[16em]" data-split>
            Cosa succede <span className="script">dopo.</span>
          </h2>
          <ol className="grid gap-4 md:grid-cols-3" data-reveal="stagger">
            {STEPS.map((s, i) => (
              <li key={s.title} className={`slab ${STEP_TONES[i]} flex flex-col gap-3 p-7`}>
                <span className={`font-[family-name:var(--font-poster)] text-[56px] leading-[0.85] ${NUM_TONES[i]}`}>{i + 1}</span>
                <h3 className="text-[23px] leading-tight tracking-[-0.02em]">{s.title}</h3>
                <p className="text-[16px] leading-relaxed opacity-85">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Una storia vera */}
      <section className="section-tight" aria-labelledby="story-title">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="grid grid-cols-2 gap-3" data-reveal>
            {[
              { src: zoeBefore, label: 'Prima', alt: 'Zoe, cucciola dal pelo riccio, prima del cambio di alimentazione' },
              { src: zoeAfter, label: 'Dopo un mese', alt: 'Zoe dopo un mese di nuova alimentazione, con il mantello più folto' },
            ].map((p) => (
              <figure key={p.label} className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-white/80 shadow-[var(--shadow-glass-s)]">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 300px, 45vw" className="object-cover" />
                <figcaption className="pill absolute bottom-3 left-3 !text-[13px]">{p.label}</figcaption>
              </figure>
            ))}
          </div>
          <div className="flex flex-col items-start gap-5">
            <span className="eyebrow">Una storia vera</span>
            <h2 id="story-title" className="display-md" data-split>
              Zoe, <span className="script">un mese dopo.</span>
            </h2>
            <p className="text-[17.5px] leading-relaxed text-ink-soft">
              Cucciola dal pelo riccio, con l&apos;alimentazione appena cambiata. Dopo trenta giorni il mantello è già diverso.
            </p>
            <p className="text-[13.5px] text-ink-mute">Esperienza individuale.</p>
          </div>
        </div>
      </section>

      {/* Domande */}
      <section className="section-tight" aria-labelledby="faq-title">
        <div className="wrap grid items-start gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="flex flex-col items-start gap-4">
            <span className="eyebrow">Domande</span>
            <h2 id="faq-title" className="display-md" data-split>
              Prima di <span className="script">iniziare.</span>
            </h2>
          </div>
          <FaqList items={FAQS} />
        </div>
      </section>

      {/* Chiusura: un solo passo da fare */}
      <section id="fine" className="pb-16 lg:pb-24" aria-labelledby="end-title">
        <div className="wrap">
          <div
            className="on-dark slab slab-deep flex flex-col items-start gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between"
            data-reveal
          >
            <div className="flex flex-col gap-3">
              <h2 id="end-title" className="display-md">
                Ci vogliono <span className="script">due minuti.</span>
              </h2>
              <p className="lead max-w-[28em]">Compili il questionario, io ti richiamo. Gratis, senza impegno.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="btn btn-lg" href="#questionario">
                Compila il questionario <ArrowIcon size={16} />
              </a>
              <a
                className="btn btn-ghost btn-lg"
                href={waLink('Ciao Andrea! Vorrei informazioni sulla consulenza gratuita.')}
                target="_blank"
                rel="noopener"
              >
                <WhatsAppIcon size={16} /> Preferisco scrivere
              </a>
            </div>
          </div>
        </div>
      </section>

      <StickyCta target="questionario" until="fine">
        Compila il questionario <ArrowIcon size={16} />
      </StickyCta>
    </>
  );
}
