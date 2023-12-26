'use client'
import { useRouter } from 'next/navigation'

export default function UserCard({ username, avatar, size = 12 }) {
  const router = useRouter()

  const handleClickUser = () => {
    router.push(`/web/profile/${username}`);
  };

  return (
    <div className="h-12 flex justify-start items-center gap-4 my-4" onClick={handleClickUser}>
      <img src={avatar} alt={username} className={`w-${size} rounded-full`} />
      <p className={`font-medium text-[${size / 10}rem]`}>{username}</p>
    </div>
  );
}