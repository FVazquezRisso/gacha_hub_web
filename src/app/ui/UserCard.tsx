'use client'
import { useRouter } from 'next/navigation'

type Props = {
  username: any;
  avatar: any;
}

export default function UserCard({ username, avatar }: Props) {
  const router = useRouter()

  const handleClickUser = () => {
    router.push(`/web/profile/${username}/posts`);
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