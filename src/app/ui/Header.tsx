import { useRouter } from 'next/navigation'
import { IoMdArrowRoundBack } from "react-icons/io";

type Props = {
  title: string;
}

export default function Header({ title }: Props) {
  const router = useRouter()

  const handleBack = () => {
    router.back();
  }
  return (
    <div className="w-screen h-16 bg-primary-100 flex items-center p-4 gap-4">
      <IoMdArrowRoundBack size={32} onClick={handleBack} />
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
  );
}