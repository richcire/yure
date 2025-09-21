"use client";

import { cn } from "@/lib/utils";
import { BottomDisplayAd } from "./bottom-display-ad";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

interface MobileStickyBottomAdWrapperProps {
  className?: string;
}

export default function MobileStickyBottomAdWrapper({
  className,
}: MobileStickyBottomAdWrapperProps) {
  if (process.env.NODE_ENV !== "production") return null;
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300",
        isHidden && "translate-y-[calc(100%+20px)]",
        className
      )}
    >
      <button
        onClick={() => setIsHidden(!isHidden)}
        className="w-full bg-gray-200 rounded-t-lg px-8 py-1 text-black flex items-center justify-center"
      >
        {isHidden ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>
      <div className="w-full max-w-[320px] h-[100px]">
        <style jsx>{`
          .stick_ad {
            width: 320px;
            height: 100px;
          }
        `}</style>
        <ins
          className="adsbygoogle stick_ad"
          style={{ display: "block" }}
          data-ad-client="ca-pub-4738868818137222"
          data-ad-slot="6505812562"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
}
