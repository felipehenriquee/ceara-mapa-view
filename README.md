# Mapa do Ceará

Interactive SVG map of the 184 municipalities of Ceará, built with Next.js (App Router), React and TypeScript. The map was drawn by Felipe Henrique Morais Araujo in 2019–2020 and first used on the **Jornal Ceará Hoje** website.

> Code, comments and docs are in English. Text shown to users and the site URLs (`/municipios`, `/cadastro`, `/entrar`) stay in Portuguese.

> **Branch `github-pages`:** static test version published on GitHub Pages by `.github/workflows/pages.yml` (`STATIC_EXPORT=1`, base path = repository name). City data is read from the database at build time (repository secrets `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`) and baked into the pages; re-run the workflow to refresh it. Registration and login need a server, so they are not in this build.

## Features

- **Full map** of the 184 municipalities, with hover and a tooltip (photo, name and nickname).
- **Mesoregion filter** (IBGE mesoregions) and a **"registered" filter** for cities that have data in the database.
- **Municipality search**, accent- and case-insensitive.
- **One page per municipality** at `/municipios/<slug>`, statically generated, with facts and summary from the database.
- **City registration** at `/cadastro`, protected by the portal login.

## Structure

The repository is a monorepo (npm workspaces): the map **library** and the **site** that uses it.

```
packages/ceara-map/              → React map library (see packages/ceara-map/README.md)
src/components/InteractiveMap.tsx → home: filters, search and tooltip, using <CearaMap>
src/lib/municipalities.ts        → re-exports the library data + the municipality route
src/lib/cities.ts                → reads/writes the `cidades` table and formats its fields
src/lib/db.ts, auth.ts           → MySQL pool and login/session
src/app/                         → pages (home, /municipios/[slug], /cadastro, /entrar)
src/app/globals.css              → site styles (map colors are the --cm-* variables)
db/                              → schema and seed copied from the portal project
legacy/                          → original version in plain HTML/CSS/JS
```

## Database

Municipality pages read facts, summary and photo from the `cidades` table of the Ceará Hoje portal MySQL database. The connection is configured in `.env` (copy it from `.env.example`):

```
DB_HOST=  DB_PORT=  DB_USER=  DB_PASS=  DB_NAME=  SESSION_SECRET=
```

- `src/lib/db.ts` creates the connection pool; `src/lib/cities.ts` runs the queries (5-minute cache) and maps the Portuguese column names to English fields.
- Cities are matched to the map by `nomecru` when it is a valid map slug, otherwise by **name** (older rows have an inconsistent `nomecru`). Municipalities without a row show only the map.
- If the database is down, pages still render, without the data.
- `db/schema.sql` and `db/cities_seed.sql` are copies of the portal schema and seed, for setting up a local database.

## City registration

`/cadastro` inserts a new row into the `cidades` table. It requires logging in (`/entrar`) with the same username and password as the portal admin panel (`usuarios` table); the session is a cookie signed with `SESSION_SECRET`.

**Link with the map:** the municipality is picked on the map itself (or from the list of 184), never typed. The form stores `nome` and `mesorregiao` from the map and `nomecru` equal to the map slug, so the new city immediately shows up at `/municipios/<slug>` and in the home "registered" filter, and can't be registered twice. Municipalities that already have a row are greyed out in the form.

- Municipality pages without a row show a button that opens the form with that city preselected.
- The summary is typed as plain text (paragraphs separated by a blank line) and stored as `<p>…</p>`, the format the portal uses.
- The photo is a URL (uploading to S3 still happens through the portal admin panel).

## Running

Requires Node 18.18 or newer.

```bash
npm install
npm run dev      # builds the library and starts the site at http://localhost:3000
npm run dev:lib  # (optional, in another terminal) rebuilds the library on every change
npm run build && npm start
```

## Reusing in other projects

Use the `packages/ceara-map` library: publish it to npm (`npm publish -w ceara-map`) or install it straight from the folder. Props, tooltip and color variables are documented in [packages/ceara-map/README.md](packages/ceara-map/README.md).

## License

[MIT](LICENSE) © 2019-2026 Felipe Henrique Morais Araujo.
