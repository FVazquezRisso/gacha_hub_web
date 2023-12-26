"use client";
import { IoLogOutOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push('/web/login')
  };

  return (
    <>
      <div className="w-screen h-16 bg-primary-100 flex items-center p-4">
        <h2 className="text-2xl font-semibold">Configuración</h2>
      </div>
      <div className="w-screen">
        <div
          className="p-4 flex items-center gap-4 border-b-[1px] border-text-200"
          onClick={handleLogout}
        >
          <IoLogOutOutline size={32} />
          <h3 className="text-xl">Cerrar sesión</h3>
        </div>
      </div>
    </>
  );
}
