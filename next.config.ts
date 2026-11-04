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
