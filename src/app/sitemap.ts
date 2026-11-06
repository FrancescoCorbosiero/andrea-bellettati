import type { MetadataRoute } from 'next';
import { getArticles, getEvents } from '@/lib/content';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/consulenza-gratuita', '/approccio', '/chi-sono', '/servizi', '/lavora-con-noi', '/articoli', '/eventi', '/privacy'];
  const now = new Date();
  return [
    ...pages.map((p) => ({
      url: absoluteUrl(p),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: p === '/' ? 1 : p === '/consulenza-gratuita' ? 0.9 : p === '/privacy' ? 0.2 : 0.7,
    })),
    ...getArticles()
      .filter((a) => a.onSite)
      .map((a) => ({ url: absoluteUrl(`/articoli/${a.slug}`), lastModified: a.date, changeFrequency: 'yearly' as const, priority: 0.6 })),
    ...getEvents()
      .filter((e) => e.onSite)
      .map((e) => ({ url: absoluteUrl(`/eventi/${e.slug}`), lastModified: now, changeFrequency: 'weekly' as const, priority: 0.5 })),
  ];
}
