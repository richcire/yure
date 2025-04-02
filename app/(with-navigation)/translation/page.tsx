import { Header } from "@/components/translation/header";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import TranslationList from "@/components/translation/translation-list";
import TranslationFilter from "@/components/translation/translation-filter";
import { Metadata } from "next";
import { SideVerticalDisplayAdWrapper } from "@/components/google-adsense/side-vertical-display-ad-wrapper";

export const metadata: Metadata = {
  title: "유레 揺れ • 당신의 마음을 흔들 음악을 번역해드려요.",
  description: "J-POP 등 일본 음악/문화 위주로 소개합니다.",
  icons: {
    icon: "/assets/logos/round.png",
  },
};

const ITEMS_PER_PAGE = 8;

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    sort?: string;
  }>;
}

function TranslationListSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
        {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
          <div
            key={i}
            className="w-full relative aspect-video bg-gray-300 animate-pulse rounded-lg"
          >
            <Skeleton className="absolute inset-0 rounded-lg" />
            <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-gray-400 rounded-md px-2 py-1">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="w-8 h-4" />
            </div>
            <div className="absolute z-10 h-full flex flex-col justify-end p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Skeleton className="w-96 h-10" /> {/* Pagination */}
      </div>
    </>
  );
}

function TranslationFilterSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-8">
      <div className="flex flex-wrap gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-24 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-9 w-[180px] rounded-md" />{" "}
      {/* Sort select skeleton */}
    </div>
  );
}

export default async function TranslationHomePage({ searchParams }: Props) {
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background">
      <div className="px-4">
        <Suspense>
          <Header />
        </Suspense>
        <Suspense fallback={<TranslationFilterSkeleton />}>
          <TranslationFilter searchParams={searchParams} />
        </Suspense>
      </div>
      <main className="container mx-auto px-4 py-8 w-full">
        <Suspense fallback={<TranslationListSkeleton />}>
          <TranslationList searchParams={searchParams} />
        </Suspense>
      </main>
      <SideVerticalDisplayAdWrapper />
    </div>
  );
}
