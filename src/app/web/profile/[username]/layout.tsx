"use client";
import { useState, useEffect, FormEvent, ReactNode } from "react";
import { api } from "@/services/apiConfig";
import { UserInterface } from "@/types/types";
import Header from "@/app/ui/Header";
import axios from "axios";
import { AiFillEdit } from "react-icons/ai";
import LoadingScreen from "@/app/ui/LoadingScreen";
import { formatDate } from "@/utils/convertDate";
import { notification } from "@/utils/notification";
import TextEditor from "@/app/ui/TextEditor";
import cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";

type props = {
  params: {
    username: string;
  };
  children: ReactNode;
};

export default function ProfileLayout({ params, children }: props) {
  const { username } = params;
  const pathname = usePathname();
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const currentUser = cookies.get("username");
  const token = cookies.get("token");
  const [userData, setUserData] = useState<UserInterface | null>(null);
  const [newBio, setNewBio] = useState("");
  const [editBio, setEditBio] = useState(false);
  const [boolean, setBoolean] = useState({
    editingProfile: false,
    isLoading: true,
  });
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const getData = async () => {
    try {
      const response = await api.get(`/users/${username}`, {
        headers: { "x-access-token": token },
      });
      if (response.status === 200) {
        setUserData(response.data);
        setNewBio(response.data.bio);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBoolean({ ...boolean, isLoading: false });
    }
  };

  const handleClickChangeBio = () => {
    setEditBio(true);
    setBoolean((prevState) => ({ ...prevState, editingProfile: false }));
  };

  const handleShowEditProfile = () => {
    setBoolean({ ...boolean, editingProfile: !boolean.editingProfile });
  };

  const handleAvatarChange = (e: any) => {
    setSelectedAvatar(e.target.files[0]);
    setSelectedBanner(null);
    handleShowEditProfile();
  };

  const handleBannerChange = (e: any) => {
    setSelectedBanner(e.target.files[0]);
    setSelectedAvatar(null);
    handleShowEditProfile();
  };

  const uploadAvatar = async () => {
    if (!selectedAvatar) {
      notification(
        "warn",
        "Por favor, selecciona una imagen antes de subirla."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedAvatar);

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}&name=${username}-avatar`,
        formData
      );

      if (response.status === 200) {
        const res = await api.patch(
          `/users/${username}`,
          {
            avatar: response.data.data.url,
          },
          { headers: { "x-access-token": token } }
        );

        if (res.status === 204) {
          notification("success", "El avatar se ha actualizado con éxito.");
          cookies.set("avatar", response.data.data.url);
          getData();
        }
        setSelectedAvatar(null);
      }
    } catch (error) {
      notification(
        "error",
        "Error al subir el avatar. Por favor, inténtalo de nuevo."
      );
      console.error(error);
    }
  };

  const uploadBanner = async () => {
    if (!selectedBanner) {
      notification(
        "warn",
        "Por favor, selecciona una imagen antes de subirla."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", selectedBanner);

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}&name=${username}-banner`,
        formData
      );

      if (response.status === 200) {
        const res = await api.patch(
          `/users/${username}`,
          {
            banner: response.data.data.url,
          },
          { headers: { "x-access-token": token } }
        );

        if (res.status === 204) {
          notification("success", "El banner se ha actualizado con éxito.");
          getData();
        }
        setSelectedBanner(null);
      }
    } catch (error) {
      notification(
        "error",
        "Error al subir el banner. Por favor, inténtalo de nuevo."
      );
      console.error(error);
    }
  };

  const handleSubmitBio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await api.patch(
        `/users/${username}`,
        {
          bio: newBio,
        },
        { headers: { "x-access-token": token } }
      );

      if (res.status === 204) {
        setEditBio(false);
        notification("success", "La bio se ha actualizado con éxito.");
        getData();
      }
    } catch (error) {
      notification(
        "error",
        "Error al editar la bio. Por favor, inténtalo de nuevo."
      );
      console.error(error);
    }
  };

  const handleFollow = async () => {
    try {
      const method = userData?.isFollowing ? "delete" : "post";
      const headers = {
        headers: { "x-access-token": token },
      };
      const response = await api[method](
        `/follows/${username}`,
        headers,
        headers
      );
      if (response.status === 200) {
        getData();
      }
    } catch (error) {
      notification(
        "error",
        "Error al seguir al usuario. Por favor, inténtalo de nuevo."
      );
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (boolean.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="mb-16">
      <Header title={`Perfil de ${username}`} />
      <div>
        <img
          src={userData?.banner}
          alt={`Banner de ${username}`}
          className="object-cover aspect-3/1 w-full"
        />
        <img
          src={userData?.avatar}
          alt={username}
          className="w-20 aspect-square object-cover rounded-full absolute -translate-y-1/2 translate-x-4 border-4 border-bg-100"
        />
      </div>
      <div className="pt-12 px-8 border-b-[1px] border-bg-300 pb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{username}</h2>
          {currentUser === username && (
            <AiFillEdit size={24} onClick={handleShowEditProfile} />
          )}
        </div>
        {!editBio ? (
          <p className="overflow-x-hidden whitespace-pre-wrap pb-2 mt-2">
            {userData?.bio}
          </p>
        ) : (
          <form onSubmit={handleSubmitBio}>
            <TextEditor
              content={newBio}
              setContent={setNewBio}
              buttonText="Guardar"
              range={[0, 200]}
              title="Bio"
            />
          </form>
        )}
        <span className="text-text-300">
          Miembro desde: {formatDate(userData?.createdAt, true)}
        </span>
        <div className="flex justify-between mt-2">
          <div className="flex gap-4">
            <h4 className="text-text-300">
              <span className="font-bold text-text-100">
                {userData?.followingCount}
              </span>{" "}
              Siguiendo
            </h4>
            <h4 className="text-text-300">
              <span className="font-bold text-text-100">
                {userData?.followersCount}
              </span>{" "}
              Seguidores
            </h4>
          </div>
          {currentUser !== username && (
            <button onClick={handleFollow}>
              {userData?.isFollowing ? "Siguiendo" : "Seguir"}
            </button>
          )}
        </div>
      </div>
      <div className="h-12 bg-bg-100 flex items-center justify-around w-screen text-xl font-semibold">
        <Link
          href={`/web/profile/${username}/posts`}
          className={`${
            pathname === `/web/profile/${username}/posts` &&
            "border-b-2 border-text-100 text-text-100"
          } h-full flex items-center w-1/2 justify-center`}
        >
          Publicaciones
        </Link>
        <Link
          href={`/web/profile/${username}/groups`}
          className={`${
            pathname === `/web/profile/${username}/groups` &&
            "border-b-2 border-text-100 text-text-100"
          } h-full flex items-center w-1/2 justify-center`}
        >
          Grupos
        </Link>
      </div>
      <div className="flex flex-col mt-4">
        {children}
        {boolean.editingProfile && (
          <div className="no-scroll-container top-0 z-10 bg-black bg-opacity-80 fixed">
            <div className="flex flex-col gap-4 bg-primary-100 items-center py-8 px-12 text-xl rounded-md">
              <label htmlFor="changeAvatarInput">Cambiar avatar</label>
              <label htmlFor="changeBannerInput">Cambiar banner</label>
              <span onClick={handleClickChangeBio}>Cambiar bio</span>
              <span onClick={handleShowEditProfile} className="font-bold">
                Cerrar
              </span>
            </div>
          </div>
        )}
        <div>
          <input
            type="file"
            id="changeAvatarInput"
            onChange={handleAvatarChange}
            accept=".jpg, .jpeg, .png"
            className="hidden"
          />
          {selectedAvatar && (
            <button
              onClick={uploadAvatar}
              className="button absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-20"
            >
              Cambiar avatar
            </button>
          )}
        </div>
        <div>
          <input
            type="file"
            id="changeBannerInput"
            onChange={handleBannerChange}
            accept=".jpg, .jpeg, .png"
            className="hidden"
          />
          {selectedBanner && (
            <button
              onClick={uploadBanner}
              className="button absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-20"
            >
              Cambiar banner
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
