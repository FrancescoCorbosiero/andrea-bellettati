/** Domande frequenti: <details> nativi, si aprono anche senza JavaScript
 *  (il motore li apre e chiude morbidi, data-accordion). */
export default function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="border-t border-ink/12" data-reveal>
      {items.map((f) => (
        <details key={f.q} className="faq group border-b border-ink/12" data-accordion>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-0.5 py-[22px] text-[clamp(20px,2.1vw,26px)] font-[750] leading-[1.15] tracking-[-0.025em] text-ink transition-colors hover:text-peach-deep [&::-webkit-details-marker]:hidden">
            <span>{f.q}</span>
            <i
              aria-hidden
              className="relative h-[42px] w-[42px] shrink-0 rounded-full border border-white/90 bg-white/75 shadow-[var(--shadow-glass-s)] transition-[rotate,background-color] duration-500 ease-[var(--ease-spring)] before:absolute before:left-1/2 before:top-1/2 before:h-[2.5px] before:w-[15px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded before:bg-ink after:absolute after:left-1/2 after:top-1/2 after:h-[15px] after:w-[2.5px] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded after:bg-ink group-open:rotate-45 group-open:bg-peach"
            />
          </summary>
          <div className="overflow-hidden" data-accordion-body>
            <p className="max-w-[60ch] px-0.5 pb-6 text-[17px] leading-relaxed text-ink-soft">{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
