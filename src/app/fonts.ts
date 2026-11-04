import localFont from 'next/font/local';

/**
 * Font self-hosted (nessuna richiesta a Google dal browser):
 *  · Bricolage Grotesque — testo e titoli piccoli, un solo file variabile;
 *  · Anton — titoli grandi e numeri, da manifesto;
 *  · Caveat — le note scritte a mano.
 */
export const bricolage = localFont({
  src: '../fonts/bricolage-grotesque-latin-opsz.woff2',
  weight: '200 800',
  style: 'normal',
  variable: '--font-bricolage',
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

export const anton = localFont({
  src: '../fonts/anton-400.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-anton',
  display: 'swap',
  fallback: ['Arial Narrow', 'Arial', 'sans-serif'],
});

export const caveat = localFont({
  src: '../fonts/caveat-600.woff2',
  weight: '600',
  style: 'normal',
  variable: '--font-caveat',
  display: 'swap',
  fallback: ['cursive'],
});

export const fontVariables = `${bricolage.variable} ${anton.variable} ${caveat.variable}`;
