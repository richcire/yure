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
      <main className="min-h-screen flex flex-col items-center pt-[60px]">
        <div className="flex-1 w-full flex flex-col items-center">
          {children}

          <footer className="w-full border-t mx-auto text-md py-16">
            {/* Social Icons Section */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <Link
                href="https://www.youtube.com/@yure.music12"
                target="_blank"
                aria-label="Youtube"
                className="hover:text-primary transition-colors"
              >
                <Youtube />
              </Link>
              <Link
                href="https://www.instagram.com/yure.music?igsh=a2FwdXljc3hweTl3"
                aria-label="Instagram"
                className="hover:text-primary transition-colors"
              >
                <Instagram />
              </Link>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex justify-center gap-8 mb-8">
              <Link
                href="/translation"
                className="hover:text-primary transition-colors"
              >
                J-POP 가사번역
              </Link>
              <Link
                href="/article"
                className="hover:text-primary transition-colors"
              >
                유레 매거진
              </Link>
              <Link
                href="/karaoke"
                className="hover:text-primary transition-colors"
              >
                노래방 번호 검색
              </Link>
              <Link
                href="/karaoke/application"
                className="hover:text-primary transition-colors"
              >
                노래방 번호 신청
              </Link>
              <Link
                href="/news"
                className="hover:text-primary transition-colors"
              >
                NEWS
              </Link>
            </div>

            {/* Navigation Links - Mobile */}
            <div className="flex md:hidden flex-col items-center gap-4 mb-8">
              <Link
                href="/translation"
                className="hover:text-primary transition-colors"
              >
                J-POP 가사번역
              </Link>
              <Link
                href="/article"
                className="hover:text-primary transition-colors"
              >
                유레 매거진
              </Link>
              <Link
                href="/karaoke"
                className="hover:text-primary transition-colors"
              >
                노래방 번호 검색
              </Link>
              <Link
                href="/karaoke/application"
                className="hover:text-primary transition-colors"
              >
                노래방 번호 신청
              </Link>
              <Link
                href="/news"
                className="hover:text-primary transition-colors"
              >
                NEWS
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-center">
              Powered by <span className="font-bold hover:underline">YURE</span>
            </p>
            {/* <ThemeSwitcher /> */}
          </footer>
        </div>
      </main>
    </>
  );
}
