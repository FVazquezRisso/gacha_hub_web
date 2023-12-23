"use client";
import NavBar from "../ui/NavBar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const inApp = !["/web", "/web/register", "/web/login"].includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && inApp) {
      router.push("/web");
    }
  }, []);

  return (
    <>
      <main>{children}</main>
      {inApp && <NavBar />}
    </>
  );
}
