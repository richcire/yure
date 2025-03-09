"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { IUserInfo } from "@/types/supabase-table";
import { useRouter } from "next/navigation";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        return;
      }
      setUser(data.session?.user);

      const { data: userData } = await supabase
        .from("user_info")
        .select("name")
        .eq("user_id", data.session?.user.id)
        .single<IUserInfo>();

      setName(userData?.name);
    };
    getSession();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(undefined);
    router.refresh();
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if page is scrolled past navigation height (assuming 48px)
      const scrolled = window.scrollY > 48;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 h-12 transition-all duration-300 z-50 
        ${isScrolled ? "bg-white/20 backdrop-blur-sm shadow-sm" : "bg-white/20"}`}
      >
        <div className="container mx-auto h-full px-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 items-center h-full">
            {/* Logo */}
            <div className="flex-shrink-0 col-span-2 sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/assets/logos/round.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
                <span className="hidden sm:inline">揺れ 유레</span>
              </Link>
            </div>

            {/* Navigation Links - Centered */}
            <div className="hidden sm:flex items-center justify-center gap-8 col-span-2 lg:col-span-1">
              <Link
                href="/translation"
                className="hover:text-primary transition-colors whitespace-nowrap"
              >
                J-POP 가사번역
              </Link>
              <Link
                href="/article"
                className="hover:text-primary transition-colors whitespace-nowrap"
              >
                유레 매거진
              </Link>
              <Link
                href="/karaoke"
                className="hover:text-primary transition-colors whitespace-nowrap"
              >
                노래방 번호 검색
              </Link>
            </div>

            {/* Auth Section */}
            <div className="flex items-center justify-end gap-2 sm:gap-4 col-span-1 sm:col-span-2 lg:col-span-1">
              {user ? (
                <div
                  className="relative"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <div className="text-sm hover:text-primary transition-colors cursor-pointer truncate max-w-[120px] sm:max-w-none">
                    안녕하세요, {name}님!
                  </div>
                  {showDropdown && (
                    <div className="absolute right-0 top-full pt-1">
                      <div className="w-48 bg-white/80 backdrop-blur-sm shadow-sm border rounded-md">
                        <button
                          onClick={() => router.push("/protected/myPage")}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors rounded-md"
                        >
                          마이 페이지
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-md"
                        >
                          로그아웃
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="hover:text-primary transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-primary text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    회원가입
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                className="sm:hidden ml-2 p-1"
                onClick={() => setIsSidebarOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 sm:hidden ${
          isSidebarOpen ? "opacity-100 z-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <button
              className="absolute top-3 right-3 p-1"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex flex-col gap-4 mt-8">
              <Link
                href="/translation"
                className="px-4 py-2 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                J-POP 가사번역
              </Link>
              <Link
                href="/article"
                className="px-4 py-2 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                유레 매거진
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
