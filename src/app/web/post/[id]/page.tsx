"use client";
import { useState, useEffect } from "react";
import { api } from "../../../../services/apiConfig";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { VscComment } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import CommentCard from "@/app/ui/CommentCard";
import { oswald } from "@/app/ui/fonts";
import TextareaAutosize from "react-textarea-autosize";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PostDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const username = localStorage.getItem("username");
  const [post, setPost] = useState({});
  const avatar = localStorage.getItem("avatar");
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [disabledButton, setDisabledButton] = useState(true);
  const [content, setContent] = useState("");
  const [commentCount, setCommentCount] = useState(0)

  const getPost = async () => {
    try {
      const response = await api.get(`posts/${id}?username=${username}`);
      if (response.status === 200) {
        setPost(response.data);
        setIsLiked(response.data.userLikedPost);
        setLikes(response.data.likeCount);
        setCommentCount(response.data.commentCount)
      }
    } catch (error) {
      console.error(error);
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

  const handleClickUser = () => {
    router.push(`/web/profile/${post.author.username}`);
  };

  const handleClickHeart = async () => {
    try {
      const token = localStorage.getItem("token");
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
    setDisabledButton(value.length < 5 || value.length > 200);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/comments/${id}`, { content }, {
        headers: { "x-access-token": token },
      });
      if (response.status === 201) {
        toast.success("Comentario publicado con éxito.", {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 1500,
        });
        getComments()
        setContent('')
        setCommentCount(commentCount + 1)
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

  return (
    <>
      <div className="mb-16">
        <div className="w-screen h-16 bg-primary-100 flex items-center p-4">
          <h2 className="text-2xl font-semibold">
            Publicación de {post?.author?.username}
          </h2>
        </div>
        <article className="w-screen flex justify-center items-center flex-col p-6 pb-0 border-b-[1px] border-bg-300">
          <div className="h-12 w-screen flex justify-start items-center gap-4 p-6">
            <img
              src={post?.author?.avatar}
              alt={post?.author?.username}
              className="w-12 rounded-full"
              onClick={handleClickUser}
            />
            <p className="font-medium text-xl" onClick={handleClickUser}>
              {post?.author?.username}
            </p>
          </div>
          <p className="overflow-x-hidden whitespace-pre-wrap break-all mt-4 w-screen px-8">
            {post.content}
          </p>
          <div className="h-12 w-screen flex items-center justify-around p-8">
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
          <form onSubmit={handleSubmit} className="flex items-start flex-col mb-4">
            <div className="h-12 w-screen flex justify-start items-center gap-4 px-6 py-4">
              <img
                src={avatar}
                alt={username}
                className="w-10 rounded-full"
                onClick={handleClickUser}
              />
              <p className="font-medium text-lg" onClick={handleClickUser}>
                {username}
              </p>
            </div>
            <div>
              <TextareaAutosize
                className="w-3/4 mt-6 resize-none bg-bg-100 outline-none border-b-2 border-primary-100 rounded-sm px-2 text-text-200 text-lg ml-12"
                autoFocus
                onChange={handleChange}
                value={content}
              />
              <div className="w-screen flex justify-end py-2 px-6">
                <h4>
                  <span className={disabledButton ? "text-red-500" : ""}>
                    {content.length}
                  </span>
                  / 200
                </h4>
              </div>
            </div>
            <button
              className={
                disabledButton ? "disabled-button mx-8" : "button mx-8"
              }
            >
              Comentar
            </button>
          </form>
          {comments.length !== 0 &&
            comments.map(({ id, content, author }) => {
              return <CommentCard key={id} content={content} author={author} />;
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
      </div>
      <ToastContainer />
    </>
  );
}
