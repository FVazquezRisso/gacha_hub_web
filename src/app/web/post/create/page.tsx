"use client";
import { useState, useEffect, FormEvent } from "react";
import { api } from "@/services/apiConfig";
import { useRouter } from "next/navigation";
import { notification } from "@/utils/notification";
import TextEditor from "@/app/ui/TextEditor";
import Header from "@/app/ui/Header";
import cookies from "js-cookie";
import LoadingScreen from "@/app/ui/LoadingScreen";

export default function PostCreate() {
  const router = useRouter();
  const avatar: any = cookies.get("avatar");
  const username: any = cookies.get("username");
  const [content, setContent] = useState("");
  const [groupName, setGroupName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = cookies.get("token");

  let groupId
  if (typeof window !== "undefined") {
    const url = window.location.href;
    const searchParams = new URLSearchParams(new URL(url).search);
    groupId = searchParams.get("groupId");
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const body: any = { content };
      if (groupId) body.groupId = groupId;
      const response = await api.post("/posts", body, {
        headers: { "x-access-token": token },
      });
      if (response.status === 201) {
        notification("success", "Publicación creada con éxito.");
        router.back();
      }
    } catch (error) {
      notification("error", "Error inesperado. Inténtalo de nuevo más tarde.");
      console.error(error);
    }
  };

  const getGroup = async () => {
    if (!groupId) return;
    try {
      const response = await api.get(`/groups/${groupId}`, {
        headers: {
          "x-access-token": token,
        },
      });
      if (response.status === 200) {
        setGroupName(response.data.name);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (groupId) {
        getGroup();
      } else {
        setIsLoading(false);
      }
    }
  }, [groupId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="mb-24">
      <Header title="Crear publicación" />
      <form onSubmit={handleSubmit} className="px-4">
        <div className="h-16 w-full flex justify-start items-center gap-4 mt-4">
          <img
            src={avatar}
            alt={username}
            className="w-12 aspect-square object-cover rounded-full"
          />
          <p className="font-medium text-xl">{username}</p>
        </div>
        {groupName && (
          <h3 className="text-text-300">
            {`Se publicará en el grupo "${groupName}"`}
          </h3>
        )}
        <TextEditor
          content={content}
          setContent={setContent}
          buttonText="Publicar"
          range={[10, 1000]}
          title="Contenido"
        />
      </form>
    </div>
  );
}
