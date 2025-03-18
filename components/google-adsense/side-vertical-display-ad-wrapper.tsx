"use client";

import { SideVerticalDisplayAd } from "./side-veritcal-display-ad";
import { useEffect, useState } from "react";
export const SideVerticalDisplayAdWrapper = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsMobile(window.innerWidth < 1500);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1500);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) return null;

  return (
    <div className="sticky-side-ad">
      <SideVerticalDisplayAd />
    </div>
  );
};
