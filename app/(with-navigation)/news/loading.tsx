import { Skeleton } from "@/components/ui/skeleton";

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

export default function NewsLoading() {
  return (
    <div className="w-full max-w-6xl mx-auto min-h-screen bg-hanji pt-32 lg:my-20 rounded-lg shadow-lg">
      {/* Header skeleton */}
      <div className="px-4 md:px-8">
        <Skeleton className="h-10 w-48 mb-4" />
      </div>
      {/* Banner skeleton */}
      <div className="px-4 md:px-8 mb-4">
        <Skeleton className="h-12 w-full rounded-md bg-gray-300" />
      </div>
      <main className="container mx-auto px-4 md:px-8 w-full py-8">
        <NewsGridSkeleton />
      </main>
    </div>
  );
}
