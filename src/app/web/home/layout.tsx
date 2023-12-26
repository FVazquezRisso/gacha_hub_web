"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoMdCreate } from "react-icons/io";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter()

  const handleClickCreatePost = () => {
    router.push('/web/post/create')
  }

  return (
    <>
      <div>
        <div className="h-16 bg-primary-100 flex items-center justify-around fixed w-screen">
          <Link
            href="/web/home/latest"
            className={`${
              pathname === "/web/home/latest" &&
              "border-b-2 border-text-100 text-text-100"
            } text-2xl h-full flex items-center w-1/2 justify-center font-semibold`}
          >
            Nuevo
          </Link>
          <Link
            href="/web/home/following"
            className={`${
              pathname === "/web/home/following" &&
              "border-b-2 border-text-100 text-text-100"
            } text-2xl h-full flex items-center w-1/2 justify-center font-semibold`}
          >
            Siguiendo
          </Link>
        </div>
        {children}
        <div className="h-14 w-14 bg-primary-100 rounded-full border-4 border-primary-100 fixed bottom-[5.5rem] right-6 flex items-center justify-center" onClick={handleClickCreatePost}>
          <IoMdCreate size={32} className="text-text-200" />
        </div>
      </div>
    </>
  );
}
