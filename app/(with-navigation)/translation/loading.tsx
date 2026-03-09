import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 8;

export default function TranslationLoading() {
  return (
    <div className="w-full max-w-6xl mx-auto min-h-screen pt-32 lg:my-20 rounded-lg shadow-lg bg-hanji">
      <div className="px-4 md:px-8">
        {/* Header skeleton */}
        <Skeleton className="h-10 w-64 mb-4" />
        {/* Filter skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-8">
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-24 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-9 w-[180px] rounded-md" />
        </div>
      </div>
      <main className="container mx-auto px-4 md:px-8 py-8 w-full">
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
          <Skeleton className="w-96 h-10" />
        </div>
      </main>
    </div>
  );
}
