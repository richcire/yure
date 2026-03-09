import { Skeleton } from "@/components/ui/skeleton";

export default function NewsDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 mb-48">
      <div className="max-w-4xl mx-auto">
        {/* Title skeleton */}
        <div className="mb-6">
          <Skeleton className="h-10 w-3/4 mb-3 bg-gray-200" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-20 bg-gray-200" />
            <Skeleton className="h-4 w-24 bg-gray-200" />
          </div>
        </div>
        {/* Thumbnail skeleton */}
        <Skeleton className="w-full h-[400px] rounded-lg mb-8 bg-gray-200" />
        {/* Content skeleton */}
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-full bg-gray-200" />
          ))}
          <Skeleton className="h-5 w-2/3 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
