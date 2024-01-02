"use client";
import { useState, useEffect } from "react";
import { api } from "../../../../services/apiConfig";
import {
  IoHeartOutline,
  IoHeartSharp,
  IoEllipsisVerticalSharp,
} from "react-icons/io5";
import { VscComment } from "react-icons/vsc";
import CommentCard from "@/app/ui/CommentCard";
import { oswald } from "@/app/ui/fonts";
import TextareaAutosize from "react-textarea-autosize";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CommentInterface, PostInterface } from "../../../../types/types";
import UserCard from "../../../ui/UserCard";
import Header from "../../../ui/Header";
import LoadingScreen from "../../../ui/LoadingScreen";
import { formatDate } from "../../../../utils/convertDate";
import { useRouter } from 'next/navigation'

export default function PostDetail({ params }) {
  const { id } = params;
  const router = useRouter()
  const username = localStorage.getItem("username");
  const [post, setPost] = useState<PostInterface | null>(null);
  const avatar = localStorage.getItem("avatar");
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<CommentInterface[]>([]);
  const [disabledButton, setDisabledButton] = useState(true);
  const [content, setContent] = useState("");
  const [commentCount, setCommentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const getPost = async () => {
    try {
      const response = await api.get(`posts/${id}?username=${username}`);
      if (response.status === 200) {
        setPost(response.data);
        setIsLiked(response.data.userLikedPost);
        setLikes(response.data.likeCount);
        setCommentCount(response.data.commentCount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getComments = async () => {
    try {
      const response = await api.get(`comments/${id}`);
      if (response.status === 200) {
        setComments(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickHeart = async () => {
    try {
      const response = await api.post(`posts/like/${id}`, null, {
        headers: {
          "x-access-token": token,
        },
      });
      if (response.status === 204) {
        setIsLiked(!isLiked);
        if (isLiked) {
          setLikes(likes - 1);
        } else {
          setLikes(likes + 1);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setContent(value);
    setDisabledButton(
      value.replace(/\s+/g, " ").length < 5 ||
        value.replace(/\s+/g, " ").length > 200
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post(
        `/comments/${id}`,
        { content: content.replace(/\s+/g, " ") },
        {
          headers: { "x-access-token": token },
        }
      );
      if (response.status === 201) {
        toast.success("Comentario publicado con éxito.", {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 1500,
        });
        getComments();
        setContent("");
        setCommentCount(commentCount + 1);
        setDisabledButton(true);
      }
    } catch (error) {
      toast.error("Error inesperado. Inténtalo de nuevo más tarde.", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
      });
      console.error(error);
    }
  };

  const handleShowMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickDeletePost = async () => {
    try {
      const response = await api.delete(`/posts/${id}`, {
        headers: {
          "x-access-token": token,
        },
      });
      if (response.status === 204) {
        toast.success("Publicación eliminada con éxito", {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 1500,
        });
        setTimeout(() => {
          router.back()
        }, 1500)
      }
    } catch (error) {
      toast.error("Error inesperado. Inténtalo de nuevo más tarde.", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
      });
      console.error(error);
    }
  };

  useEffect(() => {
    getPost();
    getComments();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="mb-16">
        <Header title={`Publicación de ${post?.author?.username}`} />
        <article className="w-screen flex flex-col p-6 pb-0 border-b-[1px] border-bg-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UserCard
                username={post?.author?.username}
                avatar={post?.author?.avatar}
              />
              <h3 className="text-lg font-bold">{post?.author?.username}</h3>
            </div>
            {post?.author?.username === username && (
              <IoEllipsisVerticalSharp size={20} onClick={handleShowMenu} />
            )}
          </div>
          <p className="overflow-x-hidden whitespace-pre-wrap break-all mt-4">
            {post?.content}
          </p>
          <span className="text-text-300">
            {formatDate(post?.createdAt, false)}
          </span>
          <div className="h-12 flex items-center justify-around py-4">
            <span className="flex items-center gap-1">
              {isLiked ? (
                <IoHeartSharp size={20} onClick={handleClickHeart} />
              ) : (
                <IoHeartOutline size={20} onClick={handleClickHeart} />
              )}
              {likes}
            </span>
            <span className="flex items-center gap-1">
              <VscComment size={20} />
              {commentCount}
            </span>
          </div>
        </article>
        <div className="py-4 flex gap-6 flex-col">
          <h2 className="text-2xl text-center mt-4">Comentarios</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-6">
            <div className="flex justify-center">
              <UserCard username={username} avatar={avatar} />
            </div>
            <div className="col-span-5 pr-4">
              <h3 className="text-lg font-bold">{username}</h3>
              <TextareaAutosize
                className="w-full mt-2 resize-none bg-bg-100 outline-none border-b-2 border-primary-100 rounded-sm text-text-200"
                autoFocus
                onChange={handleChange}
                value={content}
              />
              <div className="flex justify-end">
                <h4>
                  <span className={disabledButton ? "text-red-500" : ""}>
                    {content.length}
                  </span>
                  / 200
                </h4>
              </div>
              <button className={disabledButton ? "disabled-button" : "button"}>
                Comentar
              </button>
            </div>
          </form>
          {comments.length !== 0 &&
            comments.map(({ id, content, author, createdAt }) => {
              return (
                <CommentCard
                  key={id}
                  content={content}
                  author={author}
                  createdAt={createdAt}
                />
              );
            })}
          {comments.length === 0 && (
            <div className="h-48 flex items-center justify-center">
              <p className={`${oswald.className} text-3xl text-center`}>
                <span className="text-primary-200">¡Sin comentarios!</span>
                <br />
                ¡Sé el primero en comentar!
              </p>
            </div>
          )}
        </div>
        {isMenuOpen && (
          <div className="no-scroll-container fixed top-0 z-10 bg-black bg-opacity-80">
            <div className="flex flex-col gap-4 bg-primary-100 items-center py-8 px-12 text-xl rounded-md">
              <span>Editar</span>
              <span onClick={handleClickDeletePost}>Eliminar</span>
              <span onClick={handleShowMenu} className="font-bold">
                Cerrar
              </span>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
