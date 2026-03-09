"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

export function DesktopKaraokeInfeedAdWrapper() {
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (isDevelopment) {
    return (
      <div className="infeed-ad" style={{ height: "80px", minHeight: "80px", maxHeight: "80px" }}>
        <div className="w-full h-[80px] bg-gradient-to-r from-purple-50 to-blue-50 border border-dashed border-gray-300 rounded flex items-center justify-center">
          <span className="text-xs text-gray-400">AD Placeholder (Desktop)</span>
        </div>
      </div>
    );
  }

  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div className="infeed-ad">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4738868818137222"
        data-ad-slot="6117941194"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
