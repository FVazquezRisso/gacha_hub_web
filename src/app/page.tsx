import Link from "next/link";
import { oswald } from "./ui/fonts.ts";

export default function Home() {
  return (
      <main className="flex items-center justify-center flex-col w-screen h-screen bg-bg-100 p-8 gap-8">
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
            href="/register"
            className="text-text-200 rounded-full bg-primary-100 p-4"
          >
            ¡Únete a la comunidad!
          </Link>
        </div>
      </main>
  );
}
