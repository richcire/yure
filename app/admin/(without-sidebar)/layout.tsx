import { ThemeSwitcher } from "@/components/theme-switcher";

export default function WithoutSidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center pt-16">
        <div className="flex-1 w-full flex flex-col items-center">
          {children}
        </div>
      </main>
    </>
  );
}
