"use client";
import { useState } from "react";
import TextEditor from "@/app/ui/TextEditor";
import Header from "@/app/ui/Header";
import cookies from "js-cookie";
import { notification } from "@/utils/notification";
import { api } from "@/services/apiConfig";
import { useRouter } from "next/navigation";

export default function GroupCreate() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const username = cookies.get("username");
  const avatar = cookies.get("avatar");
  const token = cookies.get("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post(
        "/groups",
        { name: content },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (response.status === 201) {
        notification("success", "Grupo creado con éxito.");
        router.back();
      }
    } catch (error) {
      notification("error", "Error inesperado. Inténtalo de nuevo más tarde.");

      console.error(error);
    }
  };

  return (
    <>
      <Header title="Crear Grupo" />
      <form onSubmit={handleSubmit} className="px-4">
        <div className="h-16 w-full flex justify-start items-center gap-4 mt-4">
          <img
            src={avatar}
            alt={username}
            className="w-12 aspect-square object-cover rounded-full"
          />
          <p className="font-medium text-xl">{username}</p>
        </div>
        <TextEditor
          content={content}
          setContent={setContent}
          buttonText="Crear"
          range={[4, 50]}
        />
      </form>
    </>
  );
}
