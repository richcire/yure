import { Header } from "@/components/translation/header";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import TranslationList from "@/components/translation/translation-list";

const ITEMS_PER_PAGE = 8;

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    sort?: string;
  }>;
}

function TranslationListSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="w-full aspect-video rounded-lg" />{" "}
            {/* Thumbnail */}
            <Skeleton className="w-3/4 h-5" /> {/* Title */}
            <Skeleton className="w-1/2 h-4" /> {/* Artist */}
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Skeleton className="w-96 h-10" /> {/* Pagination */}
      </div>
    </>
  );
}

export default async function TranslationHomePage({ searchParams }: Props) {
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<TranslationListSkeleton />}>
          <TranslationList searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}
