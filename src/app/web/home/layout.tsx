"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <>
      <div>
        <div className="h-12 bg-primary-100 flex items-center justify-around fixed w-screen">
          <Link
            href="/web/home/latest"
            className={`${
              pathname === "/web/home/latest" &&
              "border-b-2 border-text-100 text-text-100"
            } text-xl h-full flex items-center w-1/2 justify-center`}
          >
            Nuevo
          </Link>
          <Link
            href="/web/home/following"
            className={`${
              pathname === "/web/home/following" &&
              "border-b-2 border-text-100 text-text-100"
            } text-xl h-full flex items-center w-1/2 justify-center`}
          >
            Siguiendo
          </Link>
        </div>
        {children}
      </div>
    </>
  );
}
