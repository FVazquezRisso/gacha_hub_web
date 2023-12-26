"use client";
import { useRouter } from 'next/navigation';

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
  const router = useRouter()

  const handleClickUser = () => {
    router.push(`/web/profile/${author.username}`);
  };

  return (
    <div>
      <div className="h-12 w-screen flex justify-start items-center gap-4 px-6 py-4">
        <img
          src={author.avatar}
          alt={author.username}
          className="w-10 rounded-full"
          onClick={handleClickUser}
        />
        <p className="font-medium text-lg" onClick={handleClickUser}>
          {author.username}
        </p>
      </div>
      <p className='overflow-x-hidden whitespace-pre-wrap break-all py-4 px-12'>
        {content}
      </p>
    </div>
  );
}
