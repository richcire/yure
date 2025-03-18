"use client";

import { useEffect } from "react";

export const SideVerticalDisplayAd = () => {
  if (process.env.NODE_ENV !== "production") return null;
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);
  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-4738868818137222"
      data-ad-slot="5520899928"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};
