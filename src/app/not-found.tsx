import Link from "next/link";
import { oswald } from './ui/fonts.ts'
 
export default function NotFound() {
  return (
    <div className="no-scroll-container gap-4">
      <h2 className={`${oswald.className} text-6xl`}>
        <span className="text-primary-100">404</span> - Not Found
      </h2>
      <Link href="/" className="button mt-8">
        Volver al inicio
      </Link>
    </div>
  );
}
