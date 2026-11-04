import type { SVGProps } from 'react';

/* Icone del brand che non esistono in lucide (marchi, zampa) e la freccia
   di sempre. Tutte decorative: aria-hidden di default. */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function ArrowIcon({ size = 16, className = 'arrow', ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className} {...rest}>
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 18, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...rest}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.2 4.23-9.42 9.44-9.42 2.52 0 4.88.98 6.66 2.76a9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.23 9.42-9.43 9.42m8.02-17.44A11.27 11.27 0 0 0 12.04.75C5.8.75.72 5.82.72 12.06c0 2 .52 3.94 1.51 5.65L.62 23.25l5.67-1.49a11.3 11.3 0 0 0 5.75 1.47h.01c6.24 0 11.32-5.08 11.32-11.32 0-3.02-1.18-5.87-3.32-8.01" />
    </svg>
  );
}

export function InstagramIcon({ size = 18, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden {...rest}>
      <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17.4" cy="6.6" r="1.25" fill="currentColor" />
    </svg>
  );
}

/** La zampina del brand (stessa forma ovunque). */
export const PAW_ELLIPSES = [
  { cx: 12, cy: 15, rx: 4.3, ry: 5.8 },
  { cx: 21, cy: 10, rx: 4.3, ry: 6 },
  { cx: 30, cy: 11, rx: 4.3, ry: 6 },
  { cx: 38.5, cy: 16, rx: 4.3, ry: 5.6 },
  { cx: 25, cy: 29, rx: 9.5, ry: 8 },
] as const;

export function PawIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={(size * 44) / 50} viewBox="0 0 50 44" fill="currentColor" aria-hidden {...rest}>
      {PAW_ELLIPSES.map((e, i) => (
        <ellipse key={i} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} />
      ))}
    </svg>
  );
}

/** La sottolineatura disegnata a mano sotto le parole evidenziate. */
export function HandUnderline({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden className={className} {...rest}>
      <path d="M4 15c46-9 92-12 142-8s96 6 150-3" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" pathLength={1} />
    </svg>
  );
}
