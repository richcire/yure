import { Skeleton } from "@/components/ui/skeleton";

export default function TranslationDetailLoading() {
  return (
    <div className="relative">
      {/* Hero skeleton */}
      <section className="relative flex h-screen w-full items-center justify-center px-6">
        <div className="absolute inset-0 bg-gray-300 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        <div className="relative mx-auto max-w-3xl text-center">
          <Skeleton className="mx-auto h-6 w-40 rounded-full bg-white/20 mb-6" />
          <Skeleton className="mx-auto h-12 w-80 bg-white/20 mb-3" />
          <Skeleton className="mx-auto h-6 w-40 bg-white/20" />
        </div>
      </section>

      {/* Content skeleton */}
      <section className="relative pb-24 max-w-4xl w-screen p-4 rounded-2xl bg-gradient-to-b from-[#F5F5F5] to-[#E4E0D5] mb-48">
        <div className="space-y-4 pt-8">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-full bg-gray-200" />
          ))}
        </div>
      </section>
    </div>
  );
}
