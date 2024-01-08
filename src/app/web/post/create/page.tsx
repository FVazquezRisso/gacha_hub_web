"use client";
import { useState, FormEvent } from "react";
import { api } from "@/services/apiConfig";
import { useRouter } from "next/navigation";
import { notification } from "@/utils/notification";
import TextEditor from "@/app/ui/TextEditor";
import Header from "@/app/ui/Header";
import cookies from 'js-cookie'

export default function PostCreate() {
  const router = useRouter();
  const avatar: any = cookies.get("avatar");
  const username: any = cookies.get("username");
  const [content, setContent] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = cookies.get("token");
      const response = await api.post(
        "/posts",
        { content: content },
        { headers: { "x-access-token": token } }
      );
      if (response.status === 201) {
        notification("success", "Publicación creada con éxito.");
        setTimeout(() => {
          router.back();
        }, 1500);
      }
    } catch (error) {
      notification("error", "Error inesperado. Inténtalo de nuevo más tarde.");
      console.error(error);
    }
  };

  return (
    <div className="mb-24">
      <Header title="Crear publicación" />
      <form onSubmit={handleSubmit} className='px-4'>
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
          buttonText="Publicar"
          range={[10, 1000]}
        />
      </form>
    </div>
  );
}
