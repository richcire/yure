"use client";

import { useEffect, useState } from "react";

export const SideVerticalDisplayAd = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      // Initial check
      setIsMobile(window.innerWidth < 768);

      // Add resize listener
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Don't render on mobile or in development
  if (process.env.NODE_ENV !== "production" || isMobile) return null;

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
