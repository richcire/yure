import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import localFont from "next/font/local";
import { WebVitals } from "@/components/web-vitals";
import { AdSenseCodeSnippet } from "@/components/google-adsense/adsense-code-snippet";
import { Toaster } from "@/components/ui/sonner";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "유레 揺れ • JPOP 커뮤니티",
  description: "J-POP 등 일본 음악/문화 위주로 소개합니다.",
  icons: {
    icon: "/assets/logos/round.png",
  },
};

// const geistSans = Geist({
//   display: "swap",
//   subsets: ["latin"],
// });

const taeMovieFont = localFont({
  src: "../public/fonts/TaeMovie.ttf",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={taeMovieFont.className} suppressHydrationWarning>
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
