// map data and types come from the library; only what is specific to this site lives here
export * from "ceara-map/data";

export function municipalityHref(slug: string) {
  return `/municipios/${slug}`;
}
