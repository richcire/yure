"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signInWithGoogleAction } from "@/app/actions";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-lg mx-auto p-8 rounded-lg backdrop-blur-sm shadow-lg">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 relative mb-4">
          {/* <Image
            src="/logo.png" // Make sure to add your logo
            alt="Logo"
            fill
            className="object-contain"
          /> */}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">로그인하기</h1>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-4 mb-8">
        <Button
          variant="outline"
          className="w-full relative h-12 border-2"
          onClick={signInWithGoogleAction}
        >
          <div className="absolute left-4">
            <Image
              src="/assets/icons/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <span className="mx-auto">Google로 계속하기</span>
        </Button>

        {/* <Button variant="outline" className="w-full relative h-12 border-2">
          <div className="absolute left-4">
            <Image
              src="/assets/icons/kakaotalk.svg"
              alt="Kakao"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <span className="mx-auto">카카오톡으로 계속하기</span>
        </Button> */}
      </div>
      {/* Footer Links */}
      <div className="mt-6 text-center">
        <div className="mt-4">
          <span className="text-gray-600">계정이 없으신가요? </span>
          <a href="sign-up" className="text-emerald-600 hover:underline">
            가입하기
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
