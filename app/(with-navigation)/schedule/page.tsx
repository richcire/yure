import Header from "@/components/schedule/schedule-header";
import ScheduleList from "@/components/schedule/schedule-list";
import { SideVerticalDisplayAdWrapper } from "@/components/google-adsense/side-vertical-display-ad-wrapper";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  searchParams: Promise<{
    search?: string;
    page?: string;
    sort?: string;
  }>;
}

function CalendarSkeleton() {
  return (
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
            <div className="absolute left-2 right-2 bottom-2 flex flex-col gap-1">
              <Skeleton className="h-3 w-3/4 bg-gray-100 rounded" />
              {i % 7 === 0 && (
                <Skeleton className="h-3 w-1/2 bg-gray-100 rounded" />
              )}
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
  );
}

function ScheduleCardSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="relative group border-b border-gray-300 pb-6 last:border-b-0"
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 sm:w-3/4">
              <div className="mb-1 flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Skeleton className="h-3 w-3 rounded-full bg-gray-300" />
                  <Skeleton className="h-3 w-24 bg-gray-300" />
                </div>
              </div>
              <Skeleton className="mb-2 h-8 w-3/4 sm:text-2xl bg-gray-300" />
              <div className="space-y-2 mb-3">
                <Skeleton className="h-4 w-full bg-gray-300" />
                <Skeleton className="h-4 w-full bg-gray-300" />
                <Skeleton className="h-4 w-4/5 bg-gray-300" />
              </div>
              <Skeleton className="h-4 w-36 bg-gray-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function SchedulePage({ searchParams }: Props) {
  const { search } = await searchParams;
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background pt-32">
      <Header />
      <Suspense
        key={search || ""}
        fallback={!search ? <CalendarSkeleton /> : <ScheduleCardSkeleton />}
      >
        <ScheduleList searchParams={searchParams} />
      </Suspense>
      {/* <SideVerticalDisplayAdWrapper /> */}
    </div>
  );
}
