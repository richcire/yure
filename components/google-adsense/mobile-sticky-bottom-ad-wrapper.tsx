"use client";

import { cn } from "@/lib/utils";
import { BottomDisplayAd } from "./bottom-display-ad";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MobileStickyBottomAdWrapperProps {
  className?: string;
}

export default function MobileStickyBottomAdWrapper({
  className,
}: MobileStickyBottomAdWrapperProps) {
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
      <div className={cn("h-[100px]", "flex items-center justify-center")}>
        <div className="w-full max-w-[320px] h-full">
          <BottomDisplayAd />
        </div>
      </div>
    </div>
  );
}
