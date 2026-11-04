import type { Metadata, Viewport } from 'next';
import './globals.css';
import { fontVariables } from './fonts';
import { AppProvider } from '@/components/app/AppProvider';
import RevealObserver from '@/components/app/RevealObserver';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import MobileTabbar from '@/components/layout/MobileTabbar';
import JsonLd from '@/components/seo/JsonLd';
import { siteGraph } from '@/lib/seo';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Andrea Bellettati — Comportamento e nutrizione per cani e gatti',
    template: '%s · Andrea Bellettati',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: { type: 'website', locale: 'it_IT', siteName: SITE_NAME },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/', types: { 'application/rss+xml': '/rss.xml' } },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icons/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: { capable: true, title: 'Andrea B.', statusBarStyle: 'default' },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined },
};

export const viewport: Viewport = {
  themeColor: '#f1ebdf',
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={fontVariables} data-scroll-behavior="smooth">
      <body className="k-ios min-h-dvh">
        <a
          href="#contenuto"
          className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-cream-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
        >
          Salta al contenuto
        </a>
        <AppProvider>
          <SiteHeader />
          <main id="contenuto">{children}</main>
          <SiteFooter />
          <MobileTabbar />
        </AppProvider>
        <RevealObserver />
        <JsonLd data={siteGraph()} />
      </body>
    </html>
  );
}
