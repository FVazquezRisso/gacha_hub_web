"use client";
import { useRouter } from "next/navigation";
import UserCard from "../ui/UserCard";

type comment = {
  content: string;
  author: author;
};

type author = {
  username: string;
  avatar: string;
  role: string;
};

export default function CommentCard({ content, author }: comment) {
  const router = useRouter();

  const handleClickUser = () => {
    router.push(`/web/profile/${author.username}`);
  };

  return (
    <div className="grid grid-cols-6 pt-4">
      <div className="col-span-1 flex justify-center  ">
        <UserCard username={author.username} avatar={author.avatar} />
      </div>
      <div className="col-span-5 pr-4">
        <h3 className="text-lg font-bold">{author.username}</h3>
        <p className="overflow-x-hidden whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
}
