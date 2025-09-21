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
    <div
      className="infeed-ad"
      style={{
        height: "80px !important",
        minHeight: "80px",
        maxHeight: "80px",
        // overflow: "hidden",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "inline-block",
          width: "320px",
          height: "80px !important",
          minHeight: "80px",
          maxHeight: "80px",
          overflow: "hidden",
        }}
        data-ad-client="ca-pub-4738868818137222"
        data-ad-slot="5910638236"
        data-ad-format="fixed"
        data-full-width-responsive="false"
      ></ins>
    </div>
  );
}
