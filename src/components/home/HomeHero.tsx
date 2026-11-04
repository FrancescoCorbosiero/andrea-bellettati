import Image from 'next/image';
import Link from 'next/link';
import heroPortrait from '@/assets/home-hero.jpg';
import bowl from '@/assets/home-ciotola.jpg';
import { ArrowIcon, HandUnderline } from '@/components/icons';
import { CONSULENZA_HREF, TEAM_HREF } from '@/lib/site';

const FACTS = ['45 minuti al telefono', 'Piano scritto e firmato', 'Senza impegno'];

/**
 * Hero: marrone pieno con una luce calda dietro le foto. A destra la foto
 * di Andrea in una cornice di vetro chiaro e, davanti, la ciotola. Le due
 * strade del sito (consulenza, Team) subito in vista.
 */
export default function HomeHero() {
  return (
    <section
      className="on-dark relative overflow-hidden"
      aria-labelledby="hero-title"
      style={{
        background:
          'radial-gradient(48% 62% at 76% 42%, rgb(244 169 138 / 0.3), rgb(244 169 138 / 0) 72%), radial-gradient(38% 52% at 6% 100%, rgb(201 169 106 / 0.2), rgb(201 169 106 / 0) 70%), radial-gradient(30% 40% at 100% 0%, rgb(255 255 255 / 0.07), rgb(255 255 255 / 0) 70%), var(--color-bark)',
      }}
    >
      <div className="wrap grid items-center gap-12 pb-20 pt-8 lg:min-h-[calc(100svh-72px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-16">
        <div className="relative z-10 flex flex-col items-start gap-6">
          <span className="eyebrow intro" style={{ ['--d' as string]: '0.05s' }}>
            Nutrizione e comportamento · cane e gatto
          </span>
          <h1 id="hero-title" className="text-[clamp(56px,13.6vw,104px)] leading-[0.9] lg:text-[clamp(64px,6vw,96px)]">
            <span className="intro block" style={{ ['--d' as string]: '0.15s' }}>
              Il cibo è il
            </span>
            <span className="intro relative block w-fit text-peach" style={{ ['--d' as string]: '0.3s' }}>
              primo passo.
              <HandUnderline className="draw absolute -bottom-[0.2em] left-[-1%] h-[0.28em] w-[102%] overflow-visible text-peach-soft" />
            </span>
          </h1>
          <p className="lead intro max-w-[30em]" style={{ ['--d' as string]: '0.55s' }}>
            Ti aiuto a capire cosa mettere nella ciotola del tuo cane e del tuo gatto, e come questo cambia il loro
            comportamento. Sempre al fianco del tuo veterinario.
          </p>
          <div className="intro flex flex-wrap gap-3" style={{ ['--d' as string]: '0.7s' }}>
            <Link className="btn btn-lg" href={CONSULENZA_HREF}>
              Prenota la consulenza gratuita <ArrowIcon size={16} />
            </Link>
            <Link className="btn btn-ghost btn-lg" href={TEAM_HREF}>
              Lavora con noi
            </Link>
          </div>
          <ul className="intro flex flex-wrap gap-x-5 gap-y-2" style={{ ['--d' as string]: '0.85s' }}>
            {FACTS.map((f) => (
              <li key={f} className="inline-flex items-center gap-2 text-[14.5px] font-[650] text-cream-ink/85">
                <span
                  aria-hidden
                  className="h-[18px] w-[18px] shrink-0 rounded-full border border-white/70 bg-peach bg-[length:11px] bg-center bg-no-repeat shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_3px_8px_-3px_rgb(0_0_0/0.4)]"
                  style={{ backgroundImage: 'var(--tick)' }}
                />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-0 mx-auto aspect-[1/0.98] w-full max-w-[480px] lg:max-w-[520px]">
          {/* La cornice: una lastra di vetro chiaro, la luce entra dall'alto a
              sinistra e si accende di pesca nell'angolo opposto. */}
          <div
            data-speed="0.08"
            className="intro-photo absolute right-0 top-0 aspect-square w-[86%] rounded-[28px] border border-white/55"
            style={{
              ['--d' as string]: '0.2s',
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
              <Image
                src={heroPortrait}
                alt="Andrea Bellettati con la sua bassotta in braccio"
                fill
                sizes="(min-width: 1024px) 420px, 76vw"
                priority
                className="object-cover object-[42%_28%]"
              />
            </div>
          </div>
          <div
            data-speed="-0.05"
            className="intro-photo absolute -bottom-[2%] -left-[2%] z-10 aspect-square w-[44%] overflow-hidden rounded-2xl border border-white/60 shadow-[0_0_0_7px_rgb(255_255_255/0.12),0_0_0_8px_rgb(255_255_255/0.22),0_36px_64px_-24px_rgb(0_0_0/0.72),0_8px_18px_-8px_rgb(0_0_0/0.4)]"
            style={{ ['--d' as string]: '0.6s' }}
          >
            <Image src={bowl} alt="" fill sizes="(min-width: 1024px) 230px, 40vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
