import type { MetadataRoute } from 'next';

/**
 * Manifest da web app: il sito si può già aggiungere alla schermata Home e
 * si apre a tutto schermo, come un'app. È il primo mattone dell'area
 * clienti futura (vedi docs/web-app.md).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Andrea Bellettati — Comportamento e nutrizione per cani e gatti',
    short_name: 'Andrea B.',
    description: 'Consulenza gratuita di 45 minuti, articoli ed eventi su alimentazione e comportamento di cani e gatti.',
    lang: 'it',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f1ebdf',
    theme_color: '#f1ebdf',
    categories: ['lifestyle', 'health', 'education'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Consulenza gratuita', short_name: 'Consulenza', url: '/consulenza-gratuita#questionario' },
      { name: 'Blog', url: '/articoli' },
      { name: 'Eventi', url: '/eventi' },
    ],
  };
}
