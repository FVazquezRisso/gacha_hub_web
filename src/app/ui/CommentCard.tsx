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
    <div>
      <div className='mx-8'>
        <UserCard username={author.username} avatar={author.avatar} size={10} />
      </div>
      <p className="overflow-x-hidden whitespace-pre-wrap break-all py-4 px-12">
        {content}
      </p>
    </div>
  );
}
