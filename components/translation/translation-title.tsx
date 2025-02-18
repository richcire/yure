import { ITranslations } from "@/types/supabase-table";
import { createClient } from "@/utils/supabase/server";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

interface TranslationTitleProps {
  permalink: string;
}

export function TranslationTitleSkeleton() {
  return (
    <div className="bg-[#214E34] backdrop-blur-sm shadow-sm p-4 rounded-md mb-8">
      <Skeleton className="h-9 w-3/4 mb-2" />
      <Skeleton className="h-7 w-1/2 mb-8" />
      <div className="w-full flex justify-between">
        <Skeleton className="h-6 w-40" />
      </div>
    </div>
  );
}

async function fetchTranslation(permalink: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("translations")
    .select("*, categories(*)")
    .eq("permalink", permalink)
    .single<ITranslations>();

  if (error || !data) {
    throw new Error("Translation not found");
  }

  return data;
}

export async function TranslationTitle({ permalink }: TranslationTitleProps) {
  const translation = await fetchTranslation(permalink);
  return (
    <div className="bg-[#214E34] backdrop-blur-sm shadow-sm p-4 rounded-md mb-8">
      <h1 className="text-3xl text-[#E4E0D5] font-bold mb-2">
        {translation.title}
      </h1>
      <h2 className="text-xl text-[#E4E0D5] text-muted-foreground mb-8">
        {translation.artist}
      </h2>
      <div className=" w-full flex justify-between">
        <Badge>{translation.categories.name}</Badge>
        <h3 className="text-[#E4E0D5]">발매일: {translation.release_date}</h3>
      </div>
    </div>
  );
}
