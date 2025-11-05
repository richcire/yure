import { SideVerticalDisplayAdWrapper } from "@/components/google-adsense/side-vertical-display-ad-wrapper";
import Header from "@/components/news/header";
import NewsBanner from "@/components/news/news-banner";
import NewsList from "@/components/news/news-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "J-POP 뉴스 • 유레 揺れ",
  description:
    "아티스트 컴백, 신곡 발매, 뮤직비디오, 콘서트 정보, 업계 소식 등 최신 J-POP 뉴스를 한눈에 확인하세요.",
};

interface Props {
  searchParams: Promise<{
    search?: string; // 검색 키워드
    page?: string;
  }>;
}

function NewsGridSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-12">
      <div className="border-b-2 pb-8 md:col-span-8 md:border-b-0 md:border-r-2 md:pr-8">
        <Skeleton className="mb-4 h-10 w-1/4 bg-gray-300" />
        <Skeleton className="mb-4 h-10 w-3/4 bg-gray-300" />
        <Skeleton className="mb-4 h-4 w-48 bg-gray-300" />
        <Skeleton className="mb-6 h-[300px] w-full rounded-sm animate-pulse bg-gray-300" />
        <Skeleton className="mb-3 h-4 w-full bg-gray-300" />
        <Skeleton className="mb-3 h-4 w-full bg-gray-300" />
        <Skeleton className="h-4 w-2/3 bg-gray-300" />
      </div>
      <div className="space-y-8 md:col-span-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b border-gray-200 pb-6 last:border-0">
            <Skeleton className="mb-2 h-6 w-full bg-gray-300" />
            <Skeleton className="mb-3 h-4 w-32 bg-gray-300" />
            <Skeleton className="mb-3 h-20 w-full rounded-sm animate-pulse bg-gray-300" />
            <Skeleton className="h-4 w-full bg-gray-300" />
          </div>
        ))}
      </div>
      <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="w-full h-40 rounded-sm animate-pulse bg-gray-300" />
            <Skeleton className="w-3/4 h-5 bg-gray-300" />
            <Skeleton className="w-1/2 h-4 bg-gray-300" />
            <Skeleton className="w-full h-16 bg-gray-300" />
          </div>
        ))}
      </div>
      <div className="md:col-span-12 mt-8 flex justify-center">
        <Skeleton className="w-96 h-10 bg-gray-300" />
      </div>
    </div>
  );
}

function NewsCardSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="relative group border-b border-gray-300 pb-6 last:border-b-0"
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="sm:w-1/4">
              <Skeleton className="h-[200px] w-full rounded-sm animate-pulse bg-gray-300" />
            </div>
            <div className="flex-1 sm:w-3/4">
              <div className="mb-1 flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Skeleton className="h-3 w-3 rounded-full bg-gray-300" />
                  <Skeleton className="h-3 w-24 bg-gray-300" />
                </div>
              </div>
              <Skeleton className="mb-2 h-8 w-3/4 sm:text-2xl bg-gray-300" />
              <div className="space-y-2 mb-3">
                <Skeleton className="h-4 w-full bg-gray-300" />
                <Skeleton className="h-4 w-full bg-gray-300" />
                <Skeleton className="h-4 w-4/5 bg-gray-300" />
              </div>
              <Skeleton className="h-4 w-36 bg-gray-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function NewsHomePage({ searchParams }: Props) {
  const { search, page = "1" } = await searchParams;
  const currentPage = parseInt(page);

  return (
    <div className="w-full max-w-6xl mx-auto min-h-screen bg-hanji pt-32 lg:my-20 rounded-lg shadow-lg">
      <Header />
      <NewsBanner />
      <main className="container mx-auto px-4 md:px-8 w-full py-8">
        <Suspense
          key={search || page || ""}
          fallback={
            currentPage === 1 && !search ? (
              <>
                <div className="block md:hidden">
                  <NewsCardSkeleton />
                </div>
                <div className="hidden md:block">
                  <NewsGridSkeleton />
                </div>
              </>
            ) : (
              <NewsCardSkeleton />
            )
          }
        >
          <NewsList searchParams={searchParams} />
        </Suspense>
      </main>
      {/* <SideVerticalDisplayAdWrapper /> */}
    </div>
  );
}
