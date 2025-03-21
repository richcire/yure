import { SideVerticalDisplayAd } from "@/components/google-adsense/side-veritcal-display-ad";
import Header from "@/components/news/header";
import NewsList from "@/components/news/news-list";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{
    search?: string; // 검색 키워드
    page?: string;
  }>;
}

export default async function NewsHomePage({ searchParams }: Props) {
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background px-4 py-8">
      <Header />
      <main>
        <Suspense>
          <NewsList searchParams={searchParams} />
        </Suspense>
      </main>
      <div className="sticky-side-ad">
        <SideVerticalDisplayAd />
      </div>
    </div>
  );
}
