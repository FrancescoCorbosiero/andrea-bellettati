import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/logo.jpg';

/** Il marchio: la foto di Andrea nel tondo e il nome in Anton. */
export default function Logo({ tone = 'ink', size = 42 }: { tone?: 'ink' | 'cream'; size?: number }) {
  return (
    <Link href="/" className="group inline-flex min-w-0 items-center gap-3" aria-label="Andrea Bellettati, torna alla home">
      <span
        className="relative shrink-0 overflow-hidden rounded-full border border-white/90 bg-paper p-0.5 shadow-[var(--shadow-glass-s)] transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <Image src={logo} alt="" width={size * 2} height={size * 2} className="h-full w-full rounded-full object-cover" priority />
      </span>
      <span
        className={`truncate font-[family-name:var(--font-poster)] text-[19px] uppercase leading-none tracking-[0.02em] ${
          tone === 'cream' ? 'text-cream-ink' : 'text-ink'
        }`}
      >
        Andrea Bellettati
      </span>
    </Link>
  );
}
