import { Skeleton } from "@/components/ui/skeleton";

export default function ScheduleLoading() {
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background pt-32">
      {/* Header skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
      {/* Calendar skeleton */}
      <div className="px-2 md:px-3 py-4 md:py-6 bg-[#DAD6CB] rounded-md font-sans text-[14px]">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-10 w-10 rounded bg-[#e4e0d5] border border-[#beb9ae]" />
          <Skeleton
            className="h-8 w-32 md:w-48 rounded bg-transparent"
            style={{ background: "rgba(180,180,180,0.15)" }}
          />
          <Skeleton className="h-10 w-10 rounded bg-[#e4e0d5] border border-[#beb9ae]" />
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1">
          {[...Array(7)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-5 w-full bg-transparent rounded-sm"
              style={{ background: "rgba(150,150,150,0.1)" }}
            />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-6">
          {[...Array(42)].map((_, i) => (
            <div
              key={i}
              className="relative h-14 md:h-20 w-full bg-[#e4e0d5] rounded-lg border border-[#f0ede6]"
              style={{ minHeight: "56px" }}
            >
              <div className="absolute top-1 left-2">
                <Skeleton className="h-4 w-5 bg-gray-300 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 mb-8 flex flex-wrap gap-4 justify-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded border border-solid bg-gray-200" />
              <Skeleton className="h-4 w-16 bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
