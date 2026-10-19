# ceara-map

Interactive SVG map of the **184 municipalities of Ceará** (Brazil) for React: IBGE mesoregions, the IBGE code of every municipality, per-municipality fills and a configurable tooltip. No dependencies besides React.

```bash
npm install ceara-map
```

```tsx
import { CearaMap } from "ceara-map";
import "ceara-map/styles.css";

export default function Page() {
  return <CearaMap tooltip onClick={(m) => alert(m.name)} />;
}
```

## Data

Each municipality has:

```ts
type Municipality = {
  ibgeCode: number;   // 2304400
  slug: string;       // "fortaleza"
  name: string;       // "Fortaleza" (official IBGE name)
  region: RegionKey;  // "metropolitan"
  shape: "polygon" | "path" | "polyline";
  geometry: string;
};
```

| Export | Purpose |
|---|---|
| `MUNICIPALITIES`, `MUNICIPALITIES_BY_NAME` | The 184 municipalities (by slug / alphabetical) |
| `REGIONS`, `REGION_ORDER` | The 7 mesoregions: `north`, `northwest`, `metropolitan`, `jaguaribe`, `southCentral`, `south`, `sertoes`. `REGIONS[key].name` is the official Portuguese name, for display |
| `findMunicipality(slug)`, `findByIbgeCode(code)` | Look up a municipality |
| `regionColor(region)` | Region color as a CSS variable, e.g. `"var(--cm-region-south)"` |
| `normalize(text)`, `toSlug(text)` | Accent-insensitive comparison / slug in the same format as the map |

Use the **IBGE code** to join the map with other datasets (your database, IBGE, TSE): it is stable and doesn't depend on spelling.

> **Next.js App Router:** `ceara-map` is a Client Component. In Server Components, import the data from `ceara-map/data`.

## `<CearaMap>` props

| Prop | Type | |
|---|---|---|
| `getFill` | `(m) => string \| undefined` | Fill color of each municipality |
| `fills` | `{ [slug]: string }` | Same as `getFill`, but serializable (for use from Server Components) |
| `defaultFill` | `string` | Fill for municipalities without a color |
| `getClassName` | `(m) => string` | Extra class per municipality |
| `highlighted` | `string \| null` | Highlights a slug from outside the map (e.g. hovering a list) |
| `getHref` | `(m) => string` | Turns municipalities into links |
| `onClick` | `(m, event) => void` | Click (also Enter/Space on the keyboard) |
| `onHover` | `(m \| null, event) => void` | Entered / left a municipality |
| `tooltip` | `true \| TooltipConfig` | Built-in tooltip |
| `renderTooltip` | `(m) => ReactNode` | Tooltip with custom content |
| `showOutline` | `boolean` | State outline (default `true`) |
| `title` | `string` | Accessible label (default "Mapa do Ceará") |

### Coloring

```tsx
// by mesoregion
<CearaMap getFill={(m) => regionColor(m.region)} />

// choropleth from your own data, keyed by IBGE code
<CearaMap getFill={(m) => scale(population[m.ibgeCode])} defaultFill="#eee" />
```

## Tooltip

**Level 1 — just the data.** The built-in tooltip shows an image, a title (default: the name) and a subtitle; any of them may be missing. Return `null` to show nothing for that municipality.

```tsx
<CearaMap tooltip />  {/* name only */}

<CearaMap
  tooltip={{
    content: (m) => ({ image: photos[m.slug], subtitle: nicknames[m.slug] }),
  }}
/>
```

**Level 2 — behavior.**

```tsx
<CearaMap
  tooltip={{
    content: (m) => ({ ... }),
    width: 260,            // px (default 220)
    cursorOffset: 12,      // px (default 16)
    placement: "anchored", // "cursor" follows the mouse | "anchored" sits below the municipality
    delay: 150,            // ms before showing (default 0)
    touch: "first-tap",    // see below
    className: "myTooltip",
  }}
/>
```

**Level 3 — custom content.** The library still handles positioning, edges and touch.

```tsx
<CearaMap renderTooltip={(m) => <MyCard municipality={m} />} />
```

**Full control:** without `tooltip`/`renderTooltip` nothing is shown; use `onHover` with your own tooltip library.

### Touch screens

- `touch: "hide"` (default): no tooltip; a tap clicks right away.
- `touch: "first-tap"`: the 1st tap shows the tooltip, a 2nd tap on the same municipality clicks; tapping outside closes it.

### Keyboard

With `getHref` or `onClick`, municipalities are in the Tab order; focus shows the tooltip (anchored) and Enter clicks.

## Styles

Import `ceara-map/styles.css` and override any of the variables:

```css
:root {
  --cm-municipality-fill: #cbd5e1;
  --cm-municipality-stroke: #fff;
  --cm-municipality-highlight: #0f172a;  /* hover */
  --cm-outline: #94a3b8;
  --cm-region-south: #f97316;            /* and the other --cm-region-* */

  --cm-tooltip-background: #fff;
  --cm-tooltip-text: #0f172a;
  --cm-tooltip-radius: 12px;
  --cm-tooltip-shadow: 0 12px 32px rgba(15, 23, 42, .18);
}
```

Classes: `.cm-map`, `.cm-svg`, `.cm-municipality` (with `[data-highlighted]` on hover), `.cm-outline`, `.cm-tooltip` (with `[data-visible]`), `.cm-tooltip-image`, `.cm-tooltip-title`, `.cm-tooltip-subtitle`.

## Development

```bash
npm run build      # builds dist/ (ESM + CJS + types + CSS)
npm run dev        # build in watch mode
npm run typecheck
```

The municipality shapes come from the Ceará Hoje portal SVG; names and codes come from the IBGE localities API.
