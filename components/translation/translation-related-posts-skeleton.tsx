export default function TranslationRelatedPostsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
      {/* Previous Post Skeleton */}
      <div className="flex flex-col rounded-lg shadow-md p-4">
        <div className="text-sm text-gray-600 mb-2">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="relative aspect-video mb-3 w-full">
          <div className="absolute inset-0 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-7 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Next Post Skeleton */}
      <div className="flex flex-col rounded-lg shadow-md p-4">
        <div className="text-sm text-gray-600 mb-2 text-right">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto" />
        </div>
        <div className="relative aspect-video mb-3 w-full">
          <div className="absolute inset-0 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-7 w-3/4 bg-gray-200 rounded animate-pulse ml-auto mb-2" />
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
      </div>
    </div>
  );
}
