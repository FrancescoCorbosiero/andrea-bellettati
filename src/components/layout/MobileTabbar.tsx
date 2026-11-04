'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabbar, TabbarLink, ToolbarPane } from 'konsta/react';
import { BookOpen, Compass, House, LayoutGrid, PawPrint } from 'lucide-react';
import { useApp } from '@/components/app/AppProvider';
import { CONSULENZA_HREF } from '@/lib/site';

/**
 * Telefono e tablet: la barra di un'app, di vetro, sempre a portata di
 * pollice. Home, Approccio, Blog, il questionario al centro (si apre come
 * foglio sopra la pagina) e "Menu" per tutto il resto.
 */
export default function MobileTabbar() {
  const pathname = usePathname();
  const { openMenu, menuOpen, consultOpen } = useApp();
  const on = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const nothingOpen = !menuOpen && !consultOpen;

  return (
    <div className="lg:hidden">
      {/* Sotto la capsula, una velatura sabbia leggera al posto del bianco di iOS. */}
      <Tabbar
        labels
        icons
        className="fixed bottom-0 left-0 z-40"
        colors={{ bgIos: 'bg-gradient-to-t from-cream/70 to-transparent' }}
        aria-label="Navigazione"
      >
        <ToolbarPane>
        <TabbarLink
          component={Link}
          linkProps={{ href: '/' }}
          active={nothingOpen && on('/')}
          icon={<House size={24} strokeWidth={1.9} aria-hidden />}
          label="Home"
        />
        <TabbarLink
          component={Link}
          linkProps={{ href: '/approccio' }}
          active={nothingOpen && on('/approccio')}
          icon={<Compass size={24} strokeWidth={1.9} aria-hidden />}
          label="Approccio"
        />
        <TabbarLink
          linkProps={{ href: CONSULENZA_HREF }}
          active={consultOpen || (nothingOpen && on('/consulenza-gratuita'))}
          icon={<PawPrint size={24} strokeWidth={1.9} aria-hidden />}
          label="Consulenza"
        />
        <TabbarLink
          component={Link}
          linkProps={{ href: '/articoli' }}
          active={nothingOpen && on('/articoli')}
          icon={<BookOpen size={24} strokeWidth={1.9} aria-hidden />}
          label="Blog"
        />
        <TabbarLink
          component="button"
          linkProps={{ type: 'button' }}
          onClick={openMenu}
          active={menuOpen}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          icon={<LayoutGrid size={24} strokeWidth={1.9} aria-hidden />}
          label="Menu"
        />
        </ToolbarPane>
      </Tabbar>
    </div>
  );
}
