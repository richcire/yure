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
      className={`fixed top-1/2 -translate-y-1/2 z-40 hidden xl:block ${
        position === "right" ? "right-8" : "left-8"
      }`}
    >
      <div className="relative w-[160px] h-[600px] bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs transition-colors"
          aria-label="광고 닫기"
        >
          ×
        </button>

        {/* Ad Content */}
        {isDevelopment ? (
          // Development: Show dummy ad
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50">
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
          <iframe 
            src="https://ads-partners.coupang.com/widgets.html?id=960394&template=carousel&trackingCode=AF4139821&subId=&width=160&height=600&tsource=" 
            width="160" 
            height="600" 
            frameBorder="0" 
            scrolling="no" 
            referrerPolicy="unsafe-url"
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
}
