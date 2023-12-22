export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main><h1>Este es el layout</h1>{children}</main>
  );
}
