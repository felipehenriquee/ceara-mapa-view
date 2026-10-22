import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";

export const SITE_NAME = "Mapa do Ceará";
export const SITE_DESCRIPTION =
  "Mapa interativo dos 184 municípios do Ceará, com filtro por mesorregião, busca e informações de cada cidade.";

/**
 * Absolute address of the site, needed by link previews (Open Graph wants absolute URLs).
 * Set NEXT_PUBLIC_SITE_URL where the site is published, including any subfolder,
 * e.g. https://felipehenriquee.github.io/ceara-mapa-view
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const METADATA_BASE = new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`);

/** Shown in previews of the home page and of cities without a photo (public/og-default.png). */
export const DEFAULT_IMAGE = { url: "og-default.png", width: 1200, height: 630, alt: "Mapa do Ceará com os 184 municípios" };

const PREVIEW_DESCRIPTION_LENGTH = 160;

/** The first paragraphs, cut at a word boundary to fit a link preview. */
export function excerpt(paragraphs: string[], max = PREVIEW_DESCRIPTION_LENGTH) {
  const text = paragraphs.join(" ").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > max * 0.6 ? cut.lastIndexOf(" ") : cut.length).replace(/[\s,.;:–—-]+$/, "")}…`;
}

type PreviewImage = { url: string; width?: number; height?: number; alt?: string };

/**
 * Preview image of a city: the optimized 1200×630 version made by scripts/build-og-images.mjs when
 * it exists, otherwise the original photo, otherwise the default image.
 */
export function cityPreviewImage(slug: string, name: string, photo: string | null | undefined): PreviewImage {
  const optimized = `og/municipios/${slug}.jpg`;
  if (existsSync(join(process.cwd(), "public", optimized))) {
    return { url: optimized, width: 1200, height: 630, alt: `Foto de ${name}` };
  }
  return photo ? { url: photo, alt: `Foto de ${name}` } : DEFAULT_IMAGE;
}

/** Open Graph + Twitter tags for a page, so shared links show title, description and image. */
export function previewMetadata({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
}: {
  title: string;
  description: string;
  /** relative to the site address, without a leading slash: "municipios/crato/" */
  path: string;
  image?: PreviewImage;
}): Metadata {
  return {
    description,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "pt_BR",
      title,
      description,
      url: path,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
