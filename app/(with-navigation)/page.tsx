import { Suspense } from "react";
import { FeaturedTranslations } from "@/components/home/featured-translations";
import { Skeleton } from "@/components/ui/skeleton";
import FeaturedArticleWrapper from "@/components/home/featured-article-wrapper";
import { BottomDisplayAd } from "@/components/google-adsense/bottom-display-ad";
import Search from "@/components/karaoke/search";

function CarouselLoading() {
  return (
    <section className="w-full relative overflow-hidden">
      <div className="aspect-[2/1] w-full">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/60 to-transparent">
        <div className="max-w-5xl mx-auto w-full space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    </section>
  );
}

function TranslationsLoading() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">J-POP 가사번역</h2>
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

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-background">
      <Suspense fallback={<CarouselLoading />}>
        <FeaturedArticleWrapper />
      </Suspense>

      <div className="max-w-5xl mx-auto my-12 px-4">
        <h2 className="text-3xl font-bold mb-8 pt-12">🔍 JPOP 노래방 검색기</h2>
        <Search />
      </div>

      <div className="max-w-5xl mx-auto my-12">
        <Suspense fallback={<TranslationsLoading />}>
          <FeaturedTranslations />
        </Suspense>
      </div>

      <div className="max-w-[768px] mx-auto px-4 my-12 h-40 w-full">
        <BottomDisplayAd />
      </div>
    </main>
  );
}
