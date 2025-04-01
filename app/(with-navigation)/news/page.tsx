import { SideVerticalDisplayAdWrapper } from "@/components/google-adsense/side-vertical-display-ad-wrapper";
import Header from "@/components/news/header";
import NewsBanner from "@/components/news/news-banner";
import NewsList from "@/components/news/news-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "유레 揺れ • J-POP 뉴스",
  description:
    "아티스트 컴백, 신곡 발매, 뮤직비디오, 콘서트 정보, 업계 소식 등 최신 J-POP 뉴스를 한눈에 확인하세요.",
};

interface Props {
  searchParams: Promise<{
    search?: string; // 검색 키워드
    page?: string;
  }>;
}

function NewsListSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-12">
      {/* Featured News Skeleton */}
      <div className="border-b-2 border-black pb-8 md:col-span-8 md:border-b-0 md:border-r-2 md:pr-8">
        <Skeleton className="mb-4 h-10 w-3/4" /> {/* Title */}
        <Skeleton className="mb-4 h-4 w-48" /> {/* Author/Date */}
        <Skeleton className="mb-6 h-[300px] w-full rounded-sm" /> {/* Image */}
        <Skeleton className="mb-3 h-4 w-full" /> {/* Summary line 1 */}
        <Skeleton className="mb-3 h-4 w-full" /> {/* Summary line 2 */}
        <Skeleton className="h-4 w-2/3" /> {/* Summary line 3 */}
      </div>

      {/* Secondary News Skeleton - Right Column */}
      <div className="space-y-8 md:col-span-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b border-gray-200 pb-6 last:border-0">
            <Skeleton className="mb-2 h-6 w-full" /> {/* Title */}
            <Skeleton className="mb-3 h-4 w-32" /> {/* Author/Date */}
            <Skeleton className="mb-3 h-20 w-full rounded-sm" /> {/* Image */}
            <Skeleton className="h-4 w-full" /> {/* Summary */}
          </div>
        ))}
      </div>

      {/* Rest of News Grid Skeleton */}
      <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="w-full h-40 rounded-sm" /> {/* Thumbnail */}
            <Skeleton className="w-3/4 h-5" /> {/* Title */}
            <Skeleton className="w-1/2 h-4" /> {/* Author/Date */}
            <Skeleton className="w-full h-16" /> {/* Content preview */}
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="md:col-span-12 mt-8 flex justify-center">
        <Skeleton className="w-96 h-10" /> {/* Pagination */}
      </div>
    </div>
  );
}

export default async function NewsHomePage({ searchParams }: Props) {
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background px-4 py-8">
      <Header />
      <NewsBanner />
      <main>
        <Suspense fallback={<NewsListSkeleton />}>
          <NewsList searchParams={searchParams} />
        </Suspense>
      </main>
      <SideVerticalDisplayAdWrapper />
    </div>
  );
}
