import { Header } from "@/components/article/header";
import { Suspense } from "react";
import ArticleList from "@/components/article/article-list";
import { Skeleton } from "@/components/ui/skeleton";
import { SideVerticalDisplayAdWrapper } from "@/components/google-adsense/side-vertical-display-ad-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "J-POP 매거진 | 뉴스, 특집 & 오리지널 스토리 • 유레 揺れ.",
  description:
    "J-POP의 세계를 만나보세요. 최신 뉴스, 아티스트 특집, 심층 분석, 그리고 일본 대중문화를 기념하는 오리지널 콘텐츠가 가득한 매거진입니다.",
  icons: {
    icon: "/assets/logos/round.png",
  },
};
interface Props {
  searchParams: Promise<{
    search?: string; // 검색 키워드
    page?: string;
    sort?: string;
  }>;
}

function ArticleListSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col h-[450px] border-2 border-[#69140E]/50 bg-background rounded-lg"
          >
            <div className="relative m-2 mb-3 max-h-[200px] aspect-square">
              <Skeleton className="w-full h-full rounded-lg bg-gray-200" />
            </div>
            <div className="p-4 pt-0 flex-1">
              <div className="flex flex-col h-full">
                <Skeleton className="w-full h-7 mb-2 bg-gray-200" />{" "}
                {/* Title */}
                <Skeleton className="w-full h-20 mb-4 bg-gray-200" />{" "}
                {/* Content */}
                <div className="flex justify-between items-center mt-auto">
                  <Skeleton className="w-24 h-4 bg-gray-200" /> {/* Author */}
                  <Skeleton className="w-24 h-4 bg-gray-200" /> {/* Date */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default async function ArticleHomePage({ searchParams }: Props) {
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<ArticleListSkeleton />}>
          <ArticleList searchParams={searchParams} />
        </Suspense>
      </main>
      <SideVerticalDisplayAdWrapper />
    </div>
  );
}
