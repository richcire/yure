"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { INotifications, IUserInfo } from "@/types/supabase-table";
import { useRouter, usePathname } from "next/navigation";
import { User as UserIcon, ChevronRight, BellIcon } from "lucide-react";

const Navigation = () => {
  const [user, setUser] = useState<User | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showKaraokeDropdown, setShowKaraokeDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<INotifications[]>([]);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const markAsReadAll = async () => {
    if (notifications.length === 0) {
      return;
    }
    const { data, error } = await supabase.from("notifications").upsert(
      notifications.map((notification) => ({
        ...notification,
        is_read: true,
      })),
      {
        onConflict: "id",
      }
    );
    setNotifications([]);
  };

  const getNotifications = async (user_id: string, role: string) => {
    const { data, error } =
      role === "admin"
        ? await supabase
            .from("notifications")
            .select("*")
            .eq("is_read", false)
            .order("created_at", { ascending: false })
            .returns<INotifications[]>()
        : await supabase
            .from("notifications")
            .select("*")
            .eq("recipient_user_id", user_id)
            .eq("is_read", false)
            .order("created_at", { ascending: false })
            .returns<INotifications[]>();
    return { data, error };
  };

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        return;
      }
      setUser(data.session?.user);

      if (data.session?.user) {
        const { data: userData } = await supabase
          .from("user_info")
          .select("name, role")
          .eq("user_id", data.session?.user.id)
          .single<IUserInfo>();

        setName(userData?.name);

        const { data: notifications } = await getNotifications(
          data.session?.user.id,
          userData?.role || ""
        );
        if (notifications) {
          setNotifications(notifications);
        }
      }
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
      <nav
        className={`fixed top-0 left-0 right-0 h-[60px] transition-all duration-300 z-50 bg-background border-b border-border`}
      >
        <div className="container mx-auto h-full px-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 items-center h-full">
            {/* Logo */}
            <div className="flex-shrink-0 col-span-2 sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/assets/logos/round.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
                <span className="hidden sm:inline">유레 揺れ</span>
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
              <div
                className="relative"
                onMouseEnter={() => setShowKaraokeDropdown(true)}
                onMouseLeave={() => setShowKaraokeDropdown(false)}
              >
                <Link
                  href="/karaoke"
                  className="hover:text-primary transition-colors whitespace-nowrap"
                >
                  노래방 번호 검색
                </Link>
                {showKaraokeDropdown && (
                  <div className="absolute left-0 top-full pt-1">
                    <div className="w-48 bg-white/80 backdrop-blur-sm shadow-sm border rounded-md">
                      <Link
                        href="/karaoke"
                        className="block px-4 py-2 text-sm hover:bg-red-50 transition-colors rounded-md"
                      >
                        노래방 번호 검색
                      </Link>
                      <Link
                        href="/karaoke/application"
                        className="block px-4 py-2 text-sm hover:bg-red-50 transition-colors rounded-md"
                      >
                        노래방 번호 신청
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Auth Section */}

            <div className="flex items-center justify-end gap-3 sm:gap-4 col-span-1 sm:col-span-2 lg:col-span-1">
              {/* Notifications Section */}
              <div>
                <button
                  className="hover:text-primary transition-colors flex items-center justify-center relative"
                  onClick={() => setShowNotifications((prev) => !prev)}
                >
                  <BellIcon size={20} />
                  {notifications.length > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {notifications.length > 9 ? "9+" : notifications.length}
                    </div>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-1 top-full pt-2">
                    <div className="w-80 bg-[#F5F5F5] backdrop-blur-sm shadow-sm border rounded-md p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">알림</h3>
                        <button
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={markAsReadAll}
                        >
                          모두 읽음 표시
                        </button>
                      </div>

                      <div className="space-y-4">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <Link
                              href={notification.relevant_url || "#"}
                              key={notification.id}
                              className="flex items-start gap-3 p-2 rounded-md"
                            >
                              <div className="flex-1">
                                <p className="text-sm">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(
                                    notification.created_at
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="text-sm text-center text-muted-foreground">
                            새로운 알림이 없습니다
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {user ? (
                <div
                  className="relative"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <div className="text-sm hover:text-primary transition-colors cursor-pointer truncate max-w-[120px] sm:max-w-none">
                    안녕하세요, {name}님!
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
                  className="hover:text-primary transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  <UserIcon size={20} />
                </Link>
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
              <Link
                href="/translation"
                className="px-4 py-2 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-between"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span>J-POP 가사번역</span>
                <ChevronRight size={16} />
              </Link>
              <Link
                href="/article"
                className="px-4 py-2 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-between"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span>유레 매거진</span>
                <ChevronRight size={16} />
              </Link>
              <Link
                href="karaoke"
                className="px-4 py-2 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-between"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span>노래방 번호 검색</span>
                <ChevronRight size={16} />
              </Link>
              <Link
                href="/karaoke/application"
                className="px-4 py-2 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-between"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span>노래방 번호 신청</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Login section at bottom */}
            {!user && (
              <div className="mt-auto border-t border-border pt-4">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
