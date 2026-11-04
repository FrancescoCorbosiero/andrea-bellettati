import Link from 'next/link';
import bowls from '@/assets/hero.jpg';
import { ArrowIcon } from '@/components/icons';
import Polaroid from '@/components/ui/Polaroid';
import ScrubText from '@/components/ui/ScrubText';

const VALUES = ['Concretezza', 'Vicinanza', 'Scienza semplice', 'Rispetto'];

/** L'approccio: la frase che si accende con lo scroll, sul verde notte. */
export default function Statement() {
  return (
    <section
      className="on-dark relative overflow-hidden py-[clamp(84px,12vh,150px)]"
      aria-labelledby="st-title"
      style={{
        background:
          'radial-gradient(50% 70% at 92% 8%, rgb(111 139 96 / 0.3), rgb(111 139 96 / 0) 70%), radial-gradient(40% 60% at 0% 100%, rgb(244 169 138 / 0.1), rgb(244 169 138 / 0) 70%), var(--color-deep)',
      }}
    >
      <div className="wrap">
        <span className="eyebrow">L&apos;approccio</span>
        <ScrubText
          id="st-title"
          text="Non parto dal prodotto. Parto dall'animale. Alimentazione, comportamento e stile di vita fanno parte dello stesso equilibrio."
          className="mt-6 max-w-[14.5em] font-[family-name:var(--font-sans)] text-[clamp(34px,4.8vw,72px)] font-[800] normal-case leading-[0.98] tracking-[-0.04em] text-cream-ink"
        />
        <div className="mt-[clamp(44px,6vw,80px)] grid items-center gap-10 lg:ml-auto lg:max-w-[920px] lg:grid-cols-[300px_1fr]">
          <div className="mx-auto w-[min(300px,78%)]" data-reveal>
            <Polaroid src={bowls} alt="Quattro ciotole con carne, verdure e crocchette: una razione preparata con cura" caption="cosa c'è nella ciotola" />
          </div>
          <div className="flex max-w-[36em] flex-col gap-4" data-reveal style={{ ['--d' as string]: '0.1s' }}>
            <p className="text-[18px] leading-relaxed text-cream-ink/85">
              Il mio lavoro è osservare il soggetto nella sua globalità e costruire un percorso sostenibile per lui e per la
              sua famiglia.
            </p>
            <p className="text-[18px] leading-relaxed text-cream-ink/85">
              <strong className="font-[750] text-cream-ink">Lavoro al fianco del tuo veterinario, mai al suo posto.</strong> E una
              dieta perfetta sulla carta non serve a nulla, se non entra nella vita di tutti i giorni.
            </p>
            <ul className="mt-1 flex flex-wrap gap-2" aria-label="I miei valori">
              {VALUES.map((v) => (
                <li
                  key={v}
                  className="rounded-full border border-white/25 bg-white/[0.06] px-3.5 py-2 text-[14px] font-[650] shadow-[inset_0_1px_0_rgb(255_255_255/0.16)]"
                >
                  {v}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link className="btn btn-cream" href="/approccio">
                Scopri il mio approccio <ArrowIcon size={15} />
              </Link>
              <Link className="btn btn-ghost" href="/servizi">
                I servizi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
