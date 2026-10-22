import data from "./municipalities.json";

export type RegionKey = "north" | "northwest" | "metropolitan" | "jaguaribe" | "southCentral" | "south" | "sertoes";

export type Municipality = {
  /** 7-digit IBGE code, e.g. 2304400 (Fortaleza) */
  ibgeCode: number;
  /** lowercase, accent-free, hyphenated name, e.g. "juazeiro-do-norte" */
  slug: string;
  /** official name, as published by IBGE */
  name: string;
  /** IBGE mesoregion */
  region: RegionKey;
  shape: "polygon" | "path" | "polyline";
  /** `d` when shape is "path"; `points` otherwise */
  geometry: string;
};

/** The 7 IBGE mesoregions of Ceará. `name` is the official Portuguese name, meant for display. */
export const REGIONS: Record<RegionKey, { name: string }> = {
  north: { name: "Norte Cearense" },
  northwest: { name: "Noroeste Cearense" },
  metropolitan: { name: "Região Metropolitana de Fortaleza" },
  jaguaribe: { name: "Região do Jaguaribe" },
  southCentral: { name: "Centro-Sul" },
  south: { name: "Sul Cearense" },
  sertoes: { name: "Sertões" },
};

export const REGION_ORDER = Object.keys(REGIONS) as RegionKey[];

export const VIEW_BOX = data.viewBox;
export const STATE_OUTLINE = data.stateOutline;
export const MUNICIPALITIES = data.municipalities as Municipality[];
export const MUNICIPALITIES_BY_NAME = [...MUNICIPALITIES].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

const BY_SLUG = new Map(MUNICIPALITIES.map((m) => [m.slug, m]));
const BY_IBGE_CODE = new Map(MUNICIPALITIES.map((m) => [m.ibgeCode, m]));

export function findMunicipality(slug: string): Municipality | undefined {
  return BY_SLUG.get(slug);
}

export function findByIbgeCode(code: number | string): Municipality | undefined {
  return BY_IBGE_CODE.get(Number(code));
}

/** Region color as a CSS variable (defined in styles.css), e.g. "var(--cm-region-south)". */
export function regionColor(region: RegionKey) {
  return `var(--cm-region-${region})`;
}

/** Strips accents and case, for searching: normalize("Crateús") === "crateus". */
export function normalize(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

/** Same format as the map slugs; handy for matching names coming from other sources. */
export function toSlug(text: string) {
  return normalize(text).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
