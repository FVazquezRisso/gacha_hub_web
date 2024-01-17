"use client";
import { useState, useEffect } from "react";
import { GroupInterface, PostInterface } from "@/types/types";
import { api } from "@/services/apiConfig";
import LoadingScreen from "@/app/ui/LoadingScreen";
import { useInView } from "react-intersection-observer";
import { oswald } from "@/app/ui/fonts";
import cookies from "js-cookie";
import PostCard from "@/app/ui/PostCard";
import Header from "@/app/ui/Header";
import { formatDate } from "@/utils/convertDate";
import { notification } from "@/utils/notification";
import { IoMdCreate } from "react-icons/io";
import { useRouter } from "next/navigation";

type Props = {
  params: {
    id: number;
  };
};

export default function GroupDetail({ params }: Props) {
  const { id } = params;
  const router = useRouter();
  const [groupDetail, setGroupDetail] = useState<GroupInterface>({});
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const username = cookies.get("username");
  const token = cookies.get("token");

  const getGroupDetail = async () => {
    try {
      const response = await api.get(`/groups/${id}?username=${username}`);
      setGroupDetail(response.data);
      getPosts();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPosts = async () => {
    try {
      if (!hasMorePosts) {
        return;
      }
      const response = await api.get(
        `/posts?groupId=${id}&page=${currentPage}&username=${username}`
      );
      if (response.status === 200) {
        setPosts([...posts, ...response.data.posts]);
        if (response.data.posts.length < 10) {
          setHasMorePosts(false);
          return;
        }
        setCurrentPage(currentPage + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      const method = groupDetail?.userJoined ? "delete" : "post";
      const headers = {
        headers: { "x-access-token": token },
      };
      const response = await api[method](`/groups/${id}`, headers, headers);
      if (response.status === 204) {
        getGroupDetail();
      }
    } catch (error) {
      notification(
        "error",
        "Error al unirse al grupo. Por favor, inténtalo de nuevo."
      );
      console.error(error);
    }
  };

  const handleClickCreatePost = () => {
    router.push(`/web/post/create?groupId=${id}`);
  };

  useEffect(() => {
    getGroupDetail();
  }, [inView]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header title="Información del Grupo" />
      <div className="pb-16">
        <div className="p-4 border-b-[1px] border-bg-300 flex flex-col gap-2">
          <h3 className="text-3xl font-bold mb-2">{groupDetail.name}</h3>
          <span className="text-text-300">
            Creado: {formatDate(groupDetail.createdAt)}
          </span>
          <div className="flex gap-8">
            <span className="text-text-300">
              <span className="font-bold text-text-200">
                {groupDetail.postCount}
              </span>{" "}
              Publicaciones
            </span>
            <span className="text-text-300">
              <span className="font-bold text-text-200">
                {groupDetail.userCount}
              </span>{" "}
              Miembros
            </span>
            <button onClick={handleJoin}>
              {groupDetail?.userJoined ? "Unido" : "Unirse"}
            </button>
          </div>
        </div>
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
                updatedAt={post.updatedAt}
                deletedAt={post.deletedAt}
              />
            );
          })}
        <div ref={ref}></div>
        {!hasMorePosts && (
          <div className="h-48 flex items-center justify-center">
            <p className={`${oswald.className} text-3xl text-center`}>
              <span className="text-primary-200">¡Fin del Grupo!</span> <br />{" "}
              ¡A esperar más sorpresas!{" "}
            </p>
          </div>
        )}
      </div>
      {groupDetail.userJoined && (
        <div
          className="h-14 w-14 bg-primary-100 rounded-full border-4 border-primary-100 fixed bottom-[5.5rem] right-6 flex items-center justify-center"
          onClick={handleClickCreatePost}
        >
          <IoMdCreate size={32} className="text-text-200" />
        </div>
      )}
    </>
  );
}
