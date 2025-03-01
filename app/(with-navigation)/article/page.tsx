import { Header } from "@/components/article/header";
import { Suspense } from "react";
import ArticleList from "@/components/article/article-list";
import { Skeleton } from "@/components/ui/skeleton";
import { SideVerticalDisplayAd } from "@/components/google-adsense/side-veritcal-display-ad";

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
        {[...Array(9)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="w-full h-48 rounded-lg" /> {/* Thumbnail */}
            <Skeleton className="w-3/4 h-6" /> {/* Title */}
            <Skeleton className="w-1/2 h-4" /> {/* Author/Date */}
            <Skeleton className="w-full h-20" /> {/* Content preview */}
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Skeleton className="w-96 h-10" /> {/* Pagination */}
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
      <div className="sticky-side-ad">
        <SideVerticalDisplayAd />
      </div>
    </div>
  );
}
