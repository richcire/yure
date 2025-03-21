import { ITranslations } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { redirect, notFound } from "next/navigation";

interface TranslationTitleProps {
  permalink: string;
}

export function TranslationTitleSkeleton() {
  return (
    <div className="bg-[#214E34] backdrop-blur-sm shadow-sm p-4 rounded-md mb-8">
      <Skeleton className="h-9 w-3/4 mb-2 animate-pulse bg-gray-300/10" />
      <Skeleton className="h-7 w-1/2 mb-8 animate-pulse bg-gray-300/10" />
      <div className="w-full flex justify-between">
        <Skeleton className="h-6 w-40 animate-pulse bg-gray-300/10" />
      </div>
    </div>
  );
}

async function fetchTranslation(permalink: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_single_translation_header", {
      _permalink: decodeURIComponent(permalink),
    })
    .single<ITranslations>();

  if (error || !data) {
    return null;
  }
  return data;
}

export async function TranslationTitle({ permalink }: TranslationTitleProps) {
  const translation = await fetchTranslation(permalink);

  if (!translation) {
    notFound();
  }

  return (
    <div className="bg-[#214E34] backdrop-blur-sm shadow-sm p-4 rounded-md mb-8">
      <h1 className="text-3xl text-[#E4E0D5] font-bold mb-2">
        {translation.title}
      </h1>
      <h2 className="text-xl text-[#E4E0D5] mb-8">{translation.artist}</h2>
      <div className="w-full flex justify-between items-end">
        <div className="flex gap-2">
          {translation.categories.map((category) => (
            <Badge key={category.id} className="font-bold">
              {category.name}
            </Badge>
          ))}
        </div>
        <h3 className="text-[#E4E0D5]">발매일: {translation.release_date}</h3>
      </div>
    </div>
  );
}
