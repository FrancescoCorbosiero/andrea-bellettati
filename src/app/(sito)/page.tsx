import consulenzaPhoto from '@/assets/consulenza.jpg';
import About from '@/components/home/About';
import Doors from '@/components/home/Doors';
import HomeHero from '@/components/home/HomeHero';
import { BlogGrid, Faq, InstagramRow, NextEvent, faqLd } from '@/components/home/HomeExtras';
import HowRail from '@/components/home/HowRail';
import Statement from '@/components/home/Statement';
import Stories from '@/components/home/Stories';
import JsonLd from '@/components/seo/JsonLd';
import CtaBand from '@/components/ui/CtaBand';
import { getArticles, nextEvent } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import { SITE_DESCRIPTION } from '@/lib/site';

/** Il prossimo incontro cambia con le date: rigenerata ogni 12 ore. */
export const revalidate = 43200;

export const metadata = pageMetadata({
  title: { absolute: 'Andrea Bellettati — Comportamento e nutrizione per cani e gatti' },
  description: SITE_DESCRIPTION,
  path: '/',
  image: consulenzaPhoto.src,
  imageAlt: 'Andrea Bellettati seduto su una roccia con la sua bassotta, lungo un fiume di montagna',
});

/**
 * Home: un compito solo, portare alla consulenza gratuita (e chi vuole
 * lavorare nel Team al colloquio). Promessa → le due porte → chi sono →
 * come ragiono → come funziona → storie → Instagram → prossimo incontro →
 * blog → dubbi → di nuovo i due flussi.
 */
export default function HomePage() {
  const articles = getArticles();
  const onSite = articles.filter((a) => a.onSite);
  const event = nextEvent();
  return (
    <>
      <HomeHero />
      <Doors articleCount={articles.filter((a) => a.status === 'published').length} />
      <About />
      <Statement />
      <HowRail />
      <Stories />
      <InstagramRow />
      {event && <NextEvent event={event} />}
      {onSite.length > 0 && <BlogGrid articles={onSite.slice(0, 3)} total={articles.filter((a) => a.status === 'published').length} />}
      <Faq />
      <CtaBand />
      <JsonLd data={faqLd} />
    </>
  );
}
