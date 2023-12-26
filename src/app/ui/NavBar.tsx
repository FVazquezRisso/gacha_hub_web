"use client";
import Link from "next/link";
import { IoHome, IoSearch, IoSettingsSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const username = localStorage.getItem('username')
  return (
    <nav className="w-screen h-16 fixed bottom-0 flex items-center justify-around bg-primary-100">
      <Link
        href="/web/home/latest"
        className={`${
          pathname.startsWith("/web/home")
            ? "text-text-100 border-b-4"
            : "text-text-200"
        } h-16 w-1/4 flex flex-col justify-center items-center rounded-sm`}
      >
        <IoHome size={32} />
      </Link>
      <Link
        href="/web/search"
        className={`${
          pathname.startsWith("/web/search")
            ? "text-text-100 border-b-4"
            : "text-text-200"
        } h-16 w-1/4 flex flex-col justify-center items-center rounded-sm`}
      >
        <IoSearch size={32} />
      </Link>
      <Link
        href={`/web/profile/${username}`}
        className={`${
          pathname.startsWith(`/web/profile/${username}`)
            ? "text-text-100 border-b-4"
            : "text-text-200"
        } h-16 w-1/4 flex flex-col justify-center items-center rounded-sm`}
      >
        <FaUser size={32} />
      </Link>
      <Link
        href="/web/settings"
        className={`${
          pathname.startsWith("/web/settings")
            ? "text-text-100 border-b-4"
            : "text-text-200"
        } h-16 w-1/4 flex flex-col justify-center items-center rounded-sm`}
      >
        <IoSettingsSharp size={32} />
      </Link>
    </nav>
  );
}
