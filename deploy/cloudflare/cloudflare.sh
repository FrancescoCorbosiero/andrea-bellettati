#!/usr/bin/env bash
# =====================================================================
# Cloudflare davanti al sito: regole di cache, impostazioni della zona e
# svuotamento della cache a ogni deploy. Il perché è in docs/cloudflare.md.
#
#   deploy/cloudflare/cloudflare.sh regole     regole di cache + impostazioni della zona
#   deploy/cloudflare/cloudflare.sh svuota     svuota tutta la cache (dopo ogni deploy)
#   deploy/cloudflare/cloudflare.sh verifica   cosa risponde Cloudflare sulle pagine chiave
#
# Opzioni: --prova  mostra le richieste all'API senza mandarle
#          --si     non chiede conferma (per gli script di deploy)
#
# Servono (variabili d'ambiente, o deploy/cloudflare/cloudflare.env che resta
# fuori da git; modello in cloudflare.env.example):
#   CLOUDFLARE_API_TOKEN  token della zona con i permessi Cache Rules: Edit,
#                         Zone Settings: Edit, Cache Purge: Purge
#   CLOUDFLARE_ZONE_ID    ID della zona (pagina Panoramica del dominio)
#   SITE_DOMAIN           il dominio del sito (se manca, dal .env del sito)
# =====================================================================
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/../.." && pwd)"
API="https://api.cloudflare.com/client/v4"

if [[ -f "$DIR/cloudflare.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  . "$DIR/cloudflare.env"
  set +a
fi
# Il dominio è lo stesso del deploy: lo si legge dal .env del sito (solo quella riga).
if [[ -z "${SITE_DOMAIN:-}" && -f "$ROOT/.env" ]]; then
  SITE_DOMAIN="$(grep -E '^SITE_DOMAIN=' "$ROOT/.env" | tail -n 1 | cut -d= -f2- | tr -d "\"' ")"
fi

COMANDO="${1:-}"
[[ $# -gt 0 ]] && shift
PROVA=0
SI=0
for arg in "$@"; do
  case "$arg" in
    --prova) PROVA=1 ;;
    --si) SI=1 ;;
    *) echo "Opzione sconosciuta: $arg" >&2; exit 2 ;;
  esac
done

serve() {
  if [[ -z "${!1:-}" ]]; then
    echo "Manca $1: impostalo nell'ambiente o in deploy/cloudflare/cloudflare.env." >&2
    exit 1
  fi
}

dominio() {
  serve SITE_DOMAIN
  # Finisce dentro le espressioni delle regole: solo lettere, cifre, punti e trattini.
  if [[ ! "$SITE_DOMAIN" =~ ^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$ ]]; then
    echo "SITE_DOMAIN non sembra un dominio: «$SITE_DOMAIN»." >&2
    exit 1
  fi
}

# Chiamata all'API di Cloudflare: si ferma se la risposta non è "success": true.
api() {
  local metodo="$1" percorso="$2" corpo="${3:-}"
  if (( PROVA )); then
    echo "→ $metodo $API$percorso"
    if [[ -n "$corpo" ]]; then echo "$corpo"; fi
    return 0
  fi
  local args=(-sS -X "$metodo" "$API$percorso" -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json")
  if [[ -n "$corpo" ]]; then args+=(--data "$corpo"); fi
  local risposta
  risposta="$(curl "${args[@]}")"
  if ! grep -q '"success": *true' <<<"$risposta"; then
    echo "Cloudflare ha risposto con un errore a $metodo $percorso:" >&2
    echo "$risposta" >&2
    exit 1
  fi
}

regole() {
  dominio
  serve CLOUDFLARE_ZONE_ID
  (( PROVA )) || serve CLOUDFLARE_API_TOKEN
  local corpo
  corpo="$(sed "s/__DOMINIO__/$SITE_DOMAIN/g" "$DIR/regole-cache.json")"
  if (( ! SI && ! PROVA )); then
    echo "Sostituisco TUTTE le regole di cache della zona con quelle di"
    echo "deploy/cloudflare/regole-cache.json, per il dominio $SITE_DOMAIN."
    read -r -p "Procedo? [s/N] " ok
    [[ "$ok" == [sS]* ]] || { echo "Niente di fatto."; exit 0; }
  fi
  api PUT "/zones/$CLOUDFLARE_ZONE_ID/rulesets/phases/http_request_cache_settings/entrypoint" "$corpo"
  echo "✓ Regole di cache"
  # Impostazioni che con Next fanno danni: Rocket Loader riscrive gli
  # script, l'offuscamento delle email cambia l'HTML e rompe l'idratazione
  # di React; la cache del browser deve seguire le intestazioni del sito.
  api PATCH "/zones/$CLOUDFLARE_ZONE_ID/settings/rocket_loader" '{"value":"off"}'
  echo "✓ Rocket Loader spento"
  api PATCH "/zones/$CLOUDFLARE_ZONE_ID/settings/email_obfuscation" '{"value":"off"}'
  echo "✓ Offuscamento delle email spento"
  api PATCH "/zones/$CLOUDFLARE_ZONE_ID/settings/browser_cache_ttl" '{"value":0}'
  echo "✓ Cache del browser: segue le intestazioni del sito"
}

svuota() {
  serve CLOUDFLARE_ZONE_ID
  (( PROVA )) || serve CLOUDFLARE_API_TOKEN
  api POST "/zones/$CLOUDFLARE_ZONE_ID/purge_cache" '{"purge_everything":true}'
  echo "✓ Cache svuotata: la prossima visita prende la versione nuova."
}

# Due richieste per indirizzo: la prima riempie la cache, la seconda dice
# cosa fa Cloudflare (cf-cache-status). VERIFICA_URL cambia l'indirizzo base.
verifica() {
  local base="${VERIFICA_URL:-}"
  if [[ -z "$base" ]]; then
    dominio
    base="https://$SITE_DOMAIN"
  fi
  local html chunk img
  html="$(curl -sS "$base/")"
  chunk="$(grep -o '/_next/static/chunks/[A-Za-z0-9._~-]*\.js' <<<"$html" | head -n 1 || true)"
  img="$(grep -o '/_next/image?url=[^" ,]*' <<<"$html" | head -n 1 | sed 's/&amp;/\&/g' || true)"
  printf '%-44s %-11s %s\n' 'INDIRIZZO' 'CLOUDFLARE' 'CACHE-CONTROL DEL SITO'
  local url h stato cc
  for url in / /approccio "$chunk" "$img" /api/richiesta "/approccio?_rsc=verifica"; do
    [[ -n "$url" ]] || continue
    curl -sS -o /dev/null "$base$url" || true
    h="$(curl -sS -o /dev/null -D - "$base$url" | tr -d '\r')"
    stato="$(grep -i '^cf-cache-status:' <<<"$h" | cut -d' ' -f2 || true)"
    cc="$(grep -i '^cache-control:' <<<"$h" | cut -d' ' -f2- || true)"
    printf '%-44s %-11s %s\n' "${url:0:44}" "${stato:--}" "${cc:--}"
  done
  echo
  echo "Atteso: HIT su /, /approccio e sul file di Next; BYPASS o DYNAMIC su"
  echo "immagine, API e _rsc senza intestazione rsc."
}

case "$COMANDO" in
  regole) regole ;;
  svuota) svuota ;;
  verifica) verifica ;;
  *)
    sed -n '3,18p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
    exit 2
    ;;
esac
