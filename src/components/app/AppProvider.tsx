'use client';

import { Component, createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { KonstaProvider } from 'konsta/react';
import type { ConsultDraft } from '@/lib/forms';
import { lockScroll } from '@/lib/motion/scroll';
import { rememberArrival } from '@/lib/source';

/* Il questionario e il menu si caricano solo quando servono (al primo segno
   di intenzione, vedi sotto): chi legge e basta non scarica il codice dei form. */
const loadFlow = () => import('@/components/flows/ConsultOverlay');
const loadMenu = () => import('./MenuSheet');
const ConsultOverlay = dynamic(loadFlow, { ssr: false });
const MenuSheet = dynamic(loadMenu, { ssr: false });
const Toaster = dynamic(() => import('sonner').then((m) => m.Toaster), { ssr: false });

type AppApi = {
  /** Apre il questionario della consulenza sopra la pagina. */
  openConsult: (handoff?: Partial<ConsultDraft>) => void;
  /** Apre il menu "Tutto il sito" (telefono). */
  openMenu: () => void;
  /**
   * Chiude il foglio aperto perché si sta andando a un'altra pagina: toglie
   * il suo passo dalla cronologia invece di tornare indietro (un "indietro"
   * mentre parte la navigazione la annullerebbe).
   */
  dismissForNavigation: () => void;
  menuOpen: boolean;
  consultOpen: boolean;
};

const AppContext = createContext<AppApi | null>(null);

export function useApp(): AppApi {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp va usato dentro <AppProvider>');
  return ctx;
}

/** La pagina che ospita il questionario in linea: lì i link non aprono il foglio. */
const CONSULT_PATH = '/consulenza-gratuita';
const HISTORY_FLAG = 'abSheet';
const PAGE_LOAD = Math.random().toString(36).slice(2);
type SheetKind = 'consult' | 'menu';
const sheetOf = (state: unknown): SheetKind | null => {
  const s = state as Record<string, unknown> | null;
  return s?.[HISTORY_FLAG] === PAGE_LOAD ? ((s.kind as SheetKind) ?? null) : null;
};

/** Se il codice del foglio non si scarica (offline, nuovo deploy), si va alla pagina. */
class OverlayBoundary extends Component<{ href: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    window.location.assign(this.props.href);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Il guscio "app" del sito: ogni link al questionario apre il foglio sul
 * posto invece di cambiare pagina (i link restano link veri: senza
 * JavaScript, in una nuova scheda o per i motori di ricerca portano alla
 * pagina). Aprire un foglio aggiunge un passo alla cronologia, così il
 * gesto "indietro" del telefono lo chiude invece di uscire dalla pagina.
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sheet, setSheet] = useState<SheetKind | null>(null);
  const [session, setSession] = useState<{ id: number; handoff: Partial<ConsultDraft>; path: string } | null>(null);
  const [menuMounted, setMenuMounted] = useState(false);

  const push = (kind: SheetKind) => {
    if (sheetOf(window.history.state)) window.history.replaceState({ [HISTORY_FLAG]: PAGE_LOAD, kind }, '');
    else window.history.pushState({ [HISTORY_FLAG]: PAGE_LOAD, kind }, '');
  };

  const openConsult = useCallback((handoff: Partial<ConsultDraft> = {}) => {
    setSession((s) => ({ id: (s?.id ?? 0) + 1, handoff, path: window.location.pathname }));
    setSheet('consult');
    push('consult');
  }, []);

  const openMenu = useCallback(() => {
    setMenuMounted(true);
    setSheet('menu');
    push('menu');
  }, []);

  const close = useCallback(() => {
    setSheet(null);
    if (sheetOf(window.history.state)) window.history.back();
  }, []);

  const dismissForNavigation = useCallback(() => {
    setSheet(null);
    if (sheetOf(window.history.state)) window.history.replaceState(null, '');
  }, []);

  // La prima pagina della visita e la sua campagna (vanno nell'email ad Andrea).
  useEffect(rememberArrival, []);

  // Indietro/avanti: il foglio è aperto esattamente sul suo passo di cronologia.
  useEffect(() => {
    const onPop = (e: PopStateEvent) => setSheet(sheetOf(e.state));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Ogni link al questionario apre il foglio (tranne sulla pagina che lo ospita).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== CONSULT_PATH || url.hash !== '#questionario') return;
      if (window.location.pathname === CONSULT_PATH) return;
      e.preventDefault();
      const species = url.searchParams.get('animale');
      const handoff: Partial<ConsultDraft> = species === 'cane' || species === 'gatto' ? { species } : {};
      window.setTimeout(() => openConsult(handoff), 0);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [openConsult]);

  // Il codice dei fogli (questionario, menu) arriva al primo segno di
  // intenzione: il puntatore sopra il link, il dito che tocca, il focus.
  // Così non pesa su chi legge e basta, e sulla pagina della consulenza
  // (che ha il questionario in pagina) non arriva proprio.
  useEffect(() => {
    let flow = false;
    let menu = false;
    const warm = (e: Event) => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;
      if (!menu && el.closest('[data-menu-button]')) {
        menu = true;
        void loadMenu().catch(() => (menu = false));
        return;
      }
      if (flow || window.location.pathname === CONSULT_PATH) return;
      const link = el.closest<HTMLAnchorElement>('a[href*="#questionario"]');
      if (!link || new URL(link.href, window.location.href).pathname !== CONSULT_PATH) return;
      flow = true;
      void loadFlow().catch(() => (flow = false));
    };
    const opts = { capture: true, passive: true } as const;
    document.addEventListener('pointerover', warm, opts);
    document.addEventListener('pointerdown', warm, opts);
    document.addEventListener('focusin', warm, opts);
    return () => {
      document.removeEventListener('pointerover', warm, opts);
      document.removeEventListener('pointerdown', warm, opts);
      document.removeEventListener('focusin', warm, opts);
    };
  }, []);

  const consultShown = sheet === 'consult' && session?.path === pathname;
  const anySheet = consultShown || sheet === 'menu';

  // Con un foglio aperto la pagina sotto sta ferma (anche lo scroll morbido).
  useEffect(() => {
    lockScroll(anySheet);
  }, [anySheet]);

  return (
    <KonstaProvider theme="ios" dark={false}>
      <AppContext.Provider
        value={{ openConsult, openMenu, dismissForNavigation, menuOpen: sheet === 'menu', consultOpen: consultShown }}
      >
        {children}
        {session && (
          <OverlayBoundary href={`${CONSULT_PATH}#questionario`}>
            <ConsultOverlay open={consultShown} session={session.id} handoff={session.handoff} onClose={close} />
          </OverlayBoundary>
        )}
        {menuMounted && <MenuSheet open={sheet === 'menu'} onClose={close} onNavigate={dismissForNavigation} />}
        <Toaster
          position="top-center"
          offset={{ top: 'calc(env(safe-area-inset-top) + 14px)' }}
          mobileOffset={{ top: 'calc(env(safe-area-inset-top) + 10px)' }}
          toastOptions={{ className: '!rounded-2xl !font-sans !text-[14.5px] !shadow-lg' }}
        />
      </AppContext.Provider>
    </KonstaProvider>
  );
}
