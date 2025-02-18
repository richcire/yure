import { Suspense } from "react";
import { FeaturedTranslations } from "@/components/home/featured-translations";
import { FeaturedArticles } from "@/components/home/featured-articles";
import { Skeleton } from "@/components/ui/skeleton";

function TranslationsLoading() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">최근 가사번역</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="block">
              <div className="relative group">
                <div className="absolute top-4 mx-4 z-20">
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
                <div className="relative w-full pt-[100%]">
                  <div className="absolute inset-0">
                    <Skeleton className="w-full h-full rounded-full" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticlesLoading() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">유레 매거진</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col h-[400px] overflow-hidden border-2 border-[#69140E]/50 bg-background rounded-lg"
            >
              <div className="m-3">
                <Skeleton className="aspect-video w-full rounded-lg" />
              </div>
              <div className="p-4 pt-0 flex-1">
                <div className="flex flex-col h-full">
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <div className="space-y-2 mb-4 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="w-full max-w-5xl mx-auto min-h-screen bg-background">
      <Suspense fallback={<TranslationsLoading />}>
        <FeaturedTranslations />
      </Suspense>
      <Suspense fallback={<ArticlesLoading />}>
        <FeaturedArticles />
      </Suspense>
    </main>
  );
}
