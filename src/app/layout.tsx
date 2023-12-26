import type { Metadata } from "next";
import "./globals.css";
import { cabin } from "./ui/fonts";


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
