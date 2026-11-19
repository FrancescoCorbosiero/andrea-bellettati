import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Server autonomo in .next/standalone: l'immagine Docker esegue `node server.js`
  // senza tutto node_modules (vedi Dockerfile).
  output: 'standalone',
  poweredByHeader: false,
  // Niente badge di sviluppo sopra la pagina (screenshot puliti).
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Indirizzi corti e articoli nascosti (hidden: true) che portano altrove.
  async redirects() {
    return [
      // L'URL corto dell'articolo, da usare nei post e nei messaggi.
      { source: '/il-mio-barboncino-non-mangia', destination: '/articoli/il-mio-barboncino-non-mangia', permanent: true },
      // Articoli nascosti sull'inappetenza: chi arriva da un vecchio link trova quello nuovo.
      // Temporanei (307): se un giorno tornano visibili, basta togliere la riga.
      { source: '/articoli/wurstel-al-cane-inappetenza', destination: '/articoli/il-mio-barboncino-non-mangia', permanent: false },
      { source: '/articoli/il-cane-mangia-solo-se-aggiungo-qualcosa', destination: '/articoli/il-mio-barboncino-non-mangia', permanent: false },
    ];
  },
  // Intestazioni di sicurezza leggere per ogni risposta. HSTS lo mette Caddy,
  // che termina il TLS; niente CSP per non rompere JSON-LD e stili inline.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
