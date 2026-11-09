import Script from 'next/script';

// Il badge è un Web Component di alpacode.it: React lo passa così com'è.
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'alpacode-badge': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        lang?: string;
        theme?: 'light' | 'dark' | 'auto';
        compact?: boolean | '';
      };
    }
  }
}

/**
 * Il credito «Realizzato da Alpacode» in fondo al piè di pagina. Il link
 * dentro sta nell'HTML del server: è quello che leggono i motori e che resta
 * se lo script non arriva. Lo script si carica a pagina ferma (lazyOnload),
 * una volta sola anche se il badge compare più volte.
 */
export default function AlpacodeBadge({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <>
      <alpacode-badge lang="it" theme={theme}>
        <a href="https://alpacode.it/">Realizzato da Alpacode</a>
      </alpacode-badge>
      <Script id="alpacode-badge" src="https://alpacode.it/badge.js" strategy="lazyOnload" />
    </>
  );
}
