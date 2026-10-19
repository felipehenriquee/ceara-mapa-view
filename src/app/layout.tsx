import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "ceara-map/styles.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font" });

export const metadata: Metadata = {
  title: "Mapa do Ceará",
  description: "Mapa interativo dos 184 municípios do Ceará, com filtro por mesorregião e busca.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
