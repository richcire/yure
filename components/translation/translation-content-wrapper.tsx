import { createClient } from "@/utils/supabase/server";
import TranslationContent from "./translation-content";
import { ITranslations } from "@/types/supabase-table";
import { BottomDisplayAdWrapper } from "../google-adsense/bottom-display-ad-wrapper";
async function getTranslationContent(permalink: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("translations")
    .select("content, created_at, updated_at")
    .eq("permalink", permalink)
    .single<ITranslations>();
  return data;
}

export default async function TranslationContentWrapper({
  permalink,
}: {
  permalink: string;
}) {
  const data = await getTranslationContent(permalink);
  if (!data) {
    return null;
  }
  return (
    <div>
      <TranslationContent content={data.content} />
      <BottomDisplayAdWrapper />

      <div className="flex justify-between mt-16 text-sm text-muted-foreground">
        <time dateTime={data.created_at}>
          작성일: {new Date(data.created_at).toLocaleString()}
        </time>
        <time dateTime={data.updated_at}>
          최근 수정일: {new Date(data.updated_at).toLocaleString()}
        </time>
      </div>
    </div>
  );
}
