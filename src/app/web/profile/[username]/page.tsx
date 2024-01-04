"use client";
import { useState, useEffect } from "react";
import { api } from "@/services/apiConfig";
import PostCard from "@/app/ui/PostCard";
import { PostInterface } from "@/types/types";
import { oswald } from "@/app/ui/fonts";
import UserCard from "../../../ui/UserCard";
import { UserInterface, PostInterface } from "../../../../types/types.ts";
import Header from "../../../ui/Header";
import axios from "axios";
import { AiFillEdit } from "react-icons/ai";
import TextareaAutosize from "react-textarea-autosize";
import LoadingScreen from "../../../ui/LoadingScreen";
import { formatDate } from "../../../../utils/convertDate.ts";
import { notification } from '../../../../utils/notification.ts'

export default function Profile({ params }) {
  const { username } = params;
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const currentUser = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState<UserInterface | null>(null);
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [editBio, setEditBio] = useState(false);
  const [newBio, setNewBio] = useState(""); 
  const [disabledButtonBio, setDisabledButtonBio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    }
  };

  const getPosts = async () => {
    try {
      const response = await api.get(
        `/posts?username=${currentUser}&author=${username}`
      );
      if (response.status === 200) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickChangeBio = () => {
    setEditBio(true);
    setEditingProfile(false);
  };

  const handleChangeBio = (event) => {
    const { value } = event.target;
    setNewBio(value);
    setDisabledButtonBio(value.length > 200);
  };

  const handleShowEditProfile = () => {
    setEditingProfile(!editingProfile);
  };

  const handleAvatarChange = (e) => {
    setSelectedAvatar(e.target.files[0]);
    setSelectedBanner(null);
    handleShowEditProfile();
  };

  const handleBannerChange = (e) => {
    setSelectedBanner(e.target.files[0]);
    setSelectedAvatar(null);
    handleShowEditProfile();
  };

  const uploadAvatar = async () => {
    if (!selectedAvatar) {
      notification(
        "warning",
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
          localStorage.setItem("avatar", response.data.data.url);
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
        "warning",
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

  const handleSubmitBio = async () => {
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
      console.erro(error);
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
    getPosts();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
      <div className='mb-16'>
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
        <div className="pt-12 px-8">
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
            <div>
              <TextareaAutosize
                className="mt-6 resize-none bg-bg-100 outline-none border-b-2 border-primary-100 rounded-sm w-full px-2 text-text-200 text-lg"
                autoFocus
                value={newBio}
                onChange={handleChangeBio}
              />
              <h4 className="text-right block">
                <span className={disabledButtonBio ? "text-red-500" : ""}>
                  {newBio ? newBio.length : 0}
                </span>
                /200
              </h4>
              <button
                className={
                  disabledButtonBio ? "disabled-button mb-4" : "button mb-4"
                }
                disabled={disabledButtonBio}
                onClick={handleSubmitBio}
              >
                Guardar
              </button>
            </div>
          )}
          <span className='text-text-300'>Miembro desde: {formatDate(userData?.createdAt, true)}</span>
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
        <div className="flex flex-col mt-4 border-t-[1px] border-bg-300">
          {posts.length !== 0 &&
            posts.map((post: PostInterface) => {
              return (
                <PostCard
                  key={post.id}
                  id={post.id}
                  author={post.author}
                  content={post.content}
                  likeCount={post.likeCount}
                  userLikedPost={post.userLikedPost}
                  commentCount={post.commentCount}
                  createdAt={post.createdAt}
                />
              );
            })}
          {posts.length === 0 && (
            <div className="h-48 flex items-center justify-center">
              <p className={`${oswald.className} text-3xl text-center`}>
                ¡<span className="text-primary-200">{`${username} `}</span>
                no tiene publicaciones aún!
              </p>
            </div>
          )}
          {editingProfile && (
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
