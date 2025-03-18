export function KaraokeCardsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg bg-white shadow-sm">
          <div className="space-y-3">
            <div className="h-6 bg-[#69140E]/20 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-[#69140E]/20 rounded w-1/2 animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-6 bg-[#69140E]/20 rounded w-20 animate-pulse"></div>
              <div className="h-6 bg-[#69140E]/20 rounded w-20 animate-pulse"></div>
              <div className="h-6 bg-[#69140E]/20 rounded w-20 animate-pulse"></div>
            </div>
            <div className="h-10 bg-[#69140E]/20 rounded w-full animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
