import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "ceara-map/styles.css";
import { METADATA_BASE, SITE_DESCRIPTION, SITE_NAME, previewMetadata } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font" });

export const metadata: Metadata = {
  metadataBase: METADATA_BASE,
  title: SITE_NAME,
  ...previewMetadata({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "" }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
