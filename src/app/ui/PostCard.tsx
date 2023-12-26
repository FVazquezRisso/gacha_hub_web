"use client";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { VscComment } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { PostInterface } from "@/types/posts.types";
import { useState, useEffect } from "react";
import { api } from "@/services/apiConfig";

export default function PostCard({
  author,
  content,
  likeCount,
  userLikedPost,
  id,
  commentCount
}: PostInterface) {
  const contentSplitted =
    content.length > 225 ? `${content.substring(0, 200)}...` : content;
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(userLikedPost);
  const [likes, setLikes] = useState(likeCount)

  const handleClickCard = () => {
    router.push(`/web/post/${id}`);
  };

  const handleClickUser = () => {
    router.push(`/web/profile/${author.username}`);
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
          setLikes(likes - 1)
        } else {
          setLikes(likes + 1)
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {}, [isLiked]);

  return (
    <div className="p-4 pb-0 border-b-[1px] border-bg-300">
      <div className="h-16 flex justify-start items-center gap-4">
        <img
          src={author.avatar}
          alt={author.username}
          className="w-10 rounded-full"
          onClick={handleClickUser}
        />
        <p className="font-medium" onClick={handleClickUser}>
          {author.username}
        </p>
      </div>
      <p
        className="overflow-x-hidden whitespace-pre-wrap break-all"
        onClick={handleClickCard}
      >
        {contentSplitted}
      </p>
      <div className="h-12 flex items-center justify-around">
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
    </div>
  );
}
