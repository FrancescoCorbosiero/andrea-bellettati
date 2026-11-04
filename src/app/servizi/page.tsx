import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import bowls from '@/assets/hero.jpg';
import andrea from '@/assets/home-hero.jpg';
import van from '@/assets/home-approccio.jpg';
import { ArrowIcon } from '@/components/icons';
import CtaBand from '@/components/ui/CtaBand';
import SectionHead from '@/components/ui/SectionHead';
import { pageMetadata } from '@/lib/seo';
import { CONSULENZA_HREF, TEAM_HREF } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Servizi — alimentazione, consulenza, lavoro',
  description:
    'Alimentazione naturale, consulenza 1:1 e opportunità lavorative nel settore pet. Consulenza gratuita di 45 minuti e piano di lavoro su misura.',
  path: '/servizi',
  image: bowls.src,
});

type Service = {
  n: string;
  title: string;
  text: string;
  tags: string[];
  ticks: string[];
  photo: StaticImageData;
  alt: string;
  position?: string;
  ctas: { href: string; label: string; ghost?: boolean }[];
};

const SERVICES: Service[] = [
  {
    n: '01',
    title: 'Alimentazione naturale',
    text: 'Capire cosa stai davvero comprando per il tuo animale e costruire una ciotola adatta a lui — non alla pubblicità. Alimentazione naturale per cani e gatti, scelta a partire dal soggetto.',
    tags: ['Carne fresca', 'Grain free', 'Lettura etichette', 'Percorso su misura'],
    ticks: [
      "Analisi dell'alimentazione attuale e degli ingredienti reali",
      'Scelta dei prodotti in base a età, razza, attività e sensibilità',
      'Indicazioni pratiche su dosi, transizione e routine',
      'Supporto nel tempo, non una tabella e via',
    ],
    photo: bowls,
    alt: 'Quattro ciotole con carne, verdure e crocchette: una razione preparata con cura',
    ctas: [
      { href: CONSULENZA_HREF, label: 'Richiedi un preventivo' },
      { href: '/articoli', label: 'Leggi il blog', ghost: true },
    ],
  },
  {
    n: '02',
    title: 'Consulenza 1:1',
    text: 'Un confronto dedicato per analizzare insieme tutti gli aspetti legati ad alimentazione e comportamento del tuo animale. La prima consulenza è gratuita.',
    tags: ['45 minuti', 'Cane e gatto', 'Primo incontro gratuito'],
    ticks: [
      '45 minuti per analizzare alimentazione e comportamento del soggetto',
      'Un documento firmato con il piano di lavoro proposto',
      'Obiettivi concreti e sostenibili per la tua quotidianità',
      'Ti ricontatto io al numero che lasci nel questionario',
    ],
    photo: andrea,
    alt: 'Andrea Bellettati con la sua bassotta in braccio',
    position: 'object-[42%_28%]',
    ctas: [{ href: CONSULENZA_HREF, label: 'Richiedi la tua consulenza gratuita' }],
  },
  {
    n: '03',
    title: 'Opportunità lavorative',
    text: "Se ami gli animali e vuoi trasformare questa passione in una professione, il settore dell'alimentazione pet è un'opportunità concreta e in crescita costante. Entrando nel Team non sei solo: formazione continua, una community di esperti e strumenti reali per costruire il tuo percorso.",
    tags: ['Formazione continua', 'Community', 'Attività indipendente', 'Settore in crescita'],
    ticks: [
      'Competenze pratiche e scientifiche per seguire i clienti',
      'Affiancamento di un team multidisciplinare',
      "Strumenti per avviare un'attività o ampliare le tue competenze",
      'Un primo confronto senza impegno per capire se fa per te',
    ],
    photo: van,
    alt: 'Andrea con il furgone aperto e i cani, pronti a partire',
    ctas: [{ href: TEAM_HREF, label: 'Lavora con noi' }],
  },
];

const STEPS = [
  {
    title: 'Compili il questionario',
    text: 'Due minuti, quasi tutto a tocchi: chi è il tuo animale, cosa mangia, cosa ti preoccupa. Oppure scrivimi su WhatsApp.',
  },
  { title: 'Ti ricontatto io', text: 'Ti chiamo al numero indicato e fissiamo la consulenza gratuita di 45 minuti, su alimentazione e comportamento.' },
  { title: 'Ricevi il piano', text: 'Al termine ti consegno un documento firmato con il piano di lavoro che possiamo mettere in atto, passo dopo passo.' },
];

export default function ServiziPage() {
  return (
    <>
      <section className="pb-12 pt-10 lg:pt-16" aria-labelledby="s-title">
        <div className="wrap">
          <SectionHead
            as="h1"
            id="s-title"
            size="xl"
            eyebrow="I servizi"
            title="Tre strade,"
            script="un'unica cura."
            lead="Per le famiglie che vogliono nutrire meglio il proprio animale e per chi sogna di trasformare questa passione in un mestiere. Nessun prezzo a listino: ogni percorso parte da un confronto gratuito e da un preventivo costruito sulla tua situazione reale."
            className="intro"
          />
        </div>
      </section>

      <section className="pb-[clamp(72px,9vw,128px)]" aria-label="I tre servizi">
        <div className="wrap grid gap-7">
          {SERVICES.map((s, i) => (
            <article key={s.n} className="slab grid overflow-hidden lg:grid-cols-2" data-reveal aria-labelledby={`svc-${s.n}`}>
              <div
                className={`relative min-h-[260px] overflow-hidden border-b border-ink/10 lg:min-h-[520px] lg:border-b-0 ${i % 2 ? 'lg:order-2 lg:border-l' : 'lg:border-r'}`}
                data-clip
              >
                <Image
                  src={s.photo}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className={`object-cover ${s.position ?? ''}`}
                  data-parallax
                  data-parallax-cover
                />
              </div>
              <div className="flex flex-col items-start gap-4 p-[clamp(26px,4vw,52px)]">
                <span className="font-[family-name:var(--font-script)] text-[24px] leading-none text-peach-deep">Servizio {s.n}</span>
                <h2 id={`svc-${s.n}`} className="display-md" data-split>
                  {s.title}
                </h2>
                <p className="text-[17px] leading-relaxed text-ink-soft">{s.text}</p>
                <ul className="flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li key={t} className="pill">
                      {t}
                    </li>
                  ))}
                </ul>
                <ul className="ticks mt-1 text-[16px]">
                  {s.ticks.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="mt-2 flex flex-wrap gap-3">
                  {s.ctas.map((c) => (
                    <Link key={c.label} className={`btn ${c.ghost ? 'btn-ghost' : ''}`} href={c.href}>
                      {c.label} {!c.ghost && <ArrowIcon size={15} />}
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section border-t border-ink/10 bg-sand" aria-labelledby="s-how-title">
        <div className="wrap">
          <SectionHead id="s-how-title" eyebrow="Come funziona" title="Dal primo messaggio" script="al piano firmato." />
          <ol className="mt-10 grid gap-5 md:grid-cols-3" data-reveal="stagger">
            {STEPS.map((s, i) => (
              <li key={s.title} className="slab flex flex-col gap-3 p-7">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-white/80 bg-peach font-[family-name:var(--font-poster)] text-[22px] text-ink shadow-[var(--shadow-glass-s)]">
                  {i + 1}
                </span>
                <h3 className="text-[24px]">{s.title}</h3>
                <p className="text-[16px] leading-relaxed text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        eyebrow="Pronto a iniziare?"
        title={
          <>
            Il primo confronto è <span className="script !text-white [text-shadow:0_1px_0_rgb(208_103_63/0.55),0_4px_14px_rgb(140_60_30/0.3)]">sempre gratuito.</span>
          </>
        }
      />
    </>
  );
}
