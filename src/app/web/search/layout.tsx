"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClickCreatePost = () => {
    router.push("/web/post/create");
  };

  return (
    <>
      <div>
        <div className="h-16 bg-primary-100 flex items-center justify-around fixed w-screen text-2xl">
          <Link
            href="/web/search/users"
            className={`${
              pathname === "/web/search/users" &&
              "border-b-2 border-text-100 text-text-100"
            } h-full flex items-center w-1/2 justify-center font-semibold`}
          >
            Usuarios
          </Link>
          <Link
            href="/web/search/posts"
            className={`${
              pathname === "/web/search/posts" &&
              "border-b-2 border-text-100 text-text-100"
            } h-full flex items-center w-1/2 justify-center font-semibold`}
          >
            Publicaciones
          </Link>
          {/* <Link
            href="/web/search/groups"
            className={`${
              pathname === "/web/search/groups" &&
              "border-b-2 border-text-100 text-text-100"
            } h-full flex items-center w-1/2 justify-center font-semibold`}
          >
            Grupos
          </Link> */}
        </div>
        {children}
      </div>
    </>
  );
}
