/* =====================================================================
   Da dove arriva una richiesta: la pagina del questionario e, se la
   visita è partita da una campagna, i suoi parametri (utm_*, clic da
   Google Ads o Meta) e il sito da cui si è arrivati. Va solo nell'email
   ad Andrea, per sapere quale campagna porta contatti. Niente cookie:
   resta nella scheda del browser (sessionStorage) e sparisce chiudendola.
   ===================================================================== */

const KEY = 'ab:arrivo';
const UTM = ['source', 'medium', 'campaign', 'content', 'term'] as const;

type Arrival = { path: string; utm: string; click: string; ref: string };

/** Alla prima pagina della visita: dove si è entrati e con quale campagna. */
export function rememberArrival(): void {
  try {
    if (window.sessionStorage.getItem(KEY)) return;
    const url = new URL(window.location.href);
    const utm = UTM.map((k) => [k, url.searchParams.get(`utm_${k}`)?.trim()] as const)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ');
    const click = url.searchParams.has('gclid') ? 'Google Ads' : url.searchParams.has('fbclid') ? 'Meta' : '';
    let ref = '';
    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host !== url.hostname) ref = host.replace(/^www\./, '');
    }
    const arrival: Arrival = { path: url.pathname, utm, click, ref };
    window.sessionStorage.setItem(KEY, JSON.stringify(arrival));
  } catch {
    /* modalità privata o URL strano: la provenienza resta solo la pagina */
  }
}

/** "/consulenza · campagna: source=meta, campaign=autunno · clic da Meta". */
export function describeSource(): string {
  const parts = [window.location.pathname];
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const a = raw ? (JSON.parse(raw) as Partial<Arrival>) : null;
    if (a) {
      if (a.utm) parts.push(`campagna: ${a.utm}`);
      if (a.click) parts.push(`clic da ${a.click}`);
      if (a.path && a.path !== window.location.pathname) parts.push(`entrata da ${a.path}`);
      if (a.ref) parts.push(`arrivata da ${a.ref}`);
    }
  } catch {
    /* niente provenienza salvata */
  }
  return parts.join(' · ').slice(0, 300);
}
