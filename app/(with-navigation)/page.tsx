import { Suspense } from "react";
import { FeaturedTranslations } from "@/components/home/featured-translations";
import { FeaturedArticles } from "@/components/home/featured-articles";

function TranslationsLoading() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Popular Posts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="block">
              <div className="relative group">
                <div className="absolute top-4 w-8 h-8 mx-4 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 text-[#69140E] border-2 border-[#69140E] flex items-center justify-center z-20 font-bold animate-shimmer bg-[length:200%_100%]">
                  {i + 1}
                </div>
                <div className="relative w-full pt-[100%] rounded-full overflow-hidden">
                  <div className="absolute inset-0 rounded-full border-4 border-[#69140E]/60" />
                  <div className="absolute inset-[3%] rounded-full overflow-hidden bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]">
                    <div className="absolute inset-[40%] bg-black/80 rounded-full border-4 border-white/20" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 mb-2 animate-shimmer bg-[length:200%_100%]" />
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 animate-shimmer bg-[length:200%_100%]" />
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
        <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col h-[400px] overflow-hidden border-2 border-[#69140E]/50 bg-background rounded-lg"
            >
              <div className="relative aspect-video m-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]" />
              <div className="p-4 pt-0 flex-1">
                <div className="flex flex-col h-full">
                  <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 mb-2 animate-shimmer bg-[length:200%_100%]" />
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full animate-shimmer bg-[length:200%_100%]" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-5/6 animate-shimmer bg-[length:200%_100%]" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-4/6 animate-shimmer bg-[length:200%_100%]" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/4 animate-shimmer bg-[length:200%_100%]" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/4 animate-shimmer bg-[length:200%_100%]" />
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
