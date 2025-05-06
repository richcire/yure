import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ["image/webp"],
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

  //폰트 파일은 인덱스 안되게
  async headers() {
    return [
      {
        source: "/_next/static/media/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
