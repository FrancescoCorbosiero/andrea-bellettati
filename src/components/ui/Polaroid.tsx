import Image, { type StaticImageData } from 'next/image';

/** Polaroid: cornice bianca di vetro latte, didascalia scritta a mano. */
export default function Polaroid({
  src,
  alt,
  caption,
  sizes = '300px',
  className = '',
}: {
  src: StaticImageData;
  alt: string;
  caption: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure
      className={`relative m-0 rounded-[8px] border border-white bg-white/90 p-3 pb-12 shadow-[var(--shadow-glass-l)] ${className}`}
      style={{ WebkitBackdropFilter: 'blur(18px) saturate(1.6)', backdropFilter: 'blur(18px) saturate(1.6)' }}
    >
      <Image src={src} alt={alt} sizes={sizes} className="aspect-[4/5] h-auto w-full rounded-[3px] object-cover" />
      <figcaption className="absolute inset-x-0 bottom-2.5 text-center font-[family-name:var(--font-script)] text-[25px] leading-none text-ink">
        {caption}
      </figcaption>
    </figure>
  );
}
