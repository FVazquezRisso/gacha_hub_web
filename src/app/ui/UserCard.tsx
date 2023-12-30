'use client'
import { useRouter } from 'next/navigation'

export default function UserCard({ username, avatar }) {
  const router = useRouter()

  const handleClickUser = () => {
    router.push(`/web/profile/${username}`);
  };

  return (
    <div onClick={handleClickUser}>
      <img
        src={avatar}
        alt={username}
        className="w-12 aspect-square object-cover rounded-full"
      />
    </div>
  );
}