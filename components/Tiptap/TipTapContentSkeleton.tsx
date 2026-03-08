export const TipTapContentSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6" role="status" aria-busy="true">
      <div className="w-full h-64 bg-muted animate-pulse rounded-lg" />
      <div className="w-full aspect-video bg-muted animate-pulse rounded-lg" />
      <div className="space-y-4">
        <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded w-full" />
          <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
          <div className="h-4 bg-muted animate-pulse rounded w-4/6" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded w-full" />
          <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
          <div className="h-4 bg-muted animate-pulse rounded w-4/6" />
        </div>
      </div>
    </div>
  );
};
