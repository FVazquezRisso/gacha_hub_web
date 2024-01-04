"use client";
import NavBar from "../ui/NavBar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const inApp = !["/web/register", "/web/login"].includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && inApp) {
      router.push("/");
    }

    if (token && !inApp) {
      router.push('/web/home/latest')
    }
  }, []);

  return (
    <>
      <main>{children}</main>
      {inApp && <NavBar />}
      <ToastContainer />
    </>
  );
}
