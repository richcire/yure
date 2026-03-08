import { ITranslations } from "@/types/supabase-table";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

interface TranslationTitleProps {
  translation: ITranslations;
}

export function TranslationTitleSkeleton() {
  return (
    <div className="bg-banner-green backdrop-blur-sm shadow-sm p-4 rounded-md mb-8">
      <Skeleton className="h-9 w-3/4 mb-2 animate-pulse bg-gray-300/10" />
      <Skeleton className="h-7 w-1/2 mb-8 animate-pulse bg-gray-300/10" />
      <div className="w-full flex justify-between">
        <Skeleton className="h-6 w-40 animate-pulse bg-gray-300/10" />
      </div>
    </div>
  );
}

export function TranslationTitle({ translation }: TranslationTitleProps) {
  return (
    <div className="bg-banner-green shadow-lg p-4 rounded-md mb-8">
      <h1 className="text-2xl sm:text-3xl text-hanji font-bold mb-2">
        {translation.title}
      </h1>
      <h2 className="text-lg sm:text-xl text-hanji mb-8">
        {translation.artist}
      </h2>
      <div className="w-full flex justify-between items-end">
        <div className="flex gap-2">
          {translation.categories.map((category) => (
            <Badge
              key={category.id}
              className="font-bold text-xs sm:text-sm bg-background text-foreground"
            >
              {category.name}
            </Badge>
          ))}
        </div>
        <h3 className="text-hanji text-sm sm:text-base">
          발매일: {translation.release_date}
        </h3>
      </div>
    </div>
  );
}
