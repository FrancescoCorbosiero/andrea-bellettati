import Image from 'next/image';
import Link from 'next/link';
import consulenzaPhoto from '@/assets/consulenza.jpg';
import logo from '@/assets/logo.jpg';
import { Mail, Phone } from 'lucide-react';
import ConsultInline from '@/components/flows/ConsultInline';
import { ArrowIcon, InstagramIcon, WhatsAppIcon } from '@/components/icons';
import Polaroid from '@/components/ui/Polaroid';
import SectionHead from '@/components/ui/SectionHead';
import { pageMetadata } from '@/lib/seo';
import { EMAIL, IG_HANDLE, IG_URL, PHONE, PHONE_DISPLAY, TEAM_HREF, waLink } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Consulenza gratuita — 45 minuti per il tuo cane o gatto',
  description:
    '45 minuti insieme per analizzare alimentazione e comportamento del tuo cane o gatto. Gratuita e senza impegno, con un piano di lavoro scritto e firmato al termine.',
  path: '/consulenza-gratuita',
  image: consulenzaPhoto.src,
  imageAlt: 'Andrea Bellettati seduto su una roccia con la sua bassotta, lungo un fiume di montagna',
});

const STEPS = [
  { title: 'Compili il questionario', text: 'Due minuti, quasi tutto a tocchi.' },
  { title: 'Ti richiamo io', text: 'Al numero che lasci, quando preferisci.' },
  { title: 'Piano di lavoro firmato', text: 'Concreto e su misura, al termine della call.' },
];

const LOOK = ['cosa mangia', 'come si comporta', 'abitudini e stile di vita'];

const MONITORING = ['Adattamento', 'Appetito', 'Feci', 'Digestione', 'Abitudini'];

const STEP_TONES = ['bg-peach text-ink', 'bg-sage text-cream-ink', 'bg-ink text-peach'];

export default function ConsulenzaPage() {
  const channels = [
    { href: waLink('Ciao Andrea! Vorrei informazioni sulla consulenza gratuita.'), label: 'WhatsApp', value: PHONE_DISPLAY, icon: <WhatsAppIcon size={20} />, external: true, tone: 'bg-[#25d366] text-white' },
    { href: `mailto:${EMAIL}`, label: 'Email', value: EMAIL, icon: <Mail size={20} aria-hidden />, tone: 'bg-sage-mist text-olive' },
    { href: IG_URL, label: 'Instagram', value: IG_HANDLE, icon: <InstagramIcon size={20} />, external: true, tone: 'bg-peach-soft text-peach-deep' },
    { href: `tel:${PHONE}`, label: 'Telefono', value: PHONE_DISPLAY, icon: <Phone size={20} aria-hidden />, tone: 'bg-sand text-bark' },
  ];

  return (
    <>
      {/* HERO: il pitch e il questionario nello stesso schermo */}
      <section className="relative overflow-hidden pb-20 pt-8 lg:pt-14" aria-labelledby="c-title">
        <div className="wrap grid items-start gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="flex flex-col items-start gap-6 lg:sticky lg:top-28">
            <span className="eyebrow intro">Consulenza gratuita · 45&apos;</span>
            <h1 id="c-title" className="text-[clamp(60px,15vw,112px)] leading-[0.86] lg:text-[clamp(72px,7vw,108px)]">
              <span className="intro block" style={{ ['--d' as string]: '0.1s' }}>
                Parliamo
              </span>
              <span className="intro block" style={{ ['--d' as string]: '0.2s' }}>
                del tuo
              </span>
              <span className="intro block text-peach-deep" style={{ ['--d' as string]: '0.3s' }}>
                animale.
              </span>
            </h1>
            <p className="lead intro" style={{ ['--d' as string]: '0.5s' }}>
              45 minuti insieme per analizzare alimentazione e comportamento. Senza impegno.
            </p>
            <ol className="intro grid gap-3.5" style={{ ['--d' as string]: '0.65s' }}>
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex items-start gap-3.5">
                  <b
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/70 font-[family-name:var(--font-poster)] text-[17px] font-normal shadow-[var(--shadow-glass-s)] ${STEP_TONES[i]}`}
                  >
                    {i + 1}
                  </b>
                  <span className="flex flex-col pt-0.5 text-[16.5px] font-[750] leading-tight">
                    {s.title}
                    <small className="mt-1 text-[14px] font-normal text-ink-mute">{s.text}</small>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div id="questionario" className="intro scroll-mt-24" style={{ ['--d' as string]: '0.3s' }}>
            <ConsultInline />
          </div>
        </div>
      </section>

      {/* COSA GUARDIAMO INSIEME */}
      <section className="section border-y border-ink/10 bg-peach-soft" aria-labelledby="look-title">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2">
          <SectionHead
            id="look-title"
            eyebrow="Facciamo conoscenza"
            title="In 45 minuti guardiamo"
            script="insieme."
            lead="Non parto dal prodotto: parto dal tuo animale, da come vive e da cosa c'è oggi nella sua ciotola."
          />
          <div className="slab slab-frost p-7 sm:p-9" data-reveal>
            <p className="font-[family-name:var(--font-script)] text-[27px] leading-none text-peach-deep">Nella call guardiamo</p>
            <ul className="ticks mt-5 text-[19px]">
              {LOOK.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <p className="mt-6 text-[16.5px] leading-relaxed text-ink-soft">
              Alla fine ricevi un <strong className="text-ink">piano di lavoro scritto e firmato</strong>, su misura per lui.
              Decidi tu se e come proseguire: nessun impegno.
            </p>
          </div>
        </div>
      </section>

      {/* COME FUNZIONA: i tre passi come storie nel telefono */}
      <section className="section overflow-hidden" aria-labelledby="how-title">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[1fr_auto] lg:gap-20">
          <div className="flex flex-col items-start gap-6">
            <SectionHead
              id="how-title"
              eyebrow="Come funziona"
              title="Dal questionario al piano, in"
              script="tre passi."
              lead="Gratuita e senza impegno, per cane e gatto."
            />
            <Link className="btn btn-ghost" href="#questionario">
              Inizia dal questionario <ArrowIcon size={15} />
            </Link>
          </div>
          <div
            className="relative mx-auto w-[min(330px,86vw)] rounded-[44px] border border-white/15 bg-olive-dark p-3 shadow-[var(--shadow-smoke-xl)]"
            data-reveal
          >
            <div className="flex items-center gap-2 px-3 pb-3 pt-2 text-cream-ink">
              <Image src={logo} alt="" width={56} height={56} className="h-7 w-7 rounded-full border border-white/40 object-cover" />
              <span className="text-[13px] font-[700]">comunicazionecinofila</span>
              <span className="text-[12px] text-cream-ink/60">Consulenza gratuita</span>
            </div>
            <div className="grid gap-2.5">
              {STEPS.map((s, i) => (
                <article
                  key={s.title}
                  className={`relative overflow-hidden rounded-[26px] border border-white/25 p-5 pb-6 ${
                    ['bg-peach text-ink', 'bg-sage text-cream-ink', 'bg-deep text-cream-ink'][i]
                  }`}
                  style={{ backgroundImage: 'radial-gradient(120% 85% at 0% 0%, rgb(255 255 255 / 0.32), rgb(255 255 255 / 0) 58%)' }}
                >
                  <span className="block font-[family-name:var(--font-poster)] text-[64px] leading-[0.85]">{i + 1}</span>
                  <h3 className="mt-3 text-[24px]">{s.title}</h3>
                  <p className="mt-1.5 text-[14.5px] opacity-85">{s.text}</p>
                  {i === 2 && <span className="absolute right-5 top-5 font-[family-name:var(--font-script)] text-[30px] text-peach">Andrea</span>}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DOPO IL PRIMO INCONTRO */}
      <section
        className="on-dark section"
        aria-labelledby="after-title"
        style={{
          background:
            'radial-gradient(50% 70% at 92% 8%, rgb(111 139 96 / 0.3), rgb(111 139 96 / 0) 70%), radial-gradient(40% 60% at 0% 100%, rgb(244 169 138 / 0.1), rgb(244 169 138 / 0) 70%), var(--color-deep)',
        }}
      >
        <div className="wrap">
          <SectionHead
            id="after-title"
            eyebrow="Dopo il primo incontro"
            title="La consulenza non finisce con un consiglio"
            script="alimentare."
            lead="Il mio lavoro parte dal primo confronto, ma continua nel tempo. Seguo personalmente ogni percorso, monitorando:"
          />
          <ol className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5" data-reveal>
            <span aria-hidden className="absolute left-[10%] right-[10%] top-[22px] hidden h-1 rounded-full bg-peach/80 lg:block" />
            {MONITORING.map((m, i) => (
              <li key={m} className="relative flex flex-col items-start gap-3 lg:items-center">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-peach font-[family-name:var(--font-poster)] text-[17px] text-ink shadow-[var(--shadow-night-s)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[clamp(22px,2.4vw,30px)] font-[800] tracking-[-0.02em]">{m}</span>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex max-w-[38em] flex-col items-start gap-5">
            <p className="text-[17.5px] leading-relaxed text-cream-ink/85">
              Dietro ogni consulenza c&apos;è inoltre il confronto con un Team di professionisti e consulenti che condividono un
              metodo di lavoro comune. Quel Team ha un nome: TeamNutrizione.
            </p>
            <Link className="btn btn-cream" href={TEAM_HREF}>
              Scopri come lavorare con noi <ArrowIcon size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* TUTTI I MODI PER SCRIVERMI */}
      <section className="section" aria-labelledby="contact-title">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-8">
            <SectionHead
              id="contact-title"
              eyebrow="Tutti i modi per scrivermi"
              title="O semplicemente,"
              script="contattami."
              lead="Preferisci saltare il questionario? Scegli il canale che ti è più comodo. Rispondo entro 24–48 ore."
            />
            <ul className="grid gap-3 sm:grid-cols-2" data-reveal>
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noopener' } : {})}
                    className="slab slab-lift flex items-center gap-4 !rounded-[22px] px-5 py-4"
                  >
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${c.tone}`}>{c.icon}</span>
                    <span className="flex min-w-0 flex-col">
                      <b className="text-[16.5px] font-[750]">{c.label}</b>
                      <span className="truncate text-[14px] text-ink-mute">{c.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mx-auto w-[min(330px,80vw)]" data-reveal>
            <Polaroid
              src={consulenzaPhoto}
              alt="Andrea Bellettati seduto su una roccia con la sua bassotta, lungo un fiume di montagna"
              caption="pausa al fiume, con la bassotta"
              sizes="330px"
            />
          </div>
        </div>
      </section>
    </>
  );
}
