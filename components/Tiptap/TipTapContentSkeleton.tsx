export const TipTapContentSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Thumbnail image skeleton */}
      <div className="w-full h-64 bg-gray-300 animate-pulse rounded-lg" />

      {/* Video skeleton */}
      <div className="w-full aspect-video bg-gray-300 animate-pulse rounded-lg" />

      {/* Title and text content skeletons */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-300 animate-pulse rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 animate-pulse rounded w-full" />
          <div className="h-4 bg-gray-300 animate-pulse rounded w-5/6" />
          <div className="h-4 bg-gray-300 animate-pulse rounded w-4/6" />
        </div>
      </div>

      {/* Additional text content skeletons */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 animate-pulse rounded w-full" />
          <div className="h-4 bg-gray-300 animate-pulse rounded w-5/6" />
          <div className="h-4 bg-gray-300 animate-pulse rounded w-4/6" />
        </div>
      </div>
    </div>
  );
};
