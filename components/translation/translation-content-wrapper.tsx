import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TranslationContent from "./translation-content";
async function getTranslationContent(permalink: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("translations")
    .select("content")
    .eq("permalink", permalink)
    .single();
  return data?.content;
}

export default async function TranslationContentWrapper({
  permalink,
}: {
  permalink: string;
}) {
  const content = await getTranslationContent(permalink);
  if (!content) {
    redirect("/404");
  }
  return <TranslationContent content={content} />;
}
