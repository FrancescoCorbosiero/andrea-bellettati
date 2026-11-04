import type { Metadata } from 'next';
import { EMAIL, IG_URL, PHONE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from './site';

/** Grafo base presente in ogni pagina: sito, persona, attività. */
export function siteGraph(): Record<string, unknown>[] {
  return [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: 'it-IT',
      publisher: { '@id': `${SITE_URL}/#andrea` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#andrea`,
      name: 'Andrea Bellettati',
      jobTitle: 'Consulente in comportamento e nutrizione per cani e gatti',
      url: SITE_URL,
      image: absoluteUrl('/icons/icon-512.png'),
      sameAs: [IG_URL],
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#servizio`,
      name: `${SITE_NAME} · Comunicazione Cinofila`,
      description: SITE_DESCRIPTION,
      image: absoluteUrl('/icons/icon-512.png'),
      url: SITE_URL,
      email: EMAIL,
      telephone: PHONE,
      areaServed: 'IT',
      priceRange: 'Consulenza gratuita',
      founder: { '@id': `${SITE_URL}/#andrea` },
      sameAs: [IG_URL],
      knowsAbout: [
        'Alimentazione naturale per cani e gatti',
        'Comportamento animale',
        'Lettura delle etichette del pet food',
        'Benessere di cani e gatti',
      ],
    },
  ];
}

export function breadcrumbLd(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

/** Metadata di una pagina: titolo, descrizione, canonical e anteprima social. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  type = 'website',
}: {
  title: string | { absolute: string };
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
}): Metadata {
  const plain = typeof title === 'string' ? title : title.absolute;
  const images = image ? [{ url: image, alt: imageAlt ?? plain }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, title: plain, description, images, locale: 'it_IT', siteName: SITE_NAME },
    twitter: { card: 'summary_large_image', title: plain, description, images: image ? [image] : undefined },
  };
}
