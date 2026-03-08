import Footer from "@/components/footer";
import Navigation from "@/components/navigation-section/navigation";
import SideBannerAd from "@/components/advertisement/side-banner-ad";

export default function WithNavigationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <SideBannerAd position="right" />
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col items-center">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
