import Link from "next/link";
import Image from "next/image";
import roundLogo from "@/public/assets/logos/round.png";
import { Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full mx-auto text-md py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start justify-center gap-16 md:gap-24">
          {/* Logo Section */}
          <div className="w-full md:w-auto flex justify-center">
            <Link href="/" className="flex flex-col items-center gap-4">
              <Image
                src={roundLogo}
                alt="Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
            {/* Content Section */}
            <div>
              <h3 className="font-medium mb-4">컨텐츠</h3>
              <div className="flex flex-col gap-3">
                <Link
                  href="/translation"
                  className="hover:text-primary transition-colors text-sm text-muted-foreground"
                >
                  J-POP 가사 번역
                </Link>
                <Link
                  href="/article"
                  className="hover:text-primary transition-colors text-sm text-muted-foreground"
                >
                  유레 매거진
                </Link>
                <Link
                  href="/news"
                  className="hover:text-primary transition-colors text-sm text-muted-foreground"
                >
                  유레 뉴스
                </Link>
              </div>
            </div>

            {/* Karaoke Section */}
            <div>
              <h3 className="font-medium mb-4">노래방 번호</h3>
              <div className="flex flex-col gap-3">
                <Link
                  href="/karaoke"
                  className="hover:text-primary transition-colors text-sm text-muted-foreground"
                >
                  노래방 번호 찾기
                </Link>
                <Link
                  href="/karaoke/application"
                  className="hover:text-primary transition-colors text-sm text-muted-foreground"
                >
                  노래방 번호 신청
                </Link>
              </div>
            </div>

            {/* Schedule Section */}
            <div>
              <h3 className="font-medium mb-4">일정</h3>
              <div className="flex flex-col gap-3">
                <Link
                  href="/schedule"
                  className="hover:text-primary transition-colors text-sm text-muted-foreground"
                >
                  일정
                </Link>
              </div>
            </div>

            {/* Community Section */}
            <div>
              <h3 className="font-medium mb-4">커뮤니티</h3>
              <div className="flex flex-col gap-3">
                <Link
                  href="/community"
                  className="hover:text-primary transition-colors text-sm text-muted-foreground"
                >
                  커뮤니티
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright and Social Links */}
        <div className="mt-32 border-t pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="https://www.youtube.com/@yure.music12"
                target="_blank"
                aria-label="Youtube"
                className="hover:text-primary transition-colors"
              >
                <Youtube size={20} />
              </Link>
              <Link
                href="https://www.instagram.com/yure.music?igsh=a2FwdXljc3hweTl3"
                aria-label="Instagram"
                className="hover:text-primary transition-colors"
              >
                <Instagram size={20} />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-bold hover:underline">YURE</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
