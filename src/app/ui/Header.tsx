export default function Header({title}) {
  return (
    <div className="w-screen h-16 bg-primary-100 flex items-center p-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
  );
}