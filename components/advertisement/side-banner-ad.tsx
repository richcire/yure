"use client";

import { useState } from "react";

interface SideBannerAdProps {
  position?: "left" | "right";
}

export default function SideBannerAd({ position = "right" }: SideBannerAdProps) {
  const [isVisible, setIsVisible] = useState(true);
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-[60] block ${
        position === "right" ? "right-8" : "left-8"
      }`}
    >
      <div className="relative w-[160px] h-[640px] bg-background shadow-lg rounded-lg overflow-hidden border border-border">
        {/* Coupang Partners Disclaimer */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gray-100 px-2 py-2">
          <p className="text-[9px] leading-tight text-gray-600 text-center">
            이 배너는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 z-30 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs transition-colors"
          aria-label="광고 닫기"
        >
          ×
        </button>

        {/* Ad Content */}
        {isDevelopment ? (
          // Development: Show dummy ad
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 pt-16">
            <div className="text-center space-y-4">
              {/* Example ad content */}
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                AD
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-800">
                  광고 영역
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  여기에 커스텀 광고 콘텐츠를 넣으세요
                </p>
              </div>

              <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all">
                자세히 보기
              </button>
            </div>

            {/* Ad label */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                Advertisement (Dev)
              </span>
            </div>
          </div>
        ) : (
          // Production: Show Coupang iframe ad
          <div className="w-full h-full pt-16">
            <iframe 
              src="https://ads-partners.coupang.com/widgets.html?id=960394&template=carousel&trackingCode=AF4139821&subId=&width=160&height=600&tsource=" 
              width="160" 
              height="600" 
              frameBorder="0" 
              scrolling="no" 
              referrerPolicy="unsafe-url"
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
