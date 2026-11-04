'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sheet } from 'react-modal-sheet';
import { useMediaQuery, useReducedMotion } from '@/lib/hooks';
import type { ConsultDraft } from '@/lib/forms';
import ConsultFlow from './ConsultFlow';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])';

/** Tab e Maiusc+Tab restano dentro il foglio aperto. */
function trapTab(e: KeyboardEvent, container: HTMLElement | null) {
  if (e.key !== 'Tab' || !container) return;
  const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0]!;
  const last = items[items.length - 1]!;
  const active = document.activeElement;
  if (!container.contains(active)) {
    e.preventDefault();
    first.focus();
  } else if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}

/** Esc chiude, Tab resta dentro, il focus torna a chi ha aperto. */
function useDialogKeys(open: boolean, onClose: () => void, container: React.RefObject<HTMLElement | null>) {
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else trapTab(e, container.current);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
    };
  }, [open, onClose, container]);
}

/**
 * Il questionario sopra qualsiasi pagina: un foglio a tutta altezza dal
 * basso su telefono e tablet (si chiude trascinando giù, rispetta la
 * tastiera), un pannello di vetro a destra sul desktop.
 */
export default function ConsultOverlay({
  open,
  session,
  handoff,
  onClose,
}: {
  open: boolean;
  session: number;
  handoff: Partial<ConsultDraft>;
  onClose: () => void;
}) {
  const desktop = useMediaQuery('(min-width: 1024px)');
  return desktop ? (
    <Drawer key={session} open={open} handoff={handoff} onClose={onClose} />
  ) : (
    <MobileSheet key={session} open={open} handoff={handoff} onClose={onClose} />
  );
}

function MobileSheet({ open, handoff, onClose }: { open: boolean; handoff: Partial<ConsultDraft>; onClose: () => void }) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  useDialogKeys(open, onClose, containerRef);

  return (
    <Sheet
      isOpen={open}
      onClose={onClose}
      detent="full"
      avoidKeyboard
      prefersReducedMotion={reduced}
      onOpenEnd={() => containerRef.current?.querySelector<HTMLElement>('h3[tabindex="-1"]')?.focus({ preventScroll: true })}
    >
      <ConsultFlow variant="sheet" handoff={handoff} onClose={onClose}>
        {({ header, body, footer }) => (
          <Sheet.Container
            ref={containerRef}
            className="flow-sheet k-ios"
            role="dialog"
            aria-modal="true"
            aria-label="Consulenza gratuita"
          >
            <Sheet.Header>
              <div className="flex justify-center pt-2">
                <Sheet.DragIndicator />
              </div>
              {header}
            </Sheet.Header>
            <Sheet.Content scrollClassName="overscroll-contain">{body}</Sheet.Content>
            {footer}
          </Sheet.Container>
        )}
      </ConsultFlow>
      <Sheet.Backdrop onTap={onClose} className="!bg-ink/50 backdrop-blur-[2px]" />
    </Sheet>
  );
}

function Drawer({ open, handoff, onClose }: { open: boolean; handoff: Partial<ConsultDraft>; onClose: () => void }) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogKeys(open, onClose, panelRef);

  // La pagina sotto sta ferma mentre il pannello è aperto.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.button
            type="button"
            aria-label="Chiudi il questionario"
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            onClick={onClose}
          />
          <ConsultFlow variant="sheet" handoff={handoff} onClose={onClose}>
            {({ header, body, footer }) => (
              <motion.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Consulenza gratuita"
                className="k-ios absolute bottom-3 right-3 top-3 flex w-[min(500px,calc(100vw-24px))] flex-col overflow-hidden rounded-[28px] border border-white/80 bg-cream/95 shadow-[0_40px_90px_-30px_rgb(21_25_15/0.6),inset_0_1px_0_rgb(255_255_255/0.9)]"
                style={{ WebkitBackdropFilter: 'blur(24px) saturate(1.6)', backdropFilter: 'blur(24px) saturate(1.6)' }}
                initial={{ x: reduced ? 0 : 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: reduced ? 0 : 60, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                onAnimationComplete={() => panelRef.current?.querySelector<HTMLElement>('h3[tabindex="-1"]')?.focus({ preventScroll: true })}
              >
                <div className="pt-3">{header}</div>
                <div data-flow-scroll className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                  {body}
                </div>
                {footer}
              </motion.div>
            )}
          </ConsultFlow>
        </div>
      )}
    </AnimatePresence>
  );
}
