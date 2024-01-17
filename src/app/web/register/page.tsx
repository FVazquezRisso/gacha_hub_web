"use client";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useState, useEffect } from "react";
import { validateFields } from "@/utils/validateField";
import { api } from "@/services/apiConfig";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent } from "react";
import { notification } from "@/utils/notification";

export default function Register() {
  const router = useRouter();
  const [data, setData] = useState({
    username: "",
    password: "",
    confirmPassword: " ",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [disabledButton, setDisabledButton] = useState(true);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.post("/users/register", data);
      if (response.status === 201) {
        notification("success", "Cuenta creada con éxito.");
        router.push("/web/login");
      }
    } catch (error: any) {
      if (error.response.status === 409) {
        notification("warn", "¡Nombre de usuario ocupado! Prueba con otro.");
      } else {
        notification("error", "Error inesperado. Inténtalo de nuevo más tarde.");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const errors = validateFields(data);
    setErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error !== "");
    setDisabledButton(hasErrors);
  }, [data]);

  return (
    <form onSubmit={handleSubmit} className="no-scroll-container gap-4">
      <div className="flex items-center">
        <Link href="/">
          <IoMdArrowRoundBack size={32} />
        </Link>
        <h1 className="text-5xl text-text-200 text-center m-4">Registro</h1>
      </div>
      <label>
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          autoComplete="off"
          className="form-input-text"
          onChange={handleChange}
          onPaste={(e) => e.preventDefault()}
        />
        {errors.username && (
          <p className="text-error-100 text-left mt-2">{errors.username}</p>
        )}
      </label>
      <label>
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          autoComplete="off"
          className="form-input-text"
          onChange={handleChange}
          onPaste={(e) => e.preventDefault()}
        />
        {errors.password && (
          <p className="text-error-100 text-left mt-2">{errors.password}</p>
        )}
      </label>
      <label>
        <input
          type="password"
          name="confirmPassword"
          autoComplete="off"
          placeholder="Repetir contraseña"
          className="form-input-text"
          onChange={handleChange}
          onPaste={(e) => e.preventDefault()}
        />
        {errors.confirmPassword && (
          <p className="text-error-100 text-left mt-2">
            {errors.confirmPassword}
          </p>
        )}
      </label>
      <button
        className={disabledButton ? "disabled-button mt-4" : "button mt-4"}
        disabled={disabledButton}
      >
        Crear cuenta
      </button>
      <Link href="/web/login" className="link mt-4">
        Ya tengo una cuenta
      </Link>
    </form>
  );
}
