// Builds the link-preview image of each city from its photo: 1200×630 JPEG, ~100 KB.
// The original photos (on the portal's S3) are often 1–2 MB, which WhatsApp ignores in previews,
// and some are narrower than 600 px, which LinkedIn shows as a small thumbnail.
//
// Run before `next build` (needs the DB_* environment): images go to public/og/municipios/<slug>.jpg,
// and the city pages use them when they exist, falling back to the original photo otherwise.

import { mkdir, readFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "og", "municipios");
const WIDTH = 1200;
const HEIGHT = 630;
const CONCURRENCY = 6;

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;
if (!DB_HOST) {
  console.log("No DB_HOST: skipping preview images.");
  process.exit(0);
}

function toSlug(text) {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// same matching as src/lib/cities.ts: nomecru when it is a map slug, otherwise the name
const data = JSON.parse(await readFile(join(ROOT, "packages", "ceara-map", "src", "municipalities.json"), "utf8"));
const slugs = new Set(data.municipalities.map((m) => m.slug));
const slugFor = (row) => (slugs.has(row.nomecru) ? row.nomecru : slugs.has(toSlug(row.nome)) ? toSlug(row.nome) : null);

const connection = await mysql.createConnection({
  host: DB_HOST,
  port: Number(DB_PORT || 3306),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
});
const [rows] = await connection.query("SELECT nome, nomecru, foto FROM cidades WHERE foto IS NOT NULL AND foto <> ''");
await connection.end();

const photos = new Map();
for (const row of rows) {
  const slug = slugFor(row);
  if (slug && !photos.has(slug)) photos.set(slug, row.foto.trim());
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const failed = [];
let bytes = 0;
const queue = [...photos];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (let item = queue.shift(); item; item = queue.shift()) {
      const [slug, url] = item;
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const info = await sharp(Buffer.from(await response.arrayBuffer()))
          .rotate() // respect EXIF orientation
          .resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" })
          .jpeg({ quality: 78, progressive: true, mozjpeg: true })
          .toFile(join(OUT, `${slug}.jpg`));
        bytes += info.size;
      } catch (error) {
        failed.push(`${slug} (${error.message})`);
      }
    }
  }),
);

const done = photos.size - failed.length;
console.log(`Preview images: ${done} of ${photos.size}, ${Math.round(bytes / 1024 / Math.max(done, 1))} KB on average.`);
if (failed.length) console.log(`Kept the original photo for: ${failed.join(", ")}`);
