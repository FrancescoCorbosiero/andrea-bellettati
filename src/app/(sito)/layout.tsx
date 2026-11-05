import type { ReactNode } from 'react';
import MobileTabbar from '@/components/layout/MobileTabbar';
import SiteFooter from '@/components/layout/SiteFooter';
import SiteHeader from '@/components/layout/SiteHeader';

/** Le pagine del sito: header, menu, piè di pagina e barra in basso. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="contenuto">{children}</main>
      <SiteFooter />
      <MobileTabbar />
    </>
  );
}
