import Link from 'next/link';

/**
 * Konsta accetta come `linkComponent` solo un nome di tag nei tipi, ma a
 * runtime rende qualsiasi componente: passandogli il Link di Next le voci
 * delle liste navigano senza ricaricare la pagina (il guscio "app" resta).
 */
export const NextLinkTag = Link as unknown as string;
