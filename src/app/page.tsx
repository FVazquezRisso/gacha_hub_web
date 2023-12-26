import Link from "next/link";
import { oswald } from "./ui/fonts.ts";

export default function Home() {
  return (
    <main className="no-scroll-container p-8 gap-8">
      <div>
        <h1
          className={`${oswald.className} text-5xl text-center text-text-200`}
        >
          Bienvenido a
        </h1>
        <h1
          className={`${oswald.className} text-7xl text-center text-primary-300 mt-2`}
        >
          Gacha<span className="text-primary-100">Hub</span>
        </h1>
      </div>
      <div className="text-center text-text-200 text-2xl flex gap-8 flex-col">
        <p>
          Tu espacio dedicado a los juegos gacha. Comparte, descubre y conecta
          con la comunidad más apasionada.
        </p>
        <Link
          href="/web/register"
          className="button mt-4"
        >
          ¡Únete a la comunidad!
        </Link>
      </div>
    </main>
  );
}
