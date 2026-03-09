import { Skeleton } from "@/components/ui/skeleton";

export default function KaraokeLoading() {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 min-h-screen pt-32">
      <div className="text-center mb-8">
        <Skeleton className="h-9 w-72 mx-auto mb-2" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>
      <div className="mb-8">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg bg-gray-200" />
        ))}
      </div>
    </div>
  );
}
