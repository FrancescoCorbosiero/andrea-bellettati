import type { ReactNode } from 'react';
import { WhatsAppIcon } from '@/components/icons';
import Logo from '@/components/layout/Logo';
import { SITE_NAME, waLink } from '@/lib/site';

/**
 * Le pagine delle campagne (annunci, link in bio, QR): niente menu, niente
 * piè di pagina pieno di link, niente barra in basso. Chi arriva da un
 * annuncio ha una cosa sola da fare, il questionario; WhatsApp resta come
 * strada breve per chi preferisce scrivere.
 */
export default function CampaignLayout({ children }: { children: ReactNode }) {
  return (
    <div data-campaign>
      <header className="wrap flex h-[68px] items-center justify-between gap-4 lg:h-[80px]">
        <Logo link={false} />
        <a
          className="icon-btn"
          href={waLink('Ciao Andrea! Ti scrivo dal sito.')}
          target="_blank"
          rel="noopener"
          aria-label="Scrivi ad Andrea su WhatsApp"
        >
          <WhatsAppIcon size={18} />
        </a>
      </header>
      <main id="contenuto">{children}</main>
      <footer className="wrap border-t border-ink/10 pb-32 pt-8 text-[13.5px] leading-relaxed text-ink-mute lg:pb-10">
        © {new Date().getFullYear()} {SITE_NAME} · Comunicazione Cinofila. Il veterinario resta il riferimento per diagnosi e
        terapie.
      </footer>
    </div>
  );
}
