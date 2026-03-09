import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleDetailLoading() {
  return (
    <div className="min-h-screen w-screen text-foreground">
      {/* Hero skeleton */}
      <section className="relative h-[340px] sm:h-[420px] lg:h-[460px]">
        <div className="absolute inset-0 bg-gray-300 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
        <div className="relative z-10 h-full">
          <div className="mx-auto flex h-full max-w-3xl flex-col justify-end px-6 pb-12 lg:px-0">
            <Skeleton className="mb-3 h-9 w-3/4 bg-white/20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20 bg-white/20" />
              <Skeleton className="h-4 w-24 bg-white/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <div className="bg-article-bg">
        <div className="mx-auto max-w-3xl px-6 lg:px-0 pt-10 pb-24">
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-full bg-gray-200" />
            ))}
            <Skeleton className="h-5 w-2/3 bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
