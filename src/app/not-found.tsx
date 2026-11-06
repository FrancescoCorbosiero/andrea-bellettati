import Logo from '@/components/layout/Logo';
import NotFoundContent from '@/components/layout/NotFoundContent';

export const metadata = { title: 'Pagina non trovata' };

/**
 * 404 per gli indirizzi che non esistono. Sta fuori dai gruppi, quindi senza
 * header e piè di pagina del sito: solo il marchio. Next la mette nei dati di
 * ogni pagina, anche delle campagne: deve restare leggera.
 */
export default function NotFound() {
  return (
    <>
      <header className="wrap flex h-[68px] items-center lg:h-[80px]">
        <Logo />
      </header>
      <main id="contenuto">
        <NotFoundContent />
      </main>
    </>
  );
}
