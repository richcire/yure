import Navigation from "@/components/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Instagram, Youtube } from "lucide-react";
import Link from "next/link";

export default function WithNavigationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen flex flex-col items-center pt-12">
        <div className="flex-1 w-full flex flex-col items-center">
          {children}

          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <Link href="https://www.youtube.com/@yure.music12" target="_blank">
              <Youtube />
            </Link>
            <Link href="https://www.instagram.com/yure.music?igsh=a2FwdXljc3hweTl3">
              <Instagram />
            </Link>

            <p>
              Powered by <span className="font-bold hover:underline">YURE</span>
            </p>
            {/* <ThemeSwitcher /> */}
          </footer>
        </div>
      </main>
    </>
  );
}
