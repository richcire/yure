import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ["image/avif", "image/webp"],
    // loader: "custom",
    // loaderFile: "./utils/supabase/supabase-image-loader.ts",
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "**.supabase.co",
      // },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
