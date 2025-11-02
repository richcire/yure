"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { User as UserIcon } from "lucide-react";
import roundLogo from "@/public/assets/logos/round.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";
import Notification from "./notification";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Navigation = () => {
  const [user, setUser] = useState<User | undefined>();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        return;
      }
      setUser(data.session?.user);
    };
    getSession();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(undefined);
    window.location.reload();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 transition-all duration-300 z-50 bg-background/70 md:bg-transparent h-16  md:h-[80px] ">
        <div className="container mx-auto h-full px-4">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 md:w-[150px]">
              <Image
                src={roundLogo}
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
              <span className="hidden sm:inline font-semibold">유레 揺れ</span>
            </Link>

            {/* Navigation Menu - Centered */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList className="bg-background/70 backdrop-blur-sm px-6 py-1 rounded-2xl">
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">
                      컨텐츠
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <ListItem href="/translation" title="J-POP 가사 번역">
                          J-POP 노래 가사를 한국어 번역과 함께 감상해보세요
                        </ListItem>
                        <ListItem href="/article" title="유레 매거진">
                          J-컬처와 음악 이야기, 지금 만나보세요
                        </ListItem>
                        <ListItem href="/news" title="유레 뉴스">
                          지금 일본 음악 씬에서 무슨 일이? 가장 빠른 뉴스로
                          확인하세요
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">
                      노래방 번호
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <ListItem href="/karaoke" title="노래방 번호 찾기">
                          부르고 싶은 일본 노래, 번호부터 찾아보세요
                        </ListItem>
                        <ListItem
                          href="/karaoke/application"
                          title="노래방 번호 신청"
                        >
                          찾는 노래가 없다면? 노래방 번호 요청하기
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent"
                      )}
                    >
                      <Link href="/schedule">일정</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-3 md:gap-4 md:w-[150px]">
              {/* Notifications Section */}
              {user && <Notification />}
              <div className="hidden sm:block">
                {user ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                    onClick={() => setShowDropdown((prev) => !prev)}
                  >
                    <div className="text-sm hover:text-primary transition-colors cursor-pointer truncate max-w-[120px] sm:max-w-none">
                      <UserIcon size={20} />
                    </div>
                    {showDropdown && (
                      <div className="absolute right-0 top-full pt-2">
                        <div className="w-32 bg-[#F5F5F5] backdrop-blur-sm shadow-sm border rounded-md py-2">
                          <button
                            onClick={() => router.push("/protected/myPage")}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors rounded-md"
                          >
                            마이 페이지
                          </button>
                          <div className="h-[1px] bg-border my-2 mx-4" />
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
                  <Link
                    href={`/sign-in?redirectTo=${pathname}`}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-70 transition-all text-sm font-medium"
                  >
                    로그인
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden ml-2 p-1"
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
          className={`fixed right-0 top-0 h-full w-[20rem] bg-[#F5F5F5] shadow-lg transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 flex flex-col h-full">
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
            <div className="flex flex-col gap-4 mt-8 flex-1">
              <div className="px-4 py-2 font-medium">컨텐츠</div>
              <Link
                href="/translation"
                className="px-8 py-2 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                J-POP 가사 번역
              </Link>
              <Link
                href="/article"
                className="px-8 py-2 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                유레 매거진
              </Link>
              <Link
                href="/news"
                className="px-8 py-2 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                유레 뉴스
              </Link>

              <div className="px-4 py-2 font-medium">노래방 번호</div>
              <Link
                href="/karaoke"
                className="px-8 py-2 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                노래방 번호 찾기
              </Link>
              <Link
                href="/karaoke/application"
                className="px-8 py-2 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                노래방 번호 신청
              </Link>

              <div className="px-4 py-2 font-medium">일정</div>
              <Link
                href="/schedule"
                className="px-8 py-2 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                일정
              </Link>
            </div>

            {/* Login section at bottom */}
            <div className="mt-auto border-t border-border pt-4">
              {user ? (
                <>
                  <Link
                    href="/protected/myPage"
                    className="block w-full bg-foreground text-white py-2 px-4 rounded-md text-center text-sm hover:bg-primary/90 transition-colors"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsSidebarOpen(false);
                    }}
                    className="mt-2 block w-full border border-red-500 text-red-500 py-2 px-4 rounded-md text-center text-sm hover:bg-red-50 transition-colors"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <div className="text-sm text-center mb-3">
                    로그인하고 더 많은 기능을 사용해보세요!
                  </div>
                  <Link
                    href={`/sign-in?redirectTo=${pathname}`}
                    className="block w-full bg-foreground text-white py-2 px-4 rounded-md text-center text-sm hover:bg-primary/90 transition-colors"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    로그인하기
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
