import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/footer"));

const Navigation = dynamic(
  () => import("@/components/navigation-section/navigation")
);

const SideBannerAd = dynamic(
  () => import("@/components/advertisement/side-banner-ad")
);

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
