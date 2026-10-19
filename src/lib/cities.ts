import { unstable_cache } from "next/cache";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { MUNICIPALITIES, REGIONS, toSlug, type Municipality } from "@/lib/municipalities";

/** A row of the portal's `cidades` table (column names are the database's, in Portuguese). */
type CityRow = {
  id: number;
  nome: string;
  nomecru: string;
  apelido: string | null;
  resumo: string | null;
  area: string | null;
  limite: string | null;
  populacao: string | null;
  aniversario: string | null;
  mesorregiao: string | null;
  microrregiao: string | null;
  foto: string | null;
};

export type City = {
  id: number;
  name: string;
  nickname: string | null;
  /** HTML, as stored by the portal editor */
  summary: string | null;
  area: string | null;
  borders: string | null;
  population: string | null;
  /** "YYYY-MM-DD"; the year is usually a 2000 placeholder */
  birthday: string | null;
  mesoregion: string | null;
  microregion: string | null;
  photo: string | null;
};

export type NewCity = {
  municipality: Municipality;
  nickname: string;
  summary: string;
  area: string;
  borders: string;
  population: string;
  birthdayDay: number | null;
  birthdayMonth: number | null;
  microregion: string;
  photo: string;
};

const MAP_SLUGS = new Set(MUNICIPALITIES.map((m) => m.slug));

/** Cache tag of the cities query; revalidate it after writing to the `cidades` table. */
export const CITIES_CACHE_TAG = "cities";

function toCity(row: CityRow): City {
  return {
    id: row.id,
    name: row.nome,
    nickname: row.apelido,
    summary: row.resumo,
    area: row.area,
    borders: row.limite,
    population: row.populacao,
    birthday: row.aniversario,
    mesoregion: row.mesorregiao,
    microregion: row.microrregiao,
    photo: row.foto,
  };
}

/**
 * Links each row of the `cidades` table to a map municipality.
 * Cities registered here store nomecru = map slug; older rows have an inconsistent
 * nomecru (e.g. "baturit-", "Crateús"), so those are matched by name.
 */
function mapSlugFor(row: CityRow) {
  if (MAP_SLUGS.has(row.nomecru)) return row.nomecru;
  const byName = toSlug(row.nome);
  return MAP_SLUGS.has(byName) ? byName : null;
}

async function loadCities() {
  const [rows] = await db().query<(CityRow & RowDataPacket)[]>(
    `SELECT id, nome, nomecru, apelido, resumo, area, limite, populacao, aniversario, mesorregiao, microrregiao, foto
       FROM cidades`,
  );
  const bySlug = new Map<string, City>();
  for (const row of rows) {
    const slug = mapSlugFor(row);
    if (slug && !bySlug.has(slug)) bySlug.set(slug, toCity(row));
  }
  return bySlug;
}

// Next's data cache is shared by every route (a module-level variable is not: each route
// bundle gets its own copy), so registering a city can invalidate it everywhere via the tag
const loadCitiesCached = unstable_cache(async () => [...(await loadCities())], ["cities"], {
  revalidate: 300,
  tags: [CITIES_CACHE_TAG],
});

async function citiesBySlug() {
  try {
    return new Map(await loadCitiesCached());
  } catch (error) {
    console.error("Failed to query the cidades table:", error);
    return null;
  }
}

/** The city registered for a map municipality, or null if there is none (or the database is down). */
export async function findCity(municipality: Municipality): Promise<City | null> {
  return (await citiesBySlug())?.get(municipality.slug) ?? null;
}

export type CityPreview = { nickname: string | null; photo: string | null };

/** Nickname and photo of every registered municipality, by slug (what the map tooltip needs). */
export async function listCityPreviews(): Promise<Record<string, CityPreview>> {
  const cities = await citiesBySlug();
  if (!cities) return {};
  return Object.fromEntries(
    [...cities].map(([slug, c]) => [slug, { nickname: c.nickname?.trim() || null, photo: c.photo?.trim() || null }]),
  );
}

/** Slugs of the map municipalities that already have a registered city. */
export async function registeredSlugs(): Promise<string[]> {
  return [...((await citiesBySlug())?.keys() ?? [])];
}

export class CityAlreadyRegistered extends Error {}

/** Inserts a city. The caller must revalidate CITIES_CACHE_TAG afterwards. */
export async function insertCity(city: NewCity) {
  // check the database directly (no cache) so a municipality is never registered twice
  if ((await loadCities()).has(city.municipality.slug)) {
    throw new CityAlreadyRegistered(`${city.municipality.name} já está cadastrada.`);
  }

  const { municipality } = city;
  const birthday =
    city.birthdayDay && city.birthdayMonth
      ? `2000-${String(city.birthdayMonth).padStart(2, "0")}-${String(city.birthdayDay).padStart(2, "0")}`
      : null;

  const [result] = await db().execute<ResultSetHeader>(
    `INSERT INTO cidades
       (nome, nomecru, apelido, resumo, area, limite, populacao, aniversario, mesorregiao, microrregiao, foto, data_registro, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      municipality.name,
      municipality.slug,
      city.nickname || null,
      summaryToHtml(city.summary),
      city.area || null,
      city.borders || null,
      city.population || null,
      birthday,
      REGIONS[municipality.region].name,
      city.microregion || null,
      city.photo || null,
    ],
  );
  return result.insertId;
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** The portal renders the summary as HTML; the form takes plain text, one paragraph per blank line. */
function summaryToHtml(text: string) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paragraphs.length ? paragraphs.map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`).join("") : null;
}

const ENTITIES: Record<string, string> = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

/** The summary comes as HTML from the panel editor; this turns it into plain-text paragraphs. */
export function summaryParagraphs(html: string | null) {
  if (!html) return [];
  return html
    .replace(/\s+/g, " ") // HTML pasted from Word breaks lines mid-sentence
    .replace(/<\/(p|div|h\d|li)>|<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, code: string) => {
      if (code[0] === "#") {
        const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return Number.isFinite(n) ? String.fromCodePoint(n) : entity;
      }
      return ENTITIES[code.toLowerCase()] ?? entity;
    })
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/** The database usually stores the birthday year as 2000, so only day and month are shown. */
export function formatBirthday(date: string | null) {
  const parts = date?.match(/^\d{4}-(\d{2})-(\d{2})/);
  if (!parts || parts[1] === "00") return null;
  return new Date(2000, Number(parts[1]) - 1, Number(parts[2])).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
  });
}

export function formatNumber(value: string | null) {
  if (!value) return null;
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n.toLocaleString("pt-BR") : value;
}
