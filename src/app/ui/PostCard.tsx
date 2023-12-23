'use client'
import { IoHeartOutline } from "react-icons/io5";
import { VscComment } from "react-icons/vsc";
import { useRouter } from 'next/navigation';

type props = {
  username: string;
  content: string;
  avatar: string;
  likeCount: number;
  commentsCount: number;
  id: number
};

export default function PostCard({
  username,
  content,
  avatar,
  likeCount,
  commentsCount,
  id
}: props) {
  const contentSplitted =
    content.length > 225 ? `${content.substring(0, 200)}...` : content;
  const router = useRouter()

  const handleClickCard = () => {
    router.push(`/web/detail/post/:${id}`)
  };

  const handleClickUser = () => {
    router.push(`/web/profile/:${username}`);
  };

  const handleClickHeart = () => {
    console.log("click heart");
  };

  return (
    <div className="p-4 pb-0 border-b-[1px] border-bg-300">
      <div className="h-16 flex justify-start items-center gap-4">
        <img
          src={avatar}
          alt={username}
          className="w-10 rounded-full"
          onClick={handleClickUser}
        />
        <p className="font-medium" onClick={handleClickUser}>
          {username}
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
          <IoHeartOutline size={20} onClick={handleClickHeart} />
          {likeCount}
        </span>
        <span className="flex items-center gap-1">
          <VscComment size={20} />
          {commentsCount}
        </span>
      </div>
    </div>
  );
}
