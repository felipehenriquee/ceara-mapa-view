// map data and types come from the library; only what is specific to this site lives here
export * from "ceara-map/data";

export function municipalityHref(slug: string) {
  return `/municipios/${slug}`;
}

/** Prefixes the site's base path (set when the site is served from a subfolder, e.g. GitHub Pages). */
export function withBasePath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
