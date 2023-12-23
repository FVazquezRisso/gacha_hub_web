"use client";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useState, useEffect } from "react";
import { api } from "../../../services/apiConfig";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const router = useRouter();
  const [data, setData] = useState({});

  const [disabledButton, setDisabledButton] = useState(true);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/users/login", data);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        router.push("/web/home/latest");
      }
    } catch (error) {
      toast.error("Usuario o contraseña incorrectos.", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
      });
      console.error(error);
    }
  };

  useEffect(() => {
    if (data.username && data.password) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [data]);

  return (
    <>
      <form onSubmit={handleSubmit} className="no-scroll-container gap-4">
        <div className="flex items-center">
          <Link href="/web">
            <IoMdArrowRoundBack size={32} />
          </Link>
          <h1 className="text-5xl text-text-200 text-center m-4">Ingresar</h1>
        </div>
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          autoComplete="off"
          className="form-input-text"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          autoComplete="off"
          className="form-input-text"
          onChange={handleChange}
        />
        <button
          className={disabledButton ? "disabled-button" : "button"}
          disabled={disabledButton}
        >
          Iniciar sesión
        </button>
        <Link href="/web/register" className="link mt-4">
          No tengo una cuenta aún
        </Link>
      </form>
      <ToastContainer />
    </>
  );
}
