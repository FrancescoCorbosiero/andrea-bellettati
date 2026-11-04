import type { ReactNode } from 'react';

/**
 * Testata di sezione: l'etichetta di vetro con la zampina, il titolo in
 * Anton (con la parola a mano in `script`) e, se serve, un sottotitolo.
 */
export default function SectionHead({
  eyebrow,
  title,
  script,
  lead,
  id,
  size = 'lg',
  align = 'left',
  className = '',
  as: Tag = 'h2',
  split = true,
}: {
  eyebrow: string;
  title: ReactNode;
  /** La parola scritta a mano alla fine del titolo. */
  script?: string;
  lead?: ReactNode;
  id?: string;
  size?: 'xl' | 'lg' | 'md';
  align?: 'left' | 'center';
  className?: string;
  as?: 'h1' | 'h2';
  /** Come entra il titolo (data-split del motore): a turno, una variante, o fermo. */
  split?: boolean | 'lines' | 'pop' | 'wipe' | 'blur';
}) {
  return (
    <div className={`flex flex-col gap-4 ${align === 'center' ? 'items-center text-center' : 'items-start'} ${className}`}>
      <span className="eyebrow">{eyebrow}</span>
      <Tag id={id} className={`display-${size}`} data-split={split === false ? undefined : split === true ? '' : split}>
        {title}
        {script && (
          <>
            {' '}
            <span className="script">{script}</span>
          </>
        )}
      </Tag>
      {lead && <p className={`lead max-w-[36em] ${align === 'center' ? 'mx-auto' : ''}`}>{lead}</p>}
    </div>
  );
}
