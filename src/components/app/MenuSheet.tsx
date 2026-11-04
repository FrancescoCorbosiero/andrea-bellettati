'use client';

import { NextLinkTag } from '@/lib/konsta';
import { Sheet } from 'react-modal-sheet';
import { BlockTitle, List, ListItem } from 'konsta/react';
import { BookOpen, CalendarDays, Compass, HandHeart, Mail, Phone, Sparkles, UserRound, UsersRound } from 'lucide-react';
import { InstagramIcon, PawIcon, WhatsAppIcon } from '@/components/icons';
import { useReducedMotion } from '@/lib/hooks';
import { CONSULENZA_HREF, EMAIL, IG_HANDLE, IG_URL, PHONE, PHONE_DISPLAY, TEAM_HREF, waLink } from '@/lib/site';

const PAGES = [
  { href: '/approccio', title: 'Il mio approccio', subtitle: 'Non parto dal prodotto, parto dall’animale', icon: Compass },
  { href: '/chi-sono', title: 'Chi sono', subtitle: 'La mia storia, dal primo cane a un metodo', icon: UserRound },
  { href: '/servizi', title: 'Servizi', subtitle: 'Consulenze, percorsi e monitoraggio', icon: Sparkles },
  { href: '/articoli', title: 'Blog', subtitle: 'Alimentazione e comportamento, senza slogan', icon: BookOpen },
  { href: '/eventi', title: 'Eventi e webinar', subtitle: 'Gli incontri dal vivo e online', icon: CalendarDays },
] as const;

const media = (Icon: typeof Compass) => (
  <span className="grid h-9 w-9 place-items-center rounded-full bg-sage-mist text-olive">
    <Icon size={18} strokeWidth={1.9} aria-hidden />
  </span>
);

/** "Tutto il sito" su telefono: un foglio con le pagine e i contatti. */
export default function MenuSheet({ open, onClose, onNavigate }: { open: boolean; onClose: () => void; onNavigate: () => void }) {
  const reduced = useReducedMotion();
  return (
    <Sheet isOpen={open} onClose={onClose} detent="content" prefersReducedMotion={reduced}>
      <Sheet.Container className="flow-sheet k-ios" role="dialog" aria-modal="true" aria-label="Menu">
        <Sheet.Header>
          <div className="flex justify-center pt-2">
            <Sheet.DragIndicator />
          </div>
        </Sheet.Header>
        <Sheet.Content scrollClassName="overscroll-contain">
          <div className="px-1 pb-[calc(env(safe-area-inset-bottom)+20px)]">
            <BlockTitle>Inizia da qui</BlockTitle>
            <List strong inset>
              <ListItem
                link
                href={CONSULENZA_HREF}
                linkProps={{ onClick: onNavigate }}
                title="Consulenza gratuita"
                subtitle="45 minuti al telefono, senza impegno"
                media={
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-peach text-ink">
                    <PawIcon size={18} />
                  </span>
                }
              />
              <ListItem
                link
                linkComponent={NextLinkTag}
                href={TEAM_HREF}
                title="Lavora con noi"
                subtitle="Entra nel Team di TeamNutrizione"
                media={media(UsersRound)}
                linkProps={{ onClick: onNavigate }}
              />
            </List>

            <BlockTitle>Il sito</BlockTitle>
            <List strong inset>
              {PAGES.map((p) => (
                <ListItem
                  key={p.href}
                  link
                  linkComponent={NextLinkTag}
                  href={p.href}
                  title={p.title}
                  subtitle={p.subtitle}
                  media={media(p.icon)}
                  linkProps={{ onClick: onNavigate }}
                />
              ))}
            </List>

            <BlockTitle>Scrivimi</BlockTitle>
            <List strong inset>
              <ListItem
                link
                href={waLink('Ciao Andrea! Ti scrivo dal sito.')}
                target="_blank"
                title="WhatsApp"
                after={PHONE_DISPLAY}
                media={
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#25d366] text-white">
                    <WhatsAppIcon size={18} />
                  </span>
                }
              />
              <ListItem link href={`tel:${PHONE}`} title="Telefono" after={PHONE_DISPLAY} media={media(Phone)} />
              <ListItem link href={`mailto:${EMAIL}`} title="Email" after="Scrivimi" media={media(Mail)} />
              <ListItem
                link
                href={IG_URL}
                target="_blank"
                title="Instagram"
                after={IG_HANDLE}
                media={
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-sage-mist text-olive">
                    <InstagramIcon size={18} />
                  </span>
                }
              />
            </List>
            <p className="flex items-center justify-center gap-2 px-6 pt-2 text-center text-[13px] text-ink-mute">
              <HandHeart size={15} aria-hidden /> Sempre al fianco del tuo veterinario
            </p>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} className="!bg-ink/45" />
    </Sheet>
  );
}
