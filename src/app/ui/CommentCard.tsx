"use client";
import { useRouter } from "next/navigation";
import UserCard from "../ui/UserCard";
import { timeAgo } from '../../utils/convertDate'

type Comment = {
  content: string;
  author: Author;
  createdAt: string;
};

type Author = {
  username: string;
  avatar: string;
  role: string;
};

export default function CommentCard({ content, author, createdAt }: Comment) {
  const router = useRouter();

  const handleClickUser = () => {
    router.push(`/web/profile/${author.username}`);
  };

  return (
    <div className="grid grid-cols-6 py-4 border-b-[1px] border-bg-300">
      <div className="col-span-1 flex justify-center  ">
        <UserCard username={author.username} avatar={author.avatar} />
      </div>
      <div className="col-span-5 pr-4">
        <h3 className="text-lg font-bold">{author.username}</h3>
        <p className="overflow-x-hidden whitespace-pre-wrap">{content}</p>
        <span className="text-text-300">{timeAgo(createdAt)}</span>
      </div>
    </div>
  );
}
