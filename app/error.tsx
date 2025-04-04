"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-hanji flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all animate-fade-in">
        <div className="text-center">
          <div className="mb-6 text-6xl animate-bounce-slow">😅</div>
          <h2 className="text-3xl font-bold text-[#69140E] mb-3">
            앗! 문제가 발생했어요
          </h2>
          <p className="text-[#69140E]/80 mb-8">
            걱정하지 마세요! 저희가 해결하고 있습니다. 잠시 후 다시 시도해
            주세요.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/")}
              className="bg-hanji hover:bg-hanji/80 text-[#69140E] font-semibold px-6 py-3 rounded-lg
                transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 
                focus:ring-[#69140E]/20 focus:ring-offset-2 shadow-md"
            >
              홈으로 가기
            </button>
            <button
              onClick={() => reset()}
              className="bg-[#69140E] hover:bg-[#69140E]/90 text-white font-semibold px-6 py-3 rounded-lg
                transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 
                focus:ring-[#69140E]/20 focus:ring-offset-2 shadow-md"
            >
              다시 시도하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
