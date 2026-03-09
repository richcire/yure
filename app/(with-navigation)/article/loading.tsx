import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleLoading() {
  return (
    <div className="w-full max-w-6xl mx-auto min-h-screen bg-hanji pt-32 lg:my-20 rounded-lg shadow-lg">
      {/* Header skeleton */}
      <div className="px-4 md:px-8">
        <Skeleton className="h-10 w-64 mb-4" />
      </div>
      <main className="container mx-auto px-4 md:px-8 w-full py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-20">
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
                  <Skeleton className="w-full h-7 mb-2 bg-gray-200" />
                  <Skeleton className="w-full h-20 mb-4 bg-gray-200" />
                  <div className="flex justify-between items-center mt-auto">
                    <Skeleton className="w-24 h-4 bg-gray-200" />
                    <Skeleton className="w-24 h-4 bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
