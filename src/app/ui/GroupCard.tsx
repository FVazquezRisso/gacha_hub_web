import { GroupInterface } from "@/types/types";
import { useRouter } from 'next/navigation'

export default function GroupCard({
  id,
  name,
  userCount,
  postCount,
}: GroupInterface) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/web/group/${id}/detail`)
  }

  return (
    <div className="w-full py-4 px-8 border-b-[1px] border-bg-300 flex flex-col gap-2"
      onClick={handleClick}
    >
      <h3 className="text-lg">{name}</h3>
      <div className="flex gap-8">
        <span className="text-text-300">
          <span className="font-bold text-text-200">{postCount}</span> Publicaciones
        </span>
        <span className="text-text-300">
          <span className="font-bold text-text-200">{userCount}</span> Miembros
        </span>
      </div>
    </div>
  );
}
