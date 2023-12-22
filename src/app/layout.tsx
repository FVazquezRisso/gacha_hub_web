import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cabin } from "./ui/fonts.ts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GachaHub",
  description: "Red social para videojuegos gacha.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={cabin.className}>
        {children}
      </body>
    </html>
  );
}
