/** Date in italiano, ancorate al fuso Europe/Rome (l'orario non slitta col fuso del server). */
const TZ = 'Europe/Rome';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "11" */
export function eventDay(d: Date): string {
  return new Intl.DateTimeFormat('it-IT', { day: 'numeric', timeZone: TZ }).format(d);
}

/** "Febbraio" */
export function eventMonth(d: Date): string {
  return cap(new Intl.DateTimeFormat('it-IT', { month: 'long', timeZone: TZ }).format(d));
}

/** "21:00" */
export function eventTime(d: Date): string {
  return new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: TZ }).format(d);
}

/** "mercoledì 11 febbraio, ore 21:00" */
export function eventLong(d: Date): string {
  const day = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ }).format(d);
  return `${day}, ore ${eventTime(d)}`;
}

/** "10 marzo 2026" */
export function longDate(d: Date): string {
  return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ }).format(d);
}

/** true se la data ha un orario diverso dalla mezzanotte (fuso di Roma). */
export function hasTime(d: Date): boolean {
  return eventTime(d) !== '00:00';
}
