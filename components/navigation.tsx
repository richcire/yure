"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | undefined>();
  const [showDropdown, setShowDropdown] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user);
    };
    getSession();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(undefined);
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
    <nav
      className={`fixed top-0 left-0 right-0 h-12 transition-all duration-300 z-50 
      ${isScrolled ? "bg-white/20 backdrop-blur-sm shadow-sm" : "bg-white/20"}`}
    >
      <div className="container mx-auto h-full">
        <div className="grid grid-cols-3 items-center h-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/logos/round.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              揺れ 유레
            </Link>
          </div>

          {/* Navigation Links - Centered */}
          <div className="flex items-center justify-center gap-8">
            <Link href="/" className="hover:text-primary transition-colors">
              J-POP 가사번역
            </Link>
            {/* <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/services"
              className="hover:text-primary transition-colors"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link> */}
          </div>

          {/* Auth Section */}
          <div className="flex items-center justify-end gap-4">
            {user ? (
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="text-sm hover:text-primary transition-colors cursor-pointer">
                  안녕하세요, {user.email?.split("@")[0]}님!
                </div>
                {showDropdown && (
                  <div className="absolute right-0 top-full pt-1">
                    <div className="w-48 bg-white/80 backdrop-blur-sm shadow-sm border rounded-md">
                      {/* <Link
                        href="/user-info"
                        className="block px-4 py-2 text-sm hover:bg-primary/10 transition-colors"
                      >
                        사용자 정보
                      </Link> */}
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
                  className="hover:text-primary transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
