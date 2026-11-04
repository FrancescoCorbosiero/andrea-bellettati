'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowIcon, InstagramIcon, WhatsAppIcon } from '@/components/icons';
import { CONSULENZA_HREF, IG_URL, NAV, TEAM_HREF, waLink } from '@/lib/site';
import Logo from './Logo';

/**
 * Header di vetro. Desktop: marchio, voci, social e i due flussi sempre in
 * vista. Telefono: marchio e WhatsApp; il resto vive nella barra in basso
 * (MobileTabbar), come in un'app.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Leggendo verso il basso l'header si toglie di mezzo; risalendo torna.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y > 260 && y > lastY + 4) setHidden(true);
      else if (y < lastY - 4 || y <= 260) setHidden(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      // Il focus da tastiera lo riporta sempre in vista.
      onFocusCapture={() => setHidden(false)}
      className={`site-header sticky top-0 z-50 border-b ${hidden ? 'is-hidden' : ''} ${
        scrolled
          ? 'border-white/70 bg-cream/80 shadow-[0_10px_30px_-22px_rgb(31_40_24/0.55)]'
          : 'border-transparent bg-cream/70'
      }`}
      style={{ WebkitBackdropFilter: 'blur(20px) saturate(1.7)', backdropFilter: 'blur(20px) saturate(1.7)' }}
    >
      <div className="wrap flex h-[66px] items-center justify-between gap-4 lg:h-[72px]">
        <Logo />

        <nav aria-label="Principale" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`rounded-full px-3.5 py-2 text-[15px] font-[650] transition-colors ${
                isActive(item.href) ? 'bg-ink text-cream-ink' : 'text-ink hover:bg-white/70'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a className="icon-btn hidden lg:inline-grid" href={IG_URL} target="_blank" rel="noopener" aria-label="Instagram di Andrea">
            <InstagramIcon size={18} />
          </a>
          <a
            className="icon-btn"
            href={waLink('Ciao Andrea! Ti scrivo dal sito.')}
            target="_blank"
            rel="noopener"
            aria-label="Scrivi ad Andrea su WhatsApp"
          >
            <WhatsAppIcon size={18} />
          </a>
          <Link className="btn btn-ghost btn-sm hidden xl:inline-flex" href={TEAM_HREF}>
            Lavora con noi
          </Link>
          <Link className="btn btn-sm hidden sm:inline-flex" href={CONSULENZA_HREF}>
            Consulenza gratuita <ArrowIcon size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}
