import { getArticles } from '@/lib/content';
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from '@/lib/site';

/* Feed RSS del blog, generato al build. */
export const dynamic = 'force-static';

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);

export function GET() {
  const items = getArticles()
    .filter((a) => a.onSite)
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${absoluteUrl(`/articoli/${a.slug}`)}</link>
      <guid>${absoluteUrl(`/articoli/${a.slug}`)}</guid>
      <pubDate>${a.date.toUTCString()}</pubDate>
      <category>${esc(a.category)}</category>
      <description>${esc(a.excerpt)}</description>
    </item>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)} — Blog</title>
    <link>${absoluteUrl('/articoli')}</link>
    <atom:link href="${absoluteUrl('/rss.xml')}" rel="self" type="application/rss+xml" />
    <description>${esc(SITE_DESCRIPTION)}</description>
    <language>it-it</language>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
