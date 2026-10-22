import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a static site (no server, no database) for GitHub Pages, served from
// NEXT_PUBLIC_BASE_PATH (e.g. /ceara-mapa-view)
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = staticExport
  ? {
      output: "export",
      basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
