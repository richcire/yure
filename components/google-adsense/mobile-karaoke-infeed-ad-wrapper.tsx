"use client";

import { useEffect } from "react";
import { BottomDisplayAd } from "./bottom-display-ad";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

export function MobileKaraokeInfeedAdWrapper() {
  if (process.env.NODE_ENV !== "production") return null;
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);
  return (
    <div className="my-12 max-w-[768px] min-w-[320px] mx-auto px-4 w-full">
      <ins
        className="adsbygoogle h-20"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4738868818137222"
        data-ad-slot="6505812562"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
