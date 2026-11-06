import NotFoundContent from '@/components/layout/NotFoundContent';

export const metadata = { title: 'Pagina non trovata' };

/** 404 dentro il sito (un articolo o un evento che non c'è): con header e piè di pagina. */
export default function NotFound() {
  return <NotFoundContent />;
}
