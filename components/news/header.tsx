import { Newspaper } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const NewsFilters = dynamic(() => import("./news-filters"));

export default function Header() {
  return (
    <header className="mb-6 pb-4 px-4 md:px-8">
      <div className="my-6 text-center">
        <h1 className="font-serif text-5xl font-bold uppercase tracking-tight sm:text-6xl md:text-7xl">
          News
        </h1>
        <p className="mt-2 font-serif italic text-gray-600">
          "All the News That's Fit to Print"
        </p>
      </div>

      <div className="flex flex-col justify-between gap-4 md:border-y-2 py-4 sm:flex-row sm:items-center">
        <div className="items-center gap-2 hidden md:flex">
          <Newspaper className="h-5 w-5" />
          <span className="font-medium">Latest Edition</span>
        </div>
        <Suspense>
          <NewsFilters />
        </Suspense>
      </div>
    </header>
  );
}
