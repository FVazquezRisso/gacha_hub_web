"use client";
import { useState, useEffect, FormEvent } from "react";
import { api } from "@/services/apiConfig";
import {
  IoHeartOutline,
  IoHeartSharp,
  IoEllipsisVerticalSharp,
} from "react-icons/io5";
import { VscComment } from "react-icons/vsc";
import CommentCard from "@/app/ui/CommentCard";
import { oswald } from "@/app/ui/fonts";
import { CommentInterface, PostInterface } from "@/types/types";
import UserCard from "@/app/ui/UserCard";
import Header from "@/app/ui/Header";
import LoadingScreen from "@/app/ui/LoadingScreen";
import { formatDate } from "@/utils/convertDate";
import { useRouter } from "next/navigation";
import { notification } from "@/utils/notification";
import TextEditor from "@/app/ui/TextEditor";
import cookies from "js-cookie";

type Props = {
  params: {
    id: number;
  };
};

export default function PostDetail({ params }: Props) {
  const { id } = params;
  const router = useRouter();
  const username = cookies.get("username");
  const avatar = cookies.get("avatar");
  const token = cookies.get("token");
  const [post, setPost] = useState<PostInterface | null>(null);
  const [comments, setComments] = useState<CommentInterface[]>([]);
  const [content, setContent] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const isEdited = post?.createdAt !== post?.updatedAt;
  const edited = isEdited ? "- editado" : "";
  const [count, setCount] = useState({
    comments: 0,
    likes: 0,
  });
  const [boolean, setBoolean] = useState({
    isLoading: true,
    isMenuOpen: false,
  });
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const getPost = async () => {
    try {
      const response = await api.get(`posts/${id}?username=${username}`);
      if (response.status === 200) {
        setPost(response.data);
        setIsLiked(response.data.userLikedPost);
        setCount({
          comments: response.data.commentCount,
          likes: response.data.likeCount,
        });
        setNewPostContent(response.data.content);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setBoolean({ ...boolean, isLoading: false });
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
          setCount({ ...count, likes: count.likes - 1 });
        } else {
          setCount({ ...count, likes: count.likes + 1 });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.post(
        `/comments/${id}`,
        { content: content },
        {
          headers: { "x-access-token": token },
        }
      );
      if (response.status === 201) {
        notification("success", "Comentario publicado con éxito.");
        getComments();
        setContent("");
        setCount({ ...count, comments: count.comments + 1 });
        setBoolean({ ...boolean });
      }
    } catch (error) {
      notification("error", "Error inesperado. Inténtalo de nuevo más tarde.");
      console.error(error);
    }
  };

  const handleShowMenu = () => {
    setBoolean({ ...boolean, isMenuOpen: !boolean.isMenuOpen });
  };

  const handleClickDeletePost = async () => {
    try {
      const response = await api.delete(`/posts/${id}`, {
        headers: {
          "x-access-token": token,
        },
      });
      if (response.status === 204) {
        notification("success", "Publicación eliminada con éxito");
        setTimeout(() => {
          router.back();
        }, 1500);
      }
    } catch (error) {
      notification("error", "Error inesperado. Inténtalo de nuevo más tarde.");
      console.error(error);
    }
  };

  const handleClickEditPost = () => {
    setBoolean({ ...boolean, isMenuOpen: false });
    setIsEditingPost(true);
  };

  const handleSubmitModifiedPost = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      const response = await api.patch(
        `/posts/${id}`,
        { content: newPostContent },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (response.status === 204) {
        notification("success", "El post de ha modificado satisfactoriamente.");
        setIsEditingPost(false);
        getPost();
      }
    } catch (error) {
      notification(
        "error",
        "Ha ocurrido un error al intentar modificar el post."
      );
      console.error(error);
    }
  };

  useEffect(() => {
    getPost();
    getComments();
  }, []);

  if (boolean.isLoading) {
    return <LoadingScreen />;
  }

  return (
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
        {isEditingPost ? (
          <form onSubmit={handleSubmitModifiedPost}>
            <TextEditor
              content={newPostContent}
              setContent={setNewPostContent}
              buttonText="Guardar"
              range={[10, 1000]}
            />
          </form>
        ) : (
          <p className="overflow-x-hidden whitespace-pre-wrap break-all mt-4">
            {post?.content}
          </p>
        )}
        <span className="text-text-300">
          {`${formatDate(post?.createdAt, false)} ${edited}`}
        </span>
        <div className="h-12 flex items-center justify-around py-4">
          <span className="flex items-center gap-1">
            {isLiked ? (
              <IoHeartSharp size={20} onClick={handleClickHeart} />
            ) : (
              <IoHeartOutline size={20} onClick={handleClickHeart} />
            )}
            {count.likes}
          </span>
          <span className="flex items-center gap-1">
            <VscComment size={20} />
            {count.comments}
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
            <TextEditor
              content={content}
              setContent={setContent}
              buttonText="Comentar"
              range={[5, 200]}
            />
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
      {boolean.isMenuOpen && (
        <div className="no-scroll-container fixed top-0 z-10 bg-black bg-opacity-80">
          <div className="flex flex-col gap-4 bg-primary-100 items-center py-8 px-12 text-xl rounded-md">
            <span onClick={handleClickEditPost}>Editar</span>
            <span onClick={handleClickDeletePost}>Eliminar</span>
            <span onClick={handleShowMenu} className="font-bold">
              Cerrar
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
