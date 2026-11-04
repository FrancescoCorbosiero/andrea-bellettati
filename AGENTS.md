<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Questo progetto

Sito di Andrea Bellettati (versione 2), spec nel sito Astro `comunicazionecinofila`.
Leggi prima `README.md`, poi `docs/spec.md` (pagine e regole dei testi) e
`docs/decisioni.md` (perché le scelte). La web app futura è in `docs/web-app.md`.

- **Lingua**: testi del sito, commenti e messaggi di commit in italiano.
- **Voce**: prima persona (parla Andrea), frasi semplici, niente slogan. Mai
  "candidatura". Il veterinario resta il riferimento per diagnosi e terapie.
- **Stile**: usa i componenti del Brand System in `src/app/globals.css`
  (`.btn`, `.slab`, `.eyebrow`, `.pill`, `.ticks`, `.icon-btn`, `.on-dark`)
  prima di inventare classi nuove. Niente rotazioni, sticker o bordi d'inchiostro.
- **Konsta** solo nelle parti "app" (questionari, barra in basso, fogli,
  ricerca); i componenti Konsta vanno in file `'use client'`.
- **Questionari**: campi e regole in `src/lib/forms.ts`, condivisi con il server.
- **Prima di consegnare**: `npm run check` e `npm run build` puliti.
