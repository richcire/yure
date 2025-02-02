export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[calc(100dvh-48px)] flex items-center justify-center p-4 w-full pt-0">
      {children}
    </div>
  );
}
