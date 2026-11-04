import Image from 'next/image';
import Link from 'next/link';
import aboutPhoto from '@/assets/home-chi-sono.jpg';
import vanPhoto from '@/assets/home-approccio.jpg';
import { ArrowIcon } from '@/components/icons';
import CountUp from '@/components/ui/CountUp';
import Polaroid from '@/components/ui/Polaroid';
import { IG_URL, STATS } from '@/lib/site';

/** Chi sono: la persona dietro la consulenza, con i numeri. */
export default function About() {
  return (
    <section className="section overflow-hidden border-y border-ink/10 bg-sage-mist" aria-labelledby="about-title">
      <div className="wrap grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div className="relative mx-auto w-[min(82%,430px)]" data-reveal>
          <div className="aspect-[4/5] overflow-hidden rounded-[26px] border border-white/70 shadow-[0_0_0_7px_rgb(255_255_255/0.28),0_0_0_8px_rgb(255_255_255/0.5),var(--shadow-glass-xl)]">
            <Image src={aboutPhoto} alt="Andrea Bellettati al mare con i suoi due cani in braccio" sizes="(min-width: 1024px) 430px, 80vw" className="h-full w-full object-cover" />
          </div>
          <Polaroid src={vanPhoto} alt="Andrea con il furgone aperto e i cani, pronti a partire in montagna" caption="si parte!" sizes="220px" className="!absolute -bottom-[9%] -right-[16%] w-1/2 !pb-10 !p-2.5" />
        </div>
        <div className="flex flex-col items-start gap-5">
          <span className="eyebrow">Chi sono</span>
          <h2 id="about-title" className="display-lg">
            Ciao, sono <span className="script">Andrea.</span>
          </h2>
          <p className="lead max-w-[30em]">
            Mi occupo di comportamento e nutrizione per cani e gatti. Da anni studio il legame tra quello che mangiano e come
            si comportano.
          </p>
          <p className="max-w-[36em] text-[17.5px] leading-relaxed text-ink-soft">
            Dal {STATS.teamSince} collaboro con un team di professionisti per portare consapevolezza su un tema ancora
            sottovalutato. Nutrirli bene, insieme a una corretta educazione, è la forma più grande di cura.
          </p>
          <ul className="mt-1 grid w-full grid-cols-3 gap-3.5 border-t border-ink/15 pt-6" data-reveal>
            {[
              { n: <CountUp to={STATS.teamSince} from={2000} plain />, l: 'inizio nel team' },
              { n: <CountUp to={STATS.posts} />, l: 'contenuti pubblicati' },
              { n: <CountUp to={STATS.followers} />, l: 'persone mi seguono' },
            ].map((s) => (
              <li key={s.l} className="flex flex-col gap-1.5">
                <b className="font-[family-name:var(--font-poster)] text-[clamp(38px,4.4vw,60px)] font-normal leading-[0.9] text-peach-deep">{s.n}</b>
                <span className="text-[14.5px] font-[650] leading-tight text-ink-mute">{s.l}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link className="btn" href="/chi-sono">
              Conosci la mia storia <ArrowIcon size={15} />
            </Link>
            <a className="text-link" href={IG_URL} target="_blank" rel="noopener">
              Seguimi su Instagram <ArrowIcon size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
