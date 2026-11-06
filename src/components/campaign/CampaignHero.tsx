import type { CSSProperties, ReactNode } from 'react';
import Image, { type StaticImageData } from 'next/image';

type Line = { text: string; face?: boolean; accent?: boolean };
type Chip = { icon: ReactNode; label: string; className: string; tone?: 'peach' | 'mist' };

const delay = (s: number) => ({ ['--d' as string]: `${s}s` }) as CSSProperties;

/**
 * L'hero delle pagine delle campagne: il titolo che sale riga per riga, la
 * foto da coccolare dentro il titolo (data-pet: scodinzola, cuori al tocco),
 * la sottolineatura a mano dell'ultima riga, le pillole che saltano fuori
 * dai bordi del questionario. Tutto CSS (globals.css, "Pagine delle
 * campagne"): parte subito, prima del motore, e con "riduci movimento" è fermo.
 * Sul telefono: il pitch, subito il questionario, poi `aside`.
 */
export default function CampaignHero({
  id,
  eyebrow,
  lines,
  titleClass,
  face,
  lead,
  chips,
  form,
  aside,
}: {
  id: string;
  eyebrow: ReactNode;
  lines: Line[];
  titleClass: string;
  face: { src: StaticImageData; position?: string };
  lead: ReactNode;
  chips: Chip[];
  form: ReactNode;
  aside: ReactNode;
}) {
  const step = 0.11;
  const faceAt = lines.length * step + 0.25;
  const accentAt = lines.findIndex((l) => l.accent) * step + 0.55;
  return (
    <section className="lp-hero pb-16 pt-2 lg:pb-24 lg:pt-8" aria-labelledby={id}>
      <div className="wrap grid items-start gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:grid-rows-[auto_1fr] lg:gap-x-16">
        <div className="flex flex-col items-start gap-5 lg:col-start-1 lg:row-start-1">
          <span className="eyebrow intro">{eyebrow}</span>
          <h1 id={id} className={titleClass}>
            {lines.map((l, i) => (
              <span
                key={l.text}
                className={`lp-line ${l.accent ? 'lp-accent text-peach-deep' : ''}`}
                style={l.accent ? ({ ['--draw-d' as string]: `${accentAt}s` } as CSSProperties) : undefined}
              >
                <span className="lp-mask">
                  <span className="lp-rise" style={delay(0.08 + i * step)}>
                    {l.text}
                  </span>
                </span>{' '}
                {l.face && (
                  <span className="lp-face" data-pet aria-hidden style={delay(faceAt)}>
                    <Image
                      src={face.src}
                      alt=""
                      sizes="160px"
                      priority
                      style={{ objectPosition: face.position ?? '50% 40%' }}
                    />
                    <i className="lp-heart" style={delay(faceAt)}>
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M12 21s-7.5-4.6-9.6-9.2C1 8.6 3 5 6.6 5c2.1 0 3.6 1.2 4.4 2.6h2C13.8 6.2 15.3 5 17.4 5 21 5 23 8.6 21.6 11.8 19.5 16.4 12 21 12 21z" />
                      </svg>
                    </i>
                  </span>
                )}
              </span>
            ))}
          </h1>
          <p className="lead intro max-w-[30em]" style={delay(0.5)}>
            {lead}
          </p>
        </div>

        <div id="questionario" className="intro relative lg:col-start-2 lg:row-span-2 lg:row-start-1" style={delay(0.3)}>
          {chips.map((c, i) => (
            <span
              key={c.label}
              aria-hidden
              className={`pill lp-chip ${c.tone === 'peach' ? 'pill-peach' : 'bg-white/90'} ${c.className}`}
              style={delay(1 + i * 0.18)}
            >
              {c.icon}
              {c.label}
            </span>
          ))}
          {form}
        </div>

        <div className="flex flex-col gap-8 lg:col-start-1 lg:row-start-2">{aside}</div>
      </div>
    </section>
  );
}
