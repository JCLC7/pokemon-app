import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PokePWA",
  description: "Tu Pokédex Progresiva",
  manifest: "/manifest.json",
};

import { PokedexProvider } from './context/PokedexContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-gray-100">
        <PokedexProvider>{children}</PokedexProvider>
      </body>
    </html>
  );
}