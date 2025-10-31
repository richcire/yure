import { ThemeProvider } from "next-themes";
import "./globals.css";
import { WebVitals } from "@/components/web-vitals";
import { AdSenseCodeSnippet } from "@/components/google-adsense/adsense-code-snippet";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import squareLogo from "@/public/assets/logos/square_high.jpeg";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "유레 揺れ • JPOP 커뮤니티",
  description:
    "J-POP을 새로운 방식으로 만나보세요! 좋아하는 J-POP 노래의 번역을 확인하고, 최신 J-POP 뉴스와 기사도 놓치지 마세요. 또한, 원하는 곡의 노래방 번호도 간편하게 검색할 수 있습니다. J-POP 팬들을 위한 최적의 공간!",
  icons: {
    icon: "/assets/logos/round.png",
  },
  openGraph: {
    images: [
      {
        url: squareLogo.src,
        width: 1200,
        height: 630,
        alt: "유레 揺れ",
      },
    ],
    locale: "ko_KR",
    type: "website",
    siteName: "유레 揺れ",
  },
};

const gothica1Font = localFont({
  src: [
    {
      path: "../public/fonts/Gothic_A1/gothic-a1-v18-korean_latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Gothic_A1/gothic-a1-v18-korean_latin-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Gothic_A1/gothic-a1-v18-korean_latin-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Gothic_A1/gothic-a1-v18-korean_latin-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={gothica1Font.className} suppressHydrationWarning>
      <head>
        {/* 구글 애드센스 코드 스니펫 */}
        <AdSenseCodeSnippet />
      </head>
      <body className="bg-hanji text-[#69140E]">
        {/* <WebVitals /> */}

        <ThemeProvider
          attribute="class"
          defaultTheme="ligth"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
