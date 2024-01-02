"use client";
import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import { api } from "../../../../services/apiConfig.ts";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PostCreate() {
  const router = useRouter();
  const avatar = localStorage.getItem("avatar");
  const username = localStorage.getItem("username");
  const [content, setContent] = useState("");
  const [disabledButton, setDisabledButton] = useState(true);

  const handleChange = (event) => {
    const { value } = event.target;
    setContent(value);
    setDisabledButton(
      value.replace(/\s+/g, " ").length < 10 ||
        value.replace(/\s+/g, " ").length > 1000
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setDisabledButton(true)
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/posts",
        { content: content.replace(/\s+/g, " ") },
        { headers: { "x-access-token": token } }
      );
      if (response.status === 201) {
        toast.success("Publicación creada con éxito.", {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 1500,
        });
        setTimeout(() => {
          router.back();
        }, 1500);
      }
    } catch (error) {
      toast.error("Error inesperado. Inténtalo de nuevo más tarde.", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
      });
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-24">
        <div className="w-screen h-16 bg-primary-100 flex items-center p-4">
          <h2 className="text-2xl font-semibold">Crear publicación</h2>
        </div>
        <div className="w-screen flex justify-center items-center flex-col p-4 pb-0">
          <div className="h-16 w-screen flex justify-start items-center gap-4 p-4">
            <img
              src={avatar}
              alt={username}
              className="w-12 aspect-square object-cover rounded-full"
            />
            <p className="font-medium text-xl">{username}</p>
          </div>
          <TextareaAutosize
            className="mt-6 resize-none bg-bg-100 outline-none border-b-2 border-primary-100 rounded-sm w-full px-2 text-text-200 text-lg"
            autoFocus
            onChange={handleChange}
          />
          <div className="w-screen flex justify-end py-2 px-6">
            <h4>
              <span className={disabledButton ? "text-red-500" : ""}>
                {content.length}
              </span>
              / 1000
            </h4>
          </div>
        </div>
        <button
          className={disabledButton ? "disabled-button mx-4" : "button mx-4"}
        >
          Publicar
        </button>
      </form>
      <ToastContainer />
    </>
  );
}
