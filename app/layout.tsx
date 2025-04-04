import { Gothic_A1 } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { WebVitals } from "@/components/web-vitals";
import { AdSenseCodeSnippet } from "@/components/google-adsense/adsense-code-snippet";
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
        url: "/assets/logos/square_high.jpeg",
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

const gothicFont = Gothic_A1({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={gothicFont.className} suppressHydrationWarning>
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
      </body>
    </html>
  );
}
