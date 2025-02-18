import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import localFont from "next/font/local";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
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
      <body className="bg-hanji text-[#69140E]">
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
